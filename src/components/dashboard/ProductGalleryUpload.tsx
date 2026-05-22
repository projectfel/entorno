import { useState } from "react";
import { Upload, X, ImagePlus } from "lucide-react";
import { useUploadImage } from "@/hooks/useUploadImage";
import { toast } from "sonner";

interface Props {
  storeId: string;
  mainImage: string | null;
  gallery: string[];
  onMainChange: (url: string) => void;
  onGalleryChange: (urls: string[]) => void;
}

export default function ProductGalleryUpload({ storeId, mainImage, gallery, onMainChange, onGalleryChange }: Props) {
  const { upload, uploading } = useUploadImage();
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!arr.length) return;
    const toastId = toast.loading(`Enviando ${arr.length} imagem(ns)...`);
    try {
      const results = await Promise.all(arr.map((f) => upload(f, `products/${storeId}`)));
      const urls = results.map((r) => r.url);
      if (!mainImage && urls.length) {
        onMainChange(urls[0]);
        onGalleryChange([...gallery, ...urls.slice(1)]);
      } else {
        onGalleryChange([...gallery, ...urls]);
      }
      toast.success(`${arr.length} imagem(ns) carregada(s)`, { id: toastId });
    } catch {
      toast.error("Erro ao carregar imagens", { id: toastId });
    }
  };

  const removeGallery = (url: string) => {
    onGalleryChange(gallery.filter((u) => u !== url));
  };

  const setAsMain = (url: string) => {
    const newGallery = gallery.filter((u) => u !== url);
    if (mainImage) newGallery.push(mainImage);
    onMainChange(url);
    onGalleryChange(newGallery);
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        className={`rounded-xl border-2 border-dashed p-4 text-center transition-colors ${
          dragOver ? "border-primary bg-primary/5" : "border-border bg-secondary/30"
        }`}
      >
        <label className="cursor-pointer">
          <ImagePlus className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-foreground font-medium">
            {uploading ? "Enviando..." : "Arraste várias imagens ou clique"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Primeira vira a capa</p>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            disabled={uploading}
          />
        </label>
      </div>

      {(mainImage || gallery.length > 0) && (
        <div className="grid grid-cols-4 gap-2">
          {mainImage && (
            <div className="relative group aspect-square">
              <img src={mainImage} alt="" className="h-full w-full object-cover rounded-lg ring-2 ring-primary" />
              <span className="absolute top-1 left-1 rounded bg-primary px-1.5 py-0.5 text-[9px] font-semibold text-primary-foreground">Capa</span>
              <button
                type="button"
                onClick={() => onMainChange("")}
                className="absolute top-1 right-1 hidden group-hover:flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {gallery.map((url) => (
            <div key={url} className="relative group aspect-square">
              <img src={url} alt="" className="h-full w-full object-cover rounded-lg border" />
              <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-foreground/40 rounded-lg gap-1">
                <button
                  type="button"
                  onClick={() => setAsMain(url)}
                  className="rounded bg-card px-1.5 py-0.5 text-[9px] font-medium text-card-foreground"
                >
                  Capa
                </button>
                <button
                  type="button"
                  onClick={() => removeGallery(url)}
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
