import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extrait la couleur dominante d'une image à partir de son URL
 */
export async function extractDominantColor(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context not available"));
          return;
        }

        // Redimensionner pour de meilleures performances
        const width = 100;
        const height = (img.height / img.width) * width;
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        // Compter les couleurs en privilégiant celles qui sont vives et visibles
        const colorCounts: Record<
          string,
          { count: number; saturation: number }
        > = {};

        for (let i = 0; i < data.length; i += 4) {
          const r = Math.floor(data[i] / 10) * 10;
          const g = Math.floor(data[i + 1] / 10) * 10;
          const b = Math.floor(data[i + 2] / 10) * 10;

          // Ignorer les couleurs trop sombres ou trop claires (optimisé pour mode dark)
          const brightness = (r + g + b) / 3;
          if (brightness < 70 || brightness > 220) continue;

          // Calculer la saturation (différence max-min)
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const saturation = max - min;

          // Ignorer les couleurs trop grises (faible saturation)
          if (saturation < 20) continue;

          const key = `${r},${g},${b}`;
          if (!colorCounts[key]) {
            colorCounts[key] = { count: 0, saturation };
          }
          // Pondérer par la saturation pour privilégier les couleurs vives
          colorCounts[key].count += 1 + saturation / 100;
        }

        // Trouver la couleur la plus fréquente avec meilleure saturation
        let maxScore = 0;
        let dominantColor = "100,100,200"; // Fallback bleu moyen

        for (const [color, { count, saturation }] of Object.entries(
          colorCounts,
        )) {
          const score = count * (1 + saturation / 200);
          if (score > maxScore) {
            maxScore = score;
            dominantColor = color;
          }
        }

        let [r, g, b] = dominantColor.split(",").map(Number);

        // Éclaircir si la couleur finale est encore trop sombre
        const finalBrightness = (r + g + b) / 3;
        if (finalBrightness < 100) {
          const boost = 100 / finalBrightness;
          r = Math.min(255, Math.floor(r * boost));
          g = Math.min(255, Math.floor(g * boost));
          b = Math.min(255, Math.floor(b * boost));
        }

        const hex = rgbToHex(r, g, b);
        resolve(hex);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = imageUrl;
  });
}

/**
 * Génère une couleur secondaire légèrement adoucie à partir d'une couleur primaire
 */
export function generateSecondaryColor(primaryHex: string): string {
  const rgb = hexToRgb(primaryHex);
  if (!rgb) return primaryHex;

  // Éclaircir plus fortement pour le mode dark (lighten by 45%)
  const lighten = (value: number) =>
    Math.min(255, Math.floor(value + (255 - value) * 0.45));

  const r = lighten(rgb.r);
  const g = lighten(rgb.g);
  const b = lighten(rgb.b);

  return rgbToHex(r, g, b);
}

/**
 * Convertit RGB en HEX
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

/**
 * Convertit HEX en RGB
 */
export function hexToRgb(
  hex: string,
): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null;
}
