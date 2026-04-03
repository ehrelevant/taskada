import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCallback, useEffect } from 'react';

interface LightboxImage {
  id: string;
  image: string;
  url: string | null;
}

interface ImageLightboxProps {
  images: LightboxImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const COLORS = ['bg-accent-subtle', 'bg-danger-subtle', 'bg-warning-subtle', 'bg-success-subtle', 'bg-info-subtle'];

export function ImageLightbox({ images, currentIndex, onClose, onNavigate }: ImageLightboxProps) {
  const current = images[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onNavigate(currentIndex - 1);
      if (e.key === 'ArrowRight' && hasNext) onNavigate(currentIndex + 1);
    },
    [currentIndex, hasPrev, hasNext, onClose, onNavigate],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative z-10 flex max-h-[90vh] max-w-4xl flex-col items-center">
        <div className="mb-3 flex w-full items-center justify-between">
          <span className="text-sm text-white/70">
            {currentIndex + 1} / {images.length}
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex h-[60vh] w-[80vw] max-w-3xl items-center justify-center overflow-hidden rounded-xl bg-black/50">
          {current.url ? (
            <img
              src={current.url}
              alt={current.image ?? 'Evidence'}
              className="max-h-full max-w-full rounded-xl object-contain"
            />
          ) : (
            <div
              className={`flex h-full w-full flex-col items-center justify-center ${COLORS[currentIndex % COLORS.length]}`}
            >
              <span className="text-primary text-lg font-semibold">{current.image ?? 'Image'}</span>
              <span className="text-muted mt-1 text-sm">Image unavailable</span>
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center gap-4">
          <button
            onClick={() => onNavigate(currentIndex - 1)}
            disabled={!hasPrev}
            className="rounded-lg bg-white/10 p-2 text-white transition-colors hover:bg-white/20 disabled:opacity-30"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => onNavigate(currentIndex + 1)}
            disabled={!hasNext}
            className="rounded-lg bg-white/10 p-2 text-white transition-colors hover:bg-white/20 disabled:opacity-30"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
