import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "store" | "product";
  storeName?: string;
  storeAddress?: string;
  storeRating?: number;
  storeReviewCount?: number;
}

/**
 * Dynamic SEO component that updates document head with meta tags and JSON-LD.
 */
export default function SEOHead({
  title,
  description,
  image,
  url,
  type = "website",
  storeName,
  storeAddress,
  storeRating,
  storeReviewCount,
}: SEOHeadProps) {
  useEffect(() => {
    const fullTitle = `${title} | Entorno`;
    document.title = fullTitle;

    const setMeta = (name: string, content: string, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    if (description) {
      setMeta("description", description);
      setMeta("og:description", description, "property");
    }
    setMeta("og:title", fullTitle, "property");
    setMeta("og:type", type === "store" ? "business.business" : "website", "property");
    if (image) setMeta("og:image", image, "property");
    if (url) {
      setMeta("og:url", url, "property");
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = url;
    }

    // JSON-LD structured data
    const existingLd = document.querySelector('script[data-seo-ld]');
    if (existingLd) existingLd.remove();

    if (type === "store" && storeName) {
      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "GroceryStore",
        name: storeName,
        ...(storeAddress && { address: { "@type": "PostalAddress", streetAddress: storeAddress } }),
        ...(image && { image }),
        ...(description && { description }),
        ...(storeRating && storeReviewCount && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: storeRating,
            reviewCount: storeReviewCount,
          },
        }),
      };
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo-ld", "true");
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      document.title = "Entorno - Marketplace de Bairro";
      const ldScript = document.querySelector('script[data-seo-ld]');
      if (ldScript) ldScript.remove();
    };
  }, [title, description, image, url, type, storeName, storeAddress, storeRating, storeReviewCount]);

  return null;
}
