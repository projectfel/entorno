import { useState, useCallback, useRef } from "react";

interface VoiceRecognitionState {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  isSupported: boolean;
}

export function useVoiceRecognition() {
  const [state, setState] = useState<VoiceRecognitionState>({
    isListening: false,
    transcript: "",
    interimTranscript: "",
    error: null,
    isSupported: typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window),
  });

  const recognitionRef = useRef<any>(null);
    if (!state.isSupported) {
      setState((s) => ({ ...s, error: "Seu navegador não suporta reconhecimento de voz. Use o Chrome ou Edge." }));
      return;
    }

    // Clean up previous
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "pt-BR";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setState((s) => ({ ...s, isListening: true, error: null, interimTranscript: "" }));
      // Safety timeout: stop after 30s of silence
      timeoutRef.current = setTimeout(() => {
        recognition.stop();
      }, 30000);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      // Reset timeout on each result
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        recognition.stop();
      }, 5000); // 5s of silence → stop

      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      setState((s) => ({
        ...s,
        transcript: finalTranscript || s.transcript,
        interimTranscript,
      }));
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      let errorMsg = "Erro no reconhecimento de voz";
      if (event.error === "no-speech") {
        errorMsg = "Nenhuma fala detectada. Tente falar mais perto do microfone.";
      } else if (event.error === "audio-capture") {
        errorMsg = "Microfone não encontrado. Verifique as permissões.";
      } else if (event.error === "not-allowed") {
        errorMsg = "Permissão do microfone negada. Habilite nas configurações do navegador.";
      } else if (event.error === "network") {
        errorMsg = "Erro de rede. Verifique sua conexão.";
      }
      setState((s) => ({ ...s, isListening: false, error: errorMsg }));
    };

    recognition.onend = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setState((s) => ({ ...s, isListening: false }));
    };

    recognitionRef.current = recognition;
    setState((s) => ({ ...s, transcript: "", interimTranscript: "", error: null }));

    try {
      recognition.start();
    } catch {
      setState((s) => ({ ...s, error: "Não foi possível iniciar o microfone." }));
    }
  }, [state.isSupported]);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const reset = useCallback(() => {
    stop();
    setState((s) => ({ ...s, transcript: "", interimTranscript: "", error: null }));
  }, [stop]);

  return { ...state, start, stop, reset };
}
