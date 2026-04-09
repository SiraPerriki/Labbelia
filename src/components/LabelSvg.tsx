import { createContext, useContext } from "react";
import { PALETTES } from "../data/design";
import { getMoodTrackerRows, getMoodTrackerTemplate, getMoodTrackerTitle } from "../data/mood";
import { localize } from "../lib/i18n";
import { LabelCard, LabelSize, LabelTypefaceId, Locale, Palette, ThemeId } from "../types";

export const SVG_FONT_IMPORT = `
  @import url("https://fonts.googleapis.com/css2?family=Gochi+Hand&family=Indie+Flower&family=Walter+Turncoat&family=Quicksand:wght@500;600;700&display=swap");
`;

const LabelTypefaceContext = createContext<LabelTypefaceId>("gochi");

function handwritingFontFamily(typeface: LabelTypefaceId): string {
  switch (typeface) {
    case "indie":
      return "'Indie Flower', 'Gochi Hand', 'Quicksand', 'Nunito', cursive";
    case "walter":
      return "'Walter Turncoat', 'Gochi Hand', 'Indie Flower', 'Quicksand', cursive";
    case "gochi":
    default:
      return "'Gochi Hand', 'Indie Flower', 'Quicksand', 'Nunito', cursive";
  }
}

interface SharedProps {
  card: LabelCard;
  locale: Locale;
  size: LabelSize;
  typeface?: LabelTypefaceId;
}

interface ArtProps extends SharedProps {
  width: number;
  height: number;
}

interface QuestionBox {
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number;
}

interface QuestionLayout extends QuestionBox {
  lines: string[];
  fontSize: number;
  lineHeight: number;
  variant?: "question" | "mood";
  titleFontSize?: number;
  rowFontSize?: number;
  trackerLabelWidth?: number;
  starSize?: number;
}

interface QuestionBounds {
  centerX: number;
  centerY: number;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  rx: number;
}

function seeded(seed: number, salt: number): number {
  const value = Math.sin(seed * 0.017 + salt * 19.19) * 43758.5453;
  return value - Math.floor(value);
}

function hexToRgb(value: string) {
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

function rgbToHex(red: number, green: number, blue: number): string {
  return `#${[red, green, blue]
    .map((channel) =>
      Math.max(0, Math.min(255, Math.round(channel)))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

function rgbToHsl(red: number, green: number, blue: number) {
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

  const saturation =
    lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

  let hue = 0;

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

function hslToRgb(hue: number, saturation: number, lightness: number) {
  const h = ((hue % 360) + 360) % 360 / 360;
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

function enrichColor(
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

function mixColors(first: string, second: string, amount: number): string {
  const a = hexToRgb(first);
  const b = hexToRgb(second);
  const ratio = Math.max(0, Math.min(1, amount));

  return rgbToHex(
    a.r + (b.r - a.r) * ratio,
    a.g + (b.g - a.g) * ratio,
    a.b + (b.b - a.b) * ratio,
  );
}

function tunePalette(palette: Palette, seed: number): Palette {
  const driftA = seeded(seed, 31) * 0.18;
  const driftB = seeded(seed, 47) * 0.2;
  const paperTint = seeded(seed, 59) * 0.08;
  const vivid = seeded(seed, 71);
  const hueSwing = (seeded(seed, 73) - 0.5) * 22;
  const storyIndex = Math.floor(seeded(seed, 79) * 6);
  const stories = [
    { accent: "#ef9dc0", pop: "#f3b16c", paper: "#fff6f1", border: "#ab7888" },
    { accent: "#cfb0f4", pop: "#efc76a", paper: "#fcf7ff", border: "#8f88ba" },
    { accent: "#9ed8c4", pop: "#efb184", paper: "#f7fffb", border: "#7ea095" },
    { accent: "#f0b89b", pop: "#e59079", paper: "#fff8f1", border: "#b28373" },
    { accent: "#b8d3f4", pop: "#f0c08d", paper: "#f5fbff", border: "#829abb" },
    { accent: "#e9b5b0", pop: "#ebd07d", paper: "#fff8f4", border: "#aa7c7c" },
  ];
  const story = stories[storyIndex] ?? stories[0];
  const accentEnergy = 1.1 + vivid * 0.82;
  const popEnergy = 1.14 + vivid * 0.92;
  const softEnergy = 1.02 + vivid * 0.34;
  const borderEnergy = 1.04 + vivid * 0.28;
  const accentBase = mixColors(
    mixColors(palette.accent, "#f8d6e0", driftA * 0.52),
    story.accent,
    0.16 + vivid * 0.28,
  );
  const softBase = mixColors(
    mixColors(palette.soft, "#fff8f6", driftB * 0.92),
    story.accent,
    0.06 + vivid * 0.1,
  );
  const popBase = mixColors(
    mixColors(palette.pop, "#ffddb7", 0.08 + driftB * 0.1),
    story.pop,
    0.18 + vivid * 0.24,
  );
  const borderBase = mixColors(
    mixColors(palette.border, palette.ink, 0.1 + driftA * 0.12),
    story.border,
    0.14 + vivid * 0.16,
  );
  const paperBase = mixColors(
    mixColors(palette.paper, "#fffaf8", paperTint),
    story.paper,
    0.08 + vivid * 0.1,
  );
  const inkBase = mixColors(palette.ink, palette.paper, 0.1);

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
      hueShift: hueSwing * 0.12,
      saturationMult: 1.02 + vivid * 0.12,
      lightnessShift: -0.01 + (seeded(seed, 97) - 0.5) * 0.03,
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

function moonlitPalette(palette: Palette): Palette {
  return {
    paper: mixColors("#1f2c3f", palette.paper, 0.12),
    border: mixColors("#7f97bc", palette.border, 0.3),
    ink: mixColors("#eef3fa", palette.paper, 0.08),
    accent: mixColors("#9ea6de", palette.accent, 0.38),
    soft: mixColors("#33465d", palette.soft, 0.12),
    pop: mixColors("#f4d6a0", palette.pop, 0.38),
  };
}

function splitText(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;

    if (next.length <= maxChars) {
      current = next;
      return;
    }

    if (current) {
      lines.push(current);
    }

    current = word;
  });

  if (current) {
    lines.push(current);
  }

  return lines;
}

function measureLine(line: string): number {
  return Array.from(line).reduce((total, character) => {
    if (character === " ") {
      return total + 0.42;
    }

    if (/[ilI'.,:;]/.test(character)) {
      return total + 0.44;
    }

    if (/[mwMW]/.test(character)) {
      return total + 1.08;
    }

    if (/[A-Z0-9]/.test(character)) {
      return total + 0.86;
    }

    return total + 0.78;
  }, 0);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getQuestionBounds(themeId: ThemeId, width: number, height: number): QuestionBounds {
  const squareish = width / height < 1.15;

  switch (themeId) {
    case "postage":
      return squareish
        ? {
            centerX: width * 0.5,
            centerY: height * 0.49,
            minWidth: width * 0.44,
            maxWidth: width * 0.68,
            minHeight: height * 0.24,
            maxHeight: height * 0.42,
            rx: 4.6,
          }
        : {
            centerX: width * 0.5,
            centerY: height * 0.49,
            minWidth: width * 0.38,
            maxWidth: width * 0.64,
            minHeight: height * 0.24,
            maxHeight: height * 0.41,
            rx: 4.8,
          };
    case "moon":
      return squareish
        ? {
            centerX: width * 0.5,
            centerY: height * 0.49,
            minWidth: width * 0.4,
            maxWidth: width * 0.63,
            minHeight: height * 0.22,
            maxHeight: height * 0.38,
            rx: 5.4,
          }
        : {
            centerX: width * 0.5,
            centerY: height * 0.49,
            minWidth: width * 0.34,
            maxWidth: width * 0.56,
            minHeight: height * 0.21,
            maxHeight: height * 0.35,
            rx: 5.6,
          };
    case "garden":
    case "garden-night":
    case "circus-night":
    case "cloud-mail":
    case "forest-cabin":
    case "mushrooms":
    case "ribbons":
    case "fruits":
    case "kawaii-clouds":
    case "desk-treasures":
    case "bows":
      return squareish
        ? {
            centerX: width * 0.5,
            centerY: height * 0.49,
            minWidth: width * 0.31,
            maxWidth: width * 0.55,
            minHeight: height * 0.19,
            maxHeight: height * 0.33,
            rx: 4.8,
          }
        : {
            centerX: width * 0.5,
            centerY: height * 0.49,
            minWidth: width * 0.26,
            maxWidth: width * 0.51,
            minHeight: height * 0.19,
            maxHeight: height * 0.31,
            rx: 5,
          };
    case "undersea":
      return squareish
        ? {
            centerX: width * 0.5,
            centerY: height * 0.5,
            minWidth: width * 0.36,
            maxWidth: width * 0.58,
            minHeight: height * 0.2,
            maxHeight: height * 0.34,
            rx: 4.8,
          }
        : {
            centerX: width * 0.5,
            centerY: height * 0.5,
            minWidth: width * 0.3,
            maxWidth: width * 0.54,
            minHeight: height * 0.2,
            maxHeight: height * 0.32,
            rx: 5,
          };
    default:
      return {
        centerX: width * 0.5,
        centerY: height * 0.49,
        minWidth: width * 0.4,
        maxWidth: width * 0.65,
        minHeight: height * 0.24,
        maxHeight: height * 0.42,
        rx: 5,
      };
  }
}

function layoutScore(
  layout: QuestionLayout,
  bounds: QuestionBounds,
  preferredMin: number,
  metrics: {
    density: number;
    textWidthRatio: number;
    textHeightRatio: number;
    targetLines: number;
  },
): number {
  const maxArea = bounds.maxWidth * bounds.maxHeight;
  const openness = (maxArea - layout.width * layout.height) / maxArea;
  const undersizedPenalty = Math.max(0, preferredMin - layout.fontSize) * 0.92;
  const widthUsage = layout.width / bounds.maxWidth;
  const heightUsage = layout.height / bounds.maxHeight;
  const linePenalty = Math.max(0, layout.lines.length - metrics.targetLines) * 0.12;
  const whitespacePenalty = Math.max(0, 0.9 - metrics.textWidthRatio) * 0.7;

  return (
    layout.fontSize * 2.7 -
    undersizedPenalty +
    metrics.density * 0.66 +
    metrics.textWidthRatio * 1.18 +
    metrics.textHeightRatio * 0.52 +
    widthUsage * 0.34 +
    heightUsage * 0.18 -
    openness * 0.16 -
    linePenalty -
    whitespacePenalty
  );
}

function getQuestionLayout(text: string, width: number, height: number, themeId: ThemeId): QuestionLayout {
  const baseBounds = getQuestionBounds(themeId, width, height);
  const compactLabel = height < 24;
  const mediumLabel = height < 34;
  const stripLabel = width / height > 2.45;
  const bounds = {
    ...baseBounds,
    minWidth: clamp(
      baseBounds.minWidth + (stripLabel ? width * 0.12 : compactLabel ? width * 0.018 : 0),
      baseBounds.minWidth,
      width * 0.82,
    ),
    maxWidth: clamp(
      baseBounds.maxWidth +
        (stripLabel ? width * 0.21 : compactLabel ? width * 0.085 : mediumLabel ? width * 0.05 : 0),
      baseBounds.minWidth,
      width * (stripLabel ? 0.95 : 0.82),
    ),
    minHeight: clamp(
      baseBounds.minHeight + (stripLabel ? height * 0.065 : compactLabel ? height * 0.02 : 0),
      baseBounds.minHeight,
      height * 0.58,
    ),
    maxHeight: clamp(
      baseBounds.maxHeight +
        (stripLabel ? height * 0.16 : compactLabel ? height * 0.14 : mediumLabel ? height * 0.08 : 0),
      baseBounds.minHeight,
      height * (stripLabel ? 0.66 : 0.58),
    ),
  };
  const maxFontSize = stripLabel ? 3.62 : compactLabel ? 2.94 : height >= 46 ? 3.34 : 3.02;
  const preferredMin = stripLabel ? 2.22 : compactLabel ? 1.84 : height >= 46 ? 2.04 : 1.84;
  const absoluteMin = stripLabel ? 1.74 : compactLabel ? 1.38 : height >= 46 ? 1.48 : 1.32;
  let best: QuestionLayout | null = null;
  let emergency: QuestionLayout | null = null;
  let bestScore = -Infinity;
  const baseHorizontalPaddingFactor =
    stripLabel
      ? themeId === "moon"
        ? 1.06
        : themeId === "garden" || themeId === "undersea" || themeId === "circus-night" || themeId === "cloud-mail" || themeId === "desk-treasures"
          ? 0.92
          : 1.2
      : themeId === "moon"
        ? 2.18
        : themeId === "garden" || themeId === "undersea" || themeId === "circus-night" || themeId === "cloud-mail" || themeId === "desk-treasures"
          ? 1.85
          : 3.1;
  const baseVerticalPaddingFactor =
    stripLabel
      ? themeId === "moon"
        ? 0.96
        : themeId === "garden" || themeId === "undersea" || themeId === "circus-night" || themeId === "cloud-mail" || themeId === "desk-treasures"
          ? 0.88
          : 1.02
      : themeId === "moon"
        ? 1.92
        : themeId === "garden" || themeId === "undersea" || themeId === "circus-night" || themeId === "cloud-mail" || themeId === "desk-treasures"
          ? 1.62
          : 2.45;
  const targetLines = stripLabel ? 2 : compactLabel ? 3 : 4;

  for (let maxChars = 8; maxChars <= (stripLabel ? 48 : 40); maxChars += 1) {
    const lines = splitText(text, maxChars);
    const longestLine = lines.reduce((max, line) => Math.max(max, measureLine(line)), 1);
    const lineStep = stripLabel ? 1.06 : 1.11;
    const lineUnits = 1 + Math.max(0, lines.length - 1) * lineStep;
    const widthFit = (bounds.maxWidth - 3.1) / longestLine;
    const heightFit = (bounds.maxHeight - 2.5) / lineUnits;
    const fontSize = Math.min(maxFontSize, widthFit, heightFit);
    const textWidth = longestLine * fontSize;
    const textHeight = fontSize + Math.max(0, lines.length - 1) * fontSize * lineStep;
    const horizontalPaddingFactor = Math.max(
      compactLabel ? 0.68 : 0.84,
      baseHorizontalPaddingFactor - Math.max(0, lines.length - 2) * (compactLabel ? 0.38 : 0.28),
    );
    const verticalPaddingFactor = Math.max(
      compactLabel ? 0.82 : 0.94,
      baseVerticalPaddingFactor - Math.max(0, lines.length - 2) * (compactLabel ? 0.28 : 0.18),
    );
    const boxWidth = clamp(
      textWidth + fontSize * horizontalPaddingFactor,
      bounds.minWidth,
      bounds.maxWidth,
    );
    const boxHeight = clamp(
      textHeight + fontSize * verticalPaddingFactor,
      bounds.minHeight,
      bounds.maxHeight,
    );
    const candidate: QuestionLayout = {
      x: bounds.centerX - boxWidth / 2,
      y: bounds.centerY - boxHeight / 2,
      width: boxWidth,
      height: boxHeight,
      rx: bounds.rx,
      lines,
      fontSize,
      lineHeight: fontSize * lineStep,
    };
    const candidateScore = layoutScore(candidate, bounds, preferredMin, {
      density: clamp((textWidth * textHeight) / (boxWidth * boxHeight), 0, 1),
      textWidthRatio: clamp(textWidth / boxWidth, 0, 1),
      textHeightRatio: clamp(textHeight / boxHeight, 0, 1),
      targetLines,
    });

    if (!emergency || fontSize > emergency.fontSize) {
      emergency = candidate;
    }

    if (fontSize < absoluteMin || lines.length > (stripLabel ? 6 : 7)) {
      continue;
    }

    if (!best || candidateScore > bestScore) {
      best = candidate;
      bestScore = candidateScore;
    }
  }

  if (best) {
    return {
      ...best,
      fontSize: best.fontSize * 1.02,
      lineHeight: best.lineHeight * 1.02,
    };
  }

  return {
    x: bounds.centerX - (emergency?.width ?? bounds.minWidth) / 2,
    y: bounds.centerY - (emergency?.height ?? bounds.minHeight) / 2,
    width: emergency?.width ?? bounds.minWidth,
    height: emergency?.height ?? bounds.minHeight,
    rx: bounds.rx,
    lines: emergency?.lines ?? splitText(text, 10),
    fontSize: Math.max(1.08, emergency?.fontSize ?? 1.08),
    lineHeight: Math.max(1.08, emergency?.fontSize ?? 1.08) * 1.13,
  };
}

function getMoodLayout(title: string, rows: string[], width: number, height: number, themeId: ThemeId): QuestionLayout {
  const squareish = width / height < 1.15;
  const baseBounds = getQuestionBounds(themeId, width, height);
  const bounds = {
    centerX: baseBounds.centerX,
    centerY: baseBounds.centerY + (squareish ? height * 0.01 : 0),
    minWidth: width * (squareish ? 0.74 : 0.52),
    maxWidth: width * (squareish ? 0.94 : 0.78),
    minHeight: height * (squareish ? 0.74 : 0.66),
    maxHeight: height * (squareish ? 0.94 : 0.86),
    rx: Math.max(4.4, baseBounds.rx),
  };
  const longestRow = rows.reduce((max, row) => Math.max(max, measureLine(row)), 1);

  for (let rowFont = height >= 60 ? 2.9 : height >= 46 ? 2.42 : 1.9; rowFont >= 1.28; rowFont -= 0.04) {
    const titleFont = rowFont * 0.88;
    const starSize = rowFont * 0.66;
    const labelWidth = longestRow * rowFont * 0.92;
    const starSpan = starSize * 2 * 5 + starSize * 0.54 * 4;
    const rowGap = rowFont * 1.54;
    const contentWidth = labelWidth + rowFont * 0.66 + starSpan;
    const boxWidth = clamp(
      contentWidth + rowFont * 0.92,
      bounds.minWidth,
      bounds.maxWidth,
    );
    const boxHeight = clamp(
      rows.length * rowGap + rowFont * 1.42,
      bounds.minHeight,
      bounds.maxHeight,
    );

    if (boxWidth > bounds.maxWidth || boxHeight > bounds.maxHeight) {
      continue;
    }

    return {
      x: bounds.centerX - boxWidth / 2,
      y: bounds.centerY - boxHeight / 2,
      width: boxWidth,
      height: boxHeight,
      rx: bounds.rx,
      lines: [title, ...rows],
      fontSize: rowFont,
      lineHeight: rowGap,
      variant: "mood",
      titleFontSize: titleFont,
      rowFontSize: rowFont,
      trackerLabelWidth: labelWidth,
      starSize,
    };
  }

  const fallbackRowFont = squareish ? 1.52 : 1.24;

  return {
    x: bounds.centerX - bounds.maxWidth / 2,
    y: bounds.centerY - bounds.maxHeight / 2,
    width: bounds.maxWidth,
    height: bounds.maxHeight,
    rx: bounds.rx,
    lines: [title, ...rows],
    fontSize: fallbackRowFont,
    lineHeight: fallbackRowFont * 1.76,
    variant: "mood",
    titleFontSize: fallbackRowFont * 0.88,
    rowFontSize: fallbackRowFont,
    trackerLabelWidth: longestRow * fallbackRowFont * 0.92,
    starSize: fallbackRowFont * 0.66,
  };
}

function ticketPath(x: number, y: number, width: number, height: number, corner: number, notch: number): string {
  const midY = y + height / 2;

  return [
    `M ${x + corner} ${y}`,
    `H ${x + width - corner}`,
    `Q ${x + width} ${y} ${x + width} ${y + corner}`,
    `V ${midY - notch}`,
    `Q ${x + width - notch * 1.3} ${midY} ${x + width} ${midY + notch}`,
    `V ${y + height - corner}`,
    `Q ${x + width} ${y + height} ${x + width - corner} ${y + height}`,
    `H ${x + corner}`,
    `Q ${x} ${y + height} ${x} ${y + height - corner}`,
    `V ${midY + notch}`,
    `Q ${x + notch * 1.3} ${midY} ${x} ${midY - notch}`,
    `V ${y + corner}`,
    `Q ${x} ${y} ${x + corner} ${y}`,
    "Z",
  ].join(" ");
}

function cloudPath(x: number, y: number, width: number, height: number): string {
  return [
    `M ${x + width * 0.16} ${y + height * 0.18}`,
    `C ${x + width * 0.07} ${y + height * 0.02} ${x + width * 0.26} ${y - height * 0.01} ${x + width * 0.37} ${y + height * 0.12}`,
    `C ${x + width * 0.48} ${y - height * 0.02} ${x + width * 0.67} ${y + height * 0.01} ${x + width * 0.74} ${y + height * 0.15}`,
    `C ${x + width * 0.9} ${y + height * 0.08} ${x + width} ${y + height * 0.23} ${x + width} ${y + height * 0.39}`,
    `C ${x + width} ${y + height * 0.61} ${x + width * 0.89} ${y + height * 0.78} ${x + width * 0.72} ${y + height * 0.76}`,
    `C ${x + width * 0.64} ${y + height * 0.94} ${x + width * 0.39} ${y + height} ${x + width * 0.28} ${y + height * 0.83}`,
    `C ${x + width * 0.1} ${y + height * 0.9} ${x} ${y + height * 0.73} ${x} ${y + height * 0.56}`,
    `C ${x} ${y + height * 0.36} ${x + width * 0.06} ${y + height * 0.22} ${x + width * 0.16} ${y + height * 0.18}`,
    "Z",
  ].join(" ");
}

function plaquePath(x: number, y: number, width: number, height: number): string {
  return [
    `M ${x + 10} ${y}`,
    `H ${x + width - 10}`,
    `Q ${x + width - 2} ${y} ${x + width - 2} ${y + 9}`,
    `V ${y + height - 9}`,
    `Q ${x + width - 2} ${y + height} ${x + width - 10} ${y + height}`,
    `H ${x + 10}`,
    `Q ${x + 2} ${y + height} ${x + 2} ${y + height - 9}`,
    `V ${y + 9}`,
    `Q ${x + 2} ${y} ${x + 10} ${y}`,
    "Z",
  ].join(" ");
}

function cartouchePath(x: number, y: number, width: number, height: number, wing: number): string {
  return [
    `M ${x + wing + 4} ${y}`,
    `H ${x + width - wing - 4}`,
    `Q ${x + width - wing} ${y} ${x + width - wing} ${y + 4}`,
    `V ${y + height * 0.28}`,
    `Q ${x + width} ${y + height * 0.35} ${x + width} ${y + height * 0.5}`,
    `Q ${x + width} ${y + height * 0.65} ${x + width - wing} ${y + height * 0.72}`,
    `V ${y + height - 4}`,
    `Q ${x + width - wing} ${y + height} ${x + width - wing - 4} ${y + height}`,
    `H ${x + wing + 4}`,
    `Q ${x + wing} ${y + height} ${x + wing} ${y + height - 4}`,
    `V ${y + height * 0.72}`,
    `Q ${x} ${y + height * 0.65} ${x} ${y + height * 0.5}`,
    `Q ${x} ${y + height * 0.35} ${x + wing} ${y + height * 0.28}`,
    `V ${y + 4}`,
    `Q ${x + wing} ${y} ${x + wing + 4} ${y}`,
    "Z",
  ].join(" ");
}

function roundedRectPath(x: number, y: number, width: number, height: number, radius: number): string {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));

  return [
    `M ${x + r} ${y}`,
    `H ${x + width - r}`,
    `Q ${x + width} ${y} ${x + width} ${y + r}`,
    `V ${y + height - r}`,
    `Q ${x + width} ${y + height} ${x + width - r} ${y + height}`,
    `H ${x + r}`,
    `Q ${x} ${y + height} ${x} ${y + height - r}`,
    `V ${y + r}`,
    `Q ${x} ${y} ${x + r} ${y}`,
    "Z",
  ].join(" ");
}

function rollingHillPath(width: number, height: number, baseY: number, amplitude: number, seed: number, salt: number): string {
  const left = baseY + (seeded(seed, salt + 1) - 0.5) * amplitude;
  const c1 = baseY - amplitude * (0.8 + seeded(seed, salt + 2) * 0.6);
  const c2 = baseY + amplitude * (0.1 + seeded(seed, salt + 3) * 0.7);
  const c3 = baseY - amplitude * (0.25 + seeded(seed, salt + 4) * 0.8);
  const c4 = baseY + amplitude * (0.05 + seeded(seed, salt + 5) * 0.75);
  const c5 = baseY - amplitude * (0.22 + seeded(seed, salt + 6) * 0.78);
  const right = baseY + (seeded(seed, salt + 7) - 0.45) * amplitude;

  return [
    `M -4 ${height + 4}`,
    `L -4 ${left}`,
    `C ${width * 0.12} ${c1} ${width * 0.25} ${c2} ${width * 0.42} ${c3}`,
    `C ${width * 0.58} ${c4} ${width * 0.76} ${c5} ${width + 4} ${right}`,
    `L ${width + 4} ${height + 4}`,
    "Z",
  ].join(" ");
}

function sparklePath(cx: number, cy: number, outer: number, inner: number, points = 4): string {
  const total = points * 2;
  const coordinates = Array.from({ length: total }, (_, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI) / points;
    const radius = index % 2 === 0 ? outer : inner;

    return `${cx + Math.cos(angle) * radius} ${cy + Math.sin(angle) * radius}`;
  });

  return `M ${coordinates.join(" L ")} Z`;
}

function ribbonPath(x: number, y: number, width: number, height: number): string {
  return [
    `M ${x} ${y + height * 0.18}`,
    `Q ${x + width * 0.18} ${y - height * 0.1} ${x + width * 0.36} ${y + height * 0.18}`,
    `H ${x + width * 0.64}`,
    `Q ${x + width * 0.82} ${y - height * 0.1} ${x + width} ${y + height * 0.18}`,
    `V ${y + height * 0.82}`,
    `Q ${x + width * 0.82} ${y + height * 1.08} ${x + width * 0.64} ${y + height * 0.82}`,
    `H ${x + width * 0.36}`,
    `Q ${x + width * 0.18} ${y + height * 1.08} ${x} ${y + height * 0.82}`,
    "Z",
  ].join(" ");
}

function heartPath(cx: number, cy: number, size: number): string {
  return [
    `M ${cx} ${cy + size * 0.92}`,
    `C ${cx - size * 0.92} ${cy + size * 0.34} ${cx - size * 1.3} ${cy - size * 0.38} ${cx - size * 0.56} ${cy - size * 0.62}`,
    `C ${cx - size * 0.1} ${cy - size * 0.82} ${cx + size * 0.02} ${cy - size * 0.28} ${cx} ${cy - size * 0.02}`,
    `C ${cx - size * 0.02} ${cy - size * 0.28} ${cx + size * 0.1} ${cy - size * 0.82} ${cx + size * 0.56} ${cy - size * 0.62}`,
    `C ${cx + size * 1.3} ${cy - size * 0.38} ${cx + size * 0.92} ${cy + size * 0.34} ${cx} ${cy + size * 0.92}`,
    "Z",
  ].join(" ");
}

function QuestionText(props: {
  clipId: string;
  layout: QuestionLayout;
  ink: string;
  lines: string[];
}) {
  const { clipId, layout, ink, lines } = props;
  const typeface = useContext(LabelTypefaceContext);

  if (layout.variant === "mood") {
    const rows = lines.slice(1);
    const rowFontSize = layout.rowFontSize ?? layout.fontSize;
    const starSize = layout.starSize ?? rowFontSize * 0.48;
    const labelWidth = layout.trackerLabelWidth ?? rowFontSize * 7.2;
    const starGap = starSize * 0.54;
    const starsWidth = starSize * 2 * 5 + starGap * 4;
    const columnGap = rowFontSize * 0.66;
    const innerPadding = rowFontSize * 0.34;
    const contentWidth = labelWidth + columnGap + starsWidth + innerPadding * 2;
    const blockX = layout.x + (layout.width - contentWidth) / 2;
    const labelX = blockX + innerPadding;
    const starStartX = labelX + labelWidth + columnGap;
    const contentHeight = rowFontSize + Math.max(0, rows.length - 1) * layout.lineHeight;
    const baselineLift = rowFontSize * 0.76;
    const firstRowY = layout.y + layout.height / 2 - contentHeight / 2 + baselineLift;

    return (
      <>
        <clipPath id={clipId}>
          <rect
            x={layout.x + 1.1}
            y={layout.y + 1}
            width={layout.width - 2.2}
            height={layout.height - 2}
            rx={Math.max(1, layout.rx - 0.7)}
          />
        </clipPath>
        {rows.map((row, index) => {
          const y = firstRowY + index * layout.lineHeight;
          return (
            <g key={`${clipId}-mood-row-${index}`} clipPath={`url(#${clipId})`}>
              <text
                x={labelX}
                y={y}
                fontFamily="'Quicksand', 'Nunito', 'Segoe UI', sans-serif"
                fontSize={rowFontSize}
                fontWeight="600"
                letterSpacing="0.01em"
                fill={ink}
              >
                {row}
              </text>
              {Array.from({ length: 5 }).map((_, starIndex) => {
                const cx = starStartX + starIndex * (starSize * 2 + starGap) + starSize;
                const cy = y - rowFontSize * 0.3;
                return (
                  <path
                    key={`${clipId}-star-${index}-${starIndex}`}
                    d={sparklePath(cx, cy, starSize, starSize * 0.44, 5)}
                    fill="none"
                    stroke={mixColors(ink, "#ffffff", 0.18)}
                    strokeWidth={starSize * 0.14}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                );
              })}
            </g>
          );
        })}
      </>
    );
  }

  const baselineLift = layout.fontSize * 0.3;
  const firstLineY =
    layout.y +
    layout.height / 2 -
    ((lines.length - 1) * layout.lineHeight) / 2 +
    baselineLift;

  return (
    <>
      <clipPath id={clipId}>
        <rect
          x={layout.x + 1.1}
          y={layout.y + 1}
          width={layout.width - 2.2}
          height={layout.height - 2}
          rx={Math.max(1, layout.rx - 0.7)}
        />
      </clipPath>
      <text
        x={layout.x + layout.width / 2}
        y={firstLineY}
        textAnchor="middle"
        fontFamily={handwritingFontFamily(typeface)}
        fontSize={layout.fontSize * 1.03}
        fontWeight="400"
        letterSpacing="0.004em"
        fill={ink}
        clipPath={`url(#${clipId})`}
      >
        {lines.map((line, index) => (
          <tspan
            key={`${clipId}-line-${index}`}
            x={layout.x + layout.width / 2}
            dy={index === 0 ? 0 : layout.lineHeight}
          >
            {line}
          </tspan>
        ))}
      </text>
    </>
  );
}

function Flower(props: {
  x: number;
  y: number;
  scale: number;
  petal: string;
  center: string;
  stem: string;
  rotation?: number;
}) {
  const { x, y, scale, petal, center, stem, rotation = 0 } = props;

  return (
    <g transform={`translate(${x} ${y}) rotate(${rotation})`}>
      <path d={`M 0 0 Q ${0.2 * scale} ${2.4 * scale} ${0.1 * scale} ${6.8 * scale}`} fill="none" stroke={stem} strokeWidth={0.42 * scale} strokeLinecap="round" />
      {Array.from({ length: 5 }).map((_, index) => {
        const angle = (Math.PI * 2 * index) / 5;
        const px = Math.cos(angle) * 1.55 * scale;
        const py = Math.sin(angle) * 1.55 * scale - 2.15 * scale;

        return (
          <ellipse
            key={`petal-${index}`}
            cx={px}
            cy={py}
            rx={0.9 * scale}
            ry={1.45 * scale}
            fill={petal}
            transform={`rotate(${(angle * 180) / Math.PI} ${px} ${py})`}
          />
        );
      })}
      <circle cx="0" cy={-2.05 * scale} r={0.85 * scale} fill={center} />
    </g>
  );
}

function WildflowerSprig(props: {
  x: number;
  baseY: number;
  height: number;
  lean: number;
  scale: number;
  stem: string;
  petal: string;
  center: string;
  style: "daisy" | "cluster" | "bell";
  opacity?: number;
}) {
  const { x, baseY, height, lean, scale, stem, petal, center, style, opacity = 1 } = props;
  const topX = x + lean * scale;
  const topY = baseY - height;
  const controlX = x + lean * scale * 0.45;
  const controlY = baseY - height * 0.52;
  const leafColor = mixColors(stem, petal, 0.28);

  return (
    <g opacity={opacity}>
      <path
        d={`M ${x} ${baseY} Q ${controlX} ${controlY} ${topX} ${topY}`}
        fill="none"
        stroke={stem}
        strokeWidth={0.42 * scale}
        strokeLinecap="round"
      />
      <ellipse
        cx={x + lean * scale * 0.28 - 0.6 * scale}
        cy={baseY - height * 0.4}
        rx={0.95 * scale}
        ry={0.42 * scale}
        fill={leafColor}
        transform={`rotate(${-30 + lean * 8} ${x + lean * scale * 0.28 - 0.6 * scale} ${baseY - height * 0.4})`}
      />
      <ellipse
        cx={x + lean * scale * 0.55 + 0.55 * scale}
        cy={baseY - height * 0.62}
        rx={0.88 * scale}
        ry={0.38 * scale}
        fill={leafColor}
        transform={`rotate(${34 + lean * 10} ${x + lean * scale * 0.55 + 0.55 * scale} ${baseY - height * 0.62})`}
      />
      {style === "daisy" ? (
        <g transform={`translate(${topX} ${topY}) rotate(${lean * 9})`}>
          {Array.from({ length: 6 }).map((_, index) => {
            const angle = (Math.PI * 2 * index) / 6;
            const px = Math.cos(angle) * 1.28 * scale;
            const py = Math.sin(angle) * 1.28 * scale;

            return (
              <ellipse
                key={`daisy-${index}`}
                cx={px}
                cy={py}
                rx={0.7 * scale}
                ry={1.18 * scale}
                fill={petal}
                transform={`rotate(${(angle * 180) / Math.PI} ${px} ${py})`}
              />
            );
          })}
          <circle cx="0" cy="0" r={0.72 * scale} fill={center} />
        </g>
      ) : null}
      {style === "cluster" ? (
        <g transform={`translate(${topX} ${topY}) rotate(${lean * 8})`}>
          <circle cx={-0.95 * scale} cy={-0.6 * scale} r={0.9 * scale} fill={petal} />
          <circle cx={0.9 * scale} cy={-0.52 * scale} r={0.92 * scale} fill={mixColors(petal, center, 0.22)} />
          <circle cx="0" cy={0.5 * scale} r={0.98 * scale} fill={mixColors(petal, "#ffffff", 0.12)} />
          <circle cx="0" cy="0" r={0.44 * scale} fill={center} />
        </g>
      ) : null}
      {style === "bell" ? (
        <g transform={`translate(${topX} ${topY}) rotate(${lean * 10})`}>
          <path
            d={`M 0 0 q ${1.4 * scale} ${0.6 * scale} ${1.05 * scale} ${2.1 * scale} q ${-1.35 * scale} ${0.25 * scale} ${-2.1 * scale} ${-0.78 * scale} q ${0.04 * scale} ${-1.1 * scale} ${1.05 * scale} ${-1.32 * scale}`}
            fill={petal}
          />
          <circle cx={-0.08 * scale} cy={1.1 * scale} r={0.36 * scale} fill={center} opacity="0.68" />
        </g>
      ) : null}
    </g>
  );
}

function MeadowBloom(props: {
  x: number;
  baseY: number;
  height: number;
  lean: number;
  scale: number;
  stem: string;
  petal: string;
  center: string;
  opacity?: number;
}) {
  const { x, baseY, height, lean, scale, stem, petal, center, opacity = 1 } = props;
  const topX = x + lean * scale;
  const topY = baseY - height;
  const leafColor = mixColors(stem, petal, 0.26);

  return (
    <g opacity={opacity}>
      <path
        d={`M ${x} ${baseY} Q ${x + lean * scale * 0.4} ${baseY - height * 0.45} ${topX} ${topY}`}
        fill="none"
        stroke={stem}
        strokeWidth={0.36 * scale}
        strokeLinecap="round"
      />
      <ellipse
        cx={x + lean * scale * 0.22 - 0.48 * scale}
        cy={baseY - height * 0.38}
        rx={0.82 * scale}
        ry={0.32 * scale}
        fill={leafColor}
        transform={`rotate(${-28 + lean * 8} ${x + lean * scale * 0.22 - 0.48 * scale} ${baseY - height * 0.38})`}
      />
      <ellipse
        cx={x + lean * scale * 0.54 + 0.42 * scale}
        cy={baseY - height * 0.58}
        rx={0.7 * scale}
        ry={0.28 * scale}
        fill={leafColor}
        transform={`rotate(${26 + lean * 8} ${x + lean * scale * 0.54 + 0.42 * scale} ${baseY - height * 0.58})`}
      />
      <g transform={`translate(${topX} ${topY}) rotate(${lean * 10})`}>
        {Array.from({ length: 7 }).map((_, index) => {
          const angle = (Math.PI * 2 * index) / 7;
          const px = Math.cos(angle) * 1.22 * scale;
          const py = Math.sin(angle) * 1.22 * scale;

          return (
            <ellipse
              key={`meadow-petal-${index}`}
              cx={px}
              cy={py}
              rx={0.48 * scale}
              ry={1.18 * scale}
              fill={petal}
              transform={`rotate(${(angle * 180) / Math.PI} ${px} ${py})`}
            />
          );
        })}
        <circle cx="0" cy="0" r={0.62 * scale} fill={center} />
      </g>
      <g transform={`translate(${topX - 1.55 * scale} ${topY + 1.7 * scale}) rotate(${-16 + lean * 10})`} opacity="0.78">
        <path
          d={`M 0 0 q ${0.95 * scale} ${0.4 * scale} ${0.7 * scale} ${1.4 * scale} q ${-0.92 * scale} ${0.18 * scale} ${-1.36 * scale} ${-0.46 * scale} q 0 ${-0.82 * scale} ${0.66 * scale} ${-0.94 * scale}`}
          fill={mixColors(petal, center, 0.18)}
        />
      </g>
    </g>
  );
}

function PostageTheme(props: {
  width: number;
  height: number;
  palette: Palette;
  layout: QuestionLayout;
  clipId: string;
  lines: string[];
  seed: number;
  cardId: string;
}) {
  const { width, height, palette, layout, clipId, lines, seed, cardId } = props;
  const outerId = `${cardId}-post-outer`;
  const panelId = `${cardId}-post-panel`;
  const stampId = `${cardId}-post-stamp`;
  const tapeId = `${cardId}-post-tape`;
  const sealId = `${cardId}-post-seal`;
  const sceneClip = `${cardId}-post-scene`;
  const outerPath = ticketPath(1.2, 1.2, width - 2.4, height - 2.4, 5.8, 2.2);
  const innerPath = ticketPath(4.2, 4.2, width - 8.4, height - 8.4, 4.6, 1.75);
  const isMood = layout.variant === "mood";
  const panelPath = isMood
    ? roundedRectPath(layout.x - 0.42, layout.y - 0.42, layout.width + 0.84, layout.height + 0.84, Math.max(2.8, layout.rx - 0.42))
    : cartouchePath(layout.x - 1.3, layout.y - 0.9, layout.width + 2.6, layout.height + 1.8, 3.8);
  const ribbon = ribbonPath(layout.x - 4.2, layout.y + layout.height * 0.16, layout.width + 8.4, layout.height * 0.36);
  const cancelCx = width * 0.18;
  const cancelCy = height * 0.36;
  const routeY = height - 9.6;
  const stripeCount = 18;
  const stampA = { x: width * 0.08, y: height * 0.14, w: width * 0.16, h: height * 0.2, angle: -8 + seeded(seed, 11) * 8 };
  const stampB = { x: width * 0.75, y: height * 0.58, w: width * 0.14, h: height * 0.18, angle: 9 - seeded(seed, 17) * 10 };
  const washiA = { x: width * 0.08, y: height * 0.08, w: width * 0.14, h: height * 0.042, angle: -12 };
  const washiB = { x: width * 0.72, y: height * 0.12, w: width * 0.16, h: height * 0.04, angle: 9 };
  const grainDots = Array.from({ length: 24 }).map((_, index) => ({
    x: 7 + seeded(seed, 110 + index) * (width - 14),
    y: 6 + seeded(seed, 150 + index) * (height - 12),
    r: 0.16 + seeded(seed, 190 + index) * 0.28,
    o: 0.1 + seeded(seed, 230 + index) * 0.12,
  }));
  const edgePalette = [
    mixColors(palette.pop, palette.paper, 0.08),
    mixColors(palette.accent, palette.paper, 0.1),
    mixColors(palette.soft, palette.paper, 0.18),
  ];
  const drawMiniStamp = (
    x: number,
    y: number,
    stampWidth: number,
    stampHeight: number,
    angle: number,
    accent: string,
    motifSeed: number,
  ) => {
    const centerX = x + stampWidth / 2;
    const centerY = y + stampHeight / 2;
    const sunX = x + stampWidth * 0.72;
    const sunY = y + stampHeight * 0.28;

    return (
      <g transform={`rotate(${angle} ${centerX} ${centerY})`} opacity="0.72">
        <rect x={x} y={y} width={stampWidth} height={stampHeight} rx="1.6" fill={`url(#${stampId})`} />
        <rect
          x={x + 0.86}
          y={y + 0.86}
          width={stampWidth - 1.72}
          height={stampHeight - 1.72}
          rx="1.2"
          fill="none"
          stroke={mixColors(palette.border, palette.paper, 0.16)}
          strokeWidth="0.28"
          strokeDasharray="0.7 1.1"
        />
        {Array.from({ length: 4 }).map((_, index) => (
          <circle
            key={`mini-stamp-dot-${x}-${index}`}
            cx={x + 1.8 + index * ((stampWidth - 3.6) / 3)}
            cy={y + stampHeight - 2.1}
            r="0.28"
            fill={mixColors(accent, palette.border, 0.32)}
            opacity="0.65"
          />
        ))}
        <circle cx={sunX} cy={sunY} r={Math.min(stampWidth, stampHeight) * 0.12} fill={mixColors(palette.pop, "#fff5dc", 0.08)} opacity="0.9" />
        <path
          d={`M ${x + stampWidth * 0.16} ${y + stampHeight * 0.68} q ${stampWidth * 0.14} -${stampHeight * 0.18} ${stampWidth * 0.3} -${stampHeight * 0.02} q ${stampWidth * 0.12} ${stampHeight * 0.1} ${stampWidth * 0.24} -${stampHeight * 0.08} q ${stampWidth * 0.12} -${stampHeight * 0.06} ${stampWidth * 0.2} ${stampHeight * 0.05}`}
          fill="none"
          stroke={mixColors(accent, palette.border, 0.2)}
          strokeWidth="0.36"
          strokeLinecap="round"
          opacity="0.82"
        />
        <path
          d={`M ${x + stampWidth * 0.18} ${y + stampHeight * 0.36} q ${stampWidth * 0.12} -${stampHeight * 0.16} ${stampWidth * 0.22} 0 q ${stampWidth * 0.1} ${stampHeight * 0.14} ${stampWidth * 0.18} 0`}
          fill="none"
          stroke={mixColors(palette.soft, accent, 0.2)}
          strokeWidth="0.3"
          strokeLinecap="round"
          opacity={0.52 + seeded(seed, motifSeed) * 0.18}
        />
      </g>
    );
  };

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors(palette.paper, palette.soft, 0.52)} />
          <stop offset="52%" stopColor={palette.paper} />
          <stop offset="100%" stopColor={mixColors(palette.paper, palette.soft, 0.22)} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#ffffff", palette.paper, 0.08)} />
          <stop offset="100%" stopColor={mixColors(palette.paper, "#fffefd", 0.16)} />
        </linearGradient>
        <linearGradient id={stampId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors(palette.paper, "#ffffff", 0.06)} />
          <stop offset="100%" stopColor={mixColors(palette.soft, palette.paper, 0.32)} />
        </linearGradient>
        <linearGradient id={tapeId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={mixColors(palette.pop, palette.paper, 0.3)} />
          <stop offset="100%" stopColor={mixColors(palette.accent, palette.paper, 0.22)} />
        </linearGradient>
        <radialGradient id={sealId} cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor={mixColors(palette.pop, "#fff5df", 0.06)} />
          <stop offset="100%" stopColor={mixColors(palette.accent, palette.border, 0.1)} />
        </radialGradient>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      <path d={outerPath} fill={mixColors(palette.border, palette.soft, 0.72)} opacity="0.14" transform="translate(0.7 0.9)" />
      <g clipPath={`url(#${sceneClip})`}>
        <rect x="0" y="0" width={width} height={height} fill={`url(#${outerId})`} />
        <g opacity="0.9">
          {Array.from({ length: stripeCount }).map((_, index) => {
            const stripeWidth = (width - 8) / stripeCount;
            const fill = edgePalette[index % edgePalette.length] ?? edgePalette[0];
            return (
              <g key={`post-stripe-${index}`}>
                <rect
                  x={4 + index * stripeWidth}
                  y="1.5"
                  width={stripeWidth * 0.78}
                  height="1.8"
                  rx="0.4"
                  fill={fill}
                  opacity={0.76}
                />
                <rect
                  x={4 + index * stripeWidth}
                  y={height - 3.3}
                  width={stripeWidth * 0.78}
                  height="1.8"
                  rx="0.4"
                  fill={fill}
                  opacity={0.62}
                />
              </g>
            );
          })}
        </g>
        <g opacity="0.22">
          {grainDots.map((dot, index) => (
            <circle key={`post-grain-${index}`} cx={dot.x} cy={dot.y} r={dot.r} fill={palette.border} opacity={dot.o} />
          ))}
        </g>
        <g transform={`rotate(${seeded(seed, 3) * 5 - 2.5} ${width / 2} ${height / 2})`}>
          {Array.from({ length: 4 }).map((_, index) => (
            <rect
              key={`paper-band-${index}`}
              x={-10 + index * 22}
              y={-2}
              width="10"
              height={height + 6}
              fill={index % 2 === 0 ? mixColors(palette.soft, "#ffffff", 0.18) : mixColors(palette.accent, palette.paper, 0.82)}
              opacity={index % 2 === 0 ? 0.16 : 0.08}
            />
          ))}
        </g>
        <g opacity="0.24">
          {Array.from({ length: 6 }).map((_, index) => {
            const y = height * 0.26 + index * (height * 0.095);
            return (
              <path
                key={`postcard-line-${index}`}
                d={`M ${width * 0.3} ${y} H ${width - 8.2}`}
                fill="none"
                stroke={mixColors(palette.border, palette.paper, 0.18)}
                strokeWidth="0.22"
                strokeLinecap="round"
              />
            );
          })}
        </g>
        <g transform={`rotate(${washiA.angle} ${washiA.x + washiA.w / 2} ${washiA.y + washiA.h / 2})`} opacity="0.72">
          <rect x={washiA.x} y={washiA.y} width={washiA.w} height={washiA.h} rx="0.7" fill={`url(#${tapeId})`} />
          <path d={`M ${washiA.x + 1} ${washiA.y + washiA.h / 2} H ${washiA.x + washiA.w - 1}`} stroke={mixColors(palette.paper, palette.border, 0.28)} strokeWidth="0.22" strokeDasharray="0.4 0.8" opacity="0.55" />
        </g>
        <g transform={`rotate(${washiB.angle} ${washiB.x + washiB.w / 2} ${washiB.y + washiB.h / 2})`} opacity="0.64">
          <rect x={washiB.x} y={washiB.y} width={washiB.w} height={washiB.h} rx="0.7" fill={`url(#${tapeId})`} />
          <path d={`M ${washiB.x + 1} ${washiB.y + washiB.h / 2} H ${washiB.x + washiB.w - 1}`} stroke={mixColors(palette.paper, palette.border, 0.28)} strokeWidth="0.22" strokeDasharray="0.4 0.8" opacity="0.55" />
        </g>
        {drawMiniStamp(stampA.x, stampA.y, stampA.w, stampA.h, stampA.angle, palette.accent, 61)}
        {drawMiniStamp(stampB.x, stampB.y, stampB.w, stampB.h, stampB.angle, palette.pop, 67)}
        <circle cx={cancelCx} cy={cancelCy} r={height * 0.21} fill="none" stroke={mixColors(palette.border, palette.paper, 0.14)} strokeWidth="0.78" opacity="0.54" />
        <circle cx={cancelCx} cy={cancelCy} r={height * 0.145} fill="none" stroke={mixColors(palette.border, palette.paper, 0.18)} strokeWidth="0.56" opacity="0.46" />
        <path
          d={`M ${cancelCx - 6.8} ${cancelCy + 1.3} q 3 -1.8 6.2 0 q 3.1 1.7 6.2 0 q 3 -1.8 6.2 0`}
          fill="none"
          stroke={mixColors(palette.accent, palette.border, 0.24)}
          strokeWidth="0.58"
          strokeLinecap="round"
          opacity="0.58"
        />
        <path
          d={`M ${cancelCx - 8.2} ${cancelCy + 4.6} q 3.6 -1.9 7.2 0 q 3.4 1.7 7 0 q 3.5 -1.7 7 0`}
          fill="none"
          stroke={mixColors(palette.accent, palette.paper, 0.22)}
          strokeWidth="0.48"
          strokeLinecap="round"
          opacity="0.54"
        />
        <path
          d={`M 8 ${routeY} C ${width * 0.22} ${routeY - 5.8}, ${width * 0.33} ${routeY + 1.8}, ${width * 0.48} ${routeY - 2.4} S ${width * 0.8} ${routeY + 2.8}, ${width - 10} ${routeY - 4}`}
          fill="none"
          stroke={mixColors(palette.border, palette.accent, 0.42)}
          strokeWidth="0.72"
          strokeDasharray="1.2 1.8"
          strokeLinecap="round"
          opacity="0.8"
        />
        {Array.from({ length: 5 }).map((_, index) => (
          <circle
            key={`route-dot-${index}`}
            cx={12 + index * ((width - 22) / 4)}
            cy={routeY + (seeded(seed, 20 + index) - 0.5) * 3}
            r="0.72"
            fill={index === 4 ? palette.pop : palette.accent}
            opacity={0.88 - index * 0.1}
          />
        ))}
        <path d={sparklePath(width - 11, 8.8, 2.6, 1.02)} fill={palette.pop} opacity="0.8" />
        <path d={sparklePath(10.5, 9.7, 1.9, 0.75)} fill={palette.accent} opacity="0.64" />
        <g transform={`rotate(${seeded(seed, 50) * 20 - 10} ${width - 8.8} ${height - 9.2})`}>
          <circle cx={width - 8.8} cy={height - 9.2} r="3.9" fill={mixColors(palette.border, palette.paper, 0.88)} opacity="0.08" />
          <circle cx={width - 8.8} cy={height - 9.2} r="3.28" fill={`url(#${sealId})`} opacity="0.9" />
          {Array.from({ length: 9 }).map((_, index) => {
            const angle = (Math.PI * 2 * index) / 9;
            return (
              <ellipse
                key={`seal-${index}`}
                cx={width - 8.8 + Math.cos(angle) * 1.55}
                cy={height - 9.2 + Math.sin(angle) * 1.55}
                rx="0.7"
                ry="1.3"
                fill={mixColors(palette.accent, palette.border, 0.08)}
                transform={`rotate(${(angle * 180) / Math.PI} ${width - 8.8 + Math.cos(angle) * 1.55} ${height - 9.2 + Math.sin(angle) * 1.55})`}
              />
            );
          })}
          <circle cx={width - 8.8} cy={height - 9.2} r="1.68" fill="none" stroke={mixColors(palette.paper, palette.border, 0.24)} strokeWidth="0.3" opacity="0.7" />
          <circle cx={width - 8.8} cy={height - 9.2} r="1.18" fill={palette.pop} />
          <path d={sparklePath(width - 8.8, height - 9.2, 1.18, 0.42)} fill={mixColors(palette.paper, "#fffef9", 0.08)} opacity="0.5" />
        </g>
        {Array.from({ length: 6 }).map((_, index) => (
          <g key={`ticket-mark-${index}`} opacity="0.42">
            <rect
              x={width - 19.2 + (index % 3) * 2.4}
              y={10 + Math.floor(index / 3) * 2.4}
              width="1.4"
              height="0.34"
              rx="0.17"
              fill={mixColors(palette.border, palette.paper, 0.16)}
            />
          </g>
        ))}
      </g>
      <path d={outerPath} fill="none" stroke={palette.border} strokeWidth="1.1" />
      <path d={innerPath} fill="none" stroke={mixColors(palette.border, palette.paper, 0.18)} strokeWidth="0.72" strokeDasharray="1.4 2.4" />
      {!isMood ? <path d={ribbon} fill={mixColors(palette.soft, palette.paper, 0.24)} opacity="0.76" /> : null}
      {!isMood ? <path d={ribbon} fill="none" stroke={mixColors(palette.border, palette.paper, 0.16)} strokeWidth="0.52" opacity="0.4" /> : null}
      <path d={panelPath} fill={mixColors(palette.border, palette.paper, 0.9)} opacity="0.05" transform="translate(0.4 0.52)" />
      <path d={panelPath} fill={`url(#${panelId})`} fillOpacity="0.8" stroke={mixColors(palette.border, palette.paper, 0.22)} strokeWidth="0.48" />
      <path d={panelPath} fill="none" stroke={mixColors(palette.border, "#ffffff", 0.42)} strokeWidth="0.18" transform="translate(0 0.22)" opacity="0.7" />
      {Array.from({ length: 4 }).map((_, index) => (
        <rect
          key={`panel-mark-left-${index}`}
          x={layout.x - 2.65}
          y={layout.y + 2.8 + index * 1.55}
          width="0.7"
          height="0.26"
          rx="0.13"
          fill={mixColors(palette.border, palette.paper, 0.18)}
          opacity="0.5"
        />
      ))}
      {Array.from({ length: 4 }).map((_, index) => (
        <rect
          key={`panel-mark-right-${index}`}
          x={layout.x + layout.width + 1.95}
          y={layout.y + 2.8 + index * 1.55}
          width="0.7"
          height="0.26"
          rx="0.13"
          fill={mixColors(palette.border, palette.paper, 0.18)}
          opacity="0.5"
        />
      ))}
      <QuestionText clipId={clipId} layout={layout} ink={mixColors(palette.ink, palette.paper, 0.18)} lines={lines} />
    </g>
  );
}

function MoonTheme(props: {
  width: number;
  height: number;
  palette: Palette;
  layout: QuestionLayout;
  clipId: string;
  lines: string[];
  seed: number;
  cardId: string;
}) {
  const { width, height, palette, layout, clipId, lines, seed, cardId } = props;
  const skyId = `${cardId}-moon-sky`;
  const panelId = `${cardId}-moon-panel`;
  const moonId = `${cardId}-moon-disc`;
  const saturnId = `${cardId}-moon-saturn`;
  const planetId = `${cardId}-moon-planet`;
  const nebulaAId = `${cardId}-moon-nebula-a`;
  const nebulaBId = `${cardId}-moon-nebula-b`;
  const sceneClip = `${cardId}-moon-scene`;
  const outerPath = plaquePath(1.2, 1.2, width - 2.4, height - 2.4);
  const innerPath = plaquePath(4.1, 4.2, width - 8.2, height - 8.4);
  const panel = {
    x: layout.x - 0.44,
    y: layout.y - 0.42,
    width: layout.width + 0.88,
    height: layout.height + 0.84,
    rx: Math.max(2.8, layout.rx - 0.45),
  };
  const saturnX = width * 0.18;
  const saturnY = height * 0.22;
  const moonX = width * 0.79;
  const moonY = height * 0.2;
  const farPlanetX = width * 0.47;
  const farPlanetY = height * 0.13;
  const tinyPlanetX = width * 0.61;
  const tinyPlanetY = height * 0.1;
  const galaxyPath = `M -4 ${height * 0.35} C ${width * 0.14} ${height * 0.16}, ${width * 0.32} ${height * 0.48}, ${width * 0.52} ${height * 0.24} S ${width * 0.84} ${height * 0.42}, ${width + 4} ${height * 0.22}`;
  const galaxyPathSoft = `M -4 ${height * 0.41} C ${width * 0.18} ${height * 0.26}, ${width * 0.34} ${height * 0.5}, ${width * 0.56} ${height * 0.32} S ${width * 0.86} ${height * 0.45}, ${width + 4} ${height * 0.29}`;
  const cometPath = `M ${width * 0.79} ${height * 0.28} q ${width * 0.08} -${height * 0.05} ${width * 0.14} -${height * 0.01}`;
  const deepSpace = mixColors("#1d2543", palette.border, 0.18);
  const midSpace = mixColors("#39426c", palette.accent, 0.24);
  const lowSpace = mixColors("#554b75", palette.accent, 0.28);
  const nebulaPink = mixColors("#f1bfd9", palette.accent, 0.14);
  const nebulaLilac = mixColors("#d1c7ff", palette.soft, 0.18);
  const nebulaGold = mixColors("#ffe0a5", palette.pop, 0.12);
  const starlight = mixColors("#fffaf1", palette.paper, 0.04);
  const coolStar = mixColors("#dce6ff", palette.soft, 0.06);
  const ringRose = mixColors("#f5bfd8", palette.accent, 0.14);
  const ringLilac = mixColors("#ddd0ff", palette.soft, 0.16);
  const moonLight = mixColors("#fff3d0", palette.pop, 0.08);
  const moonShade = mixColors(midSpace, "#ece7ff", 0.16);
  const saturnGold = mixColors("#f7c87d", palette.pop, 0.1);
  const saturnShadow = mixColors("#d99f6b", palette.border, 0.1);
  const farPlanet = mixColors("#c7cff6", palette.soft, 0.16);
  const farPlanetShadow = mixColors("#8ba4d2", palette.border, 0.22);
  const tinyPlanet = mixColors("#cbe4dd", palette.soft, 0.12);
  const mountainFar = mixColors("#6d729f", palette.accent, 0.3);
  const mountainMid = mixColors("#505c84", palette.border, 0.24);
  const mountainNear = mixColors("#343f62", palette.border, 0.16);
  const mist = mixColors("#f8f4ff", palette.paper, 0.08);
  const ink = mixColors("#685d76", palette.ink, 0.18);
  const alienMint = mixColors("#b9f0cf", palette.soft, 0.12);
  const ufoBody = mixColors("#f6d6ef", palette.accent, 0.16);
  const ufoShadow = mixColors("#caa5d2", palette.border, 0.16);
  const beamGlow = mixColors("#fff1b8", palette.pop, 0.08);
  const groundGlow = mixColors("#b2b0d8", palette.accent, 0.22);
  const crystalA = mixColors("#d5bfff", palette.accent, 0.12);
  const crystalB = mixColors("#a9d6f3", palette.soft, 0.16);
  const rockTone = mixColors("#6e6c8d", palette.border, 0.22);

  return (
    <g>
      <defs>
        <linearGradient id={skyId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={deepSpace} />
          <stop offset="56%" stopColor={midSpace} />
          <stop offset="100%" stopColor={lowSpace} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fffdf9", palette.paper, 0.02)} />
          <stop offset="100%" stopColor={mixColors("#f8f4ff", palette.paper, 0.14)} />
        </linearGradient>
        <radialGradient id={nebulaAId} cx="28%" cy="22%" r="54%">
          <stop offset="0%" stopColor={nebulaPink} stopOpacity="0.68" />
          <stop offset="42%" stopColor={nebulaLilac} stopOpacity="0.28" />
          <stop offset="100%" stopColor={nebulaPink} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={nebulaBId} cx="77%" cy="18%" r="46%">
          <stop offset="0%" stopColor={nebulaGold} stopOpacity="0.54" />
          <stop offset="48%" stopColor={nebulaLilac} stopOpacity="0.18" />
          <stop offset="100%" stopColor={nebulaGold} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={moonId} cx="35%" cy="32%" r="74%">
          <stop offset="0%" stopColor="#fffdf5" />
          <stop offset="100%" stopColor={moonLight} />
        </radialGradient>
        <linearGradient id={saturnId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={saturnGold} />
          <stop offset="100%" stopColor={saturnShadow} />
        </linearGradient>
        <radialGradient id={planetId} cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor={mixColors("#fdfcff", farPlanet, 0.12)} />
          <stop offset="100%" stopColor={farPlanetShadow} />
        </radialGradient>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      <path d={outerPath} fill={mixColors(palette.border, palette.soft, 0.7)} opacity="0.14" transform="translate(0.7 0.9)" />
      <g clipPath={`url(#${sceneClip})`}>
        <rect x="0" y="0" width={width} height={height} fill={`url(#${skyId})`} />
        <ellipse cx={width * 0.25} cy={height * 0.22} rx={width * 0.32} ry={height * 0.28} fill={`url(#${nebulaAId})`} opacity="0.78" />
        <ellipse cx={width * 0.78} cy={height * 0.18} rx={width * 0.28} ry={height * 0.24} fill={`url(#${nebulaBId})`} opacity="0.74" />
        <path d={galaxyPath} fill="none" stroke={ringRose} strokeWidth="2.2" strokeLinecap="round" opacity="0.28" />
        <path d={galaxyPath} fill="none" stroke={coolStar} strokeWidth="0.78" strokeLinecap="round" opacity="0.36" />
        <path d={galaxyPathSoft} fill="none" stroke={ringLilac} strokeWidth="0.92" strokeLinecap="round" opacity="0.3" />
        {Array.from({ length: 14 }).map((_, index) => (
          <circle
            key={`galaxy-dust-${index}`}
            cx={width * (0.08 + index * 0.068) + (seeded(seed, 810 + index) - 0.5) * 1.8}
            cy={height * (0.29 + seeded(seed, 830 + index) * 0.12)}
            r={0.2 + seeded(seed, 850 + index) * 0.22}
            fill={index % 3 === 0 ? nebulaGold : index % 3 === 1 ? starlight : coolStar}
            opacity={0.48 + (index % 2) * 0.14}
          />
        ))}
        <g transform={`translate(${saturnX} ${saturnY}) rotate(-12)`} opacity="0.98">
          <path d="M -5.6 0 A 5.6 1.52 0 0 1 5.6 0" fill="none" stroke={ringRose} strokeWidth="0.64" opacity="0.72" />
          <path d="M -4.52 0 A 4.52 1.14 0 0 1 4.52 0" fill="none" stroke={coolStar} strokeWidth="0.32" opacity="0.6" />
          <circle cx="0" cy="0" r="2.3" fill={`url(#${saturnId})`} />
          <path d="M -1.9 -0.92 q 1.5 -0.56 3.16 0" fill="none" stroke={mixColors("#fff6df", saturnGold, 0.16)} strokeWidth="0.22" strokeLinecap="round" opacity="0.64" />
          <path d="M -2.02 0.08 q 1.6 0.44 3.32 0" fill="none" stroke={mixColors(saturnShadow, deepSpace, 0.14)} strokeWidth="0.18" strokeLinecap="round" opacity="0.48" />
          <path d="M -5.6 0 A 5.6 1.52 0 0 0 5.6 0" fill="none" stroke={ringRose} strokeWidth="0.64" />
          <path d="M -4.52 0 A 4.52 1.14 0 0 0 4.52 0" fill="none" stroke={coolStar} strokeWidth="0.32" opacity="0.72" />
        </g>
        <g transform={`translate(${farPlanetX} ${farPlanetY}) rotate(14)`} opacity="0.94">
          <circle cx="0" cy="0" r="1.62" fill={`url(#${planetId})`} />
          <ellipse cx="0" cy="0" rx="2.9" ry="0.72" fill="none" stroke={ringLilac} strokeWidth="0.28" opacity="0.74" />
        </g>
        <g transform={`translate(${tinyPlanetX} ${tinyPlanetY})`} opacity="0.82">
          <circle cx="0" cy="0" r="0.8" fill={tinyPlanet} />
          <circle cx="-0.18" cy="-0.18" r="0.16" fill={mixColors("#fffefe", tinyPlanet, 0.18)} opacity="0.72" />
        </g>
        <g opacity="0.98">
          <circle cx={moonX} cy={moonY} r="6.9" fill={nebulaGold} opacity="0.16" />
          <circle cx={moonX} cy={moonY} r="5.04" fill={`url(#${moonId})`} />
          <circle cx={moonX + 2.24} cy={moonY + 0.12} r="4.56" fill={moonShade} />
          <circle cx={moonX - 1.24} cy={moonY - 1.06} r="0.24" fill={mixColors("#fffdf7", moonLight, 0.08)} opacity="0.72" />
          <circle cx={moonX - 1.72} cy={moonY + 0.94} r="0.34" fill={mixColors(moonShade, moonLight, 0.24)} opacity="0.34" />
          <circle cx={moonX - 0.44} cy={moonY + 1.46} r="0.2" fill={mixColors(moonShade, moonLight, 0.18)} opacity="0.26" />
        </g>
        {Array.from({ length: 30 }).map((_, index) => {
          const starX = 5 + seeded(seed, 900 + index) * (width - 10);
          const starY = 3.2 + seeded(seed, 930 + index) * (height * 0.58);
          const outer = 0.42 + seeded(seed, 960 + index) * 0.88;
          const inner = outer * 0.36;

          if (index % 6 === 0) {
            return <path key={`moon-star-${index}`} d={sparklePath(starX, starY, outer + 0.24, inner)} fill={nebulaGold} opacity="0.88" />;
          }

          if (index % 4 === 0) {
            return <path key={`moon-star-${index}`} d={sparklePath(starX, starY, outer, inner * 0.9)} fill={coolStar} opacity="0.76" />;
          }

          return <circle key={`moon-star-${index}`} cx={starX} cy={starY} r={outer * 0.36} fill={index % 2 === 0 ? starlight : coolStar} opacity={0.56 + (index % 3) * 0.12} />;
        })}
        <g opacity="0.42">
          <path d={`M ${width * 0.1} ${height * 0.17} L ${width * 0.16} ${height * 0.11} L ${width * 0.22} ${height * 0.15} L ${width * 0.29} ${height * 0.09}`} fill="none" stroke={coolStar} strokeWidth="0.22" strokeLinecap="round" />
          {[0.1, 0.16, 0.22, 0.29].map((anchor, index) => (
            <circle
              key={`moon-constellation-${index}`}
              cx={width * anchor}
              cy={height * ([0.17, 0.11, 0.15, 0.09][index] as number)}
              r={index === 1 ? 0.4 : 0.28}
              fill={index % 2 === 0 ? starlight : nebulaGold}
            />
          ))}
        </g>
        <path d={cometPath} fill="none" stroke={nebulaGold} strokeWidth="0.5" strokeLinecap="round" opacity="0.72" />
        <circle cx={width * 0.79} cy={height * 0.28} r="0.34" fill={starlight} opacity="0.9" />
        <path
          d={`M -3 ${height * 0.78} L ${width * 0.08} ${height * 0.58} L ${width * 0.18} ${height * 0.78} L ${width * 0.3} ${height * 0.54} L ${width * 0.43} ${height * 0.78} L ${width * 0.59} ${height * 0.57} L ${width * 0.74} ${height * 0.78} L ${width * 0.9} ${height * 0.61} L ${width + 3} ${height * 0.78} L ${width + 3} ${height} L -3 ${height} Z`}
          fill={mountainFar}
          opacity="0.44"
        />
        <path
          d={`M -3 ${height * 0.84} L ${width * 0.14} ${height * 0.7} L ${width * 0.26} ${height * 0.84} L ${width * 0.42} ${height * 0.64} L ${width * 0.56} ${height * 0.84} L ${width * 0.72} ${height * 0.68} L ${width * 0.88} ${height * 0.84} L ${width + 3} ${height * 0.72} L ${width + 3} ${height} L -3 ${height} Z`}
          fill={mountainMid}
          opacity="0.48"
        />
        <path d={rollingHillPath(width, height, height * 0.9, height * 0.06, seed, 100)} fill={mountainNear} opacity="0.72" />
        <path d={rollingHillPath(width, height, height * 0.94, height * 0.04, seed, 120)} fill={mist} opacity="0.14" />
        <path
          d={`M -3 ${height * 0.9} C ${width * 0.08} ${height * 0.87}, ${width * 0.18} ${height * 0.93}, ${width * 0.3} ${height * 0.88} S ${width * 0.58} ${height * 0.93}, ${width * 0.74} ${height * 0.88} S ${width * 0.92} ${height * 0.91}, ${width + 3} ${height * 0.87} L ${width + 3} ${height} L -3 ${height} Z`}
          fill={groundGlow}
          opacity="0.18"
        />
        <g opacity="0.66">
          <ellipse cx={width * 0.25} cy={height * 0.89} rx={width * 0.12} ry={height * 0.028} fill={mixColors(rockTone, mist, 0.22)} />
          <ellipse cx={width * 0.72} cy={height * 0.87} rx={width * 0.09} ry={height * 0.022} fill={mixColors(rockTone, mist, 0.18)} opacity="0.78" />
          <ellipse cx={width * 0.48} cy={height * 0.91} rx={width * 0.14} ry={height * 0.026} fill={mixColors(mountainNear, mist, 0.18)} opacity="0.54" />
        </g>
        <g opacity="0.74">
          <path
            d={`M ${width * 0.08} ${height * 0.7} q ${width * 0.08} -${height * 0.025} ${width * 0.18} 0 q ${width * 0.08} ${height * 0.022} ${width * 0.16} -${height * 0.006}`}
            fill="none"
            stroke={ringLilac}
            strokeWidth="0.34"
            strokeLinecap="round"
          />
          <path
            d={`M ${width * 0.67} ${height * 0.76} q ${width * 0.06} -${height * 0.02} ${width * 0.13} 0`}
            fill="none"
            stroke={nebulaGold}
            strokeWidth="0.32"
            strokeLinecap="round"
          />
          <g transform={`translate(${width * 0.83} ${height * 0.74}) rotate(14)`} opacity="0.88">
            <circle cx="0" cy="0" r="1.26" fill={mixColors("#f3e7ff", farPlanet, 0.16)} />
            <ellipse cx="0" cy="0" rx="2.14" ry="0.5" fill="none" stroke={coolStar} strokeWidth="0.22" opacity="0.76" />
          </g>
          <g transform={`translate(${width * 0.36} ${height * 0.82})`} opacity="0.74">
            <path d={sparklePath(0, 0, 0.82, 0.3)} fill={nebulaGold} />
            <path d={sparklePath(2.2, -0.7, 0.56, 0.2)} fill={coolStar} opacity="0.86" />
            <circle cx="-1.7" cy="-0.5" r="0.24" fill={starlight} />
          </g>
          {Array.from({ length: 8 }).map((_, index) => (
            <circle
              key={`lower-dust-${index}`}
              cx={width * (0.08 + seeded(seed, 1200 + index) * 0.84)}
              cy={height * (0.66 + seeded(seed, 1220 + index) * 0.22)}
              r={0.18 + seeded(seed, 1240 + index) * 0.2}
              fill={index % 3 === 0 ? nebulaGold : index % 3 === 1 ? starlight : coolStar}
              opacity={0.42 + (index % 2) * 0.16}
            />
          ))}
        </g>
        <g transform={`translate(${width * 0.2} ${height * 0.79}) rotate(-6)`} opacity="0.96">
          <path
            d={`M -1.1 0 L 1.1 0 L 3.2 ${height * 0.11} L -3.2 ${height * 0.11} Z`}
            fill={beamGlow}
            opacity="0.18"
          />
          <ellipse cx="0" cy={height * 0.09} rx="2.55" ry="0.44" fill={beamGlow} opacity="0.12" />
          <ellipse cx="0" cy="0.9" rx="3.48" ry="1.18" fill={ufoBody} />
          <ellipse cx="0" cy="1.08" rx="3.48" ry="1.18" fill="none" stroke={ufoShadow} strokeWidth="0.22" opacity="0.78" />
          <ellipse cx="0" cy="-0.08" rx="1.58" ry="1.14" fill={mixColors("#f7fbff", palette.paper, 0.08)} opacity="0.88" />
          <ellipse cx="0" cy="-0.18" rx="1.2" ry="0.86" fill={mixColors("#edf8ff", palette.paper, 0.12)} opacity="0.72" />
          <circle cx="0" cy="-0.46" r="0.52" fill={alienMint} />
          <ellipse cx="-0.52" cy="-0.94" rx="0.18" ry="0.48" fill={alienMint} transform="rotate(-28 -0.52 -0.94)" />
          <ellipse cx="0.52" cy="-0.94" rx="0.18" ry="0.48" fill={alienMint} transform="rotate(28 0.52 -0.94)" />
          <circle cx="-0.18" cy="-0.48" r="0.06" fill={mixColors("#2b3147", palette.border, 0.18)} />
          <circle cx="0.18" cy="-0.48" r="0.06" fill={mixColors("#2b3147", palette.border, 0.18)} />
          <path d="M -0.16 -0.2 q 0.16 0.12 0.32 0" fill="none" stroke={mixColors("#2b3147", palette.border, 0.22)} strokeWidth="0.08" strokeLinecap="round" />
          {[-2.2, -0.9, 0.45, 1.9].map((lightX, index) => (
            <circle
              key={`ufo-light-${index}`}
              cx={lightX}
              cy="1.38"
              r="0.16"
              fill={index % 2 === 0 ? nebulaGold : coolStar}
              opacity="0.92"
            />
          ))}
        </g>
        <g opacity="0.76">
          <g transform={`translate(${width * 0.12} ${height * 0.88}) rotate(-8)`}>
            <path d="M 0 0 L 0.8 -2.4 L 1.58 -0.08 Z" fill={crystalA} opacity="0.82" />
            <path d="M 1.1 0.1 L 2.02 -1.72 L 2.72 0.18 Z" fill={crystalB} opacity="0.74" />
          </g>
          <g transform={`translate(${width * 0.83} ${height * 0.9}) rotate(7)`}>
            <path d="M 0 0 L 0.88 -2.2 L 1.64 0.02 Z" fill={crystalB} opacity="0.8" />
            <path d="M -0.72 0.06 L -0.08 -1.38 L 0.38 0.14 Z" fill={crystalA} opacity="0.68" />
          </g>
          <g transform={`translate(${width * 0.56} ${height * 0.89})`} opacity="0.72">
            <ellipse cx="0" cy="0" rx="1.4" ry="0.56" fill={rockTone} />
            <ellipse cx="0.44" cy="-0.12" rx="0.72" ry="0.24" fill={mixColors(rockTone, mist, 0.2)} opacity="0.74" />
          </g>
          <path
            d={`M ${width * 0.24} ${height * 0.86} q ${width * 0.04} -${height * 0.018} ${width * 0.09} 0`}
            fill="none"
            stroke={coolStar}
            strokeWidth="0.22"
            strokeLinecap="round"
          />
          <path
            d={`M ${width * 0.54} ${height * 0.84} q ${width * 0.03} -${height * 0.012} ${width * 0.07} 0`}
            fill="none"
            stroke={ringRose}
            strokeWidth="0.2"
            strokeLinecap="round"
          />
        </g>
      </g>
      <path d={outerPath} fill="none" stroke={palette.border} strokeWidth="1.08" />
      <path d={innerPath} fill="none" stroke={mixColors(palette.border, palette.paper, 0.18)} strokeWidth="0.68" opacity="0.8" />
      <rect x={panel.x + 0.35} y={panel.y + 0.45} width={panel.width} height={panel.height} rx={panel.rx} fill={mixColors(palette.border, deepSpace, 0.74)} opacity="0.1" />
      <rect x={panel.x} y={panel.y} width={panel.width} height={panel.height} rx={panel.rx} fill={`url(#${panelId})`} fillOpacity="0.8" stroke={mixColors(palette.border, palette.paper, 0.18)} strokeWidth="0.42" />
      <rect x={panel.x} y={panel.y} width={panel.width} height={panel.height} rx={panel.rx} fill="none" stroke={mixColors("#ffffff", palette.paper, 0.22)} strokeWidth="0.16" transform="translate(0 0.18)" opacity="0.72" />
      <path
        d={`M ${panel.x + panel.width * 0.12} ${panel.y - 1.14} q ${panel.width * 0.12} -1.8 ${panel.width * 0.24} 0`}
        fill="none"
        stroke={ringLilac}
        strokeWidth="0.42"
        strokeLinecap="round"
        opacity="0.72"
      />
      <path
        d={`M ${panel.x + panel.width * 0.72} ${panel.y + panel.height + 0.9} q ${panel.width * 0.09} 1.28 ${panel.width * 0.2} 0`}
        fill="none"
        stroke={nebulaGold}
        strokeWidth="0.3"
        strokeLinecap="round"
        opacity="0.64"
      />
      <QuestionText clipId={clipId} layout={layout} ink={ink} lines={lines} />
    </g>
  );
}

function HeartsTheme(props: {
  width: number;
  height: number;
  palette: Palette;
  layout: QuestionLayout;
  clipId: string;
  lines: string[];
  seed: number;
  cardId: string;
}) {
  const { width, height, palette, layout, clipId, lines, seed, cardId } = props;
  const outerId = `${cardId}-hearts-outer`;
  const panelId = `${cardId}-hearts-panel`;
  const sceneClip = `${cardId}-hearts-scene`;
  const outerPath = plaquePath(1.2, 1.2, width - 2.4, height - 2.4);
  const innerPath = plaquePath(4.1, 4.2, width - 8.2, height - 8.4);
  const panel = {
    x: layout.x - 0.38,
    y: layout.y - 0.36,
    width: layout.width + 0.76,
    height: layout.height + 0.72,
    rx: Math.max(2.6, layout.rx - 0.48),
  };
  const heartColors = [
    mixColors(palette.accent, "#ffd3df", 0.12),
    mixColors(palette.pop, "#ffe7c4", 0.16),
    mixColors(palette.soft, "#fff6fd", 0.08),
    mixColors(palette.border, "#f4c9d4", 0.2),
  ];
  const tinyDots = [palette.pop, palette.accent, mixColors("#ffffff", palette.paper, 0.08)];

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fff6f8", palette.paper, 0.08)} />
          <stop offset="54%" stopColor={mixColors(palette.paper, "#fffdfb", 0.04)} />
          <stop offset="100%" stopColor={mixColors(palette.soft, palette.paper, 0.28)} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fffefd", palette.paper, 0.02)} />
          <stop offset="100%" stopColor={mixColors("#fff8fb", palette.paper, 0.12)} />
        </linearGradient>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      <path d={outerPath} fill={mixColors(palette.border, palette.soft, 0.7)} opacity="0.12" transform="translate(0.7 0.9)" />
      <g clipPath={`url(#${sceneClip})`}>
        <rect x="0" y="0" width={width} height={height} fill={`url(#${outerId})`} />
        <circle cx={width * 0.18} cy={height * 0.2} r={height * 0.18} fill={mixColors("#ffeef3", palette.accent, 0.2)} opacity="0.22" />
        <circle cx={width * 0.76} cy={height * 0.18} r={height * 0.2} fill={mixColors("#fff4e8", palette.pop, 0.22)} opacity="0.18" />
        {Array.from({ length: 76 }).map((_, index) => {
          const x = width * (0.08 + seeded(seed, 1400 + index) * 0.84);
          const y = height * (0.1 + seeded(seed, 1450 + index) * 0.78);
          const size = 0.26 + seeded(seed, 1500 + index) * 1.92;
          const rotation = seeded(seed, 1550 + index) * 38 - 19;
          const fill = heartColors[index % heartColors.length];
          const opacity = 0.38 + (index % 4) * 0.12;

          return (
            <g key={`heart-pattern-${index}`} transform={`rotate(${rotation} ${x} ${y})`} opacity={opacity}>
              <path d={heartPath(x, y, size)} fill={fill} />
              <path d={heartPath(x, y, size)} fill="none" stroke={mixColors(fill, palette.border, 0.16)} strokeWidth="0.08" opacity="0.4" />
            </g>
          );
        })}
        {Array.from({ length: 56 }).map((_, index) => (
          <circle
            key={`hearts-dot-${index}`}
            cx={width * (0.06 + seeded(seed, 1600 + index) * 0.88)}
            cy={height * (0.08 + seeded(seed, 1650 + index) * 0.82)}
            r={0.14 + seeded(seed, 1700 + index) * 0.18}
            fill={tinyDots[index % tinyDots.length]}
            opacity={0.38 + (index % 2) * 0.14}
          />
        ))}
        <path
          d={`M ${width * 0.06} ${height * 0.3} q ${width * 0.1} -${height * 0.04} ${width * 0.2} 0 q ${width * 0.08} ${height * 0.03} ${width * 0.18} -${height * 0.01}`}
          fill="none"
          stroke={mixColors(palette.soft, palette.paper, 0.16)}
          strokeWidth="0.36"
          strokeLinecap="round"
          opacity="0.5"
        />
        <path
          d={`M ${width * 0.56} ${height * 0.74} q ${width * 0.08} -${height * 0.03} ${width * 0.16} 0`}
          fill="none"
          stroke={mixColors(palette.pop, palette.paper, 0.2)}
          strokeWidth="0.3"
          strokeLinecap="round"
          opacity="0.54"
        />
      </g>
      <path d={outerPath} fill="none" stroke={palette.border} strokeWidth="1.08" />
      <path d={innerPath} fill="none" stroke={mixColors(palette.border, palette.paper, 0.18)} strokeWidth="0.68" opacity="0.78" />
      <rect x={panel.x + 0.34} y={panel.y + 0.42} width={panel.width} height={panel.height} rx={panel.rx} fill={mixColors(palette.border, palette.paper, 0.76)} opacity="0.1" />
      <rect x={panel.x} y={panel.y} width={panel.width} height={panel.height} rx={panel.rx} fill={`url(#${panelId})`} fillOpacity="0.8" stroke={mixColors(palette.border, palette.paper, 0.18)} strokeWidth="0.42" />
      <rect x={panel.x} y={panel.y} width={panel.width} height={panel.height} rx={panel.rx} fill="none" stroke={mixColors("#ffffff", palette.paper, 0.22)} strokeWidth="0.16" transform="translate(0 0.18)" opacity="0.7" />
      <QuestionText clipId={clipId} layout={layout} ink={mixColors(palette.ink, palette.paper, 0.18)} lines={lines} />
    </g>
  );
}

function FlowersTheme(props: {
  width: number;
  height: number;
  palette: Palette;
  layout: QuestionLayout;
  clipId: string;
  lines: string[];
  seed: number;
  cardId: string;
}) {
  const { width, height, palette, layout, clipId, lines, seed, cardId } = props;
  const outerId = `${cardId}-flowers-outer`;
  const panelId = `${cardId}-flowers-panel`;
  const sceneClip = `${cardId}-flowers-scene`;
  const outerPath = plaquePath(1.2, 1.2, width - 2.4, height - 2.4);
  const innerPath = plaquePath(4.1, 4.2, width - 8.2, height - 8.4);
  const panel = {
    x: layout.x - 0.38,
    y: layout.y - 0.36,
    width: layout.width + 0.76,
    height: layout.height + 0.72,
    rx: Math.max(2.6, layout.rx - 0.48),
  };
  const flowerColors = [
    enrichColor(mixColors(palette.accent, "#ffbfd8", 0.02), { saturationMult: 1.3, lightnessShift: -0.02 }),
    enrichColor(mixColors(palette.pop, "#ffd782", 0.03), { saturationMult: 1.28, lightnessShift: -0.02 }),
    enrichColor(mixColors(palette.soft, "#d5fff1", 0.05), { saturationMult: 1.18, lightnessShift: -0.06 }),
    enrichColor(mixColors(palette.border, "#d7c0ff", 0.06), { saturationMult: 1.2, lightnessShift: 0.02 }),
    enrichColor(mixColors("#f6b8a8", palette.pop, 0.08), { saturationMult: 1.18, lightnessShift: -0.02 }),
    enrichColor(mixColors("#bfe3c8", palette.soft, 0.12), { saturationMult: 1.14, lightnessShift: -0.04 }),
  ];
  const centers = [
    mixColors("#fff0a8", palette.pop, 0.04),
    mixColors("#fff7dc", palette.paper, 0.06),
    mixColors("#ffd8a0", palette.pop, 0.12),
  ];
  const leafColors = [
    enrichColor(mixColors("#b7e0b7", palette.soft, 0.14), { saturationMult: 1.08, lightnessShift: -0.06 }),
    enrichColor(mixColors("#9fd2c3", palette.accent, 0.16), { saturationMult: 1.06, lightnessShift: -0.04 }),
    enrichColor(mixColors("#d7efc8", palette.paper, 0.22), { saturationMult: 1.04, lightnessShift: -0.08 }),
  ];
  const frameBorder = enrichColor(mixColors(palette.soft, palette.border, 0.34), {
    hueShift: -12 + seeded(seed, 9000) * 22,
    saturationMult: 1.08,
    lightnessShift: -0.02,
  });
  const frameInner = mixColors(frameBorder, palette.paper, 0.24);
  const panelShadow = mixColors(frameBorder, palette.paper, 0.76);

  const renderFlower = (x: number, y: number, scale: number, rotation: number, color: string, center: string, style: number, opacity: number) => {
    if (style === 0) {
      return (
        <g transform={`rotate(${rotation} ${x} ${y})`} opacity={opacity}>
          {Array.from({ length: 6 }).map((_, index) => {
            const angle = (Math.PI * 2 * index) / 6;
            const px = x + Math.cos(angle) * 1.15 * scale;
            const py = y + Math.sin(angle) * 1.15 * scale;
            return <ellipse key={`flower-a-${x}-${y}-${index}`} cx={px} cy={py} rx={0.52 * scale} ry={1.08 * scale} fill={color} transform={`rotate(${(angle * 180) / Math.PI} ${px} ${py})`} />;
          })}
          <circle cx={x} cy={y} r={0.58 * scale} fill={center} />
        </g>
      );
    }

    if (style === 1) {
      return (
        <g transform={`rotate(${rotation} ${x} ${y})`} opacity={opacity}>
          {Array.from({ length: 5 }).map((_, index) => {
            const angle = (Math.PI * 2 * index) / 5;
            const px = x + Math.cos(angle) * 1.05 * scale;
            const py = y + Math.sin(angle) * 1.05 * scale;
            return <circle key={`flower-b-${x}-${y}-${index}`} cx={px} cy={py} r={0.82 * scale} fill={color} />;
          })}
          <circle cx={x} cy={y} r={0.52 * scale} fill={center} />
        </g>
      );
    }

    return (
      <g transform={`rotate(${rotation} ${x} ${y})`} opacity={opacity}>
        {Array.from({ length: 8 }).map((_, index) => {
          const angle = (Math.PI * 2 * index) / 8;
          const px = x + Math.cos(angle) * 1.26 * scale;
          const py = y + Math.sin(angle) * 1.26 * scale;
          return <ellipse key={`flower-c-${x}-${y}-${index}`} cx={px} cy={py} rx={0.38 * scale} ry={0.94 * scale} fill={color} transform={`rotate(${(angle * 180) / Math.PI} ${px} ${py})`} />;
        })}
        <circle cx={x} cy={y} r={0.46 * scale} fill={center} />
      </g>
    );
  };

  const renderLeafSprig = (x: number, y: number, scale: number, rotation: number, color: string, opacity: number) => (
    <g transform={`rotate(${rotation} ${x} ${y})`} opacity={opacity}>
      <path
        d={`M ${x - 1.9 * scale} ${y + 1.8 * scale} Q ${x - 0.2 * scale} ${y} ${x + 1.6 * scale} ${y - 1.7 * scale}`}
        fill="none"
        stroke={mixColors(color, palette.border, 0.12)}
        strokeWidth={0.14 * scale}
        strokeLinecap="round"
      />
      <ellipse cx={x - 0.7 * scale} cy={y + 0.64 * scale} rx={0.58 * scale} ry={0.22 * scale} fill={color} transform={`rotate(-28 ${x - 0.7 * scale} ${y + 0.64 * scale})`} />
      <ellipse cx={x + 0.2 * scale} cy={y - 0.08 * scale} rx={0.66 * scale} ry={0.24 * scale} fill={color} transform={`rotate(22 ${x + 0.2 * scale} ${y - 0.08 * scale})`} />
      <ellipse cx={x + 1.06 * scale} cy={y - 0.8 * scale} rx={0.52 * scale} ry={0.2 * scale} fill={mixColors(color, palette.paper, 0.08)} transform={`rotate(-14 ${x + 1.06 * scale} ${y - 0.8 * scale})`} />
    </g>
  );

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fff8fb", palette.paper, 0.04)} />
          <stop offset="56%" stopColor={mixColors(palette.paper, "#fffdfb", 0.02)} />
          <stop offset="100%" stopColor={mixColors(palette.soft, palette.paper, 0.24)} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fffefe", palette.paper, 0.02)} />
          <stop offset="100%" stopColor={mixColors("#fff8fb", palette.paper, 0.12)} />
        </linearGradient>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      <path d={outerPath} fill={mixColors(frameBorder, palette.soft, 0.78)} opacity="0.12" transform="translate(0.7 0.9)" />
      <g clipPath={`url(#${sceneClip})`}>
        <rect x="0" y="0" width={width} height={height} fill={`url(#${outerId})`} />
        <circle cx={width * 0.16} cy={height * 0.2} r={height * 0.18} fill={mixColors(flowerColors[0], palette.paper, 0.8)} opacity="0.14" />
        <circle cx={width * 0.82} cy={height * 0.2} r={height * 0.2} fill={mixColors(flowerColors[1], palette.paper, 0.82)} opacity="0.12" />
        {Array.from({ length: 20 }).map((_, index) => {
          const side = index % 4;
          const x =
            side === 0
              ? width * (-0.04 + seeded(seed, 9010 + index) * 0.12)
              : side === 1
                ? width * (0.88 + seeded(seed, 9010 + index) * 0.16)
                : width * (0.08 + seeded(seed, 9010 + index) * 0.84);
          const y =
            side === 2
              ? height * (-0.06 + seeded(seed, 9050 + index) * 0.18)
              : side === 3
                ? height * (0.84 + seeded(seed, 9050 + index) * 0.18)
                : height * (0.08 + seeded(seed, 9050 + index) * 0.82);
          const scale = 1.16 + seeded(seed, 9090 + index) * 1.2;
          const style = Math.floor(seeded(seed, 9130 + index) * 3);
          const rotation = seeded(seed, 9170 + index) * 90 - 45;
          const color = flowerColors[(index + 2) % flowerColors.length];
          const center = centers[(index + 1) % centers.length];
          return <g key={`flower-edge-${index}`}>{renderFlower(x, y, scale, rotation, color, center, style, 0.78)}</g>;
        })}
        {Array.from({ length: 144 }).map((_, index) => {
          const x = width * (-0.02 + seeded(seed, 9100 + index) * 1.04);
          const y = height * (-0.02 + seeded(seed, 9220 + index) * 1.04);
          const scale = 0.22 + seeded(seed, 9340 + index) * 1.34;
          const style = Math.floor(seeded(seed, 9460 + index) * 3);
          const rotation = seeded(seed, 9580 + index) * 60 - 30;
          const color = flowerColors[index % flowerColors.length];
          const center = centers[index % centers.length];
          const opacity = scale > 1.1 ? 0.86 : scale > 0.7 ? 0.72 : 0.58;
          return <g key={`flower-pattern-${index}`}>{renderFlower(x, y, scale, rotation, color, center, style, opacity)}</g>;
        })}
        {Array.from({ length: 28 }).map((_, index) => {
          const x = width * (0.04 + seeded(seed, 9620 + index) * 0.92);
          const y = height * (0.06 + seeded(seed, 9660 + index) * 0.86);
          const scale = 0.66 + seeded(seed, 9700 + index) * 0.52;
          const rotation = seeded(seed, 9740 + index) * 140 - 70;
          const color = leafColors[index % leafColors.length];
          return <g key={`flower-leaf-${index}`}>{renderLeafSprig(x, y, scale, rotation, color, 0.42)}</g>;
        })}
        {Array.from({ length: 48 }).map((_, index) => {
          const x = width * (0.04 + seeded(seed, 9780 + index) * 0.92);
          const y = height * (0.06 + seeded(seed, 9820 + index) * 0.86);
          const scale = 0.12 + seeded(seed, 9860 + index) * 0.22;
          const rotation = seeded(seed, 9900 + index) * 70 - 35;
          const color = flowerColors[(index + 3) % flowerColors.length];
          const center = centers[(index + 2) % centers.length];
          return <g key={`flower-micro-${index}`}>{renderFlower(x, y, scale, rotation, color, center, index % 2, 0.6)}</g>;
        })}
        {Array.from({ length: 88 }).map((_, index) => (
          <circle
            key={`flowers-dot-${index}`}
            cx={width * (0.02 + seeded(seed, 9700 + index) * 0.96)}
            cy={height * (0.04 + seeded(seed, 9800 + index) * 0.92)}
            r={0.08 + seeded(seed, 9900 + index) * 0.18}
            fill={flowerColors[index % flowerColors.length]}
            opacity={0.22 + (index % 3) * 0.08}
          />
        ))}
      </g>
      <path d={outerPath} fill="none" stroke={frameBorder} strokeWidth="1.08" />
      <path d={innerPath} fill="none" stroke={frameInner} strokeWidth="0.68" opacity="0.78" />
      <rect x={panel.x + 0.34} y={panel.y + 0.42} width={panel.width} height={panel.height} rx={panel.rx} fill={panelShadow} opacity="0.1" />
      <rect x={panel.x} y={panel.y} width={panel.width} height={panel.height} rx={panel.rx} fill={`url(#${panelId})`} fillOpacity="0.8" stroke={mixColors(frameBorder, palette.paper, 0.18)} strokeWidth="0.42" />
      <rect x={panel.x} y={panel.y} width={panel.width} height={panel.height} rx={panel.rx} fill="none" stroke={mixColors("#ffffff", palette.paper, 0.22)} strokeWidth="0.16" transform="translate(0 0.18)" opacity="0.7" />
      <QuestionText clipId={clipId} layout={layout} ink={mixColors(palette.ink, palette.paper, 0.18)} lines={lines} />
    </g>
  );
}

function RainbowTheme(props: {
  width: number;
  height: number;
  palette: Palette;
  layout: QuestionLayout;
  clipId: string;
  lines: string[];
  seed: number;
  cardId: string;
}) {
  const { width, height, palette, layout, clipId, lines, seed, cardId } = props;
  const outerId = `${cardId}-rainbow-outer`;
  const panelId = `${cardId}-rainbow-panel`;
  const sceneClip = `${cardId}-rainbow-scene`;
  const outerPath = plaquePath(1.2, 1.2, width - 2.4, height - 2.4);
  const innerPath = plaquePath(4.1, 4.2, width - 8.2, height - 8.4);
  const panel = {
    x: layout.x - 0.38,
    y: layout.y - 0.36,
    width: layout.width + 0.76,
    height: layout.height + 0.72,
    rx: Math.max(2.6, layout.rx - 0.48),
  };
  const rainbow = [
    enrichColor("#ff8c8c", { saturationMult: 1.16, lightnessShift: -0.02 }),
    enrichColor("#ffb866", { saturationMult: 1.16, lightnessShift: -0.02 }),
    enrichColor("#ffd74f", { saturationMult: 1.14, lightnessShift: -0.01 }),
    enrichColor("#92d884", { saturationMult: 1.12, lightnessShift: -0.02 }),
    enrichColor("#72d6d9", { saturationMult: 1.14, lightnessShift: -0.02 }),
    enrichColor("#86afff", { saturationMult: 1.16, lightnessShift: -0.01 }),
    enrichColor("#bf95f1", { saturationMult: 1.14, lightnessShift: -0.01 }),
  ];
  const frameBorder = mixColors(palette.border, rainbow[5], 0.18);
  const frameInner = mixColors(frameBorder, palette.paper, 0.22);
  const panelShadow = mixColors(frameBorder, palette.paper, 0.74);
  const rainbowSweeps = [
    {
      x1: width * -0.18,
      x2: width * 0.38,
      y: height * (0.26 + seeded(seed, 10900) * 0.06),
      lift: height * (0.18 + seeded(seed, 10910) * 0.08),
      spread: 0.84,
      widthScale: 1,
      opacity: 0.84,
    },
    {
      x1: width * 0.28,
      x2: width * 0.98,
      y: height * (0.2 + seeded(seed, 10920) * 0.08),
      lift: height * (0.16 + seeded(seed, 10930) * 0.08),
      spread: 0.78,
      widthScale: 0.94,
      opacity: 0.8,
    },
    {
      x1: width * 0.62,
      x2: width * 1.12,
      y: height * (0.62 + seeded(seed, 10940) * 0.08),
      lift: height * (0.16 + seeded(seed, 10950) * 0.06),
      spread: 0.82,
      widthScale: 1.04,
      opacity: 0.88,
    },
    {
      x1: width * -0.1,
      x2: width * 0.56,
      y: height * (0.8 + seeded(seed, 10960) * 0.06),
      lift: height * (0.18 + seeded(seed, 10970) * 0.07),
      spread: 0.8,
      widthScale: 1.08,
      opacity: 0.86,
    },
    {
      x1: width * 0.18,
      x2: width * 1.08,
      y: height * (0.9 + seeded(seed, 10980) * 0.04),
      lift: height * (0.24 + seeded(seed, 10990) * 0.08),
      spread: 0.92,
      widthScale: 1.12,
      opacity: 0.8,
    },
  ];

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fff8fb", palette.paper, 0.03)} />
          <stop offset="100%" stopColor={mixColors("#fffef9", palette.paper, 0.08)} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fffefe", palette.paper, 0.02)} />
          <stop offset="100%" stopColor={mixColors("#fff8fb", palette.paper, 0.12)} />
        </linearGradient>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      <path d={outerPath} fill={mixColors(frameBorder, palette.soft, 0.78)} opacity="0.14" transform="translate(0.7 0.9)" />
      <g clipPath={`url(#${sceneClip})`}>
        <rect x="0" y="0" width={width} height={height} fill={`url(#${outerId})`} />
        <circle cx={width * 0.16} cy={height * 0.24} r={height * 0.2} fill={mixColors(rainbow[0], palette.paper, 0.88)} opacity="0.11" />
        <circle cx={width * 0.84} cy={height * 0.72} r={height * 0.2} fill={mixColors(rainbow[5], palette.paper, 0.88)} opacity="0.11" />
        {rainbowSweeps.map((sweep, sweepIndex) => {
          const bandThickness = height * 0.018 * sweep.widthScale;
          const bandGap = bandThickness * 0.66;
          const control1X = sweep.x1 + (sweep.x2 - sweep.x1) * 0.3;
          const control2X = sweep.x1 + (sweep.x2 - sweep.x1) * 0.72;
          return (
            <g key={`rainbow-sweep-${sweepIndex}`} opacity={sweep.opacity}>
              {rainbow.map((color, bandIndex) => {
                const offset = bandIndex * bandGap;
                const y = sweep.y + offset;
                const lift = Math.max(2.2, sweep.lift - offset * sweep.spread);
                return (
                  <path
                    key={`rainbow-sweep-band-${sweepIndex}-${bandIndex}`}
                    d={`M ${sweep.x1} ${y} C ${control1X} ${y - lift} ${control2X} ${y - lift * 0.92} ${sweep.x2} ${y}`}
                    fill="none"
                    stroke={color}
                    strokeWidth={bandThickness}
                    strokeLinecap="round"
                    opacity={0.96 - bandIndex * 0.02}
                  />
                );
              })}
            </g>
          );
        })}
        {Array.from({ length: 44 }).map((_, index) => {
          const x = width * (0.02 + seeded(seed, 10500 + index) * 0.96);
          const y = height * (0.04 + seeded(seed, 10560 + index) * 0.92);
          const size = 0.52 + seeded(seed, 10620 + index) * 1.46;
          const color = rainbow[index % rainbow.length];
          return index % 2 === 0 ? (
            <path
              key={`rainbow-star-${index}`}
              d={sparklePath(x, y, size, size * 0.38)}
              fill={color}
              opacity={0.58 + (index % 3) * 0.12}
            />
          ) : (
            <circle
              key={`rainbow-dot-${index}`}
              cx={x}
              cy={y}
              r={size * 0.28}
              fill={color}
              opacity={0.52 + (index % 4) * 0.08}
            />
          );
        })}
        {Array.from({ length: 18 }).map((_, index) => {
          const x = width * (0.06 + seeded(seed, 10680 + index) * 0.88);
          const y = height * (0.08 + seeded(seed, 10720 + index) * 0.84);
          const w = 2.8 + seeded(seed, 10760 + index) * 5.2;
          const h = 0.58 + seeded(seed, 10800 + index) * 0.76;
          const color = rainbow[(index + 2) % rainbow.length];
          return (
            <rect
              key={`rainbow-bar-${index}`}
              x={x}
              y={y}
              width={w}
              height={h}
              rx={h / 2}
              fill={color}
              opacity={0.74}
              transform={`rotate(${seeded(seed, 10840 + index) * 80 - 40} ${x + w / 2} ${y + h / 2})`}
            />
          );
        })}
      </g>
      <path d={outerPath} fill="none" stroke={frameBorder} strokeWidth="1.08" />
      <path d={innerPath} fill="none" stroke={frameInner} strokeWidth="0.68" opacity="0.78" />
      <rect x={panel.x + 0.34} y={panel.y + 0.42} width={panel.width} height={panel.height} rx={panel.rx} fill={panelShadow} opacity="0.1" />
      <rect x={panel.x} y={panel.y} width={panel.width} height={panel.height} rx={panel.rx} fill={`url(#${panelId})`} fillOpacity="0.8" stroke={mixColors(frameBorder, palette.paper, 0.18)} strokeWidth="0.42" />
      <rect x={panel.x} y={panel.y} width={panel.width} height={panel.height} rx={panel.rx} fill="none" stroke={mixColors("#ffffff", palette.paper, 0.22)} strokeWidth="0.16" transform="translate(0 0.18)" opacity="0.7" />
      <QuestionText clipId={clipId} layout={layout} ink={mixColors(palette.ink, palette.paper, 0.18)} lines={lines} />
    </g>
  );
}

function StripesTheme(
  props: {
    width: number;
    height: number;
    palette: Palette;
    layout: QuestionLayout;
    clipId: string;
    lines: string[];
    seed: number;
    cardId: string;
  } & { orientation: "vertical" | "horizontal" },
) {
  const { width, height, palette, layout, clipId, lines, seed, cardId, orientation } = props;
  const outerId = `${cardId}-stripes-outer-${orientation}`;
  const panelId = `${cardId}-stripes-panel-${orientation}`;
  const sceneClip = `${cardId}-stripes-scene-${orientation}`;
  const outerPath = plaquePath(1.2, 1.2, width - 2.4, height - 2.4);
  const innerPath = plaquePath(4.1, 4.2, width - 8.2, height - 8.4);
  const panel = {
    x: layout.x - 0.38,
    y: layout.y - 0.36,
    width: layout.width + 0.76,
    height: layout.height + 0.72,
    rx: Math.max(2.6, layout.rx - 0.48),
  };
  const stripeStories = [
    ["#ff8fa7", "#ffcc66", "#9fd4a7", "#a9c5ff", "#d7a8ff", "#ffb7c7", "#f4d25d", "#91d8d0"],
    ["#f9678a", "#fbc547", "#fec2bc", "#a8c8ff", "#bfe2a5", "#caa8ff", "#ffde9a", "#ff9db2"],
    ["#ffa16f", "#ffd36d", "#8ed3b8", "#8fb6ff", "#ff8ebb", "#c5a4ff", "#79d6d0", "#ffe4a8"],
    ["#ff8aa1", "#ffb84f", "#9cc78e", "#8cb8d6", "#df9cff", "#f8d0df", "#f0d25d", "#72d0b6"],
    ["#ff8da8", "#f6c552", "#9edfcf", "#b2c0ff", "#f7a0d0", "#e9bbff", "#ffd789", "#93dca6"],
  ];
  const stripeStory = stripeStories[Math.floor(seeded(seed, 5840) * stripeStories.length)] ?? stripeStories[0];
  const stripeColors = stripeStory.map((color, colorIndex) =>
    enrichColor(mixColors(color, colorIndex % 2 === 0 ? palette.accent : palette.pop, 0.06 + seeded(seed, 5860 + colorIndex) * 0.18), {
      hueShift: (seeded(seed, 5890 + colorIndex) - 0.5) * 10,
      saturationMult: 1.12 + seeded(seed, 5920 + colorIndex) * 0.42,
      lightnessShift: -0.08 + seeded(seed, 5950 + colorIndex) * 0.08,
    }),
  );
  stripeColors.push(
    enrichColor(mixColors("#ffffff", palette.paper, 0.04), { saturationMult: 0.82, lightnessShift: 0.02 }),
    enrichColor(mixColors("#ffd7e6", palette.soft, 0.12), { saturationMult: 1.1, lightnessShift: -0.03 }),
    enrichColor(mixColors("#b6f0de", palette.soft, 0.16), { saturationMult: 1.1, lightnessShift: -0.07 }),
  );

  const styleModes = ["pinstripe", "candy", "grouped", "ribbon"] as const;
  const styleMode = styleModes[Math.floor(seeded(seed, 5980) * styleModes.length)] ?? "grouped";
  const maxSpan = orientation === "vertical" ? width : height;
  const bands: Array<{ offset: number; size: number; color: string; opacity: number }> = [];
  let cursor = -2;
  let index = 0;

  while (cursor < maxSpan + 2) {
    const rhythm = seeded(seed, 6040 + index);
    const clusterIndex = index % 7;
    let size = 1;
    let gap = 0.12;
    let opacity = 0.84;

    if (styleMode === "pinstripe") {
      const isHero = rhythm > 0.9;
      size = isHero ? 1.8 + seeded(seed, 6080 + index) * 2.8 : 0.18 + seeded(seed, 6120 + index) * 0.78;
      gap = 0.02 + seeded(seed, 6160 + index) * (isHero ? 0.28 : 0.16);
      opacity = isHero ? 0.94 : 0.72 + seeded(seed, 6200 + index) * 0.16;
    } else if (styleMode === "candy") {
      const isHero = rhythm > 0.68;
      size = isHero ? 4.2 + seeded(seed, 6240 + index) * 5.8 : 1.1 + seeded(seed, 6280 + index) * 3.4;
      gap = 0.04 + seeded(seed, 6320 + index) * 0.22;
      opacity = isHero ? 0.94 : 0.82 + seeded(seed, 6360 + index) * 0.1;
    } else if (styleMode === "grouped") {
      if (clusterIndex === 0) {
        size = 4.2 + seeded(seed, 6400 + index) * 4.8;
        gap = 0.08 + seeded(seed, 6440 + index) * 0.18;
        opacity = 0.92;
      } else if (clusterIndex <= 3) {
        size = 0.28 + seeded(seed, 6480 + index) * 0.72;
        gap = 0.03 + seeded(seed, 6520 + index) * 0.12;
        opacity = 0.7 + seeded(seed, 6560 + index) * 0.16;
      } else {
        size = 1 + seeded(seed, 6600 + index) * 2.2;
        gap = 0.08 + seeded(seed, 6640 + index) * 0.28;
        opacity = 0.8 + seeded(seed, 6680 + index) * 0.14;
      }
    } else {
      const isRibbon = rhythm > 0.74;
      size = isRibbon ? 3 + seeded(seed, 6720 + index) * 7.4 : 0.4 + seeded(seed, 6760 + index) * 1.8;
      gap = 0.03 + seeded(seed, 6800 + index) * 0.2;
      opacity = isRibbon ? 0.95 : 0.74 + seeded(seed, 6840 + index) * 0.18;
    }

    bands.push({
      offset: cursor,
      size,
      color: stripeColors[(index + Math.floor(seeded(seed, 6880 + index) * 3)) % stripeColors.length],
      opacity,
    });
    cursor += size + gap;
    index += 1;
  }

  const accentCount = styleMode === "pinstripe" ? 34 : styleMode === "candy" ? 18 : styleMode === "grouped" ? 24 : 22;
  const glintCount = styleMode === "candy" ? 9 : styleMode === "ribbon" ? 12 : 7;

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fffaf8", palette.paper, 0.02)} />
          <stop offset="100%" stopColor={mixColors("#fff2f1", palette.soft, 0.18)} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fffefe", palette.paper, 0.02)} />
          <stop offset="100%" stopColor={mixColors("#fff8fb", palette.paper, 0.12)} />
        </linearGradient>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      <path d={outerPath} fill={mixColors(palette.border, palette.soft, 0.72)} opacity="0.12" transform="translate(0.7 0.9)" />
      <g clipPath={`url(#${sceneClip})`}>
        <rect x="0" y="0" width={width} height={height} fill={`url(#${outerId})`} />
        {bands.map((band, bandIndex) =>
          orientation === "vertical" ? (
            <rect
              key={`stripe-v-${bandIndex}`}
              x={band.offset}
              y={0}
              width={band.size}
              height={height}
              fill={band.color}
              opacity={band.opacity}
            />
          ) : (
            <rect
              key={`stripe-h-${bandIndex}`}
              x={0}
              y={band.offset}
              width={width}
              height={band.size}
              fill={band.color}
              opacity={band.opacity}
            />
          ),
        )}
        {Array.from({ length: accentCount }).map((_, accentIndex) => {
          const accentColor = stripeColors[(accentIndex + 3) % stripeColors.length];
          const thin =
            styleMode === "pinstripe"
              ? 0.08 + seeded(seed, 6920 + accentIndex) * 0.22
              : styleMode === "candy"
                ? 0.18 + seeded(seed, 6960 + accentIndex) * 0.68
                : 0.14 + seeded(seed, 7000 + accentIndex) * 0.5;
          return orientation === "vertical" ? (
            <rect
              key={`stripe-v-accent-${accentIndex}`}
              x={width * (0.01 + seeded(seed, 7040 + accentIndex) * 0.98)}
              y={0}
              width={thin}
              height={height}
              fill={accentColor}
              opacity={0.36 + seeded(seed, 7080 + accentIndex) * 0.22}
            />
          ) : (
            <rect
              key={`stripe-h-accent-${accentIndex}`}
              x={0}
              y={height * (0.01 + seeded(seed, 7120 + accentIndex) * 0.98)}
              width={width}
              height={thin}
              fill={accentColor}
              opacity={0.36 + seeded(seed, 7160 + accentIndex) * 0.22}
            />
          );
        })}
        {Array.from({ length: glintCount }).map((_, glintIndex) => {
          const span = 4 + seeded(seed, 7200 + glintIndex) * 10;
          const place = 0.02 + seeded(seed, 7240 + glintIndex) * 0.92;
          const shine = mixColors("#ffffff", stripeColors[(glintIndex + 1) % stripeColors.length], 0.18);
          return orientation === "vertical" ? (
            <rect
              key={`stripe-v-glint-${glintIndex}`}
              x={width * place}
              y={0}
              width={span}
              height={height}
              fill={shine}
              opacity={0.12 + seeded(seed, 7280 + glintIndex) * 0.14}
            />
          ) : (
            <rect
              key={`stripe-h-glint-${glintIndex}`}
              x={0}
              y={height * place}
              width={width}
              height={span}
              fill={shine}
              opacity={0.12 + seeded(seed, 7320 + glintIndex) * 0.14}
            />
          );
        })}
      </g>
      <path d={outerPath} fill="none" stroke={palette.border} strokeWidth="1.08" />
      <path d={innerPath} fill="none" stroke={mixColors(palette.border, palette.paper, 0.18)} strokeWidth="0.68" opacity="0.78" />
      <rect x={panel.x + 0.34} y={panel.y + 0.42} width={panel.width} height={panel.height} rx={panel.rx} fill={mixColors(palette.border, palette.paper, 0.76)} opacity="0.1" />
      <rect x={panel.x} y={panel.y} width={panel.width} height={panel.height} rx={panel.rx} fill={`url(#${panelId})`} fillOpacity="0.78" stroke={mixColors(palette.border, palette.paper, 0.18)} strokeWidth="0.42" />
      <rect x={panel.x} y={panel.y} width={panel.width} height={panel.height} rx={panel.rx} fill="none" stroke={mixColors("#ffffff", palette.paper, 0.2)} strokeWidth="0.16" transform="translate(0 0.18)" opacity="0.7" />
      <QuestionText clipId={clipId} layout={layout} ink={mixColors(palette.ink, palette.paper, 0.18)} lines={lines} />
    </g>
  );
}

function VerticalStripesTheme(props: {
  width: number;
  height: number;
  palette: Palette;
  layout: QuestionLayout;
  clipId: string;
  lines: string[];
  seed: number;
  cardId: string;
}) {
  return <StripesTheme {...props} orientation="vertical" />;
}

function HorizontalStripesTheme(props: {
  width: number;
  height: number;
  palette: Palette;
  layout: QuestionLayout;
  clipId: string;
  lines: string[];
  seed: number;
  cardId: string;
}) {
  return <StripesTheme {...props} orientation="horizontal" />;
}

function StarsTheme(props: {
  width: number;
  height: number;
  palette: Palette;
  layout: QuestionLayout;
  clipId: string;
  lines: string[];
  seed: number;
  cardId: string;
}) {
  const { width, height, palette, layout, clipId, lines, seed, cardId } = props;
  const outerId = `${cardId}-stars-outer`;
  const panelId = `${cardId}-stars-panel`;
  const sceneClip = `${cardId}-stars-scene`;
  const outerPath = plaquePath(1.2, 1.2, width - 2.4, height - 2.4);
  const innerPath = plaquePath(4.1, 4.2, width - 8.2, height - 8.4);
  const panel = {
    x: layout.x - 0.38,
    y: layout.y - 0.36,
    width: layout.width + 0.76,
    height: layout.height + 0.72,
    rx: Math.max(2.6, layout.rx - 0.48),
  };
  const starColors = [
    enrichColor(mixColors(palette.accent, "#ffbfd8", 0.04), { saturationMult: 1.32, lightnessShift: -0.01 }),
    enrichColor(mixColors(palette.pop, "#ffd98a", 0.04), { saturationMult: 1.3, lightnessShift: -0.02 }),
    enrichColor(mixColors(palette.soft, "#dcecff", 0.04), { saturationMult: 1.2, lightnessShift: -0.01 }),
    enrichColor(mixColors(palette.border, "#cab9ff", 0.08), { saturationMult: 1.24, lightnessShift: -0.01 }),
  ];
  const dustColors = [
    starColors[0],
    starColors[1],
    starColors[2],
    mixColors("#ffffff", palette.paper, 0.08),
  ];

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fff8fb", palette.paper, 0.04)} />
          <stop offset="56%" stopColor={mixColors(palette.paper, "#fffdfb", 0.02)} />
          <stop offset="100%" stopColor={mixColors(palette.soft, palette.paper, 0.24)} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fffefe", palette.paper, 0.02)} />
          <stop offset="100%" stopColor={mixColors("#fff8fb", palette.paper, 0.12)} />
        </linearGradient>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      <path d={outerPath} fill={mixColors(palette.border, palette.soft, 0.7)} opacity="0.12" transform="translate(0.7 0.9)" />
      <g clipPath={`url(#${sceneClip})`}>
        <rect x="0" y="0" width={width} height={height} fill={`url(#${outerId})`} />
        <circle cx={width * 0.16} cy={height * 0.2} r={height * 0.18} fill={mixColors(starColors[0], palette.paper, 0.72)} opacity="0.16" />
        <circle cx={width * 0.78} cy={height * 0.18} r={height * 0.2} fill={mixColors(starColors[1], palette.paper, 0.72)} opacity="0.14" />
        {Array.from({ length: 134 }).map((_, index) => {
          const x = width * (-0.04 + seeded(seed, 2000 + index) * 1.08);
          const y = height * (-0.03 + seeded(seed, 2060 + index) * 1.06);
          const outer = 0.14 + seeded(seed, 2120 + index) * 1.72;
          const isFivePoint = seeded(seed, 2240 + index) > 0.22;
          const inner = outer * (isFivePoint ? 0.42 + seeded(seed, 2180 + index) * 0.1 : 0.2 + seeded(seed, 2180 + index) * 0.08);
          const points = isFivePoint ? 5 : 4;
          const rotation = seeded(seed, 2300 + index) * 48 - 24;
          const fill = starColors[index % starColors.length];
          const opacity = isFivePoint ? 0.76 + (index % 3) * 0.08 : 0.5 + (index % 3) * 0.08;

          return (
            <g key={`star-pattern-${index}`} transform={`rotate(${rotation} ${x} ${y})`} opacity={opacity}>
              <path d={sparklePath(x, y, outer, inner, points)} fill={fill} />
              <path d={sparklePath(x, y, outer, inner, points)} fill="none" stroke={mixColors(fill, palette.border, 0.1)} strokeWidth={isFivePoint ? "0.08" : "0.06"} opacity="0.28" />
            </g>
          );
        })}
        {Array.from({ length: 116 }).map((_, index) => (
          <circle
            key={`stars-dust-${index}`}
            cx={width * (0.02 + seeded(seed, 2360 + index) * 0.96)}
            cy={height * (0.04 + seeded(seed, 2440 + index) * 0.92)}
            r={0.08 + seeded(seed, 2520 + index) * 0.2}
            fill={dustColors[index % dustColors.length]}
            opacity={0.34 + (index % 3) * 0.14}
          />
        ))}
        <path
          d={`M ${width * 0.08} ${height * 0.3} q ${width * 0.08} -${height * 0.032} ${width * 0.18} 0 q ${width * 0.08} ${height * 0.024} ${width * 0.16} -${height * 0.004}`}
          fill="none"
          stroke={mixColors(starColors[2], palette.paper, 0.66)}
          strokeWidth="0.3"
          strokeLinecap="round"
          opacity="0.5"
        />
        <path
          d={`M ${width * 0.62} ${height * 0.76} q ${width * 0.08} -${height * 0.028} ${width * 0.16} 0`}
          fill="none"
          stroke={mixColors(starColors[1], palette.paper, 0.66)}
          strokeWidth="0.28"
          strokeLinecap="round"
          opacity="0.54"
        />
      </g>
      <path d={outerPath} fill="none" stroke={palette.border} strokeWidth="1.08" />
      <path d={innerPath} fill="none" stroke={mixColors(palette.border, palette.paper, 0.18)} strokeWidth="0.68" opacity="0.78" />
      <rect x={panel.x + 0.34} y={panel.y + 0.42} width={panel.width} height={panel.height} rx={panel.rx} fill={mixColors(palette.border, palette.paper, 0.76)} opacity="0.1" />
      <rect x={panel.x} y={panel.y} width={panel.width} height={panel.height} rx={panel.rx} fill={`url(#${panelId})`} fillOpacity="0.8" stroke={mixColors(palette.border, palette.paper, 0.18)} strokeWidth="0.42" />
      <rect x={panel.x} y={panel.y} width={panel.width} height={panel.height} rx={panel.rx} fill="none" stroke={mixColors("#ffffff", palette.paper, 0.22)} strokeWidth="0.16" transform="translate(0 0.18)" opacity="0.7" />
      <QuestionText clipId={clipId} layout={layout} ink={mixColors(palette.ink, palette.paper, 0.18)} lines={lines} />
    </g>
  );
}

function ConfettiTheme(props: {
  width: number;
  height: number;
  palette: Palette;
  layout: QuestionLayout;
  clipId: string;
  lines: string[];
  seed: number;
  cardId: string;
}) {
  const { width, height, palette, layout, clipId, lines, seed, cardId } = props;
  const outerId = `${cardId}-confetti-outer`;
  const panelId = `${cardId}-confetti-panel`;
  const sceneClip = `${cardId}-confetti-scene`;
  const outerPath = plaquePath(1.2, 1.2, width - 2.4, height - 2.4);
  const innerPath = plaquePath(4.1, 4.2, width - 8.2, height - 8.4);
  const panel = {
    x: layout.x - 0.38,
    y: layout.y - 0.36,
    width: layout.width + 0.76,
    height: layout.height + 0.72,
    rx: Math.max(2.6, layout.rx - 0.48),
  };
  const colors = [
    enrichColor(mixColors(palette.accent, "#ffbfd8", 0.03), { saturationMult: 1.34, lightnessShift: -0.01 }),
    enrichColor(mixColors(palette.pop, "#ffd788", 0.03), { saturationMult: 1.34, lightnessShift: -0.02 }),
    enrichColor(mixColors(palette.soft, "#cfeaff", 0.04), { saturationMult: 1.22, lightnessShift: -0.02 }),
    enrichColor(mixColors(palette.border, "#d2b6ff", 0.06), { saturationMult: 1.24, lightnessShift: 0.01 }),
    enrichColor(mixColors("#bde5cf", palette.soft, 0.12), { saturationMult: 1.18, lightnessShift: -0.02 }),
    enrichColor(mixColors("#f7b9a8", palette.pop, 0.08), { saturationMult: 1.2, lightnessShift: -0.02 }),
  ];

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fff8fb", palette.paper, 0.04)} />
          <stop offset="56%" stopColor={mixColors(palette.paper, "#fffefd", 0.02)} />
          <stop offset="100%" stopColor={mixColors(palette.soft, palette.paper, 0.24)} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fffefe", palette.paper, 0.02)} />
          <stop offset="100%" stopColor={mixColors("#fff8fb", palette.paper, 0.12)} />
        </linearGradient>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      <path d={outerPath} fill={mixColors(palette.border, palette.soft, 0.7)} opacity="0.12" transform="translate(0.7 0.9)" />
      <g clipPath={`url(#${sceneClip})`}>
        <rect x="0" y="0" width={width} height={height} fill={`url(#${outerId})`} />
        <circle cx={width * 0.18} cy={height * 0.2} r={height * 0.18} fill={mixColors(colors[0], palette.paper, 0.78)} opacity="0.14" />
        <circle cx={width * 0.8} cy={height * 0.18} r={height * 0.2} fill={mixColors(colors[1], palette.paper, 0.8)} opacity="0.12" />
        {Array.from({ length: 270 }).map((_, index) => {
          const x = width * (-0.04 + seeded(seed, 2600 + index) * 1.08);
          const y = height * (-0.03 + seeded(seed, 2680 + index) * 1.06);
          const w = 0.18 + seeded(seed, 2760 + index) * 1.02;
          const h = 0.18 + seeded(seed, 2840 + index) * 0.94;
          const rotation = seeded(seed, 2920 + index) * 180 - 90;
          const mode = Math.floor(seeded(seed, 3000 + index) * 4);
          const fill = colors[index % colors.length];
          const opacity = 0.68 + (index % 4) * 0.08;

          if (mode === 0) {
            return (
              <rect
                key={`confetti-piece-${index}`}
                x={x}
                y={y}
                width={w}
                height={h}
                rx={0.14}
                fill={fill}
                opacity={opacity}
                transform={`rotate(${rotation} ${x + w / 2} ${y + h / 2})`}
              />
            );
          }

          if (mode === 1) {
            return (
              <circle
                key={`confetti-piece-${index}`}
                cx={x}
                cy={y}
                r={0.16 + seeded(seed, 3080 + index) * 0.42}
                fill={fill}
                opacity={opacity}
              />
            );
          }

          if (mode === 2) {
            return (
              <path
                key={`confetti-piece-${index}`}
                d={`M ${x} ${y} L ${x + w} ${y + h * 0.16} L ${x + w * 0.24} ${y + h}`}
                fill={fill}
                opacity={opacity}
                transform={`rotate(${rotation} ${x + w / 2} ${y + h / 2})`}
              />
            );
          }

          return (
            <ellipse
              key={`confetti-piece-${index}`}
              cx={x}
              cy={y}
              rx={0.12 + seeded(seed, 3160 + index) * 0.34}
              ry={0.08 + seeded(seed, 3240 + index) * 0.22}
              fill={fill}
              opacity={opacity}
              transform={`rotate(${rotation} ${x} ${y})`}
            />
          );
        })}
        {Array.from({ length: 64 }).map((_, index) => {
          const startX = width * (-0.04 + seeded(seed, 3320 + index) * 1.08);
          const startY = height * (0.04 + seeded(seed, 3380 + index) * 0.88);
          const sweep = width * (0.024 + seeded(seed, 3440 + index) * 0.06);
          const lift = height * (0.022 + seeded(seed, 3500 + index) * 0.07);
          const nearFactor = seeded(seed, 3560 + index);
          const strokeWidth =
            nearFactor > 0.78
              ? 0.9 + seeded(seed, 3620 + index) * 0.22
              : nearFactor > 0.48
                ? 0.42 + seeded(seed, 3680 + index) * 0.22
                : 0.18 + seeded(seed, 3740 + index) * 0.14;
          const opacity =
            nearFactor > 0.78
              ? 0.92
              : nearFactor > 0.48
                ? 0.82
                : 0.66;
          return (
            <path
              key={`confetti-ribbon-${index}`}
              d={`M ${startX} ${startY} q ${sweep * 0.4} -${lift} ${sweep} 0 q ${sweep * 0.35} ${lift} ${sweep * 0.8} 0`}
              fill="none"
              stroke={colors[index % colors.length]}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              opacity={opacity}
            />
          );
        })}
      </g>
      <path d={outerPath} fill="none" stroke={palette.border} strokeWidth="1.08" />
      <path d={innerPath} fill="none" stroke={mixColors(palette.border, palette.paper, 0.18)} strokeWidth="0.68" opacity="0.78" />
      <rect x={panel.x + 0.34} y={panel.y + 0.42} width={panel.width} height={panel.height} rx={panel.rx} fill={mixColors(palette.border, palette.paper, 0.76)} opacity="0.1" />
      <rect x={panel.x} y={panel.y} width={panel.width} height={panel.height} rx={panel.rx} fill={`url(#${panelId})`} fillOpacity="0.8" stroke={mixColors(palette.border, palette.paper, 0.18)} strokeWidth="0.42" />
      <rect x={panel.x} y={panel.y} width={panel.width} height={panel.height} rx={panel.rx} fill="none" stroke={mixColors("#ffffff", palette.paper, 0.22)} strokeWidth="0.16" transform="translate(0 0.18)" opacity="0.7" />
      <QuestionText clipId={clipId} layout={layout} ink={mixColors(palette.ink, palette.paper, 0.18)} lines={lines} />
    </g>
  );
}

function GeometricsTheme(props: {
  width: number;
  height: number;
  palette: Palette;
  layout: QuestionLayout;
  clipId: string;
  lines: string[];
  seed: number;
  cardId: string;
}) {
  const { width, height, palette, layout, clipId, lines, seed, cardId } = props;
  const outerId = `${cardId}-geom-outer`;
  const panelId = `${cardId}-geom-panel`;
  const sceneClip = `${cardId}-geom-scene`;
  const outerPath = plaquePath(1.2, 1.2, width - 2.4, height - 2.4);
  const innerPath = plaquePath(4.1, 4.2, width - 8.2, height - 8.4);
  const panel = {
    x: layout.x - 0.4,
    y: layout.y - 0.38,
    width: layout.width + 0.8,
    height: layout.height + 0.76,
    rx: Math.max(2.6, layout.rx - 0.44),
  };
  const stripeA = mixColors(palette.soft, "#fff8fb", 0.04);
  const stripeB = mixColors(palette.accent, palette.paper, 0.08);
  const stripeC = mixColors(palette.pop, palette.paper, 0.1);
  const gridTone = mixColors(palette.border, palette.paper, 0.08);
  const dotTone = mixColors(palette.pop, "#fff4d8", 0.08);
  const wovenA = mixColors(palette.accent, palette.paper, 0.1);
  const wovenB = mixColors(palette.soft, palette.paper, 0.06);
  const tileTone = mixColors(palette.pop, palette.paper, 0.14);
  const stitchTone = mixColors(palette.border, palette.paper, 0.04);

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fffaf7", palette.paper, 0.04)} />
          <stop offset="100%" stopColor={mixColors(palette.soft, palette.paper, 0.34)} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fffefe", palette.paper, 0.02)} />
          <stop offset="100%" stopColor={mixColors("#fff8fa", palette.paper, 0.12)} />
        </linearGradient>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      <path d={outerPath} fill={mixColors(palette.border, palette.soft, 0.68)} opacity="0.12" transform="translate(0.7 0.9)" />
      <g clipPath={`url(#${sceneClip})`}>
        <rect x="0" y="0" width={width} height={height} fill={`url(#${outerId})`} />
        {Array.from({ length: 14 }).map((_, index) => (
          <rect
            key={`geom-stripe-v-${index}`}
            x={index * (width / 14)}
            y="0"
            width={width / 18}
            height={height}
            fill={index % 3 === 0 ? stripeA : index % 3 === 1 ? stripeB : stripeC}
            opacity={0.54 + (index % 2) * 0.1}
          />
        ))}
        {Array.from({ length: 12 }).map((_, index) => (
          <rect
            key={`geom-stripe-h-${index}`}
            x="0"
            y={index * (height / 12)}
            width={width}
            height={height / 34}
            fill={index % 2 === 0 ? wovenA : wovenB}
            opacity={0.24 + (index % 3) * 0.1}
          />
        ))}
        {Array.from({ length: 14 }).map((_, column) =>
          Array.from({ length: 9 }).map((_, row) => {
            const x = width * (0.03 + column * 0.068);
            const y = height * (0.07 + row * 0.098);
            const w = width * (0.038 + seeded(seed, 1750 + column * 20 + row) * 0.02);
            const h = height * (0.045 + seeded(seed, 1800 + column * 20 + row) * 0.024);
            const mode = Math.floor(seeded(seed, 1850 + column * 20 + row) * 4);
            const fill = [tileTone, stripeB, stripeA, stripeC][(column + row) % 4];

            return mode === 0 ? (
              <rect
                key={`geom-tile-${column}-${row}`}
                x={x}
                y={y}
                width={w}
                height={h}
                rx={0.45}
                fill={fill}
                opacity="0.58"
              />
            ) : mode === 1 ? (
              <circle
                key={`geom-tile-${column}-${row}`}
                cx={x + w * 0.5}
                cy={y + h * 0.5}
                r={Math.min(w, h) * 0.26}
                fill={mode === 1 && (column + row) % 2 === 0 ? dotTone : fill}
                opacity="0.76"
              />
            ) : mode === 2 ? (
              <path
                key={`geom-tile-${column}-${row}`}
                d={`M ${x} ${y + h * 0.5} H ${x + w}`}
                fill="none"
                stroke={stitchTone}
                strokeWidth="0.28"
                strokeLinecap="round"
                opacity="0.9"
              />
            ) : (
              <path
                key={`geom-tile-${column}-${row}`}
                d={`M ${x + w * 0.5} ${y} V ${y + h}`}
                fill="none"
                stroke={stitchTone}
                strokeWidth="0.26"
                strokeLinecap="round"
                opacity="0.84"
              />
            );
          }),
        )}
        {Array.from({ length: 16 }).map((_, index) => (
          <path
            key={`geom-grid-v-${index}`}
            d={`M ${width * (0.02 + index * 0.064)} 0 V ${height}`}
            fill="none"
            stroke={gridTone}
            strokeWidth="0.18"
            opacity="0.42"
          />
        ))}
        {Array.from({ length: 11 }).map((_, index) => (
          <path
            key={`geom-grid-h-${index}`}
            d={`M 0 ${height * (0.06 + index * 0.09)} H ${width}`}
            fill="none"
            stroke={gridTone}
            strokeWidth="0.18"
            opacity="0.38"
          />
        ))}
        <path
          d={`M ${width * 0.06} ${height * 0.28} q ${width * 0.08} -${height * 0.03} ${width * 0.18} 0`}
          fill="none"
          stroke={mixColors(palette.pop, palette.paper, 0.1)}
          strokeWidth="0.34"
          strokeLinecap="round"
          opacity="0.72"
        />
        <path
          d={`M ${width * 0.62} ${height * 0.74} q ${width * 0.08} -${height * 0.026} ${width * 0.16} 0`}
          fill="none"
          stroke={mixColors(palette.accent, palette.paper, 0.1)}
          strokeWidth="0.32"
          strokeLinecap="round"
          opacity="0.68"
        />
      </g>
      <path d={outerPath} fill="none" stroke={palette.border} strokeWidth="1.08" />
      <path d={innerPath} fill="none" stroke={mixColors(palette.border, palette.paper, 0.18)} strokeWidth="0.68" opacity="0.78" />
      <rect x={panel.x + 0.34} y={panel.y + 0.42} width={panel.width} height={panel.height} rx={panel.rx} fill={mixColors(palette.border, palette.paper, 0.76)} opacity="0.1" />
      <rect x={panel.x} y={panel.y} width={panel.width} height={panel.height} rx={panel.rx} fill={`url(#${panelId})`} fillOpacity="0.8" stroke={mixColors(palette.border, palette.paper, 0.18)} strokeWidth="0.42" />
      <rect x={panel.x} y={panel.y} width={panel.width} height={panel.height} rx={panel.rx} fill="none" stroke={mixColors("#ffffff", palette.paper, 0.22)} strokeWidth="0.16" transform="translate(0 0.18)" opacity="0.7" />
      <QuestionText clipId={clipId} layout={layout} ink={mixColors(palette.ink, palette.paper, 0.18)} lines={lines} />
    </g>
  );
}

function UnderseaTheme(props: {
  width: number;
  height: number;
  palette: Palette;
  layout: QuestionLayout;
  clipId: string;
  lines: string[];
  seed: number;
  cardId: string;
}) {
  const { width, height, palette, layout, clipId, lines, seed, cardId } = props;
  const outerId = `${cardId}-undersea-outer`;
  const panelId = `${cardId}-undersea-panel`;
  const rayId = `${cardId}-undersea-ray`;
  const sceneClip = `${cardId}-undersea-scene`;
  const outerPath = plaquePath(1.2, 1.2, width - 2.4, height - 2.4);
  const innerPath = plaquePath(4.1, 4.2, width - 8.2, height - 8.4);
  const panel = {
    x: layout.x - 0.42,
    y: layout.y - 0.4,
    width: layout.width + 0.84,
    height: layout.height + 0.8,
    rx: Math.max(2.8, layout.rx - 0.44),
  };
  const waterTop = mixColors("#8cd6ea", palette.soft, 0.12);
  const waterMid = mixColors("#5ea8c8", palette.accent, 0.18);
  const waterDeep = mixColors("#2b5d7e", palette.border, 0.12);
  const sand = mixColors("#d7c6a4", palette.pop, 0.32);
  const reef = mixColors("#65769a", palette.border, 0.18);
  const algaeA = mixColors("#6bbfa0", palette.soft, 0.18);
  const algaeB = mixColors("#8fce7f", palette.pop, 0.28);
  const algaeC = mixColors("#6f9ec0", palette.accent, 0.2);
  const frameBorder = enrichColor(mixColors(algaeC, waterDeep, 0.42), {
    hueShift: -8 + seeded(seed, 4450) * 18,
    saturationMult: 1.18,
    lightnessShift: -0.02,
  });
  const frameInner = mixColors(frameBorder, palette.paper, 0.24);
  const panelStroke = mixColors(frameBorder, palette.paper, 0.18);
  const fishColors = [
    enrichColor(mixColors("#ffb578", palette.pop, 0.04), { saturationMult: 1.28, lightnessShift: -0.05 }),
    enrichColor(mixColors("#f092bf", palette.accent, 0.04), { saturationMult: 1.26, lightnessShift: -0.02 }),
    enrichColor(mixColors("#8ed5d9", palette.soft, 0.08), { saturationMult: 1.18, lightnessShift: -0.08 }),
    enrichColor(mixColors("#cab6ff", palette.border, 0.08), { saturationMult: 1.18, lightnessShift: -0.04 }),
  ];
  const jellyA = mixColors("#f7c6de", palette.accent, 0.1);
  const jellyB = mixColors("#bddbff", palette.soft, 0.1);
  const bubble = mixColors("#f3fbff", palette.paper, 0.04);

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={waterTop} />
          <stop offset="56%" stopColor={waterMid} />
          <stop offset="100%" stopColor={waterDeep} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fffefd", palette.paper, 0.02)} />
          <stop offset="100%" stopColor={mixColors("#f6fcff", palette.paper, 0.12)} />
        </linearGradient>
        <linearGradient id={rayId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#ffffff", palette.paper, 0.02)} stopOpacity="0.52" />
          <stop offset="100%" stopColor={mixColors("#ffffff", palette.paper, 0.16)} stopOpacity="0" />
        </linearGradient>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      <path d={outerPath} fill={mixColors(frameBorder, palette.soft, 0.78)} opacity="0.14" transform="translate(0.7 0.9)" />
      <g clipPath={`url(#${sceneClip})`}>
        <rect x="0" y="0" width={width} height={height} fill={`url(#${outerId})`} />
        {Array.from({ length: 4 }).map((_, index) => {
          const x = width * (0.08 + index * 0.22);
          const topWidth = width * (0.06 + index * 0.012);
          const bottomWidth = width * (0.16 + index * 0.02);
          return (
            <path
              key={`undersea-ray-${index}`}
              d={`M ${x} 0 L ${x + topWidth} 0 L ${x + bottomWidth} ${height * 0.72} L ${x - bottomWidth * 0.24} ${height * 0.72} Z`}
              fill={`url(#${rayId})`}
              opacity={0.22 + index * 0.04}
            />
          );
        })}
        <path d={rollingHillPath(width, height, height * 0.92, height * 0.05, seed, 4000)} fill={sand} opacity="0.88" />
        <path d={rollingHillPath(width, height, height * 0.87, height * 0.07, seed, 4010)} fill={mixColors(reef, waterMid, 0.18)} opacity="0.3" />
        <path d={rollingHillPath(width, height, height * 0.95, height * 0.03, seed, 4020)} fill={mixColors(sand, palette.paper, 0.22)} opacity="0.26" />
        {Array.from({ length: 18 }).map((_, index) => (
          <circle
            key={`bubble-${index}`}
            cx={width * (0.08 + seeded(seed, 4030 + index) * 0.84)}
            cy={height * (0.08 + seeded(seed, 4060 + index) * 0.76)}
            r={0.14 + seeded(seed, 4090 + index) * 0.34}
            fill="none"
            stroke={bubble}
            strokeWidth="0.12"
            opacity={0.34 + (index % 3) * 0.1}
          />
        ))}
        {Array.from({ length: 52 }).map((_, index) => {
          const x = width * (0.04 + seeded(seed, 4120 + index) * 0.92);
          const y = height * (0.12 + seeded(seed, 4160 + index) * 0.64);
          const scale = 0.28 + seeded(seed, 4200 + index) * 0.98;
          const color = fishColors[index % fishColors.length];
          const depth = seeded(seed, 4280 + index);
          const body = depth < 0.34 ? mixColors(color, waterTop, 0.26) : depth < 0.58 ? mixColors(color, waterMid, 0.16) : color;
          const outline = mixColors(color, waterDeep, depth < 0.46 ? 0.3 : 0.42);
          return (
            <g key={`fish-${index}`} transform={`translate(${x} ${y}) scale(${scale}) rotate(${seeded(seed, 4240 + index) > 0.5 ? 0 : 180})`}>
              <ellipse cx="0" cy="0" rx="1.7" ry="0.9" fill={body} stroke={outline} strokeWidth="0.12" />
              <path d="M -1.7 0 L -3 1 L -3 -1 Z" fill={mixColors(body, outline, 0.26)} stroke={outline} strokeWidth="0.08" strokeLinejoin="round" />
              <path d="M 0.2 -0.18 q 0.95 -0.38 1.28 0" fill="none" stroke={mixColors("#fffaf4", body, 0.08)} strokeWidth="0.14" strokeLinecap="round" opacity="0.78" />
              <circle cx="1.05" cy="-0.14" r="0.1" fill={mixColors("#243b4d", palette.border, 0.06)} />
            </g>
          );
        })}
        {Array.from({ length: 36 }).map((_, index) => {
          const x = width * (0.04 + seeded(seed, 4700 + index) * 0.92);
          const y = height * (0.14 + seeded(seed, 4760 + index) * 0.58);
          const scale = 0.16 + seeded(seed, 4820 + index) * 0.24;
          const direction = seeded(seed, 4880 + index) > 0.5 ? 1 : -1;
          const body = mixColors(waterTop, palette.paper, 0.28 + seeded(seed, 4940 + index) * 0.14);

          return (
            <g
              key={`fish-background-${index}`}
              transform={`translate(${x} ${y}) scale(${scale * direction} ${scale})`}
            >
              <ellipse cx="0" cy="0" rx="1.7" ry="0.86" fill={body} />
              <path d="M -1.7 0 L -3 1 L -3 -1 Z" fill={mixColors(body, waterDeep, 0.22)} />
            </g>
          );
        })}
        {Array.from({ length: 2 }).map((_, index) => {
          const x = width * (0.2 + index * 0.5);
          const y = height * (0.34 + index * 0.06);
          const jelly = index % 2 === 0 ? jellyA : jellyB;
          return (
            <g key={`jelly-${index}`} transform={`translate(${x} ${y})`} opacity="0.72">
              <path d="M -1.6 0.1 q 0.4 -1.6 1.8 -1.7 q 1.5 0.06 1.88 1.7 q -0.6 0.7 -1.86 0.7 q -1.28 0 -1.82 -0.7 Z" fill={jelly} />
              {[-1, -0.4, 0.2, 0.8].map((tx, tentacleIndex) => (
                <path
                  key={`jelly-tentacle-${tentacleIndex}`}
                  d={`M ${tx} 0.72 q ${(tentacleIndex % 2 === 0 ? -0.18 : 0.18)} 0.86 ${tentacleIndex % 2 === 0 ? -0.06 : 0.06} 1.78`}
                  fill="none"
                  stroke={mixColors(jelly, palette.paper, 0.14)}
                  strokeWidth="0.12"
                  strokeLinecap="round"
                  opacity="0.78"
                />
              ))}
            </g>
          );
        })}
        {Array.from({ length: 8 }).map((_, index) => {
          const x = width * (0.06 + index * 0.12);
          const baseY = height * (0.92 + seeded(seed, 4300 + index) * 0.03);
          const tipY = baseY - height * (0.12 + seeded(seed, 4340 + index) * 0.2);
          const bend = (seeded(seed, 4380 + index) - 0.5) * width * 0.06;
          const color = index % 3 === 0 ? algaeA : index % 3 === 1 ? algaeB : algaeC;
          const midY = (baseY + tipY) / 2;
          const bodyWidth = 0.3 + (index % 2) * 0.08;
          const leftBase = x - bodyWidth;
          const rightBase = x + bodyWidth;
          const leftMid = x + bend * 0.36 - bodyWidth * 0.72;
          const rightMid = x + bend * 0.36 + bodyWidth * 0.72;
          const leftTip = x + bend - bodyWidth * 0.26;
          const rightTip = x + bend + bodyWidth * 0.26;
          return (
            <g key={`seaweed-${index}`} opacity={0.82 - (index % 3) * 0.08}>
              <path
                d={`M ${leftBase} ${baseY}
                    Q ${leftMid} ${midY} ${leftTip} ${tipY}
                    Q ${x + bend * 0.62} ${tipY - height * 0.012} ${rightTip} ${tipY + height * 0.01}
                    Q ${rightMid} ${midY + height * 0.01} ${rightBase} ${baseY}
                    Q ${x + bend * 0.1} ${baseY - height * 0.022} ${leftBase} ${baseY} Z`}
                fill={mixColors(color, palette.paper, 0.08)}
                stroke={mixColors(color, waterDeep, 0.16)}
                strokeWidth="0.08"
                strokeLinejoin="round"
              />
              <path
                d={`M ${x + bend * 0.12} ${baseY - height * 0.05}
                    q ${width * 0.014} -${height * 0.016} ${width * 0.028} 0
                    q -${width * 0.01} ${height * 0.016} -${width * 0.028} 0 Z`}
                fill={mixColors(color, palette.paper, 0.22)}
                opacity="0.78"
              />
              <path
                d={`M ${x + bend * 0.34} ${midY + height * 0.02}
                    q ${width * 0.012} -${height * 0.014} ${width * 0.024} 0
                    q -${width * 0.008} ${height * 0.015} -${width * 0.024} 0 Z`}
                fill={mixColors(color, palette.paper, 0.18)}
                opacity="0.7"
              />
              <path
                d={`M ${x + bend * 0.5} ${tipY + height * 0.045}
                    q ${width * 0.014} -${height * 0.018} ${width * 0.026} 0
                    q -${width * 0.009} ${height * 0.017} -${width * 0.026} 0 Z`}
                fill={mixColors(color, palette.paper, 0.14)}
                opacity="0.68"
              />
            </g>
          );
        })}
        <g transform={`translate(${width * 0.86} ${height * 0.86})`} opacity="0.76">
          <path d="M -0.8 0 L -0.2 -3.2 L 0.7 0 Z" fill={mixColors("#b995f0", palette.accent, 0.16)} />
          <path d="M 0.2 0.1 L 1.1 -2.6 L 1.8 0.18 Z" fill={mixColors("#8fd7d7", palette.soft, 0.14)} />
          <path d="M -1.5 0.12 L -0.92 -1.9 L -0.3 0.16 Z" fill={mixColors("#f4bc88", palette.pop, 0.14)} />
        </g>
      </g>
      <path d={outerPath} fill="none" stroke={frameBorder} strokeWidth="1.08" />
      <path d={innerPath} fill="none" stroke={frameInner} strokeWidth="0.68" opacity="0.82" />
      <rect x={panel.x + 0.35} y={panel.y + 0.45} width={panel.width} height={panel.height} rx={panel.rx} fill={mixColors(palette.border, waterDeep, 0.74)} opacity="0.1" />
      <rect x={panel.x} y={panel.y} width={panel.width} height={panel.height} rx={panel.rx} fill={`url(#${panelId})`} fillOpacity="0.8" stroke={panelStroke} strokeWidth="0.42" />
      <rect x={panel.x} y={panel.y} width={panel.width} height={panel.height} rx={panel.rx} fill="none" stroke={mixColors("#ffffff", palette.paper, 0.22)} strokeWidth="0.16" transform="translate(0 0.18)" opacity="0.72" />
      <QuestionText clipId={clipId} layout={layout} ink={mixColors("#35576f", palette.ink, 0.26)} lines={lines} />
    </g>
  );
}

function CircusNightTheme(props: {
  width: number;
  height: number;
  palette: Palette;
  layout: QuestionLayout;
  clipId: string;
  lines: string[];
  seed: number;
  cardId: string;
}) {
  const { width, height, palette, layout, clipId, lines, seed, cardId } = props;
  const outerId = `${cardId}-circus-outer`;
  const panelId = `${cardId}-circus-panel`;
  const curtainId = `${cardId}-circus-curtain`;
  const tentId = `${cardId}-circus-tent`;
  const lightId = `${cardId}-circus-light`;
  const sceneClip = `${cardId}-circus-scene`;
  const outerPath = ticketPath(1.2, 1.2, width - 2.4, height - 2.4, 5.8, 2.2);
  const innerPath = ticketPath(4.2, 4.2, width - 8.4, height - 8.4, 4.6, 1.75);
  const panel = {
    x: layout.x - 0.44,
    y: layout.y - 0.4,
    width: layout.width + 0.88,
    height: layout.height + 0.8,
    rx: Math.max(2.8, layout.rx - 0.42),
  };
  const hueDrift = (seeded(seed, 5200) - 0.5) * 52;
  const skyTop = enrichColor(mixColors(palette.border, palette.accent, 0.2), {
    hueShift: hueDrift - 18,
    saturationMult: 1.34,
    lightnessShift: -0.16,
  });
  const skyMid = enrichColor(mixColors(palette.accent, palette.soft, 0.22), {
    hueShift: hueDrift + 4,
    saturationMult: 1.42,
    lightnessShift: -0.08,
  });
  const skyLow = enrichColor(mixColors(palette.pop, palette.accent, 0.24), {
    hueShift: hueDrift + 18,
    saturationMult: 1.28,
    lightnessShift: -0.04,
  });
  const curtain = enrichColor(mixColors(palette.accent, palette.border, 0.2), {
    hueShift: hueDrift - 6,
    saturationMult: 1.54,
    lightnessShift: -0.1,
  });
  const curtainShade = enrichColor(mixColors(curtain, palette.border, 0.44), {
    saturationMult: 1.16,
    lightnessShift: -0.14,
  });
  const gold = enrichColor(mixColors(palette.pop, "#ffd564", 0.22), {
    saturationMult: 1.34,
    lightnessShift: -0.02,
  });
  const tentPink = enrichColor(mixColors(palette.accent, palette.paper, 0.14), {
    hueShift: 6 + seeded(seed, 5204) * 20,
    saturationMult: 1.42,
    lightnessShift: -0.02,
  });
  const tentCream = enrichColor(mixColors(palette.soft, palette.paper, 0.08), {
    hueShift: -10 + seeded(seed, 5206) * 16,
    saturationMult: 1.18,
    lightnessShift: 0.05,
  });
  const stage = enrichColor(mixColors(palette.border, palette.accent, 0.34), {
    hueShift: hueDrift - 10,
    saturationMult: 1.18,
    lightnessShift: -0.18,
  });
  const stageDark = enrichColor(mixColors(stage, curtainShade, 0.38), {
    saturationMult: 1.08,
    lightnessShift: -0.1,
  });
  const lineSoft = mixColors(palette.paper, curtain, 0.22);
  const flagPalette = [
    tentPink,
    gold,
    enrichColor(mixColors(palette.soft, palette.paper, 0.12), {
      hueShift: -24 + seeded(seed, 5210) * 40,
      saturationMult: 1.24,
      lightnessShift: -0.02,
    }),
    enrichColor(mixColors(palette.border, palette.pop, 0.14), {
      hueShift: 12 + seeded(seed, 5212) * 34,
      saturationMult: 1.3,
      lightnessShift: -0.04,
    }),
    enrichColor(mixColors(palette.accent, palette.pop, 0.34), {
      hueShift: -8 + seeded(seed, 5214) * 28,
      saturationMult: 1.26,
      lightnessShift: -0.02,
    }),
  ];
  const tentStripePalette = [
    enrichColor(mixColors(tentPink, palette.border, 0.1), {
      saturationMult: 1.2,
      lightnessShift: -0.02,
    }),
    enrichColor(mixColors(gold, palette.paper, 0.2), {
      saturationMult: 1.16,
      lightnessShift: 0.02,
    }),
    enrichColor(mixColors(palette.soft, palette.paper, 0.08), {
      hueShift: -18 + seeded(seed, 5216) * 32,
      saturationMult: 1.2,
      lightnessShift: 0.02,
    }),
  ];
  const bulbPalette = [
    gold,
    tentPink,
    enrichColor(mixColors(palette.soft, palette.paper, 0.08), {
      hueShift: -22 + seeded(seed, 5218) * 34,
      saturationMult: 1.26,
      lightnessShift: 0.02,
    }),
    enrichColor(mixColors(palette.border, palette.pop, 0.12), {
      hueShift: 10 + seeded(seed, 5220) * 30,
      saturationMult: 1.24,
      lightnessShift: 0.02,
    }),
    enrichColor(mixColors(palette.accent, palette.pop, 0.44), {
      hueShift: -6 + seeded(seed, 5222) * 24,
      saturationMult: 1.22,
      lightnessShift: -0.01,
    }),
  ];

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={skyTop} />
          <stop offset="56%" stopColor={skyMid} />
          <stop offset="100%" stopColor={skyLow} />
        </linearGradient>
        <linearGradient id={curtainId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={curtainShade} />
          <stop offset="48%" stopColor={curtain} />
          <stop offset="100%" stopColor={mixColors(curtain, "#d88ba7", 0.22)} />
        </linearGradient>
        <linearGradient id={tentId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={tentCream} />
          <stop offset="100%" stopColor={tentPink} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fffefc", palette.paper, 0.04)} />
          <stop offset="100%" stopColor={mixColors("#fff7fb", palette.paper, 0.12)} />
        </linearGradient>
        <radialGradient id={lightId} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={mixColors("#fff7d5", gold, 0.06)} />
          <stop offset="100%" stopColor={mixColors(gold, palette.paper, 0.34)} />
        </radialGradient>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      <path d={outerPath} fill={mixColors(palette.border, palette.soft, 0.7)} opacity="0.14" transform="translate(0.7 0.9)" />
      <g clipPath={`url(#${sceneClip})`}>
        <rect x="0" y="0" width={width} height={height} fill={`url(#${outerId})`} />
        <path d={`M 0 0 H ${width * 0.18} Q ${width * 0.14} ${height * 0.16} ${width * 0.18} ${height * 0.34} Q ${width * 0.13} ${height * 0.52} ${width * 0.18} ${height * 0.72} L 0 ${height} Z`} fill={`url(#${curtainId})`} opacity="0.88" />
        <path d={`M ${width} 0 H ${width * 0.82} Q ${width * 0.86} ${height * 0.16} ${width * 0.82} ${height * 0.34} Q ${width * 0.87} ${height * 0.52} ${width * 0.82} ${height * 0.72} L ${width} ${height} Z`} fill={`url(#${curtainId})`} opacity="0.88" />
        <path d={`M 0 ${height * 0.84} C ${width * 0.2} ${height * 0.76}, ${width * 0.4} ${height * 0.9}, ${width * 0.56} ${height * 0.82} S ${width * 0.86} ${height * 0.9}, ${width} ${height * 0.8} L ${width} ${height} H 0 Z`} fill={stage} opacity="0.62" />
        <path d={`M 0 ${height * 0.9} C ${width * 0.18} ${height * 0.85}, ${width * 0.38} ${height * 0.94}, ${width * 0.58} ${height * 0.88} S ${width * 0.86} ${height * 0.95}, ${width} ${height * 0.9} L ${width} ${height} H 0 Z`} fill={stageDark} opacity="0.42" />
        {Array.from({ length: 4 }).map((_, index) => (
          <path
            key={`circus-curtain-fold-left-${index}`}
            d={`M ${width * (0.04 + index * 0.03)} ${height * 0.02} Q ${width * (0.015 + index * 0.03)} ${height * 0.24} ${width * (0.04 + index * 0.03)} ${height * 0.5}`}
            fill="none"
            stroke={mixColors(curtainShade, palette.paper, 0.16)}
            strokeWidth="0.26"
            opacity="0.34"
          />
        ))}
        {Array.from({ length: 4 }).map((_, index) => (
          <path
            key={`circus-curtain-fold-right-${index}`}
            d={`M ${width * (0.96 - index * 0.03)} ${height * 0.02} Q ${width * (0.985 - index * 0.03)} ${height * 0.24} ${width * (0.96 - index * 0.03)} ${height * 0.5}`}
            fill="none"
            stroke={mixColors(curtainShade, palette.paper, 0.16)}
            strokeWidth="0.26"
            opacity="0.34"
          />
        ))}
        <g opacity="0.92">
          {Array.from({ length: 10 }).map((_, index) => {
            const x = 7 + index * ((width - 14) / 9);
            const y = height * 0.13 + Math.sin(index * 0.55) * 0.24;
            return (
              <g key={`circus-flag-${index}`}>
                <path d={`M ${x} ${y - 1.2} L ${x} ${y + 0.12}`} fill="none" stroke={mixColors(gold, palette.paper, 0.12)} strokeWidth="0.18" opacity="0.84" />
                <path
                  d={`M ${x - 1.2} ${y + 0.1} L ${x} ${y + 2.2} L ${x + 1.2} ${y + 0.1} Z`}
                  fill={flagPalette[index % flagPalette.length] ?? tentPink}
                  opacity="0.94"
                />
              </g>
            );
          })}
        </g>
        {[
          { x: width * 0.18, y: height * 0.9, scale: 0.62 },
          { x: width * 0.38, y: height * 0.885, scale: 0.8 },
          { x: width * 0.61, y: height * 0.895, scale: 0.7 },
          { x: width * 0.81, y: height * 0.905, scale: 0.56 },
        ].map((tent, tentIndex) => {
          const tentWidth = width * 0.11 * tent.scale;
          const tentHeight = height * 0.15 * tent.scale;
          return (
            <g key={`circus-mini-tent-${tentIndex}`} transform={`translate(${tent.x} ${tent.y})`}>
              <path d={`M -${tentWidth} 0 L 0 -${tentHeight} L ${tentWidth} 0 Z`} fill={`url(#${tentId})`} opacity="0.96" />
              {[-1, 0, 1].map((offset, index) => (
                <path
                  key={`circus-mini-tent-stripe-${tentIndex}-${index}`}
                  d={`M ${offset * tentWidth * 0.42} 0 L ${offset * tentWidth * 0.18} -${tentHeight} L ${(offset * tentWidth * 0.18) + tentWidth * 0.22} -${tentHeight} L ${(offset * tentWidth * 0.42) + tentWidth * 0.34} 0 Z`}
                  fill={tentStripePalette[(tentIndex + index) % tentStripePalette.length] ?? tentPink}
                  opacity="0.94"
                />
              ))}
              <path d={`M 0 -${tentHeight} L 0 -${tentHeight * 1.18}`} stroke={mixColors(gold, palette.paper, 0.08)} strokeWidth="0.22" strokeLinecap="round" />
              <path d={`M -${tentWidth * 0.12} -${tentHeight * 1.18} L 0 -${tentHeight * 1.28} L ${tentWidth * 0.12} -${tentHeight * 1.18} Z`} fill={gold} />
              <rect x={-tentWidth * 0.16} y={-tentHeight * 0.24} width={tentWidth * 0.32} height={tentHeight * 0.24} rx="0.28" fill={mixColors("#fff7ea", palette.paper, 0.08)} opacity="0.62" />
            </g>
          );
        })}
        {Array.from({ length: 16 }).map((_, index) => {
          const bulbX = 8 + index * ((width - 16) / 15);
          const bulbY = height * 0.235 + Math.sin(index * 0.62) * 0.95;
          const bulbFill = bulbPalette[index % bulbPalette.length] ?? gold;
          return (
            <g key={`circus-bulb-${index}`}>
              <rect x={bulbX - 0.18} y={bulbY - 1.05} width="0.36" height="0.34" rx="0.08" fill={lineSoft} opacity="0.9" />
              <circle cx={bulbX} cy={bulbY} r={0.78 + (index % 4) * 0.06} fill={bulbFill} opacity="0.96" />
              <circle cx={bulbX} cy={bulbY} r={1.18 + (index % 3) * 0.08} fill={`url(#${lightId})`} opacity="0.06" />
            </g>
          );
        })}
        <path d={sparklePath(width * 0.16, height * 0.26, 1.5, 0.56)} fill={gold} opacity="0.7" />
        <path d={sparklePath(width * 0.84, height * 0.28, 1.25, 0.48)} fill={mixColors(palette.soft, palette.paper, 0.08)} opacity="0.66" />
        <path d={sparklePath(width * 0.72, height * 0.14, 1.05, 0.4)} fill={gold} opacity="0.6" />
        <g transform={`translate(${width * 0.15} ${height * 0.72})`} opacity="0.74">
          <path d={`M -${width * 0.06} -0.08 H 0.2`} stroke={mixColors(curtainShade, palette.paper, 0.18)} strokeWidth="0.36" strokeLinecap="round" />
          <circle cx="0.9" cy="0" r="1.12" fill={mixColors(gold, palette.paper, 0.18)} />
          <circle cx="0.9" cy="0" r="0.44" fill={mixColors(tentPink, palette.border, 0.1)} />
        </g>
        <g transform={`translate(${width * 0.85} ${height * 0.7})`} opacity="0.72">
          <path d={`M -0.2 -0.08 H ${width * 0.06}`} stroke={mixColors(curtainShade, palette.paper, 0.18)} strokeWidth="0.36" strokeLinecap="round" />
          <circle cx="-0.9" cy="0" r="1.12" fill={mixColors(gold, palette.paper, 0.18)} />
          <circle cx="-0.9" cy="0" r="0.44" fill={mixColors(tentPink, palette.border, 0.1)} />
        </g>
      </g>
      <path d={outerPath} fill="none" stroke={palette.border} strokeWidth="1.08" />
      <path d={innerPath} fill="none" stroke={mixColors(gold, palette.paper, 0.16)} strokeWidth="0.68" strokeDasharray="1.1 2.1" opacity="0.72" />
      <rect x={panel.x + 0.38} y={panel.y + 0.46} width={panel.width} height={panel.height} rx={panel.rx} fill={mixColors("#261727", palette.border, 0.3)} opacity="0.12" />
      <rect x={panel.x} y={panel.y} width={panel.width} height={panel.height} rx={panel.rx} fill={`url(#${panelId})`} fillOpacity="0.8" stroke={mixColors(gold, palette.paper, 0.18)} strokeWidth="0.42" />
      <rect x={panel.x} y={panel.y} width={panel.width} height={panel.height} rx={panel.rx} fill="none" stroke={mixColors("#ffffff", palette.paper, 0.24)} strokeWidth="0.16" transform="translate(0 0.18)" opacity="0.72" />
      <QuestionText clipId={clipId} layout={layout} ink={mixColors("#51333e", palette.ink, 0.2)} lines={lines} />
    </g>
  );
}

function CloudMailTheme(props: {
  width: number;
  height: number;
  palette: Palette;
  layout: QuestionLayout;
  clipId: string;
  lines: string[];
  seed: number;
  cardId: string;
}) {
  const { width, height, palette, layout, clipId, lines, seed, cardId } = props;
  const outerId = `${cardId}-cloud-outer`;
  const panelId = `${cardId}-cloud-panel`;
  const stripeId = `${cardId}-cloud-stripe`;
  const sceneClip = `${cardId}-cloud-scene`;
  const outerPath = plaquePath(1.2, 1.2, width - 2.4, height - 2.4);
  const innerPath = plaquePath(4.2, 4.2, width - 8.4, height - 8.4);
  const panel = {
    x: layout.x - 0.42,
    y: layout.y - 0.42,
    width: layout.width + 0.84,
    height: layout.height + 0.84,
    rx: Math.max(2.8, layout.rx - 0.38),
  };
  const skyTop = mixColors("#cceeff", palette.soft, 0.08);
  const skyMid = mixColors("#f2e7ff", palette.paper, 0.18);
  const skyLow = mixColors("#ffe7d5", palette.pop, 0.16);
  const cloudA = mixColors("#fffefa", palette.paper, 0.02);
  const cloudB = mixColors("#f6f2ff", palette.soft, 0.14);
  const airmailBlue = mixColors("#9ec3f4", palette.accent, 0.16);
  const airmailRed = mixColors("#f2aba9", palette.pop, 0.16);
  const route = mixColors("#b799c5", palette.border, 0.18);
  const envelopePaper = mixColors("#fffef7", palette.paper, 0.02);
  const envelopeLine = mixColors("#b68fa7", palette.border, 0.14);
  const heartPink = mixColors("#f2a6c6", palette.accent, 0.1);
  const starGold = mixColors("#ffd07d", palette.pop, 0.06);

  const drawEnvelope = (x: number, y: number, scale: number, angle: number, accent: string, opacity: number) => (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`} opacity={opacity}>
      <rect x="-2.4" y="-1.5" width="4.8" height="3" rx="0.36" fill={envelopePaper} />
      <path d="M -2.2 -1.2 L 0 0.2 L 2.2 -1.2" fill="none" stroke={envelopeLine} strokeWidth="0.22" strokeLinecap="round" />
      <path d="M -2.15 1.1 L -0.2 -0.05" fill="none" stroke={mixColors(accent, envelopeLine, 0.2)} strokeWidth="0.18" strokeLinecap="round" />
      <path d="M 2.15 1.1 L 0.2 -0.05" fill="none" stroke={mixColors(accent, envelopeLine, 0.2)} strokeWidth="0.18" strokeLinecap="round" />
      <circle cx="1.2" cy="-0.48" r="0.28" fill={accent} opacity="0.8" />
    </g>
  );

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={skyTop} />
          <stop offset="62%" stopColor={skyMid} />
          <stop offset="100%" stopColor={skyLow} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fffefe", palette.paper, 0.03)} />
          <stop offset="100%" stopColor={mixColors("#fff8fd", palette.paper, 0.14)} />
        </linearGradient>
        <linearGradient id={stripeId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={airmailBlue} />
          <stop offset="50%" stopColor={mixColors("#ffffff", palette.paper, 0.02)} />
          <stop offset="100%" stopColor={airmailRed} />
        </linearGradient>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      <path d={outerPath} fill={mixColors(palette.border, palette.soft, 0.7)} opacity="0.14" transform="translate(0.7 0.9)" />
      <g clipPath={`url(#${sceneClip})`}>
        <rect x="0" y="0" width={width} height={height} fill={`url(#${outerId})`} />
        <g opacity="0.92">
          {Array.from({ length: 15 }).map((_, index) => {
            const stripeWidth = (width - 12) / 15;
            return (
              <rect
                key={`cloud-mail-top-${index}`}
                x={6 + index * stripeWidth}
                y="1.5"
                width={stripeWidth * 0.68}
                height="1.7"
                rx="0.3"
                fill={index % 2 === 0 ? airmailRed : airmailBlue}
                opacity="0.82"
              />
            );
          })}
        </g>
        <g opacity="0.56">
          <path d={cloudPath(width * 0.12, height * 0.22, width * 0.28, height * 0.18)} fill={cloudA} transform="scale(0.26)" />
          <path d={cloudPath(width * 0.58, height * 0.16, width * 0.34, height * 0.2)} fill={cloudB} transform="scale(0.24)" />
          <path d={cloudPath(width * 0.8, height * 0.3, width * 0.32, height * 0.18)} fill={cloudA} transform="scale(0.22)" />
          <path d={cloudPath(width * 0.22, height * 0.62, width * 0.4, height * 0.22)} fill={cloudB} transform="scale(0.25)" />
          <path d={cloudPath(width * 0.7, height * 0.72, width * 0.44, height * 0.24)} fill={cloudA} transform="scale(0.24)" />
        </g>
        {drawEnvelope(width * 0.18, height * 0.28, 0.82, -14, airmailRed, 0.82)}
        {drawEnvelope(width * 0.78, height * 0.22, 0.66, 11, airmailBlue, 0.68)}
        {drawEnvelope(width * 0.82, height * 0.68, 0.74, -8, mixColors(airmailBlue, airmailRed, 0.4), 0.72)}
        {drawEnvelope(width * 0.16, height * 0.72, 0.62, 12, airmailRed, 0.62)}
        {drawEnvelope(width * 0.35, height * 0.18, 0.5, -7, heartPink, 0.58)}
        {drawEnvelope(width * 0.65, height * 0.77, 0.54, 9, airmailBlue, 0.56)}
        {drawEnvelope(width * 0.9, height * 0.44, 0.46, -11, starGold, 0.52)}
        <path
          d={`M ${width * 0.12} ${height * 0.56} C ${width * 0.22} ${height * 0.44}, ${width * 0.28} ${height * 0.72}, ${width * 0.42} ${height * 0.5} S ${width * 0.7} ${height * 0.64}, ${width * 0.84} ${height * 0.48}`}
          fill="none"
          stroke={route}
          strokeWidth="0.54"
          strokeDasharray="1 1.5"
          strokeLinecap="round"
          opacity="0.72"
        />
        <path
          d={`M ${width * 0.7} ${height * 0.38} q ${width * 0.08} -${height * 0.03} ${width * 0.14} ${height * 0.02} q -${width * 0.05} ${height * 0.04} -${width * 0.12} ${height * 0.02} Z`}
          fill={mixColors("#fffdf6", palette.paper, 0.03)}
          opacity="0.84"
        />
        <path
          d={`M ${width * 0.74} ${height * 0.392} L ${width * 0.71} ${height * 0.365} L ${width * 0.712} ${height * 0.404}`}
          fill={mixColors("#fffdf6", palette.paper, 0.03)}
          opacity="0.84"
        />
        {Array.from({ length: 5 }).map((_, index) => {
          const x = width * (0.16 + index * 0.16);
          const y = height * (0.53 + Math.sin(index * 0.7) * 0.03);
          return <circle key={`cloud-mail-route-dot-${index}`} cx={x} cy={y} r="0.26" fill={mixColors(route, palette.paper, 0.16)} opacity="0.46" />;
        })}
        {Array.from({ length: 14 }).map((_, index) => {
          const x = 8 + seeded(seed, 6100 + index) * (width - 16);
          const y = 7 + seeded(seed, 6140 + index) * (height * 0.36);
          const outer = 0.3 + seeded(seed, 6180 + index) * 0.6;
          return index % 3 === 0 ? (
            <path key={`cloud-mail-spark-${index}`} d={sparklePath(x, y, outer, outer * 0.34)} fill={index % 2 === 0 ? airmailBlue : airmailRed} opacity="0.74" />
          ) : (
            <circle key={`cloud-mail-spark-${index}`} cx={x} cy={y} r={outer * 0.44} fill={mixColors("#ffffff", palette.paper, 0.04)} opacity="0.66" />
          );
        })}
        {Array.from({ length: 6 }).map((_, index) => {
          const x = width * (0.12 + seeded(seed, 6250 + index) * 0.76);
          const y = height * (0.14 + seeded(seed, 6280 + index) * 0.58);
          const size = 0.7 + seeded(seed, 6310 + index) * 0.5;
          return (
            <path
              key={`cloud-mail-star-${index}`}
              d={sparklePath(x, y, size, size * 0.34)}
              fill={index % 2 === 0 ? starGold : mixColors(airmailBlue, palette.paper, 0.12)}
              opacity={0.62 + (index % 3) * 0.08}
            />
          );
        })}
        {Array.from({ length: 4 }).map((_, index) => {
          const x = width * (0.22 + seeded(seed, 6340 + index) * 0.56);
          const y = height * (0.24 + seeded(seed, 6370 + index) * 0.42);
          const size = 0.9 + seeded(seed, 6400 + index) * 0.42;
          return (
            <path
              key={`cloud-mail-heart-${index}`}
              d={heartPath(x, y, size)}
              fill={index % 2 === 0 ? heartPink : mixColors(airmailRed, palette.paper, 0.08)}
              opacity={0.42 + (index % 2) * 0.12}
            />
          );
        })}
        <g transform={`translate(${width * 0.86} ${height * 0.17}) rotate(9)`} opacity="0.68">
          <rect x="-3.1" y="-2.2" width="6.2" height="4.4" rx="0.6" fill={envelopePaper} />
          <rect x="-2.3" y="-1.4" width="4.6" height="2.8" rx="0.42" fill="none" stroke={airmailBlue} strokeWidth="0.24" strokeDasharray="0.5 0.7" />
          <circle cx="1.4" cy="-0.8" r="0.42" fill={airmailRed} opacity="0.82" />
        </g>
        <g transform={`translate(${width * 0.08} ${height * 0.14}) rotate(-10)`} opacity="0.44">
          <rect x="-2.5" y="-1.7" width="5" height="3.4" rx="0.46" fill={envelopePaper} />
          <path d="M -2.15 -1.1 L 0 0.15 L 2.15 -1.1" fill="none" stroke={airmailRed} strokeWidth="0.2" />
          <path d="M -1.6 0.9 H 1.35" stroke={airmailBlue} strokeWidth="0.18" strokeDasharray="0.45 0.5" />
        </g>
      </g>
      <path d={outerPath} fill="none" stroke={palette.border} strokeWidth="1.08" />
      <path d={innerPath} fill="none" stroke={mixColors(palette.border, palette.paper, 0.16)} strokeWidth="0.68" opacity="0.74" />
      <rect x={panel.x + 0.35} y={panel.y + 0.45} width={panel.width} height={panel.height} rx={panel.rx} fill={mixColors(palette.border, airmailBlue, 0.78)} opacity="0.1" />
      <rect x={panel.x} y={panel.y} width={panel.width} height={panel.height} rx={panel.rx} fill={`url(#${panelId})`} fillOpacity="0.8" stroke={mixColors(palette.border, palette.paper, 0.18)} strokeWidth="0.42" />
      <rect x={panel.x} y={panel.y} width={panel.width} height={panel.height} rx={panel.rx} fill="none" stroke={mixColors("#ffffff", palette.paper, 0.22)} strokeWidth="0.16" transform="translate(0 0.18)" opacity="0.74" />
      <QuestionText clipId={clipId} layout={layout} ink={mixColors("#5f566f", palette.ink, 0.18)} lines={lines} />
    </g>
  );
}

function SunnyKitchenTheme(props: {
  width: number;
  height: number;
  palette: Palette;
  layout: QuestionLayout;
  clipId: string;
  lines: string[];
  seed: number;
  cardId: string;
}) {
  const { width, height, palette, layout, clipId, lines, seed, cardId } = props;
  const outerId = `${cardId}-kitchen-outer`;
  const panelId = `${cardId}-kitchen-panel`;
  const tileId = `${cardId}-kitchen-tile`;
  const steamId = `${cardId}-kitchen-steam`;
  const sceneClip = `${cardId}-kitchen-scene`;
  const outerPath = plaquePath(1.2, 1.2, width - 2.4, height - 2.4);
  const innerPath = plaquePath(4.2, 4.2, width - 8.4, height - 8.4);
  const panel = {
    x: layout.x - 0.42,
    y: layout.y - 0.42,
    width: layout.width + 0.84,
    height: layout.height + 0.84,
    rx: Math.max(2.8, layout.rx - 0.38),
  };
  const wallTop = mixColors("#fff7ed", palette.paper, 0.08);
  const wallLow = mixColors("#ffe7d6", palette.pop, 0.18);
  const tileA = mixColors("#f4f0ff", palette.soft, 0.14);
  const tileB = mixColors("#fff9f4", palette.paper, 0.04);
  const grout = mixColors("#d8c4ba", palette.border, 0.18);
  const table = mixColors("#ddb692", palette.pop, 0.28);
  const tableShadow = mixColors("#b98971", palette.border, 0.24);
  const kettleBody = mixColors("#f4bda8", palette.pop, 0.14);
  const kettleLid = mixColors("#ef9fb2", palette.accent, 0.16);
  const cupBody = mixColors("#fffdf6", palette.paper, 0.02);
  const cupShade = mixColors("#efcf8d", palette.pop, 0.18);
  const saucer = mixColors("#f2d8cf", palette.soft, 0.18);
  const handle = mixColors("#c88f8f", palette.border, 0.18);
  const spoon = mixColors("#d7bfd5", palette.accent, 0.22);
  const lemon = mixColors("#ffd677", palette.pop, 0.08);
  const leaf = mixColors("#acd6b0", palette.soft, 0.14);
  const panelInk = mixColors("#685660", palette.ink, 0.16);

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={wallTop} />
          <stop offset="62%" stopColor={mixColors(wallTop, wallLow, 0.28)} />
          <stop offset="100%" stopColor={wallLow} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fffefe", palette.paper, 0.02)} />
          <stop offset="100%" stopColor={mixColors("#fff8f1", palette.paper, 0.12)} />
        </linearGradient>
        <linearGradient id={tileId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={tileA} />
          <stop offset="100%" stopColor={tileB} />
        </linearGradient>
        <linearGradient id={steamId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#ffffff", palette.paper, 0.02)} stopOpacity="0.92" />
          <stop offset="100%" stopColor={mixColors("#ffffff", palette.paper, 0.18)} stopOpacity="0" />
        </linearGradient>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      <path d={outerPath} fill={mixColors(palette.border, palette.soft, 0.72)} opacity="0.14" transform="translate(0.7 0.9)" />
      <g clipPath={`url(#${sceneClip})`}>
        <rect x="0" y="0" width={width} height={height} fill={`url(#${outerId})`} />
        {Array.from({ length: 6 }).map((_, row) =>
          Array.from({ length: 10 }).map((__, column) => {
            const tileWidth = width / 9.2;
            const tileHeight = height * 0.14;
            const x = -2 + column * tileWidth;
            const y = 2 + row * tileHeight;
            return (
              <rect
                key={`kitchen-tile-${row}-${column}`}
                x={x}
                y={y}
                width={tileWidth + 0.5}
                height={tileHeight + 0.4}
                rx="0.6"
                fill={`url(#${tileId})`}
                stroke={grout}
                strokeWidth="0.12"
                opacity={0.48 + ((row + column) % 2) * 0.08}
              />
            );
          }),
        )}
        <circle cx={width * 0.78} cy={height * 0.18} r={height * 0.12} fill={mixColors("#fff2b7", lemon, 0.16)} opacity="0.86" />
        <circle cx={width * 0.78} cy={height * 0.18} r={height * 0.18} fill={mixColors("#fff6d7", palette.paper, 0.12)} opacity="0.2" />
        <path
          d={rollingHillPath(width, height, height * 0.82, height * 0.03, seed, 8200)}
          fill={table}
          opacity="0.96"
        />
        <path
          d={rollingHillPath(width, height, height * 0.88, height * 0.025, seed, 8230)}
          fill={tableShadow}
          opacity="0.42"
        />

        <g transform={`translate(${width * 0.22} ${height * 0.74})`} opacity="0.96">
          <ellipse cx="0" cy="2.4" rx="7.1" ry="1.52" fill={mixColors(saucer, tableShadow, 0.2)} opacity="0.42" />
          <ellipse cx="0" cy="1.35" rx="5.9" ry="1.55" fill={saucer} />
          <path
            d="M -3.8 1.05 L -3.4 -4.95 q 0.2 -1.1 1.18 -1.1 H 2.3 q 1 0 1.14 1.12 L 3.82 1.05 q -0.26 0.78 -1.12 0.78 H -2.72 q -0.86 0 -1.08 -0.78 Z"
            fill={cupBody}
            stroke={mixColors(handle, palette.paper, 0.16)}
            strokeWidth="0.24"
          />
          <path d="M -2.55 -3.5 H 2.15" stroke={cupShade} strokeWidth="0.18" opacity="0.58" />
          <path d="M -2.1 -2.4 H 1.8" stroke={mixColors(cupShade, palette.paper, 0.12)} strokeWidth="0.12" opacity="0.5" />
          <path d="M 3.35 -3.95 q 2.45 0.22 2.4 2.55 q -0.04 2.18 -2.42 2.28" fill="none" stroke={handle} strokeWidth="0.36" strokeLinecap="round" />
          <path d="M -1.3 1.85 q 0.95 0.58 2.62 0" fill="none" stroke={mixColors("#ffffff", palette.paper, 0.08)} strokeWidth="0.16" opacity="0.7" />
          {[0, 1, 2].map((steam, index) => (
            <path
              key={`kitchen-steam-${index}`}
              d={`M ${-1.65 + index * 1.55} -6.1 q ${0.62 + index * 0.12} -1.7 ${0.18 + index * 0.12} -3.62 q -0.5 -1.1 0.34 -2.38`}
              fill="none"
              stroke={`url(#${steamId})`}
              strokeWidth="0.38"
              strokeLinecap="round"
              opacity="0.8"
            />
          ))}
        </g>

        <g transform={`translate(${width * 0.78} ${height * 0.74})`} opacity="0.95">
          <ellipse cx="0.2" cy="2.55" rx="7.9" ry="1.48" fill={mixColors(tableShadow, palette.border, 0.18)} opacity="0.34" />
          <path
            d="M -3.1 -8.2 H 2.5 L 4 -5.6 H 3.15 L 4.2 -0.15 q 0.18 1.1 -0.82 1.26 H -4.08 q -1.04 -0.14 -0.84 -1.28 L -3.95 -5.6 H -4.75 Z"
            fill={kettleBody}
            stroke={mixColors(handle, palette.paper, 0.16)}
            strokeWidth="0.26"
            strokeLinejoin="round"
          />
          <path d="M -3.72 -5.6 H 3.05" fill="none" stroke={mixColors(handle, palette.paper, 0.18)} strokeWidth="0.22" opacity="0.58" />
          <path d="M -2.4 -8.2 L -2.4 -9.45 H 1.8 L 1.8 -8.2" fill={kettleLid} />
          <ellipse cx="-0.3" cy="-9.92" rx="0.82" ry="0.42" fill={mixColors(kettleLid, palette.border, 0.18)} />
          <path
            d="M 4.02 -5.25 q 3.65 0.2 3.72 3.28 q 0.08 2.58 -2.38 3.16"
            fill="none"
            stroke={mixColors(handle, palette.paper, 0.12)}
            strokeWidth="0.46"
            strokeLinecap="round"
          />
          <path
            d="M -4.25 -4.68 q -2.88 0 -4.82 -1.34 q 2.25 -1.8 4.58 -1.18"
            fill="none"
            stroke={mixColors(handle, palette.paper, 0.14)}
            strokeWidth="0.5"
            strokeLinecap="round"
          />
          <path d="M -1.6 -6.82 H 0.9" stroke={mixColors("#ffffff", palette.paper, 0.08)} strokeWidth="0.16" opacity="0.56" />
        </g>

        <g transform={`translate(${width * 0.54} ${height * 0.86}) rotate(-10)`} opacity="0.84">
          <ellipse cx="0" cy="0.2" rx="4.6" ry="0.78" fill={mixColors(spoon, palette.border, 0.14)} />
          <ellipse cx="4.2" cy="0.2" rx="1.36" ry="0.92" fill={mixColors(spoon, palette.paper, 0.08)} />
        </g>

        <g transform={`translate(${width * 0.15} ${height * 0.88}) rotate(-14)`} opacity="0.86">
          <circle cx="0" cy="0" r="1.76" fill={lemon} />
          <path d="M -1.1 0 q 1.1 -1.1 2.2 0 q -1.1 1.1 -2.2 0 Z" fill={mixColors("#fff6d8", palette.paper, 0.06)} opacity="0.86" />
        </g>

        <g transform={`translate(${width * 0.89} ${height * 0.84}) rotate(18)`} opacity="0.82">
          <path d="M -1.2 0 q 0.9 -1.2 2.4 -0.6 q -0.7 1.5 -2.4 0.6 Z" fill={leaf} />
          <path d="M 1.1 0.28 q 0.8 -1 2 -0.42 q -0.6 1.25 -2 0.42 Z" fill={mixColors(leaf, palette.paper, 0.1)} />
        </g>

        {Array.from({ length: 12 }).map((_, index) => (
          <circle
            key={`kitchen-crumb-${index}`}
            cx={width * (0.08 + seeded(seed, 8260 + index) * 0.84)}
            cy={height * (0.66 + seeded(seed, 8300 + index) * 0.22)}
            r={0.1 + seeded(seed, 8340 + index) * 0.2}
            fill={index % 2 === 0 ? mixColors(tableShadow, palette.paper, 0.14) : mixColors(lemon, palette.paper, 0.1)}
            opacity={0.4 + (index % 3) * 0.1}
          />
        ))}

        <path d={sparklePath(width * 0.36, height * 0.14, 1.16, 0.42)} fill={mixColors(lemon, palette.paper, 0.08)} opacity="0.72" />
        <path d={sparklePath(width * 0.62, height * 0.2, 0.98, 0.34)} fill={mixColors(kettleLid, palette.paper, 0.16)} opacity="0.62" />
      </g>
      <path d={outerPath} fill="none" stroke={mixColors(palette.border, tableShadow, 0.18)} strokeWidth="1.08" />
      <path d={innerPath} fill="none" stroke={mixColors(palette.border, palette.paper, 0.18)} strokeWidth="0.68" opacity="0.76" />
      <rect x={panel.x + 0.35} y={panel.y + 0.45} width={panel.width} height={panel.height} rx={panel.rx} fill={mixColors(tableShadow, palette.border, 0.2)} opacity="0.1" />
      <rect x={panel.x} y={panel.y} width={panel.width} height={panel.height} rx={panel.rx} fill={`url(#${panelId})`} fillOpacity="0.8" stroke={mixColors(palette.border, palette.paper, 0.18)} strokeWidth="0.42" />
      <rect x={panel.x} y={panel.y} width={panel.width} height={panel.height} rx={panel.rx} fill="none" stroke={mixColors("#ffffff", palette.paper, 0.22)} strokeWidth="0.16" transform="translate(0 0.18)" opacity="0.72" />
      <QuestionText clipId={clipId} layout={layout} ink={panelInk} lines={lines} />
    </g>
  );
}

function DeskTreasuresTheme(props: {
  width: number;
  height: number;
  palette: Palette;
  layout: QuestionLayout;
  clipId: string;
  lines: string[];
  seed: number;
  cardId: string;
}) {
  const { width, height, palette, layout, clipId, lines, seed, cardId } = props;
  const outerId = `${cardId}-desk-outer`;
  const panelId = `${cardId}-desk-panel`;
  const noteId = `${cardId}-desk-note`;
  const tapeId = `${cardId}-desk-tape`;
  const sceneClip = `${cardId}-desk-scene`;
  const outerPath = plaquePath(1.2, 1.2, width - 2.4, height - 2.4);
  const innerPath = plaquePath(4.1, 4.2, width - 8.2, height - 8.4);
  const panel = {
    x: layout.x - 0.42,
    y: layout.y - 0.42,
    width: layout.width + 0.84,
    height: layout.height + 0.84,
    rx: Math.max(2.8, layout.rx - 0.38),
  };
  const deskBase = mixColors("#f4dcc6", palette.pop, 0.34);
  const deskWarm = mixColors("#e9c9b4", palette.paper, 0.22);
  const deskCool = mixColors("#eadfef", palette.soft, 0.28);
  const notePaper = mixColors("#fffdf8", palette.paper, 0.02);
  const noteShadow = mixColors("#aa94a7", palette.border, 0.18);
  const frameBorder = enrichColor(mixColors(deskCool, palette.border, 0.48), {
    hueShift: -8 + seeded(seed, 7110) * 16,
    saturationMult: 1.08,
    lightnessShift: -0.03,
  });
  const frameInner = mixColors(frameBorder, palette.paper, 0.24);
  const panelStroke = mixColors(frameBorder, palette.paper, 0.18);
  const washiA = mixColors(palette.accent, palette.paper, 0.18);
  const washiB = mixColors(palette.pop, palette.paper, 0.22);
  const pencilBodies = [
    mixColors("#f3c98d", palette.pop, 0.12),
    mixColors("#9fd9c7", palette.soft, 0.14),
    mixColors("#d9b6f3", palette.accent, 0.16),
    mixColors("#f4b8a3", palette.pop, 0.16),
  ];
  const pencilTip = mixColors("#d79a65", palette.pop, 0.22);
  const pencilLead = mixColors("#5b5f72", palette.ink, 0.08);

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={deskBase} />
          <stop offset="52%" stopColor={deskWarm} />
          <stop offset="100%" stopColor={deskCool} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fffefe", palette.paper, 0.02)} />
          <stop offset="100%" stopColor={mixColors("#fff8fb", palette.paper, 0.14)} />
        </linearGradient>
        <linearGradient id={noteId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={notePaper} />
          <stop offset="100%" stopColor={mixColors("#fff4ef", palette.paper, 0.1)} />
        </linearGradient>
        <linearGradient id={tapeId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={washiA} />
          <stop offset="100%" stopColor={washiB} />
        </linearGradient>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      <path d={outerPath} fill={mixColors(frameBorder, palette.soft, 0.78)} opacity="0.14" transform="translate(0.7 0.9)" />
      <g clipPath={`url(#${sceneClip})`}>
        <rect x="0" y="0" width={width} height={height} fill={`url(#${outerId})`} />
        <g opacity="0.16">
          {Array.from({ length: 8 }).map((_, index) => {
            const x = 6 + index * ((width - 12) / 7);
            return <path key={`desk-stripe-${index}`} d={`M ${x} 2 V ${height - 2}`} stroke={mixColors(deskWarm, palette.paper, 0.18)} strokeWidth="0.5" />;
          })}
        </g>

        <g transform={`translate(${width * 0.18} ${height * 0.23}) rotate(-8)`} opacity="0.94">
          <rect x="-8.2" y="-4.7" width="16.4" height="10.4" rx="1.2" fill={`url(#${noteId})`} />
          <path d="M -5.8 -2.1 H 4.6" stroke={mixColors(frameBorder, palette.paper, 0.24)} strokeWidth="0.24" opacity="0.58" />
          <path d="M -5.8 -0.2 H 5.4" stroke={mixColors(frameBorder, palette.paper, 0.24)} strokeWidth="0.24" opacity="0.58" />
          <path d="M -5.8 1.7 H 4.1" stroke={mixColors(frameBorder, palette.paper, 0.24)} strokeWidth="0.24" opacity="0.58" />
          <rect x="-6.4" y="-5.5" width="4.8" height="1.8" rx="0.4" fill={`url(#${tapeId})`} opacity="0.8" />
          <circle cx="5.7" cy="4.1" r="0.6" fill={mixColors(palette.pop, "#fff4cf", 0.12)} opacity="0.86" />
        </g>

        <g transform={`translate(${width * 0.83} ${height * 0.22}) rotate(9)`} opacity="0.88">
          <rect x="-6.4" y="-4.1" width="12.8" height="8.8" rx="1" fill={mixColors("#fffef7", palette.paper, 0.04)} />
          <rect x="-5" y="-2.9" width="10.2" height="6.2" rx="0.8" fill="none" stroke={mixColors(palette.accent, palette.paper, 0.18)} strokeWidth="0.28" strokeDasharray="0.5 0.7" />
          <circle cx="3.5" cy="-1.8" r="0.72" fill={mixColors(palette.pop, "#fff4da", 0.1)} />
        </g>

        <g transform={`translate(${width * 0.12} ${height * 0.77}) rotate(-10)`} opacity="0.86">
          <rect x="-5.8" y="-3.8" width="11.6" height="7.2" rx="0.9" fill={`url(#${noteId})`} />
          <path d="M -4.2 -1.6 H 3.8" stroke={mixColors(frameBorder, palette.paper, 0.24)} strokeWidth="0.22" opacity="0.54" />
          <path d="M -4.2 0 H 3.2" stroke={mixColors(frameBorder, palette.paper, 0.24)} strokeWidth="0.22" opacity="0.54" />
          <rect x="-4.8" y="-4.45" width="3.8" height="1.25" rx="0.3" fill={`url(#${tapeId})`} opacity="0.78" />
        </g>

        {[
          { x: width * 0.82, y: height * 0.8, angle: -18, length: 10.2, body: pencilBodies[0] },
          { x: width * 0.24, y: height * 0.85, angle: 14, length: 8.8, body: pencilBodies[1] },
          { x: width * 0.67, y: height * 0.16, angle: 32, length: 8.2, body: pencilBodies[2] },
          { x: width * 0.34, y: height * 0.76, angle: -34, length: 9.1, body: pencilBodies[3] },
        ].map((pencil, index) => {
          const bodyLength = pencil.length;
          return (
            <g key={`desk-pencil-${index}`} transform={`translate(${pencil.x} ${pencil.y}) rotate(${pencil.angle})`} opacity={index < 2 ? 0.9 : 0.76}>
              <rect x={-bodyLength * 0.78} y="-0.48" width={bodyLength} height="0.96" rx="0.34" fill={pencil.body} />
              <path d={`M ${bodyLength * 0.22} -0.48 L ${bodyLength * 0.44} 0 L ${bodyLength * 0.22} 0.48 Z`} fill={pencilTip} />
              <path d={`M ${bodyLength * 0.44} 0 L ${bodyLength * 0.52} 0.02`} stroke={pencilLead} strokeWidth="0.15" strokeLinecap="round" />
              <rect x={-bodyLength * 0.88} y="-0.48" width={bodyLength * 0.1} height="0.96" rx="0.16" fill={mixColors("#f4d6d9", palette.accent, 0.08)} />
            </g>
          );
        })}

        <g transform={`translate(${width * 0.5} ${height * 0.2})`} opacity="0.76">
          <path d={sparklePath(-10, -1.2, 1.2, 0.42)} fill={mixColors(palette.pop, "#fff1c6", 0.1)} />
          <path d={sparklePath(9, 0.4, 1.05, 0.38)} fill={mixColors(palette.accent, "#fff6ff", 0.12)} />
        </g>
      </g>
      <path d={outerPath} fill="none" stroke={frameBorder} strokeWidth="1.08" />
      <path d={innerPath} fill="none" stroke={frameInner} strokeWidth="0.68" opacity="0.8" />
      <rect x={panel.x + 0.35} y={panel.y + 0.45} width={panel.width} height={panel.height} rx={panel.rx} fill={noteShadow} opacity="0.1" />
      <rect x={panel.x} y={panel.y} width={panel.width} height={panel.height} rx={panel.rx} fill={`url(#${panelId})`} fillOpacity="0.8" stroke={panelStroke} strokeWidth="0.42" />
      <rect x={panel.x} y={panel.y} width={panel.width} height={panel.height} rx={panel.rx} fill="none" stroke={mixColors("#ffffff", palette.paper, 0.22)} strokeWidth="0.16" transform="translate(0 0.18)" opacity="0.72" />
      <QuestionText clipId={clipId} layout={layout} ink={mixColors("#665561", palette.ink, 0.16)} lines={lines} />
    </g>
  );
}

function GardenTheme(props: {
  width: number;
  height: number;
  palette: Palette;
  layout: QuestionLayout;
  clipId: string;
  lines: string[];
  seed: number;
  cardId: string;
}) {
  const { width, height, palette, layout, clipId, lines, seed, cardId } = props;
  const outerId = `${cardId}-garden-outer`;
  const panelId = `${cardId}-garden-panel`;
  const sceneClip = `${cardId}-garden-scene`;
  const outerPath = plaquePath(1.2, 1.2, width - 2.4, height - 2.4);
  const isMood = layout.variant === "mood";
  const panelPath = isMood
    ? roundedRectPath(layout.x - 0.42, layout.y - 0.42, layout.width + 0.84, layout.height + 0.84, Math.max(2.8, layout.rx - 0.42))
    : cartouchePath(layout.x - 0.45, layout.y - 0.45, layout.width + 0.9, layout.height + 0.9, 1.4);
  const meadowDeep = mixColors("#587260", palette.border, 0.52);
  const meadowSoft = mixColors("#8fb093", palette.soft, 0.48);
  const meadowMist = mixColors("#dcead9", palette.paper, 0.38);
  const mountainFar = mixColors("#b8c6d8", palette.soft, 0.44);
  const mountainNear = mixColors("#9db1b6", palette.border, 0.38);
  const stemColor = mixColors("#5f7b68", palette.border, 0.58);
  const centerColor = mixColors(palette.pop, "#fff4c9", 0.2);
  const mouseBase = mixColors("#8e8794", palette.border, 0.22);
  const mouseSoft = mixColors("#f5f0ef", palette.paper, 0.1);
  const frontSprigs = [
    {
      x: width * 0.1,
      baseY: height - 5,
      height: height * 0.21,
      lean: -0.7,
      scale: 0.72,
      style: "cluster" as const,
      petal: palette.accent,
      opacity: 0.78,
    },
    {
      x: width * 0.19,
      baseY: height - 5.2,
      height: height * 0.25,
      lean: 1,
      scale: 0.62,
      style: "bell" as const,
      petal: mixColors(palette.pop, palette.paper, 0.06),
      opacity: 0.54,
    },
    {
      x: width * 0.86,
      baseY: height - 5.1,
      height: height * 0.24,
      lean: -0.9,
      scale: 0.68,
      style: "cluster" as const,
      petal: palette.accent,
      opacity: 0.72,
    },
    {
      x: width * 0.93,
      baseY: height - 5,
      height: height * 0.27,
      lean: 0.72,
      scale: 0.64,
      style: "bell" as const,
      petal: mixColors(palette.pop, palette.paper, 0.04),
      opacity: 0.62,
    },
  ];
  const heroBlooms = [
    {
      x: width * 0.125,
      baseY: height - 4.7,
      height: height * 0.24,
      lean: 0.85,
      scale: 0.72,
      petal: mixColors(palette.pop, "#fff2ea", 0.16),
      opacity: 0.78,
    },
    {
      x: width * 0.8,
      baseY: height - 4.45,
      height: height * 0.32,
      lean: 1.12,
      scale: 0.88,
      style: "daisy" as const,
      petal: mixColors(palette.soft, "#ffffff", 0.08),
      opacity: 0.95,
    },
  ];
  const middleBlooms = [
    {
      x: width * 0.36,
      baseY: height - 4.8,
      height: height * 0.14,
      lean: -0.55,
      scale: 0.56,
      petal: mixColors(palette.soft, "#ffffff", 0.12),
      opacity: 0.42,
    },
    {
      x: width * 0.49,
      baseY: height - 4.9,
      height: height * 0.16,
      lean: 0.18,
      scale: 0.58,
      petal: mixColors(palette.accent, palette.paper, 0.14),
      opacity: 0.48,
    },
    {
      x: width * 0.63,
      baseY: height - 4.75,
      height: height * 0.145,
      lean: 0.72,
      scale: 0.56,
      petal: mixColors(palette.pop, palette.paper, 0.08),
      opacity: 0.44,
    },
  ];
  const backgroundAnchors = [0.11, 0.26, 0.43, 0.58, 0.71, 0.82, 0.92];
  const backgroundSprigs = backgroundAnchors.map((anchor, index) => {
    const stemHeightMultiplier = index >= 4 ? 0.3 + seeded(seed, 270 + index) * 0.16 : 0.22 + seeded(seed, 270 + index) * 0.12;
    const styles: Array<"daisy" | "cluster" | "bell"> = ["bell", "cluster", "daisy"];

    return {
      x: width * anchor,
      baseY: height - 5.3 - seeded(seed, 260 + index) * (index >= 4 ? 1.8 : 1.2),
      height: height * stemHeightMultiplier,
      lean: seeded(seed, 280 + index) * (index >= 4 ? 3.6 : 2.6) - (index >= 4 ? 1.8 : 1.3),
      scale: (index >= 4 ? 0.74 : 0.6) + seeded(seed, 290 + index) * 0.18,
      style: styles[index % styles.length],
      petal:
        index % 3 === 0
          ? palette.soft
          : index % 3 === 1
            ? palette.accent
            : mixColors(palette.pop, palette.paper, 0.1),
      opacity: index >= 4 ? 0.46 + (index % 2) * 0.12 : 0.22 + (index % 2) * 0.08,
    };
  });

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#f6fbff", palette.soft, 0.34)} />
          <stop offset="54%" stopColor={mixColors(palette.paper, "#fffdfa", 0.08)} />
          <stop offset="100%" stopColor={mixColors(palette.paper, palette.accent, 0.16)} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#ffffff", palette.paper, 0.06)} />
          <stop offset="100%" stopColor={mixColors(palette.paper, "#fffefd", 0.16)} />
        </linearGradient>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      <path d={outerPath} fill={mixColors(palette.border, palette.soft, 0.72)} opacity="0.12" transform="translate(0.7 0.9)" />
      <g clipPath={`url(#${sceneClip})`}>
        <rect x="0" y="0" width={width} height={height} fill={`url(#${outerId})`} />
        <circle cx={width * 0.2} cy={height * 0.18} r={height * 0.26} fill={mixColors("#f2fff1", palette.soft, 0.48)} opacity="0.28" />
        <circle cx={width * 0.72} cy={height * 0.13} r={height * 0.23} fill={mixColors("#fef4ff", palette.accent, 0.56)} opacity="0.16" />
        <circle cx={width * 0.46} cy={height * 0.12} r={height * 0.17} fill={mixColors("#ffffff", palette.paper, 0.12)} opacity="0.18" />
        <g opacity="0.72">
          <circle cx={width * 0.57} cy={height * 0.18} r={height * 0.06} fill={mixColors(centerColor, "#fff5cf", 0.12)} />
          <path
            d={cloudPath(width * 0.47, height * 0.11, width * 0.17, height * 0.11)}
            fill={mixColors("#ffffff", palette.soft, 0.22)}
            opacity="0.62"
            transform={`scale(0.34) translate(${width * 0.88} ${height * 0.58})`}
          />
          <path
            d={`M ${width * 0.49} ${height * 0.188} q ${width * 0.028} -${height * 0.018} ${width * 0.058} 0`}
            fill="none"
            stroke={mixColors("#ffffff", palette.paper, 0.22)}
            strokeWidth="0.34"
            strokeLinecap="round"
            opacity="0.48"
          />
        </g>
        <path
          d={`M -3 ${height * 0.73} L ${width * 0.08} ${height * 0.55} L ${width * 0.19} ${height * 0.73} L ${width * 0.31} ${height * 0.5} L ${width * 0.44} ${height * 0.73} L ${width * 0.61} ${height * 0.53} L ${width * 0.77} ${height * 0.73} L ${width * 0.92} ${height * 0.57} L ${width + 3} ${height * 0.73} L ${width + 3} ${height} L -3 ${height} Z`}
          fill={mountainFar}
          opacity="0.24"
        />
        <path
          d={`M -3 ${height * 0.77} L ${width * 0.16} ${height * 0.61} L ${width * 0.3} ${height * 0.77} L ${width * 0.49} ${height * 0.58} L ${width * 0.67} ${height * 0.77} L ${width * 0.84} ${height * 0.63} L ${width + 3} ${height * 0.77} L ${width + 3} ${height} L -3 ${height} Z`}
          fill={mountainNear}
          opacity="0.18"
        />
        <path d={rollingHillPath(width, height, height * 0.8, height * 0.08, seed, 200)} fill={meadowMist} opacity="0.9" />
        <path d={rollingHillPath(width, height, height * 0.86, height * 0.07, seed, 210)} fill={meadowSoft} opacity="0.58" />
        <path d={rollingHillPath(width, height, height * 0.92, height * 0.05, seed, 220)} fill={meadowDeep} opacity="0.32" />
        <g opacity="0.86">
          <path
            d={`M 1.4 ${height * 0.328} C ${width * 0.07} ${height * 0.304}, ${width * 0.14} ${height * 0.29}, ${width * 0.22} ${height * 0.31}`}
            fill="none"
            stroke={mixColors(stemColor, palette.paper, 0.12)}
            strokeWidth="0.5"
            strokeLinecap="round"
          />
          <path
            d={`M ${width * 0.1} ${height * 0.305} Q ${width * 0.12} ${height * 0.271} ${width * 0.147} ${height * 0.262}`}
            fill="none"
            stroke={mixColors(stemColor, palette.paper, 0.16)}
            strokeWidth="0.24"
            strokeLinecap="round"
          />
          <ellipse
            cx={width * 0.126}
            cy={height * 0.282}
            rx="1.05"
            ry="0.42"
            fill={mixColors(stemColor, palette.soft, 0.42)}
            transform={`rotate(-24 ${width * 0.126} ${height * 0.282})`}
            opacity="0.66"
          />
          <ellipse
            cx={width * 0.168}
            cy={height * 0.287}
            rx="0.88"
            ry="0.32"
            fill={mixColors(stemColor, palette.soft, 0.36)}
            transform={`rotate(22 ${width * 0.168} ${height * 0.287})`}
            opacity="0.54"
          />
          <g transform={`translate(${width * 0.158} ${height * 0.298}) rotate(${seeded(seed, 370) * 10 - 5})`}>
            <g transform="translate(0 -1.55) scale(0.72)">
              <path
                d="M -2.7 0.18 Q -1.8 -1.25 0.12 -1.25 Q 2.1 -1.2 2.72 0.12 Q 1.7 1.2 -0.1 1.18 Q -1.95 1.16 -2.7 0.18 Z"
                fill={mixColors(palette.pop, palette.paper, 0.05)}
              />
              <path
                d="M -1.02 -0.08 Q 0.22 -1.4 1.5 -0.22 Q 0.7 0.6 -1.02 -0.08 Z"
                fill={mixColors(palette.accent, palette.paper, 0.1)}
                opacity="0.88"
              />
              <circle cx="2.2" cy="-0.92" r="0.72" fill={mixColors(palette.pop, palette.paper, 0.02)} />
              <path
                d="M 2.72 -0.92 L 3.88 -0.64 L 2.8 -0.32 Z"
                fill={mixColors(centerColor, palette.paper, 0.06)}
              />
              <circle cx="2.38" cy="-0.98" r="0.11" fill={mixColors(palette.ink, palette.paper, 0.06)} />
              <path
                d="M -2.58 -0.04 L -4.48 -0.92 L -4.02 -0.08 L -4.8 0.32 Z"
                fill={mixColors(palette.accent, palette.paper, 0.22)}
                opacity="0.82"
              />
              <path
                d="M -0.2 1.4 Q -0.35 2.15 -0.78 2.9"
                fill="none"
                stroke={mixColors(stemColor, palette.paper, 0.16)}
                strokeWidth="0.18"
                strokeLinecap="round"
              />
              <path
                d="M 0.7 1.42 Q 0.9 2.08 1.28 2.76"
                fill="none"
                stroke={mixColors(stemColor, palette.paper, 0.16)}
                strokeWidth="0.18"
                strokeLinecap="round"
              />
              <path
                d="M -0.3 1.05 H 0.95"
                fill="none"
                stroke={mixColors(stemColor, palette.paper, 0.16)}
                strokeWidth="0.14"
                strokeLinecap="round"
                opacity="0.56"
              />
            </g>
          </g>
        </g>
        {backgroundSprigs.map((sprig, index) => (
          <WildflowerSprig
            key={`background-sprig-${index}`}
            x={sprig.x}
            baseY={sprig.baseY}
            height={sprig.height}
            lean={sprig.lean}
            scale={sprig.scale}
            stem={mixColors(stemColor, palette.paper, 0.32)}
            petal={sprig.petal}
            center={centerColor}
            style={sprig.style}
            opacity={sprig.opacity}
          />
        ))}
        {middleBlooms.map((bloom, index) => (
          <MeadowBloom
            key={`middle-bloom-${index}`}
            x={bloom.x}
            baseY={bloom.baseY}
            height={bloom.height}
            lean={bloom.lean}
            scale={bloom.scale}
            stem={mixColors(stemColor, palette.paper, 0.28)}
            petal={bloom.petal}
            center={centerColor}
            opacity={bloom.opacity}
          />
        ))}
        {frontSprigs.map((sprig, index) => (
          <WildflowerSprig
            key={`front-sprig-${index}`}
            x={sprig.x}
            baseY={sprig.baseY}
            height={sprig.height}
            lean={sprig.lean}
            scale={sprig.scale}
            stem={mixColors(stemColor, palette.paper, 0.2)}
            petal={sprig.petal}
            center={centerColor}
            style={sprig.style}
            opacity={sprig.opacity}
          />
        ))}
        {heroBlooms.map((bloom, index) => (
          <MeadowBloom
            key={`hero-bloom-${index}`}
            x={bloom.x}
            baseY={bloom.baseY}
            height={bloom.height}
            lean={bloom.lean}
            scale={bloom.scale}
            stem={mixColors(stemColor, palette.paper, 0.18)}
            petal={bloom.petal}
            center={centerColor}
            opacity={bloom.opacity}
          />
        ))}
        <g transform={`translate(${width * 0.35} ${height * 0.806}) rotate(${seeded(seed, 390) * 6 - 3})`} opacity="0.92">
          <g transform="scale(0.5)">
            <ellipse cx="0.15" cy="1.88" rx="4.05" ry="0.4" fill={mixColors(meadowDeep, palette.paper, 0.44)} opacity="0.22" />
            <path
              d="M -3.1 0.58 q -2.2 -0.22 -3.95 -1.32 q -0.86 -0.54 -1.18 -1.18"
              fill="none"
              stroke={mixColors(mouseBase, palette.paper, 0.12)}
              strokeWidth="0.16"
              strokeLinecap="round"
            />
            <path
              d="M -3.18 0.42 Q -2.35 -1.3 0.82 -1.46 Q 3.24 -1.5 4.74 -0.62 Q 5.28 -0.28 5.08 0.34 Q 4.4 1.38 2.32 1.72 Q -0.08 2.06 -2.08 1.34 Q -3 1 -3.18 0.42 Z"
              fill={mouseBase}
            />
            <path
              d="M -0.92 0.08 Q 1.12 -0.94 2.92 -0.18 Q 1.42 0.86 -0.92 0.08 Z"
              fill={mouseSoft}
              opacity="0.52"
            />
            <ellipse cx="2.42" cy="-1.78" rx="0.58" ry="0.82" fill={mixColors(mouseBase, mouseSoft, 0.28)} transform="rotate(-12 2.42 -1.78)" />
            <ellipse cx="3.32" cy="-1.54" rx="0.46" ry="0.7" fill={mixColors(mouseSoft, mouseBase, 0.24)} transform="rotate(10 3.32 -1.54)" />
            <path
              d="M 4.08 -0.84 Q 5.34 -0.66 5.42 -0.08 Q 4.9 0.26 4.1 0.12 Z"
              fill={mixColors(mouseBase, palette.paper, 0.08)}
            />
            <path
              d="M 5.38 -0.14 L 6.02 0.02 L 5.44 0.24 Z"
              fill={mixColors(centerColor, palette.paper, 0.1)}
            />
            <circle cx="4.36" cy="-0.82" r="0.1" fill={mixColors(palette.ink, palette.paper, 0.08)} />
            <path
              d="M 5.1 -0.14 q 0.86 0.06 1.48 -0.16"
              fill="none"
              stroke={mixColors(mouseBase, palette.paper, 0.06)}
              strokeWidth="0.08"
              strokeLinecap="round"
            />
            <path
              d="M 5.1 0.08 q 0.84 0.14 1.46 0.02"
              fill="none"
              stroke={mixColors(mouseBase, palette.paper, 0.06)}
              strokeWidth="0.08"
              strokeLinecap="round"
            />
            <path
              d="M -0.82 1.16 q -0.08 0.68 -0.5 1.22"
              fill="none"
              stroke={mixColors(mouseBase, palette.paper, 0.1)}
              strokeWidth="0.1"
              strokeLinecap="round"
            />
            <path
              d="M 1.1 1.14 q 0.08 0.66 0.46 1.2"
              fill="none"
              stroke={mixColors(mouseBase, palette.paper, 0.1)}
              strokeWidth="0.1"
              strokeLinecap="round"
            />
          </g>
        </g>
        {Array.from({ length: 6 }).map((_, index) => (
          <circle
            key={`pollen-${index}`}
            cx={8 + seeded(seed, 330 + index) * (width - 16)}
            cy={height * (0.16 + seeded(seed, 340 + index) * 0.46)}
            r={0.22 + seeded(seed, 350 + index) * 0.34}
            fill={index % 2 === 0 ? palette.pop : palette.accent}
            opacity="0.5"
          />
        ))}
        <g transform={`translate(${width - 15.7} ${height * 0.22}) rotate(${seeded(seed, 360) * 18 - 9})`} opacity="0.82">
          <ellipse
            cx="-1.5"
            cy="-1"
            rx="1.26"
            ry="1.22"
            fill={mixColors(palette.pop, palette.paper, 0.08)}
            transform="rotate(-26 -1.5 -0.95)"
          />
          <ellipse
            cx="1.45"
            cy="-1"
            rx="1.26"
            ry="1.22"
            fill={mixColors(palette.soft, palette.paper, 0.08)}
            transform="rotate(26 1.45 -1)"
          />
          <ellipse
            cx="-1.05"
            cy="0.96"
            rx="0.82"
            ry="0.96"
            fill={mixColors(palette.accent, palette.paper, 0.16)}
            transform="rotate(18 -1.05 0.95)"
          />
          <ellipse
            cx="1.05"
            cy="0.96"
            rx="0.82"
            ry="0.96"
            fill={mixColors(palette.pop, palette.paper, 0.16)}
            transform="rotate(-18 1.05 0.95)"
          />
          <ellipse cx="0" cy="0.08" rx="0.3" ry="1.94" fill={mixColors(palette.ink, palette.paper, 0.12)} opacity="0.72" />
          <path
            d="M -0.1 -1.35 Q -0.75 -2.3 -1.45 -2.45"
            fill="none"
            stroke={mixColors(palette.ink, palette.paper, 0.22)}
            strokeWidth="0.18"
            strokeLinecap="round"
          />
          <path
            d="M 0.1 -1.35 Q 0.75 -2.3 1.45 -2.45"
            fill="none"
            stroke={mixColors(palette.ink, palette.paper, 0.22)}
            strokeWidth="0.18"
            strokeLinecap="round"
          />
        </g>
      </g>
      <path d={outerPath} fill="none" stroke={palette.border} strokeWidth="1.08" />
      <path d={plaquePath(4.1, 4.2, width - 8.2, height - 8.4)} fill="none" stroke={mixColors(palette.border, palette.paper, 0.16)} strokeWidth="0.68" />
      <path d={panelPath} fill={mixColors(palette.border, palette.paper, 0.9)} opacity="0.05" transform="translate(0.4 0.52)" />
      <path d={panelPath} fill={`url(#${panelId})`} fillOpacity="0.8" stroke={mixColors(palette.border, palette.paper, 0.22)} strokeWidth="0.48" />
      <path d={panelPath} fill="none" stroke={mixColors(palette.border, "#ffffff", 0.42)} strokeWidth="0.18" transform="translate(0 0.22)" opacity="0.7" />
      {!isMood ? (
        <path
          d={`M ${layout.x - 3.3} ${layout.y + layout.height * 0.5} q -2.8 1.4 -2.1 4.1 q 2.6 0.1 4.1 -2.6`}
          fill={mixColors(palette.soft, palette.paper, 0.1)}
          opacity="0.74"
        />
      ) : null}
      {!isMood ? (
        <path
          d={`M ${layout.x + layout.width + 3.3} ${layout.y + layout.height * 0.42} q 2.6 -1.2 2.1 -3.9 q -2.8 0.1 -4 2.5`}
          fill={mixColors(palette.accent, palette.paper, 0.14)}
          opacity="0.7"
        />
      ) : null}
      <QuestionText clipId={clipId} layout={layout} ink={mixColors(palette.ink, palette.paper, 0.2)} lines={lines} />
    </g>
  );
}

function GardenNightTheme(props: {
  width: number;
  height: number;
  palette: Palette;
  layout: QuestionLayout;
  clipId: string;
  lines: string[];
  seed: number;
  cardId: string;
}) {
  const { width, height, palette, layout, clipId, lines, seed, cardId } = props;
  const outerId = `${cardId}-garden-night-outer`;
  const panelId = `${cardId}-garden-night-panel`;
  const sceneClip = `${cardId}-garden-night-scene`;
  const outerPath = plaquePath(1.2, 1.2, width - 2.4, height - 2.4);
  const panelPath =
    layout.variant === "mood"
      ? roundedRectPath(layout.x - 0.4, layout.y - 0.38, layout.width + 0.8, layout.height + 0.76, Math.max(2.8, layout.rx - 0.4))
      : cartouchePath(layout.x - 0.4, layout.y - 0.38, layout.width + 0.8, layout.height + 0.76, 1.3);
  const nightSky = mixColors("#182437", palette.paper, 0.08);
  const nightSkyHigh = mixColors("#26374c", palette.soft, 0.1);
  const mountainFar = mixColors("#607294", palette.soft, 0.18);
  const mountainNear = mixColors("#475d72", palette.border, 0.14);
  const meadowFar = mixColors("#3b5560", palette.soft, 0.18);
  const meadowNear = mixColors("#2c4349", palette.border, 0.12);
  const stemColor = mixColors("#8fa3b8", palette.soft, 0.18);
  const centerGlow = mixColors("#ffe1a3", palette.pop, 0.14);
  const firefly = mixColors("#ffe8b7", palette.pop, 0.08);
  const frontSprigs = [
    { x: width * 0.14, baseY: height - 4.9, height: height * 0.24, lean: -0.7, scale: 0.62, style: "cluster" as const, petal: mixColors("#c7c5ec", palette.accent, 0.2), opacity: 0.62 },
    { x: width * 0.25, baseY: height - 5.1, height: height * 0.27, lean: 0.84, scale: 0.58, style: "bell" as const, petal: mixColors("#f2d0a5", palette.pop, 0.2), opacity: 0.54 },
    { x: width * 0.78, baseY: height - 4.8, height: height * 0.31, lean: 1.02, scale: 0.78, style: "daisy" as const, petal: mixColors("#d9d8fb", palette.soft, 0.22), opacity: 0.86 },
    { x: width * 0.89, baseY: height - 5, height: height * 0.25, lean: -0.66, scale: 0.62, style: "cluster" as const, petal: mixColors("#dba6bc", palette.accent, 0.22), opacity: 0.68 },
  ];
  const middleBlooms = [
    { x: width * 0.39, baseY: height - 4.9, height: height * 0.16, lean: -0.48, scale: 0.5, petal: mixColors("#d7d8f5", palette.soft, 0.24), opacity: 0.28 },
    { x: width * 0.56, baseY: height - 4.85, height: height * 0.18, lean: 0.36, scale: 0.54, petal: mixColors("#f4d8aa", palette.pop, 0.24), opacity: 0.34 },
  ];

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={nightSkyHigh} />
          <stop offset="55%" stopColor={nightSky} />
          <stop offset="100%" stopColor={mixColors("#16202f", palette.paper, 0.06)} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fffdf7", palette.paper, 0.08)} />
          <stop offset="100%" stopColor={mixColors("#f6f6ff", palette.paper, 0.14)} />
        </linearGradient>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      <path d={outerPath} fill={mixColors(palette.border, palette.soft, 0.58)} opacity="0.14" transform="translate(0.7 0.9)" />
      <g clipPath={`url(#${sceneClip})`}>
        <rect x="0" y="0" width={width} height={height} fill={`url(#${outerId})`} />
        <circle cx={width * 0.72} cy={height * 0.19} r={height * 0.09} fill={mixColors("#fff3c8", firefly, 0.18)} opacity="0.88" />
        <circle cx={width * 0.72} cy={height * 0.19} r={height * 0.14} fill={mixColors("#fff2c8", palette.paper, 0.22)} opacity="0.1" />
        <path
          d={cloudPath(width * 0.5, height * 0.14, width * 0.18, height * 0.11)}
          fill={mixColors("#edf3ff", palette.soft, 0.16)}
          opacity="0.16"
          transform={`scale(0.36) translate(${width * 0.82} ${height * 0.52})`}
        />
        {Array.from({ length: 16 }).map((_, index) => {
          const starX = 7 + seeded(seed, 500 + index) * (width - 14);
          const starY = 4 + seeded(seed, 520 + index) * (height * 0.34);
          const outer = 0.34 + seeded(seed, 540 + index) * 0.5;

          return index % 4 === 0 ? (
            <path key={`night-star-${index}`} d={sparklePath(starX, starY, outer, outer * 0.34)} fill={mixColors("#f9f7ff", palette.paper, 0.08)} opacity="0.84" />
          ) : (
            <circle key={`night-star-${index}`} cx={starX} cy={starY} r={outer} fill={mixColors("#f7f4ff", palette.paper, 0.12)} opacity={index % 2 === 0 ? 0.74 : 0.58} />
          );
        })}
        {Array.from({ length: 6 }).map((_, index) => (
          <path
            key={`night-spark-cluster-${index}`}
            d={sparklePath(
              width * (0.1 + seeded(seed, 900 + index) * 0.8),
              height * (0.08 + seeded(seed, 920 + index) * 0.18),
              0.34 + seeded(seed, 940 + index) * 0.28,
              0.14 + seeded(seed, 960 + index) * 0.08,
            )}
            fill={index % 2 === 0 ? mixColors("#fff8e8", palette.paper, 0.08) : mixColors("#dde2ff", palette.paper, 0.14)}
            opacity="0.68"
          />
        ))}
        <path
          d={`M -3 ${height * 0.72} L ${width * 0.1} ${height * 0.54} L ${width * 0.21} ${height * 0.72} L ${width * 0.33} ${height * 0.5} L ${width * 0.46} ${height * 0.72} L ${width * 0.62} ${height * 0.55} L ${width * 0.77} ${height * 0.72} L ${width * 0.92} ${height * 0.58} L ${width + 3} ${height * 0.72} L ${width + 3} ${height} L -3 ${height} Z`}
          fill={mountainFar}
          opacity="0.26"
        />
        <path
          d={`M -3 ${height * 0.78} L ${width * 0.16} ${height * 0.64} L ${width * 0.29} ${height * 0.78} L ${width * 0.47} ${height * 0.6} L ${width * 0.66} ${height * 0.78} L ${width * 0.83} ${height * 0.65} L ${width + 3} ${height * 0.78} L ${width + 3} ${height} L -3 ${height} Z`}
          fill={mountainNear}
          opacity="0.22"
        />
        <path d={rollingHillPath(width, height, height * 0.82, height * 0.07, seed, 600)} fill={mixColors(meadowFar, palette.paper, 0.08)} opacity="0.76" />
        <path d={rollingHillPath(width, height, height * 0.88, height * 0.06, seed, 610)} fill={meadowFar} opacity="0.58" />
        <path d={rollingHillPath(width, height, height * 0.93, height * 0.045, seed, 620)} fill={meadowNear} opacity="0.46" />

        <g opacity="0.7">
          <path
            d={`M 1.4 ${height * 0.33} C ${width * 0.07} ${height * 0.308}, ${width * 0.14} ${height * 0.296}, ${width * 0.22} ${height * 0.312}`}
            fill="none"
            stroke={mixColors(stemColor, palette.paper, 0.18)}
            strokeWidth="0.42"
            strokeLinecap="round"
          />
          <g transform={`translate(${width * 0.158} ${height * 0.286}) rotate(${seeded(seed, 630) * 6 - 3})`}>
            <g transform="translate(0 -1.54) scale(0.72)">
              <path d="M -0.95 -1.45 L -0.3 -2.45 L 0.08 -1.28 Z" fill={mixColors("#b8bad9", palette.border, 0.18)} />
              <path d="M 0.95 -1.45 L 0.3 -2.45 L -0.08 -1.28 Z" fill={mixColors("#b8bad9", palette.border, 0.18)} />
              <ellipse cx="0" cy="0.02" rx="2.05" ry="2.28" fill={mixColors("#a8acc8", palette.border, 0.16)} />
              <ellipse cx="0" cy="0.44" rx="1.42" ry="1.38" fill={mixColors("#edf2ff", palette.paper, 0.18)} opacity="0.72" />
              <circle cx="-0.72" cy="-0.18" r="0.62" fill={mixColors("#f7f9ff", palette.paper, 0.08)} />
              <circle cx="0.72" cy="-0.18" r="0.62" fill={mixColors("#f7f9ff", palette.paper, 0.08)} />
              <circle cx="-0.72" cy="-0.18" r="0.16" fill={mixColors("#1d2838", palette.paper, 0.12)} />
              <circle cx="0.72" cy="-0.18" r="0.16" fill={mixColors("#1d2838", palette.paper, 0.12)} />
              <path d="M -0.22 0.44 L 0 0.78 L 0.22 0.44 Z" fill={mixColors("#f4d8a6", palette.pop, 0.14)} />
              <path d="M -0.5 1.82 Q -0.55 2.42 -0.92 2.92" fill="none" stroke={mixColors(stemColor, palette.paper, 0.18)} strokeWidth="0.14" strokeLinecap="round" />
              <path d="M 0.5 1.82 Q 0.55 2.42 0.92 2.92" fill="none" stroke={mixColors(stemColor, palette.paper, 0.18)} strokeWidth="0.14" strokeLinecap="round" />
            </g>
          </g>
        </g>

        {Array.from({ length: 6 }).map((_, index) => (
          <circle
            key={`firefly-${index}`}
            cx={width * (0.12 + seeded(seed, 640 + index) * 0.74)}
            cy={height * (0.28 + seeded(seed, 660 + index) * 0.42)}
            r={0.26 + seeded(seed, 680 + index) * 0.42}
            fill={firefly}
            opacity={0.64 + (index % 2) * 0.14}
          />
        ))}

        {middleBlooms.map((bloom, index) => (
          <MeadowBloom
            key={`night-middle-bloom-${index}`}
            x={bloom.x}
            baseY={bloom.baseY}
            height={bloom.height}
            lean={bloom.lean}
            scale={bloom.scale}
            stem={mixColors(stemColor, palette.paper, 0.24)}
            petal={bloom.petal}
            center={centerGlow}
            opacity={bloom.opacity}
          />
        ))}
        {frontSprigs.map((sprig, index) => (
          <WildflowerSprig
            key={`night-front-sprig-${index}`}
            x={sprig.x}
            baseY={sprig.baseY}
            height={sprig.height}
            lean={sprig.lean}
            scale={sprig.scale}
            stem={mixColors(stemColor, palette.paper, 0.22)}
            petal={sprig.petal}
            center={centerGlow}
            style={sprig.style}
            opacity={sprig.opacity}
          />
        ))}
        <MeadowBloom
          x={width * 0.8}
          baseY={height - 4.55}
          height={height * 0.31}
          lean={1.02}
          scale={0.82}
          stem={mixColors(stemColor, palette.paper, 0.22)}
          petal={mixColors("#d9d8fb", palette.soft, 0.22)}
          center={centerGlow}
          opacity={0.88}
        />
        <g transform={`translate(${width - 15.7} ${height * 0.22}) rotate(${seeded(seed, 700) * 18 - 9})`} opacity="0.68">
          <ellipse cx="-1.3" cy="-0.94" rx="1.02" ry="1.12" fill={mixColors("#dad7f5", palette.soft, 0.18)} transform="rotate(-28 -1.3 -0.94)" />
          <ellipse cx="1.28" cy="-0.94" rx="1.02" ry="1.12" fill={mixColors("#f3d8a8", palette.pop, 0.18)} transform="rotate(28 1.28 -0.94)" />
          <ellipse cx="-0.9" cy="0.88" rx="0.66" ry="0.86" fill={mixColors("#b7b7d9", palette.accent, 0.18)} transform="rotate(18 -0.9 0.88)" />
          <ellipse cx="0.9" cy="0.88" rx="0.66" ry="0.86" fill={mixColors("#f0c998", palette.pop, 0.18)} transform="rotate(-18 0.9 0.88)" />
          <ellipse cx="0" cy="0.08" rx="0.22" ry="1.7" fill={mixColors("#dcdff0", palette.paper, 0.18)} opacity="0.72" />
        </g>
      </g>
      <path d={outerPath} fill="none" stroke={palette.border} strokeWidth="1.08" />
      <path d={plaquePath(4.1, 4.2, width - 8.2, height - 8.4)} fill="none" stroke={mixColors(palette.border, palette.paper, 0.2)} strokeWidth="0.68" opacity="0.7" />
      <path d={panelPath} fill={mixColors(palette.paper, "#101827", 0.18)} opacity="0.14" transform="translate(0.4 0.52)" />
      <path d={panelPath} fill={`url(#${panelId})`} fillOpacity="0.8" stroke={mixColors(palette.paper, palette.border, 0.18)} strokeWidth="0.44" />
      <path d={panelPath} fill="none" stroke={mixColors("#ffffff", palette.paper, 0.14)} strokeWidth="0.16" transform="translate(0 0.22)" opacity="0.5" />
      <QuestionText clipId={clipId} layout={layout} ink={mixColors("#eef4ff", "#566c8e", 0.78)} lines={lines} />
    </g>
  );
}

function ForestCabinTheme(props: {
  width: number;
  height: number;
  palette: Palette;
  layout: QuestionLayout;
  clipId: string;
  lines: string[];
  seed: number;
  cardId: string;
}) {
  const { width, height, palette, layout, clipId, lines, seed, cardId } = props;
  const outerId = `${cardId}-forest-outer`;
  const panelId = `${cardId}-forest-panel`;
  const sceneClip = `${cardId}-forest-scene`;
  const outerPath = roundedRectPath(1.2, 1.2, width - 2.4, height - 2.4, 5.6);
  const panelPath = roundedRectPath(layout.x - 0.5, layout.y - 0.5, layout.width + 1, layout.height + 1, Math.max(2.6, layout.rx - 0.18));
  const hueDrift = (seeded(seed, 6100) - 0.5) * 56;
  const skyTop = enrichColor(mixColors(palette.border, palette.soft, 0.16), {
    hueShift: hueDrift - 18,
    saturationMult: 1.22,
    lightnessShift: -0.08,
  });
  const skyMid = enrichColor(mixColors(palette.soft, palette.accent, 0.2), {
    hueShift: hueDrift + 6,
    saturationMult: 1.2,
    lightnessShift: -0.02,
  });
  const skyBottom = enrichColor(mixColors(palette.pop, palette.paper, 0.16), {
    hueShift: hueDrift + 16,
    saturationMult: 1.16,
    lightnessShift: 0.04,
  });
  const hillFar = enrichColor(mixColors(palette.soft, palette.accent, 0.34), {
    hueShift: hueDrift - 8,
    saturationMult: 1.18,
    lightnessShift: -0.1,
  });
  const hillNear = enrichColor(mixColors(palette.border, palette.accent, 0.26), {
    hueShift: hueDrift - 22,
    saturationMult: 1.18,
    lightnessShift: -0.18,
  });
  const pinePalette = [
    enrichColor(mixColors(palette.soft, palette.accent, 0.1), {
      hueShift: -26 + seeded(seed, 6110) * 34,
      saturationMult: 1.24,
      lightnessShift: -0.08,
    }),
    enrichColor(mixColors(palette.pop, palette.soft, 0.42), {
      hueShift: 12 + seeded(seed, 6112) * 30,
      saturationMult: 1.26,
      lightnessShift: -0.06,
    }),
    enrichColor(mixColors(palette.border, palette.accent, 0.18), {
      hueShift: -12 + seeded(seed, 6114) * 44,
      saturationMult: 1.2,
      lightnessShift: -0.12,
    }),
    enrichColor(mixColors(palette.accent, palette.paper, 0.08), {
      hueShift: -34 + seeded(seed, 6116) * 52,
      saturationMult: 1.18,
      lightnessShift: -0.08,
    }),
  ];
  const cabinWall = enrichColor(mixColors(palette.pop, palette.accent, 0.34), {
    hueShift: 4 + seeded(seed, 6120) * 34,
    saturationMult: 1.3,
    lightnessShift: -0.02,
  });
  const cabinRoof = enrichColor(mixColors(palette.border, palette.accent, 0.2), {
    hueShift: -22 + seeded(seed, 6122) * 44,
    saturationMult: 1.16,
    lightnessShift: -0.18,
  });
  const cabinTrim = enrichColor(mixColors(cabinWall, palette.paper, 0.26), {
    saturationMult: 1.08,
    lightnessShift: 0.02,
  });
  const cabinGlow = enrichColor(mixColors(palette.pop, "#ffe6a4", 0.2), {
    saturationMult: 1.26,
    lightnessShift: 0.06,
  });

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={skyTop} />
          <stop offset="58%" stopColor={skyMid} />
          <stop offset="100%" stopColor={skyBottom} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors(palette.paper, "#ffffff", 0.26)} />
          <stop offset="100%" stopColor={mixColors(palette.paper, palette.soft, 0.18)} />
        </linearGradient>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      <path d={outerPath} fill={mixColors(palette.border, palette.soft, 0.62)} opacity="0.15" transform="translate(0.7 0.85)" />
      <g clipPath={`url(#${sceneClip})`}>
        <rect x="0" y="0" width={width} height={height} fill={`url(#${outerId})`} />
        <circle cx={width * 0.78} cy={height * 0.2} r={height * 0.1} fill={mixColors("#fff3c8", palette.pop, 0.12)} opacity="0.9" />
        {Array.from({ length: 15 }).map((_, index) => (
          index % 4 === 0 ? (
            <path
              key={`forest-star-${index}`}
              d={sparklePath(
                width * (0.08 + seeded(seed, 1500 + index) * 0.84),
                height * (0.08 + seeded(seed, 1520 + index) * 0.24),
                0.22 + seeded(seed, 1540 + index) * 0.34,
                0.08 + seeded(seed, 1560 + index) * 0.12,
              )}
              fill={mixColors("#fff9eb", palette.paper, 0.08)}
              opacity="0.78"
            />
          ) : (
            <circle
              key={`forest-dot-${index}`}
              cx={width * (0.08 + seeded(seed, 1500 + index) * 0.84)}
              cy={height * (0.08 + seeded(seed, 1520 + index) * 0.24)}
              r={0.16 + seeded(seed, 1540 + index) * 0.18}
              fill={mixColors("#fffaf2", palette.paper, 0.12)}
              opacity="0.64"
            />
          )
        ))}
        <path d={rollingHillPath(width, height, height * 0.72, height * 0.08, seed, 1570)} fill={hillFar} opacity="0.72" />
        <path d={rollingHillPath(width, height, height * 0.84, height * 0.07, seed, 1580)} fill={hillNear} opacity="0.82" />
        {Array.from({ length: 9 }).map((_, index) => {
          const x = width * (0.05 + index * 0.11 + seeded(seed, 1600 + index) * 0.03);
          const baseY = height * (0.78 + seeded(seed, 1620 + index) * 0.08);
          const treeHeight = height * (0.14 + seeded(seed, 1640 + index) * 0.12);
          const treeWidth = treeHeight * (0.22 + seeded(seed, 1660 + index) * 0.08);
          const crown = pinePalette[index % pinePalette.length] ?? hillFar;
          const crownHighlight = enrichColor(mixColors(crown, palette.paper, 0.14), {
            saturationMult: 1.08,
            lightnessShift: 0.05,
          });
          const trunk = enrichColor(mixColors(cabinRoof, crown, 0.32), {
            saturationMult: 1.04,
            lightnessShift: -0.04,
          });

          return (
            <g key={`pine-${index}`} transform={`translate(${x} ${baseY})`}>
              <rect x={-0.18} y={-treeHeight * 0.1} width={0.36} height={treeHeight * 0.18} rx={0.12} fill={trunk} />
              <path d={`M 0 ${-treeHeight} L ${treeWidth} ${-treeHeight * 0.32} L ${-treeWidth} ${-treeHeight * 0.32} Z`} fill={crown} />
              <path d={`M 0 ${-treeHeight * 0.74} L ${treeWidth * 0.86} ${-treeHeight * 0.12} L ${-treeWidth * 0.86} ${-treeHeight * 0.12} Z`} fill={crownHighlight} />
            </g>
          );
        })}
        <g transform={`translate(${width * 0.16} ${height * 0.71})`}>
          <rect x={-4.6} y={-3.3} width={9.2} height={5.8} rx={0.9} fill={cabinWall} />
          <path d="M -5.2 -3.05 L 0 -6.3 L 5.2 -3.05 Z" fill={cabinRoof} />
          <rect x={-1.15} y={-1.95} width={2.3} height={2.3} rx={0.5} fill={cabinGlow} opacity="0.96" />
          <rect x={-0.95} y={-1.75} width={1.9} height={1.9} rx={0.34} fill={mixColors("#fff8d6", palette.paper, 0.08)} />
          <path d="M -0.02 -1.75 V 0.15 M -0.95 -0.8 H 0.95" stroke={cabinTrim} strokeWidth="0.16" opacity="0.68" />
        </g>
        <path d={`M ${width * 0.12} ${height * 0.2} C ${width * 0.2} ${height * 0.17}, ${width * 0.28} ${height * 0.15}, ${width * 0.34} ${height * 0.12}`} fill="none" stroke={mixColors("#fff6e0", palette.paper, 0.12)} strokeWidth="0.3" opacity="0.5" strokeLinecap="round" />
      </g>
      <path d={outerPath} fill="none" stroke={mixColors(palette.border, palette.paper, 0.12)} strokeWidth="1.04" />
      <path d={roundedRectPath(4.1, 4.1, width - 8.2, height - 8.2, 4.6)} fill="none" stroke={mixColors(palette.border, palette.paper, 0.22)} strokeWidth="0.68" opacity="0.74" />
      <path d={panelPath} fill={mixColors(palette.border, palette.paper, 0.92)} opacity="0.08" transform="translate(0.45 0.56)" />
      <path d={panelPath} fill={`url(#${panelId})`} fillOpacity="0.84" stroke={mixColors(palette.border, palette.paper, 0.22)} strokeWidth="0.5" />
      <path d={panelPath} fill="none" stroke={mixColors("#ffffff", palette.paper, 0.4)} strokeWidth="0.18" transform="translate(0 0.22)" opacity="0.72" />
      <QuestionText clipId={clipId} layout={layout} ink={mixColors(palette.ink, palette.paper, 0.18)} lines={lines} />
    </g>
  );
}

function MushroomsTheme(props: {
  width: number;
  height: number;
  palette: Palette;
  layout: QuestionLayout;
  clipId: string;
  lines: string[];
  seed: number;
  cardId: string;
}) {
  const { width, height, palette, layout, clipId, lines, seed, cardId } = props;
  const outerId = `${cardId}-mushroom-outer`;
  const panelId = `${cardId}-mushroom-panel`;
  const sceneClip = `${cardId}-mushroom-clip`;
  const outerPath = roundedRectPath(1.1, 1.1, width - 2.2, height - 2.2, 5.3);
  const panelPath = roundedRectPath(
    layout.x - 0.46,
    layout.y - 0.46,
    layout.width + 0.92,
    layout.height + 0.92,
    Math.max(2.4, layout.rx - 0.2),
  );
  const skyTop = enrichColor(mixColors(palette.paper, "#fff9ee", 0.16), {
    saturationMult: 0.96,
    lightnessShift: 0.03,
  });
  const skyBottom = enrichColor(mixColors(palette.soft, palette.paper, 0.14), {
    hueShift: -8 + seeded(seed, 7210) * 16,
    saturationMult: 0.92,
    lightnessShift: 0.04,
  });
  const hillFar = enrichColor(mixColors(palette.soft, palette.border, 0.42), {
    hueShift: -18 + seeded(seed, 7220) * 32,
    saturationMult: 0.92,
    lightnessShift: -0.04,
  });
  const hillNear = enrichColor(mixColors(palette.accent, palette.soft, 0.3), {
    hueShift: 16 + seeded(seed, 7230) * 20,
    saturationMult: 0.96,
    lightnessShift: -0.06,
  });
  const soil = enrichColor(mixColors(palette.border, palette.pop, 0.26), {
    hueShift: 10 + seeded(seed, 7240) * 14,
    saturationMult: 1.02,
    lightnessShift: -0.14,
  });
  const farTrunk = enrichColor(mixColors(palette.border, palette.soft, 0.5), {
    hueShift: -10 + seeded(seed, 7245) * 20,
    saturationMult: 0.82,
    lightnessShift: -0.02,
  });
  const midTrunk = enrichColor(mixColors(palette.border, palette.pop, 0.42), {
    hueShift: 6 + seeded(seed, 7246) * 18,
    saturationMult: 0.92,
    lightnessShift: -0.08,
  });
  const caps = [
    enrichColor(mixColors("#ffbf84", palette.pop, 0.12), { saturationMult: 1.18, lightnessShift: 0.02 }),
    enrichColor(mixColors("#f0a6cf", palette.accent, 0.18), { saturationMult: 1.2, lightnessShift: 0.02 }),
    enrichColor(mixColors("#d8b5f2", palette.soft, 0.18), { saturationMult: 1.16, lightnessShift: 0.01 }),
    enrichColor(mixColors("#9fd8c9", palette.soft, 0.2), { saturationMult: 1.08, lightnessShift: -0.02 }),
  ];
  const stem = mixColors("#fff7ee", palette.paper, 0.08);
  const dots = mixColors("#fffdf8", palette.paper, 0.02);
  const mushrooms = Array.from({ length: 9 }).map((_, index) => {
    const scale = 0.72 + seeded(seed, 7250 + index) * 0.58;
    return {
      x: width * (0.08 + index * 0.1 + seeded(seed, 7260 + index) * 0.03),
      y: height * (0.8 + seeded(seed, 7270 + index) * 0.08),
      scale,
      cap: caps[index % caps.length],
      lean: seeded(seed, 7280 + index) * 18 - 9,
    };
  });

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={skyTop} />
          <stop offset="100%" stopColor={skyBottom} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors(palette.paper, "#ffffff", 0.24)} />
          <stop offset="100%" stopColor={mixColors(palette.paper, palette.soft, 0.18)} />
        </linearGradient>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      <path d={outerPath} fill={mixColors(palette.border, palette.soft, 0.62)} opacity="0.14" transform="translate(0.68 0.88)" />
      <g clipPath={`url(#${sceneClip})`}>
        <rect x="0" y="0" width={width} height={height} fill={`url(#${outerId})`} />
        {Array.from({ length: 8 }).map((_, index) => {
          const trunkWidth = width * (0.018 + seeded(seed, 7247 + index) * 0.016);
          const trunkHeight = height * (0.56 + seeded(seed, 7257 + index) * 0.18);
          const x = width * (0.04 + index * 0.12 + seeded(seed, 7267 + index) * 0.04);
          const y = height * (0.14 + seeded(seed, 7277 + index) * 0.05);
          return (
            <g key={`mushroom-far-trunk-${index}`} opacity={0.18 + seeded(seed, 7287 + index) * 0.12}>
              <rect
                x={x}
                y={y}
                width={trunkWidth}
                height={trunkHeight}
                rx={trunkWidth * 0.45}
                fill={farTrunk}
              />
              <path
                d={`M ${x + trunkWidth * 0.52} ${y + trunkHeight * (0.22 + seeded(seed, 7297 + index) * 0.12)} C ${x + trunkWidth * 1.2} ${y + trunkHeight * (0.18 + seeded(seed, 7307 + index) * 0.12)}, ${x + trunkWidth * 1.46} ${y + trunkHeight * (0.12 + seeded(seed, 7317 + index) * 0.12)}, ${x + trunkWidth * 1.78} ${y + trunkHeight * (0.08 + seeded(seed, 7327 + index) * 0.12)}`}
                fill="none"
                stroke={mixColors(farTrunk, palette.paper, 0.14)}
                strokeWidth={trunkWidth * 0.14}
                strokeLinecap="round"
              />
            </g>
          );
        })}
        {Array.from({ length: 6 }).map((_, index) => {
          const trunkWidth = width * (0.024 + seeded(seed, 7337 + index) * 0.018);
          const trunkHeight = height * (0.48 + seeded(seed, 7347 + index) * 0.18);
          const x = width * (0.08 + index * 0.15 + seeded(seed, 7357 + index) * 0.05);
          const y = height * (0.24 + seeded(seed, 7367 + index) * 0.06);
          return (
            <g key={`mushroom-mid-trunk-${index}`} opacity={0.26 + seeded(seed, 7377 + index) * 0.14}>
              <rect
                x={x}
                y={y}
                width={trunkWidth}
                height={trunkHeight}
                rx={trunkWidth * 0.46}
                fill={midTrunk}
              />
              <path
                d={`M ${x + trunkWidth * 0.5} ${y + trunkHeight * (0.36 + seeded(seed, 7387 + index) * 0.16)} C ${x + trunkWidth * 1.24} ${y + trunkHeight * (0.34 + seeded(seed, 7397 + index) * 0.12)}, ${x + trunkWidth * 1.6} ${y + trunkHeight * (0.28 + seeded(seed, 7407 + index) * 0.12)}, ${x + trunkWidth * 1.94} ${y + trunkHeight * (0.22 + seeded(seed, 7417 + index) * 0.12)}`}
                fill="none"
                stroke={mixColors(midTrunk, palette.paper, 0.16)}
                strokeWidth={trunkWidth * 0.13}
                strokeLinecap="round"
              />
            </g>
          );
        })}
        <path d={rollingHillPath(width, height, height * 0.74, height * 0.08, seed, 7290)} fill={hillFar} opacity="0.74" />
        <path d={rollingHillPath(width, height, height * 0.86, height * 0.06, seed, 7300)} fill={hillNear} opacity="0.88" />
        <path d={`M 0 ${height * 0.9} C ${width * 0.18} ${height * 0.85}, ${width * 0.36} ${height * 0.95}, ${width * 0.54} ${height * 0.9} C ${width * 0.72} ${height * 0.84}, ${width * 0.9} ${height * 0.95}, ${width} ${height * 0.9} V ${height} H 0 Z`} fill={soil} opacity="0.86" />

        {Array.from({ length: 12 }).map((_, index) => (
          <path
            key={`mushroom-grass-${index}`}
            d={`M ${width * (0.06 + seeded(seed, 7310 + index) * 0.88)} ${height * (0.89 + seeded(seed, 7320 + index) * 0.06)} C ${width * (0.08 + seeded(seed, 7330 + index) * 0.84)} ${height * (0.77 + seeded(seed, 7340 + index) * 0.06)}, ${width * (0.09 + seeded(seed, 7350 + index) * 0.82)} ${height * (0.73 + seeded(seed, 7360 + index) * 0.08)}, ${width * (0.08 + seeded(seed, 7370 + index) * 0.84)} ${height * (0.69 + seeded(seed, 7380 + index) * 0.08)}`}
            fill="none"
            stroke={mixColors(palette.soft, palette.border, 0.34)}
            strokeWidth={0.14 + seeded(seed, 7390 + index) * 0.08}
            strokeLinecap="round"
            opacity="0.52"
          />
        ))}

        {mushrooms.map((mushroom, index) => {
          const capWidth = 3.4 * mushroom.scale;
          const capHeight = 1.7 * mushroom.scale;
          const stemHeight = 2.1 * mushroom.scale;
          const stemWidth = 0.9 * mushroom.scale;
          return (
            <g key={`mushroom-${index}`} transform={`translate(${mushroom.x} ${mushroom.y}) rotate(${mushroom.lean})`}>
              <rect
                x={-stemWidth * 0.5}
                y={-stemHeight}
                width={stemWidth}
                height={stemHeight}
                rx={stemWidth * 0.42}
                fill={stem}
                opacity="0.96"
              />
              <path
                d={`M ${-capWidth} ${-stemHeight + capHeight * 0.9} C ${-capWidth * 0.8} ${-stemHeight - capHeight * 0.92}, ${capWidth * 0.8} ${-stemHeight - capHeight * 0.92}, ${capWidth} ${-stemHeight + capHeight * 0.9} Q 0 ${-stemHeight + capHeight * 0.48} ${-capWidth} ${-stemHeight + capHeight * 0.9} Z`}
                fill={mushroom.cap}
              />
              <ellipse cx="0" cy={-stemHeight + capHeight * 0.84} rx={capWidth * 0.78} ry={capHeight * 0.34} fill={mixColors(mushroom.cap, stem, 0.44)} opacity="0.82" />
              {Array.from({ length: 4 }).map((__, dotIndex) => (
                <circle
                  key={`mushroom-dot-${index}-${dotIndex}`}
                  cx={-capWidth * 0.45 + dotIndex * (capWidth * 0.3) + seeded(seed, 7400 + index * 7 + dotIndex) * 0.22}
                  cy={-stemHeight - capHeight * 0.26 + seeded(seed, 7410 + index * 7 + dotIndex) * 0.46}
                  r={0.16 * mushroom.scale + seeded(seed, 7420 + index * 7 + dotIndex) * 0.08}
                  fill={dots}
                  opacity="0.86"
                />
              ))}
            </g>
          );
        })}

        {Array.from({ length: 16 }).map((_, index) =>
          index % 3 === 0 ? (
            <path
              key={`mushroom-sparkle-${index}`}
              d={sparklePath(
                width * (0.08 + seeded(seed, 7430 + index) * 0.84),
                height * (0.08 + seeded(seed, 7440 + index) * 0.34),
                0.22 + seeded(seed, 7450 + index) * 0.24,
                0.08 + seeded(seed, 7460 + index) * 0.1,
              )}
              fill={mixColors("#fff8e9", palette.paper, 0.06)}
              opacity="0.7"
            />
          ) : (
            <circle
              key={`mushroom-dot-air-${index}`}
              cx={width * (0.08 + seeded(seed, 7430 + index) * 0.84)}
              cy={height * (0.08 + seeded(seed, 7440 + index) * 0.34)}
              r={0.14 + seeded(seed, 7450 + index) * 0.12}
              fill={index % 2 === 0 ? mixColors(palette.pop, palette.paper, 0.18) : mixColors(palette.accent, palette.paper, 0.14)}
              opacity="0.48"
            />
          ),
        )}
      </g>
      <path d={outerPath} fill="none" stroke={mixColors(palette.border, palette.paper, 0.12)} strokeWidth="1.02" />
      <path d={roundedRectPath(4.1, 4.1, width - 8.2, height - 8.2, 4.5)} fill="none" stroke={mixColors(palette.border, palette.paper, 0.24)} strokeWidth="0.66" opacity="0.74" />
      <path d={panelPath} fill={mixColors(palette.border, palette.paper, 0.92)} opacity="0.06" transform="translate(0.4 0.52)" />
      <path d={panelPath} fill={`url(#${panelId})`} fillOpacity="0.84" stroke={mixColors(palette.border, palette.paper, 0.2)} strokeWidth="0.48" />
      <path d={panelPath} fill="none" stroke={mixColors("#ffffff", palette.paper, 0.42)} strokeWidth="0.18" transform="translate(0 0.22)" opacity="0.74" />
      <QuestionText clipId={clipId} layout={layout} ink={mixColors(palette.ink, palette.paper, 0.18)} lines={lines} />
    </g>
  );
}

function RibbonsTheme(props: {
  width: number;
  height: number;
  palette: Palette;
  layout: QuestionLayout;
  clipId: string;
  lines: string[];
  seed: number;
  cardId: string;
}) {
  const { width, height, palette, layout, clipId, lines, seed, cardId } = props;
  const outerId = `${cardId}-ribbons-outer`;
  const panelId = `${cardId}-ribbons-panel`;
  const sceneClip = `${cardId}-ribbons-clip`;
  const outerPath = roundedRectPath(1.15, 1.15, width - 2.3, height - 2.3, 5.3);
  const innerPath = roundedRectPath(4.2, 4.2, width - 8.4, height - 8.4, 4.4);
  const panelPath = roundedRectPath(
    layout.x - 0.44,
    layout.y - 0.44,
    layout.width + 0.88,
    layout.height + 0.88,
    Math.max(2.4, layout.rx - 0.18),
  );
  const ribbonColors = [
    enrichColor(mixColors("#ffa2bf", palette.accent, 0.08), { saturationMult: 1.24, lightnessShift: 0.02 }),
    enrichColor(mixColors("#f9d783", palette.pop, 0.08), { saturationMult: 1.18, lightnessShift: 0.02 }),
    enrichColor(mixColors("#9fe0dc", palette.soft, 0.12), { saturationMult: 1.08, lightnessShift: -0.01 }),
    enrichColor(mixColors("#d7b8fb", palette.soft, 0.16), { saturationMult: 1.14, lightnessShift: 0.02 }),
  ];

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors(palette.paper, "#ffffff", 0.2)} />
          <stop offset="100%" stopColor={mixColors(palette.soft, palette.paper, 0.16)} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors(palette.paper, "#ffffff", 0.22)} />
          <stop offset="100%" stopColor={mixColors(palette.paper, palette.soft, 0.18)} />
        </linearGradient>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      <path d={outerPath} fill={mixColors(palette.border, palette.soft, 0.62)} opacity="0.12" transform="translate(0.68 0.86)" />
      <path d={outerPath} fill={`url(#${outerId})`} stroke={mixColors(palette.border, palette.paper, 0.12)} strokeWidth="1.02" />
      <g clipPath={`url(#${sceneClip})`}>
        {Array.from({ length: 10 }).map((_, index) => {
          const startY = height * (0.14 + index * 0.07 + seeded(seed, 7500 + index) * 0.03);
          const stroke = ribbonColors[index % ribbonColors.length] ?? palette.accent;
          return (
            <path
              key={`ribbon-${index}`}
              d={`M ${-width * 0.02} ${startY} C ${width * 0.16} ${startY - height * (0.12 + seeded(seed, 7510 + index) * 0.04)}, ${width * 0.34} ${startY + height * (0.12 + seeded(seed, 7520 + index) * 0.05)}, ${width * 0.5} ${startY} C ${width * 0.66} ${startY - height * (0.12 + seeded(seed, 7530 + index) * 0.04)}, ${width * 0.84} ${startY + height * (0.12 + seeded(seed, 7540 + index) * 0.05)}, ${width * 1.02} ${startY}`}
              fill="none"
              stroke={stroke}
              strokeWidth={0.36 + seeded(seed, 7550 + index) * 0.24}
              strokeLinecap="round"
              opacity={0.7 + seeded(seed, 7560 + index) * 0.18}
            />
          );
        })}

        {Array.from({ length: 6 }).map((_, index) => {
          const x = width * (0.12 + seeded(seed, 7570 + index) * 0.76);
          const y = height * (0.18 + seeded(seed, 7580 + index) * 0.6);
          const scale = 0.56 + seeded(seed, 7590 + index) * 0.4;
          const color = ribbonColors[(index + 1) % ribbonColors.length] ?? palette.accent;
          return (
            <g key={`bow-${index}`} transform={`translate(${x} ${y}) scale(${scale}) rotate(${seeded(seed, 7600 + index) * 24 - 12})`}>
              <ellipse cx="-0.92" cy="0" rx="1.1" ry="0.7" fill={color} transform="rotate(-18 -0.92 0)" />
              <ellipse cx="0.92" cy="0" rx="1.1" ry="0.7" fill={mixColors(color, palette.paper, 0.06)} transform="rotate(18 0.92 0)" />
              <rect x={-0.24} y={-0.44} width={0.48} height={0.88} rx={0.18} fill={mixColors(palette.border, color, 0.28)} />
              <path d="M -0.22 0.32 L -0.72 1.46 L -0.08 0.94 Z" fill={mixColors(color, palette.pop, 0.2)} />
              <path d="M 0.22 0.32 L 0.72 1.46 L 0.08 0.94 Z" fill={mixColors(color, palette.paper, 0.08)} />
            </g>
          );
        })}

        {Array.from({ length: 18 }).map((_, index) => (
          index % 4 === 0 ? (
            <path
              key={`ribbon-star-${index}`}
              d={sparklePath(
                width * (0.08 + seeded(seed, 7610 + index) * 0.84),
                height * (0.08 + seeded(seed, 7620 + index) * 0.76),
                0.2 + seeded(seed, 7630 + index) * 0.18,
                0.08 + seeded(seed, 7640 + index) * 0.08,
              )}
              fill={mixColors("#fff7ec", palette.pop, 0.1)}
              opacity="0.74"
            />
          ) : (
            <circle
              key={`ribbon-dot-${index}`}
              cx={width * (0.08 + seeded(seed, 7610 + index) * 0.84)}
              cy={height * (0.08 + seeded(seed, 7620 + index) * 0.76)}
              r={0.13 + seeded(seed, 7630 + index) * 0.14}
              fill={index % 2 === 0 ? palette.pop : palette.accent}
              opacity="0.5"
            />
          )
        ))}
      </g>
      <path d={innerPath} fill="none" stroke={mixColors(palette.border, palette.paper, 0.22)} strokeWidth="0.64" opacity="0.72" />

      <path d={panelPath} fill={mixColors(palette.border, palette.paper, 0.92)} opacity="0.06" transform="translate(0.4 0.5)" />
      <path d={panelPath} fill={`url(#${panelId})`} fillOpacity="0.84" stroke={mixColors(palette.border, palette.paper, 0.2)} strokeWidth="0.48" />
      <path d={panelPath} fill="none" stroke={mixColors("#ffffff", palette.paper, 0.4)} strokeWidth="0.18" transform="translate(0 0.22)" opacity="0.72" />
      <QuestionText clipId={clipId} layout={layout} ink={mixColors(palette.ink, palette.paper, 0.18)} lines={lines} />
    </g>
  );
}

function FruitsTheme(props: {
  width: number;
  height: number;
  palette: Palette;
  layout: QuestionLayout;
  clipId: string;
  lines: string[];
  seed: number;
  cardId: string;
}) {
  const { width, height, palette, layout, clipId, lines, seed, cardId } = props;
  const outerId = `${cardId}-fruits-outer`;
  const panelId = `${cardId}-fruits-panel`;
  const sceneClip = `${cardId}-fruits-clip`;
  const outerPath = roundedRectPath(1.15, 1.15, width - 2.3, height - 2.3, 5.3);
  const innerPath = roundedRectPath(4.15, 4.15, width - 8.3, height - 8.3, 4.4);
  const panelPath = roundedRectPath(
    layout.x - 0.44,
    layout.y - 0.44,
    layout.width + 0.88,
    layout.height + 0.88,
    Math.max(2.4, layout.rx - 0.18),
  );
  const fruitPalette = [
    enrichColor(mixColors("#ff8da8", palette.accent, 0.04), { saturationMult: 1.42, lightnessShift: 0.01 }),
    enrichColor(mixColors("#ffc577", palette.pop, 0.04), { saturationMult: 1.34, lightnessShift: 0.02 }),
    enrichColor(mixColors("#9fe1bf", palette.soft, 0.08), { saturationMult: 1.18, lightnessShift: -0.04 }),
    enrichColor(mixColors("#caa7ef", palette.soft, 0.12), { saturationMult: 1.28, lightnessShift: 0.01 }),
    enrichColor(mixColors("#ffb784", palette.pop, 0.1), { saturationMult: 1.28, lightnessShift: 0.01 }),
  ];
  const leaf = enrichColor(mixColors("#9dd4a4", palette.soft, 0.16), {
    saturationMult: 1.08,
    lightnessShift: -0.04,
  });
  const stem = mixColors("#8b7a60", palette.border, 0.2);

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors(palette.paper, "#fffdf8", 0.08)} />
          <stop offset="100%" stopColor={mixColors(palette.soft, palette.paper, 0.16)} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors(palette.paper, "#ffffff", 0.22)} />
          <stop offset="100%" stopColor={mixColors(palette.paper, palette.soft, 0.18)} />
        </linearGradient>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      <path d={outerPath} fill={mixColors(palette.border, palette.soft, 0.62)} opacity="0.12" transform="translate(0.68 0.86)" />
      <path d={outerPath} fill={`url(#${outerId})`} stroke={mixColors(palette.border, palette.paper, 0.12)} strokeWidth="1.02" />
      <g clipPath={`url(#${sceneClip})`}>
        {Array.from({ length: 42 }).map((_, index) => {
          const x = width * (0.08 + seeded(seed, 7800 + index) * 0.84);
          const y = height * (0.12 + seeded(seed, 7810 + index) * 0.72);
          const scale = 0.52 + seeded(seed, 7820 + index) * 1.18;
          const color = fruitPalette[index % fruitPalette.length] ?? palette.accent;
          const kind = index % 4;
          const outline = mixColors(palette.border, color, 0.22);

          if (kind === 0) {
            return (
              <g key={`fruit-apple-${index}`} transform={`translate(${x} ${y}) scale(${scale}) rotate(${seeded(seed, 7830 + index) * 16 - 8})`} opacity={0.86}>
                <circle cx="-0.56" cy="0" r="0.9" fill={color} />
                <circle cx="0.56" cy="0" r="0.9" fill={mixColors(color, palette.paper, 0.04)} />
                <path d="M -0.92 0.2 Q 0 1.34 0.92 0.2" fill={mixColors(color, palette.paper, 0.1)} opacity="0.86" />
                <path d="M 0 -0.94 Q 0.12 -1.58 0.64 -1.9" fill="none" stroke={stem} strokeWidth="0.12" strokeLinecap="round" />
                <ellipse cx="0.84" cy="-1.66" rx="0.54" ry="0.26" fill={leaf} transform="rotate(20 0.84 -1.66)" />
                <circle cx="-0.56" cy="0" r="0.9" fill="none" stroke={outline} strokeWidth="0.06" opacity="0.48" />
                <circle cx="0.56" cy="0" r="0.9" fill="none" stroke={outline} strokeWidth="0.06" opacity="0.48" />
              </g>
            );
          }

          if (kind === 1) {
            return (
              <g key={`fruit-cherry-${index}`} transform={`translate(${x} ${y}) scale(${scale}) rotate(${seeded(seed, 7840 + index) * 14 - 7})`} opacity={0.84}>
                <circle cx="-0.48" cy="0.36" r="0.62" fill={color} />
                <circle cx="0.52" cy="0.18" r="0.62" fill={mixColors(color, palette.pop, 0.12)} />
                <path d="M -0.48 0.02 Q -0.3 -1.18 0.22 -1.72" fill="none" stroke={stem} strokeWidth="0.11" strokeLinecap="round" />
                <path d="M 0.52 -0.16 Q 0.44 -1.26 0.1 -1.78" fill="none" stroke={stem} strokeWidth="0.11" strokeLinecap="round" />
                <ellipse cx="0.34" cy="-1.78" rx="0.48" ry="0.22" fill={leaf} transform="rotate(-14 0.34 -1.78)" />
                <circle cx="-0.48" cy="0.36" r="0.62" fill="none" stroke={outline} strokeWidth="0.06" opacity="0.44" />
                <circle cx="0.52" cy="0.18" r="0.62" fill="none" stroke={outline} strokeWidth="0.06" opacity="0.44" />
              </g>
            );
          }

          if (kind === 2) {
            return (
              <g key={`fruit-strawberry-${index}`} transform={`translate(${x} ${y}) scale(${scale}) rotate(${seeded(seed, 7850 + index) * 18 - 9})`} opacity={0.86}>
                <path d="M 0 -1.24 C 1.08 -1.08 1.22 0.16 0.86 0.98 C 0.48 1.76 -0.48 1.76 -0.86 0.98 C -1.22 0.16 -1.08 -1.08 0 -1.24 Z" fill={color} stroke={outline} strokeWidth="0.06" />
                <path d="M -0.92 -1.06 Q -0.4 -1.66 0 -1.42 Q 0.4 -1.66 0.92 -1.06" fill={leaf} />
                {Array.from({ length: 4 }).map((__, dotIndex) => (
                  <circle key={`fruit-seed-${index}-${dotIndex}`} cx={-0.36 + dotIndex * 0.24} cy={-0.2 + (dotIndex % 2) * 0.44} r="0.07" fill={mixColors("#fff4da", palette.paper, 0.08)} />
                ))}
              </g>
            );
          }

          return (
            <g key={`fruit-citrus-${index}`} transform={`translate(${x} ${y}) scale(${scale}) rotate(${seeded(seed, 7860 + index) * 18 - 9})`} opacity={0.82}>
              <circle cx="0" cy="0" r="0.96" fill={color} stroke={outline} strokeWidth="0.06" />
              <path d="M -0.7 -0.08 L 0.7 -0.08 M -0.6 0.36 L 0.6 0.36" stroke={mixColors("#fff8e8", palette.paper, 0.08)} strokeWidth="0.08" opacity="0.82" />
              <ellipse cx="0.52" cy="-1.08" rx="0.42" ry="0.2" fill={leaf} transform="rotate(26 0.52 -1.08)" />
            </g>
          );
        })}

        {Array.from({ length: 20 }).map((_, index) => (
          index % 5 === 0 ? (
            <path
              key={`fruit-heart-${index}`}
              d={heartPath(
                width * (0.08 + seeded(seed, 7870 + index) * 0.84),
                height * (0.12 + seeded(seed, 7880 + index) * 0.72),
                0.34 + seeded(seed, 7890 + index) * 0.16,
              )}
              fill={mixColors("#ffd9e2", palette.accent, 0.12)}
              opacity="0.26"
            />
          ) : (
            <circle
              key={`fruit-dot-${index}`}
              cx={width * (0.08 + seeded(seed, 7870 + index) * 0.84)}
              cy={height * (0.12 + seeded(seed, 7880 + index) * 0.72)}
              r={0.12 + seeded(seed, 7890 + index) * 0.12}
              fill={index % 2 === 0 ? palette.pop : palette.accent}
              opacity="0.34"
            />
          )
        ))}
      </g>
      <path d={innerPath} fill="none" stroke={mixColors(palette.border, palette.paper, 0.22)} strokeWidth="0.64" opacity="0.72" />
      <path d={panelPath} fill={mixColors(palette.border, palette.paper, 0.92)} opacity="0.06" transform="translate(0.4 0.5)" />
      <path d={panelPath} fill={`url(#${panelId})`} fillOpacity="0.84" stroke={mixColors(palette.border, palette.paper, 0.2)} strokeWidth="0.48" />
      <path d={panelPath} fill="none" stroke={mixColors("#ffffff", palette.paper, 0.4)} strokeWidth="0.18" transform="translate(0 0.22)" opacity="0.72" />
      <QuestionText clipId={clipId} layout={layout} ink={mixColors(palette.ink, palette.paper, 0.18)} lines={lines} />
    </g>
  );
}

function KawaiiCloudsTheme(props: {
  width: number;
  height: number;
  palette: Palette;
  layout: QuestionLayout;
  clipId: string;
  lines: string[];
  seed: number;
  cardId: string;
}) {
  const { width, height, palette, layout, clipId, lines, seed, cardId } = props;
  const outerId = `${cardId}-clouds-outer`;
  const panelId = `${cardId}-clouds-panel`;
  const sceneClip = `${cardId}-clouds-clip`;
  const outerPath = roundedRectPath(1.15, 1.15, width - 2.3, height - 2.3, 5.3);
  const innerPath = roundedRectPath(4.15, 4.15, width - 8.3, height - 8.3, 4.4);
  const panelPath = roundedRectPath(
    layout.x - 0.44,
    layout.y - 0.44,
    layout.width + 0.88,
    layout.height + 0.88,
    Math.max(2.4, layout.rx - 0.18),
  );
  const skyTop = enrichColor(mixColors("#bfefff", palette.soft, 0.12), {
    saturationMult: 1.14,
    lightnessShift: 0.02,
  });
  const skyBottom = enrichColor(mixColors("#ffeaf8", palette.paper, 0.08), {
    hueShift: -8 + seeded(seed, 7900) * 16,
    saturationMult: 1.08,
    lightnessShift: 0.02,
  });
  const cloudFill = mixColors("#ffffff", palette.paper, 0.01);
  const cloudShade = mixColors("#c8e8f7", palette.soft, 0.12);
  const cloudOutline = enrichColor(mixColors("#8ec7d5", palette.border, 0.22), {
    saturationMult: 1.06,
    lightnessShift: 0.06,
  });
  const blush = mixColors("#ffc5d9", palette.accent, 0.04);

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={skyTop} />
          <stop offset="100%" stopColor={skyBottom} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors(palette.paper, "#ffffff", 0.22)} />
          <stop offset="100%" stopColor={mixColors(palette.paper, palette.soft, 0.18)} />
        </linearGradient>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      <path d={outerPath} fill={mixColors(palette.border, palette.soft, 0.62)} opacity="0.12" transform="translate(0.68 0.86)" />
      <path d={outerPath} fill={`url(#${outerId})`} stroke={mixColors(palette.border, palette.paper, 0.12)} strokeWidth="1.02" />
      <g clipPath={`url(#${sceneClip})`}>
        <circle cx={width * 0.18} cy={height * 0.16} r={height * 0.08} fill={mixColors("#fff4bc", palette.pop, 0.04)} opacity="0.92" />
        <circle cx={width * 0.18} cy={height * 0.16} r={height * 0.13} fill={mixColors("#fff9dc", palette.paper, 0.12)} opacity="0.26" />
        {Array.from({ length: 14 }).map((_, index) => {
          const x = width * (0.06 + seeded(seed, 7910 + index) * 0.82);
          const y = height * (0.16 + seeded(seed, 7920 + index) * 0.58);
          const scale = 0.88 + seeded(seed, 7930 + index) * 1.02;
          return (
            <g key={`cloud-${index}`} transform={`translate(${x} ${y}) scale(${scale})`} opacity={0.94 - (index % 3) * 0.08}>
              <path d={cloudPath(-2.8, -1.8, 5.8, 3.8)} fill={cloudFill} stroke={cloudOutline} strokeWidth="0.12" />
              <path d={cloudPath(-2.8, -1.68, 5.8, 3.6)} fill={cloudShade} opacity="0.34" />
              {index % 2 === 0 ? (
                <>
                  <circle cx="-0.6" cy="-0.2" r="0.11" fill={mixColors(palette.ink, palette.paper, 0.02)} />
                  <circle cx="0.58" cy="-0.2" r="0.11" fill={mixColors(palette.ink, palette.paper, 0.02)} />
                  <path d="M -0.42 0.3 Q 0 0.64 0.42 0.3" fill="none" stroke={mixColors(palette.border, palette.paper, 0.02)} strokeWidth="0.1" strokeLinecap="round" />
                  <circle cx="-1.02" cy="0.12" r="0.16" fill={blush} opacity="0.76" />
                  <circle cx="1.02" cy="0.12" r="0.16" fill={blush} opacity="0.76" />
                </>
              ) : null}
            </g>
          );
        })}

        {Array.from({ length: 18 }).map((_, index) => (
          index % 4 === 0 ? (
            <path
              key={`cloud-star-${index}`}
              d={sparklePath(
                width * (0.08 + seeded(seed, 7940 + index) * 0.84),
                height * (0.08 + seeded(seed, 7950 + index) * 0.78),
                0.22 + seeded(seed, 7960 + index) * 0.22,
                0.08 + seeded(seed, 7970 + index) * 0.08,
              )}
              fill={mixColors("#fff5c8", palette.pop, 0.1)}
              opacity="0.78"
            />
          ) : (
            <circle
              key={`cloud-dot-${index}`}
              cx={width * (0.08 + seeded(seed, 7940 + index) * 0.84)}
              cy={height * (0.08 + seeded(seed, 7950 + index) * 0.78)}
              r={0.12 + seeded(seed, 7960 + index) * 0.12}
              fill={index % 2 === 0 ? palette.pop : palette.accent}
              opacity="0.42"
            />
          )
        ))}

        {Array.from({ length: 8 }).map((_, index) => (
          <path
            key={`cloud-rainbow-${index}`}
            d={`M ${width * (0.08 + seeded(seed, 7980 + index) * 0.84)} ${height * (0.28 + seeded(seed, 7990 + index) * 0.42)} q ${1.2 + seeded(seed, 8000 + index) * 0.8} ${1 + seeded(seed, 8010 + index) * 0.4} ${2.4 + seeded(seed, 8020 + index) * 0.9} 0`}
            fill="none"
            stroke={index % 2 === 0 ? mixColors(palette.accent, palette.paper, 0.06) : mixColors(palette.soft, palette.paper, 0.06)}
            strokeWidth="0.22"
            strokeLinecap="round"
            opacity="0.56"
          />
        ))}
      </g>
      <path d={innerPath} fill="none" stroke={mixColors(palette.border, palette.paper, 0.22)} strokeWidth="0.64" opacity="0.72" />
      <path d={panelPath} fill={mixColors(palette.border, palette.paper, 0.92)} opacity="0.06" transform="translate(0.4 0.5)" />
      <path d={panelPath} fill={`url(#${panelId})`} fillOpacity="0.84" stroke={mixColors(palette.border, palette.paper, 0.2)} strokeWidth="0.48" />
      <path d={panelPath} fill="none" stroke={mixColors("#ffffff", palette.paper, 0.4)} strokeWidth="0.18" transform="translate(0 0.22)" opacity="0.72" />
      <QuestionText clipId={clipId} layout={layout} ink={mixColors(palette.ink, palette.paper, 0.18)} lines={lines} />
    </g>
  );
}

function BowsTheme(props: {
  width: number;
  height: number;
  palette: Palette;
  layout: QuestionLayout;
  clipId: string;
  lines: string[];
  seed: number;
  cardId: string;
}) {
  const { width, height, palette, layout, clipId, lines, seed, cardId } = props;
  const outerId = `${cardId}-bows-outer`;
  const panelId = `${cardId}-bows-panel`;
  const outerPath = roundedRectPath(1.2, 1.2, width - 2.4, height - 2.4, 5.4);
  const innerPath = roundedRectPath(4, 4, width - 8, height - 8, 4.2);
  const panelPath = roundedRectPath(layout.x - 0.44, layout.y - 0.44, layout.width + 0.88, layout.height + 0.88, Math.max(2.5, layout.rx - 0.16));
  const butterflyColors = [
    mixColors("#f5a8bd", palette.accent, 0.14),
    mixColors("#a6d8d5", palette.soft, 0.18),
    mixColors("#f7cf87", palette.pop, 0.12),
    mixColors("#d7b9ee", palette.accent, 0.2),
    mixColors("#ffb9a2", palette.pop, 0.16),
  ];
  const butterflies = Array.from({ length: 18 }).map((_, index) => ({
    x: width * (0.1 + seeded(seed, 1800 + index) * 0.8),
    y: height * (0.14 + seeded(seed, 1820 + index) * 0.7),
    scale: 0.42 + seeded(seed, 1840 + index) * 0.58,
    angle: seeded(seed, 1860 + index) * 34 - 17,
    color: butterflyColors[index % butterflyColors.length],
    opacity: 0.42 + seeded(seed, 1880 + index) * 0.22,
  }));

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors(palette.paper, "#ffffff", 0.22)} />
          <stop offset="100%" stopColor={mixColors(palette.soft, palette.paper, 0.2)} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors(palette.paper, "#ffffff", 0.18)} />
          <stop offset="100%" stopColor={mixColors(palette.paper, palette.soft, 0.16)} />
        </linearGradient>
      </defs>

      <path d={outerPath} fill={mixColors(palette.border, palette.soft, 0.64)} opacity="0.12" transform="translate(0.68 0.9)" />
      <path d={outerPath} fill={`url(#${outerId})`} stroke={mixColors(palette.border, palette.paper, 0.14)} strokeWidth="1.06" />
      <path d={innerPath} fill="none" stroke={mixColors(palette.border, palette.paper, 0.24)} strokeWidth="0.66" opacity="0.72" />
      {butterflies.map((butterfly, index) => (
        <g
          key={`butterfly-${index}`}
          transform={`translate(${butterfly.x} ${butterfly.y}) rotate(${butterfly.angle}) scale(${butterfly.scale})`}
          opacity={butterfly.opacity}
        >
          <ellipse cx="-1.36" cy="-0.98" rx="1.18" ry="1.64" fill={butterfly.color} transform="rotate(-24 -1.36 -0.98)" />
          <ellipse cx="1.36" cy="-0.98" rx="1.18" ry="1.64" fill={mixColors(butterfly.color, palette.paper, 0.04)} transform="rotate(24 1.36 -0.98)" />
          <ellipse cx="-0.96" cy="1.02" rx="0.84" ry="1.08" fill={mixColors(butterfly.color, palette.soft, 0.12)} transform="rotate(18 -0.96 1.02)" />
          <ellipse cx="0.96" cy="1.02" rx="0.84" ry="1.08" fill={mixColors(butterfly.color, palette.paper, 0.08)} transform="rotate(-18 0.96 1.02)" />
          <rect x={-0.24} y={-1.68} width={0.48} height={3.5} rx={0.2} fill={mixColors(palette.border, butterfly.color, 0.28)} />
          <circle cx="0" cy="-1.86" r="0.24" fill={mixColors(palette.border, palette.paper, 0.12)} />
          <path d="M -0.08 -1.86 Q -0.58 -2.74 -1.12 -2.78" fill="none" stroke={mixColors(palette.border, palette.paper, 0.2)} strokeWidth="0.09" strokeLinecap="round" />
          <path d="M 0.08 -1.86 Q 0.58 -2.74 1.12 -2.78" fill="none" stroke={mixColors(palette.border, palette.paper, 0.2)} strokeWidth="0.09" strokeLinecap="round" />
          <path d="M -0.7 -0.8 C -1.02 -0.66 -1.18 -0.26 -1.1 0.12" fill="none" stroke={mixColors(palette.paper, butterfly.color, 0.14)} strokeWidth="0.08" opacity="0.54" />
          <path d="M 0.7 -0.8 C 1.02 -0.66 1.18 -0.26 1.1 0.12" fill="none" stroke={mixColors(palette.paper, butterfly.color, 0.14)} strokeWidth="0.08" opacity="0.54" />
        </g>
      ))}
      {Array.from({ length: 22 }).map((_, index) => (
        <circle
          key={`butterfly-dot-${index}`}
          cx={width * (0.06 + seeded(seed, 1900 + index) * 0.88)}
          cy={height * (0.1 + seeded(seed, 1920 + index) * 0.8)}
          r={0.14 + seeded(seed, 1940 + index) * 0.18}
          fill={index % 3 === 0 ? palette.pop : index % 2 === 0 ? palette.accent : mixColors(palette.soft, palette.paper, 0.06)}
          opacity={0.56}
        />
      ))}
      {Array.from({ length: 8 }).map((_, index) => (
        <path
          key={`butterfly-trail-${index}`}
          d={`M ${width * (0.08 + seeded(seed, 2010 + index) * 0.82)} ${height * (0.14 + seeded(seed, 2030 + index) * 0.7)} C ${width * (0.14 + seeded(seed, 2050 + index) * 0.74)} ${height * (0.2 + seeded(seed, 2070 + index) * 0.56)}, ${width * (0.18 + seeded(seed, 2090 + index) * 0.7)} ${height * (0.12 + seeded(seed, 2110 + index) * 0.66)}, ${width * (0.22 + seeded(seed, 2130 + index) * 0.66)} ${height * (0.18 + seeded(seed, 2150 + index) * 0.54)}`}
          fill="none"
          stroke={mixColors(palette.soft, palette.paper, 0.12)}
          strokeWidth="0.16"
          strokeLinecap="round"
          strokeDasharray="0.48 0.64"
          opacity="0.34"
        />
      ))}
      {Array.from({ length: 6 }).map((_, index) => (
        <path
          key={`butterfly-heart-${index}`}
          d={heartPath(
            width * (0.12 + seeded(seed, 1960 + index) * 0.76),
            height * (0.16 + seeded(seed, 1980 + index) * 0.68),
            0.42 + seeded(seed, 2000 + index) * 0.22,
          )}
          fill={mixColors("#ffd7df", palette.accent, 0.1)}
          opacity="0.28"
        />
      ))}
      <path d={panelPath} fill={mixColors(palette.border, palette.paper, 0.92)} opacity="0.06" transform="translate(0.4 0.52)" />
      <path d={panelPath} fill={`url(#${panelId})`} fillOpacity="0.84" stroke={mixColors(palette.border, palette.paper, 0.22)} strokeWidth="0.48" />
      <path d={panelPath} fill="none" stroke={mixColors("#ffffff", palette.paper, 0.4)} strokeWidth="0.18" transform="translate(0 0.22)" opacity="0.72" />
      <QuestionText clipId={clipId} layout={layout} ink={mixColors(palette.ink, palette.paper, 0.2)} lines={lines} />
    </g>
  );
}

function renderThemeArt(props: {
  width: number;
  height: number;
  palette: Palette;
  layout: QuestionLayout;
  clipId: string;
  lines: string[];
  themeId: ThemeId;
  seed: number;
  cardId: string;
}) {
  switch (props.themeId) {
    case "postage":
      return <PostageTheme {...props} />;
    case "moon":
      return <MoonTheme {...props} />;
    case "garden":
      return <GardenTheme {...props} />;
    case "garden-night":
      return <GardenNightTheme {...props} />;
    case "circus-night":
      return <CircusNightTheme {...props} />;
    case "cloud-mail":
      return <CloudMailTheme {...props} />;
    case "forest-cabin":
      return <ForestCabinTheme {...props} />;
    case "mushrooms":
      return <MushroomsTheme {...props} />;
    case "ribbons":
      return <RibbonsTheme {...props} />;
    case "fruits":
      return <FruitsTheme {...props} />;
    case "kawaii-clouds":
      return <KawaiiCloudsTheme {...props} />;
    case "sunny-kitchen":
      return <SunnyKitchenTheme {...props} />;
    case "desk-treasures":
      return <DeskTreasuresTheme {...props} />;
    case "flowers":
      return <FlowersTheme {...props} />;
    case "bows":
      return <BowsTheme {...props} />;
    case "rainbow":
      return <RainbowTheme {...props} />;
    case "stripes-vertical":
      return <VerticalStripesTheme {...props} />;
    case "stripes-horizontal":
      return <HorizontalStripesTheme {...props} />;
    case "hearts":
      return <HeartsTheme {...props} />;
    case "geometrics":
      return <GeometricsTheme {...props} />;
    case "stars":
      return <StarsTheme {...props} />;
    case "confetti":
      return <ConfettiTheme {...props} />;
    case "undersea":
      return <UnderseaTheme {...props} />;
    default:
      return <PostageTheme {...props} />;
  }
}

function LabelArt(props: ArtProps) {
  const { card, width, height, locale } = props;
  const tunedPalette = tunePalette(PALETTES[card.paletteIndex % PALETTES.length], card.seed);
  const palette = card.themeId === "garden-night" ? moonlitPalette(tunedPalette) : tunedPalette;
  const moodTemplate = getMoodTrackerTemplate(card.moodTemplateId);
  const layout =
    card.contentMode === "mood"
      ? getMoodLayout(
          localize(locale, getMoodTrackerTitle(moodTemplate.id)),
          getMoodTrackerRows(moodTemplate.id).map((row) => localize(locale, row)),
          width,
          height,
          card.themeId,
        )
      : getQuestionLayout(localize(locale, card.question.text), width, height, card.themeId);
  const clipId = `question-clip-${card.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  const cardId = `label-${card.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;

  return renderThemeArt({
    width,
    height,
    palette,
    layout,
    clipId,
    lines: layout.lines,
    themeId: card.themeId,
    seed: card.seed,
    cardId,
  });
}

export function LabelSvg(props: SharedProps) {
  const { size } = props;
  const ariaLabel =
    props.card.contentMode === "mood"
      ? localize(props.locale, getMoodTrackerTitle(props.card.moodTemplateId))
      : localize(props.locale, props.card.question.text);

  return (
    <svg
      viewBox={`0 0 ${size.widthMm} ${size.heightMm}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        <style>{SVG_FONT_IMPORT}</style>
      </defs>
      <LabelTypefaceContext.Provider value={props.typeface ?? "gochi"}>
        <LabelArt
          card={props.card}
          locale={props.locale}
          size={props.size}
          width={size.widthMm}
          height={size.heightMm}
        />
      </LabelTypefaceContext.Provider>
    </svg>
  );
}

export function LabelGroup(props: SharedProps & { x: number; y: number }) {
  const { size, x, y } = props;

  return (
    <g transform={`translate(${x} ${y})`}>
      <LabelTypefaceContext.Provider value={props.typeface ?? "gochi"}>
        <LabelArt
          card={props.card}
          locale={props.locale}
          size={size}
          width={size.widthMm}
          height={size.heightMm}
        />
      </LabelTypefaceContext.Provider>
    </g>
  );
}
