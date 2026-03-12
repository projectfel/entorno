import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transcript } = await req.json();
    if (!transcript || typeof transcript !== "string") {
      return new Response(JSON.stringify({ error: "transcript is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `Você é um parser de lista de compras. O usuário vai falar uma lista de produtos de supermercado em português brasileiro.
Extraia cada item com:
- name: nome normalizado do produto (sem quantidade, sem marca específica, ex: "leite integral", "arroz branco", "feijão carioca")
- quantity: número inteiro (padrão 1 se não especificado)
- unit: unidade se mencionada (kg, L, un, etc), caso contrário null
- original: texto original que o usuário falou para esse item

Regras:
- Normalize nomes: "leites" → "leite", "2 arroz" → quantity=2, name="arroz"
- Se o usuário disser "se tiver barato" ou condições, ignore a condição e extraia o produto
- Se não entender um item, inclua com name sendo o texto original e confidence=false
- Responda APENAS com o JSON, sem markdown, sem explicação`
          },
          {
            role: "user",
            content: transcript
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "parse_shopping_list",
              description: "Parse a spoken shopping list into structured items",
              parameters: {
                type: "object",
                properties: {
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "Normalized product name" },
                        quantity: { type: "number", description: "Quantity requested" },
                        unit: { type: "string", description: "Unit if specified (kg, L, un, etc)" },
                        original: { type: "string", description: "Original spoken text for this item" },
                        confidence: { type: "boolean", description: "Whether the parser is confident about this item" }
                      },
                      required: ["name", "quantity", "original", "confidence"],
                      additionalProperties: false
                    }
                  }
                },
                required: ["items"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "parse_shopping_list" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Muitas requisições. Tente novamente em alguns segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "Erro ao processar lista" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await response.json();
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback: try to parse content directly
    const content = result.choices?.[0]?.message?.content;
    if (content) {
      try {
        const parsed = JSON.parse(content);
        return new Response(JSON.stringify(parsed), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch {
        // Return raw content
      }
    }

    return new Response(JSON.stringify({ items: [], error: "Não foi possível interpretar a lista" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("parse-voice-list error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
