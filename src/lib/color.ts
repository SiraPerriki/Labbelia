import { Palette } from "../types";

export function seeded(seed: number, salt: number): number {
  const value = Math.sin(seed * 0.017 + salt * 19.19) * 43758.5453;
  return value - Math.floor(value);
}

export function hexToRgb(value: string) {
  const normalized = value.replace("#", "");
  const chunk =
    normalized.length === 3
      ? normalized
          .split("")
          .map((character) => `${character}${character}`)
          .join("")
      : normalized;

  return {
    r: parseInt(chunk.slice(0, 2), 16),
    g: parseInt(chunk.slice(2, 4), 16),
    b: parseInt(chunk.slice(4, 6), 16),
  };
}

export function rgbToHex(red: number, green: number, blue: number): string {
  return `#${[red, green, blue]
    .map((channel) =>
      Math.max(0, Math.min(255, Math.round(channel)))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

export function rgbToHsl(red: number, green: number, blue: number) {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  const delta = max - min;

  if (delta === 0) {
    return { h: 0, s: 0, l: lightness };
  }

  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

  let hue;

  switch (max) {
    case r:
      hue = (g - b) / delta + (g < b ? 6 : 0);
      break;
    case g:
      hue = (b - r) / delta + 2;
      break;
    default:
      hue = (r - g) / delta + 4;
      break;
  }

  return { h: hue * 60, s: saturation, l: lightness };
}

export function hslToRgb(hue: number, saturation: number, lightness: number) {
  const h = (((hue % 360) + 360) % 360) / 360;
  const s = Math.max(0, Math.min(1, saturation));
  const l = Math.max(0, Math.min(1, lightness));

  if (s === 0) {
    const gray = l * 255;
    return { r: gray, g: gray, b: gray };
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const toChannel = (offset: number) => {
    let t = h + offset;

    if (t < 0) {
      t += 1;
    }
    if (t > 1) {
      t -= 1;
    }

    if (t < 1 / 6) {
      return p + (q - p) * 6 * t;
    }
    if (t < 1 / 2) {
      return q;
    }
    if (t < 2 / 3) {
      return p + (q - p) * (2 / 3 - t) * 6;
    }

    return p;
  };

  return {
    r: toChannel(1 / 3) * 255,
    g: toChannel(0) * 255,
    b: toChannel(-1 / 3) * 255,
  };
}

export function enrichColor(
  color: string,
  options: {
    hueShift?: number;
    saturationMult?: number;
    lightnessShift?: number;
  },
): string {
  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const adjusted = hslToRgb(
    hsl.h + (options.hueShift ?? 0),
    hsl.s * (options.saturationMult ?? 1),
    hsl.l + (options.lightnessShift ?? 0),
  );

  return rgbToHex(adjusted.r, adjusted.g, adjusted.b);
}

export function mixColors(first: string, second: string, amount: number): string {
  const a = hexToRgb(first);
  const b = hexToRgb(second);
  const ratio = Math.max(0, Math.min(1, amount));

  return rgbToHex(a.r + (b.r - a.r) * ratio, a.g + (b.g - a.g) * ratio, a.b + (b.b - a.b) * ratio);
}

export function tunePalette(palette: Palette, seed: number): Palette {
  const driftA = seeded(seed, 31) * 0.18;
  const driftB = seeded(seed, 47) * 0.2;
  const paperTint = seeded(seed, 59) * 0.08;
  const vivid = seeded(seed, 71);
  const hueSwing = (seeded(seed, 73) - 0.5) * 36;
  type Story = { accent: string; pop: string; paper: string; border: string; soft?: string; ink?: string };
  const stories: Story[] = [
    { accent: "#ef9dc0", pop: "#f3b16c", paper: "#fff6f1", border: "#ab7888" },
    { accent: "#cfb0f4", pop: "#efc76a", paper: "#fcf7ff", border: "#8f88ba" },
    { accent: "#9ed8c4", pop: "#efb184", paper: "#f7fffb", border: "#7ea095" },
    { accent: "#f0b89b", pop: "#e59079", paper: "#fff8f1", border: "#b28373" },
    { accent: "#b8d3f4", pop: "#f0c08d", paper: "#f5fbff", border: "#829abb" },
    { accent: "#e9b5b0", pop: "#ebd07d", paper: "#fff8f4", border: "#aa7c7c" },
    { accent: "#ff84bc", pop: "#ffba6a", paper: "#fff8f7", border: "#c26d8c" },
    { accent: "#7cdcb2", pop: "#d095ea", paper: "#f7fdfb", border: "#739b87" },
    { paper: "#f1dbc4", soft: "#c3e8e4", border: "#9995b2", accent: "#deb0b1", pop: "#9bcdcb", ink: "#84716e" },
    { paper: "#fcdfe1", soft: "#caddc0", border: "#feacbc", accent: "#f9678a", pop: "#fbc547", ink: "#b2738a" },
    { paper: "#ffffcb", soft: "#ffe2a2", border: "#ffdb67", accent: "#ff7f75", pop: "#75c7c2", ink: "#cc5f55" },
    { paper: "#f8c6b5", soft: "#58b2bf", border: "#814589", accent: "#b15587", pop: "#3b356f", ink: "#102446" },
    { paper: "#f5b647", soft: "#ed853e", border: "#58403d", accent: "#d54833", pop: "#000000", ink: "#2c2a2e" },
    { paper: "#e2c45e", soft: "#7db080", border: "#996b85", accent: "#409394", pop: "#52425f", ink: "#2b2446" },
    { paper: "#ffffff", soft: "#acf3ec", border: "#73e2b7", accent: "#ff94af", pop: "#c08cdd", ink: "#075650" },
    { paper: "#fbe0b0", soft: "#abd4da", border: "#ddb17f", accent: "#f67c93", pop: "#5d88a8", ink: "#a96d49" },
    { paper: "#f5e8ce", soft: "#a8cdc5", border: "#eb8b25", accent: "#e55951", pop: "#2e91b3", ink: "#47aa69" },
    { paper: "#face72", soft: "#44adb4", border: "#b1577f", accent: "#f35c7c", pop: "#2f7c94", ink: "#1b385e" },
    { paper: "#b06d94", soft: "#826fab", border: "#6c4086", accent: "#da4280", pop: "#403272", ink: "#2a1845" },
    { paper: "#f5c755", soft: "#7fafaa", border: "#d9b282", accent: "#ec816d", pop: "#45aaa9", ink: "#456c97" },
    { paper: "#f9c88b", soft: "#9bcdce", border: "#759bae", accent: "#846886", pop: "#42537f", ink: "#22334a" },
    { paper: "#eec5d5", soft: "#c8ca97", border: "#c89dc1", accent: "#ef8384", pop: "#b16f9b", ink: "#583f45" },
    { paper: "#ffcfde", soft: "#9dc9ed", border: "#e9a8fe", accent: "#ae0a7b", pop: "#7a8dc9", ink: "#23242e" },
    { paper: "#d2d8b9", soft: "#b6a1ca", border: "#915388", accent: "#f1129b", pop: "#bd359e", ink: "#60577e" },
  ];
  const storyIndex = Math.floor(seeded(seed, 79) * stories.length);
  const story = stories[storyIndex] ?? stories[0];
  const accentEnergy = 1.22 + vivid * 1.0;
  const popEnergy = 1.25 + vivid * 1.08;
  const softEnergy = 1.04 + vivid * 0.42;
  const borderEnergy = 1.08 + vivid * 0.34;
  const accentBase = mixColors(
    mixColors(palette.accent, "#ffffff", 0.1),
    story.accent,
    0.85 + vivid * 0.15,
  );
  const softBase = mixColors(
    mixColors(palette.soft, "#ffffff", 0.1),
    story.soft || story.accent,
    story.soft ? 0.95 : 0.8 + vivid * 0.1,
  );
  const popBase = mixColors(
    palette.pop,
    story.pop,
    0.85 + vivid * 0.15,
  );
  const borderBase = mixColors(
    palette.border,
    story.border,
    0.85 + vivid * 0.15,
  );
  const paperBase = mixColors(
    mixColors(palette.paper, "#ffffff", 0.1),
    story.paper,
    0.8 + vivid * 0.2,
  );
  const inkBase = story.ink 
    ? mixColors(palette.ink, story.ink, 0.85 + vivid * 0.15)
    : mixColors(palette.ink, palette.paper, 0.1);

  return {
    paper: enrichColor(paperBase, {
      hueShift: hueSwing * 0.14,
      saturationMult: 0.96 + vivid * 0.08,
      lightnessShift: 0.01 + (seeded(seed, 83) - 0.5) * 0.03,
    }),
    border: enrichColor(borderBase, {
      hueShift: hueSwing * 0.42,
      saturationMult: borderEnergy,
      lightnessShift: -0.02 + (seeded(seed, 89) - 0.5) * 0.05,
    }),
    ink: enrichColor(inkBase, {
      hueShift: hueSwing * 0.08,
      saturationMult: 1.05 + vivid * 0.42,
    }),
    accent: enrichColor(accentBase, {
      hueShift: hueSwing,
      saturationMult: accentEnergy,
      lightnessShift: -0.03 + (seeded(seed, 101) - 0.5) * 0.08,
    }),
    soft: enrichColor(softBase, {
      hueShift: hueSwing * 0.48,
      saturationMult: softEnergy,
      lightnessShift: 0.02 + (seeded(seed, 103) - 0.5) * 0.05,
    }),
    pop: enrichColor(popBase, {
      hueShift: hueSwing * 0.78 + 4,
      saturationMult: popEnergy,
      lightnessShift: -0.04 + (seeded(seed, 107) - 0.5) * 0.08,
    }),
  };
}

export function moonlitPalette(palette: Palette): Palette {
  return {
    paper: mixColors("#1f2c3f", palette.paper, 0.12),
    border: mixColors("#7f97bc", palette.border, 0.3),
    ink: mixColors("#eef3fa", palette.paper, 0.08),
    accent: mixColors("#9ea6de", palette.accent, 0.38),
    soft: mixColors("#33465d", palette.soft, 0.12),
    pop: mixColors("#f4d6a0", palette.pop, 0.38),
  };
}
