import chroma from 'chroma-js';
function invertColor(hex: string): string {
  let color = (Number(`0x1${hex}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase();
  return color.padStart(6, '0');
}

export function generateMonochromaticColors(baseColor: string, count: number): string[] {
  let colors: string[] = [];
  for (let i = 0; i < count; i++) {
    const color = chroma(baseColor).brighten(i / (count - 1)).hex();
    colors.push(color);
  }
  return colors;
}

export function generateComplementaryColors(baseColor: string, count: number): string[] {
  let colors: string[] = [baseColor];
  for (let i = 0; i < count - 1; i++) {
    baseColor = invertColor(baseColor);
    colors.push(baseColor);
  }
  return colors;
}

function lerp(start: number, end: number, t: number): number {
  return start + t * (end - start);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

export function blendColors(color1: string, color2: string, percentage: number): string {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  const r = Math.round(lerp(c1.r, c2.r, percentage));
  const g = Math.round(lerp(c1.g, c2.g, percentage));
  const b = Math.round(lerp(c1.b, c2.b, percentage));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}