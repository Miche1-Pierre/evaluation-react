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

        // Compter les couleurs (simplification: regrouper par segments de 10)
        const colorCounts: Record<string, number> = {};

        for (let i = 0; i < data.length; i += 4) {
          const r = Math.floor(data[i] / 10) * 10;
          const g = Math.floor(data[i + 1] / 10) * 10;
          const b = Math.floor(data[i + 2] / 10) * 10;

          // Ignorer les couleurs trop claires ou trop sombres
          const brightness = (r + g + b) / 3;
          if (brightness < 30 || brightness > 240) continue;

          const key = `${r},${g},${b}`;
          colorCounts[key] = (colorCounts[key] || 0) + 1;
        }

        // Trouver la couleur la plus fréquente
        let maxCount = 0;
        let dominantColor = "0,0,0";

        for (const [color, count] of Object.entries(colorCounts)) {
          if (count > maxCount) {
            maxCount = count;
            dominantColor = color;
          }
        }

        const [r, g, b] = dominantColor.split(",").map(Number);
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

  // Adoucir en augmentant légèrement chaque composante vers le blanc
  const lighten = (value: number) =>
    Math.min(255, Math.floor(value + (255 - value) * 0.25));

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
