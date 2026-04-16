import { ThemeId } from "../types";

export interface QuestionBox {
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number;
}

export interface QuestionLayout extends QuestionBox {
  lines: string[];
  fontSize: number;
  lineHeight: number;
  variant?: "question" | "mood";
  titleFontSize?: number;
  rowFontSize?: number;
  trackerLabelWidth?: number;
  trackerColumnGap?: number;
  trackerInnerPadding?: number;
  starSize?: number;
}

export interface QuestionBounds {
  centerX: number;
  centerY: number;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  rx: number;
}

export function splitText(text: string, maxChars: number): string[] {
  if (!text.includes(" ") && /[\u3040-\u30ff\u3400-\u9fff]/.test(text)) {
    const glyphs = Array.from(text);
    const lines: string[] = [];
    let current = "";
    const disallowedLineStart = /[、。，．！？）】」』〉》】〕〟ァィゥェォッャュョヮー]/;

    glyphs.forEach((glyph, index) => {
      current += glyph;
      const nextGlyph = glyphs[index + 1];

      if (current.length >= maxChars && (!nextGlyph || !disallowedLineStart.test(nextGlyph))) {
        lines.push(current);
        current = "";
      }
    });

    if (current) {
      lines.push(current);
    }

    return lines;
  }

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

export function measureLine(line: string): number {
  return Array.from(line).reduce((total, character) => {
    if (character === " ") {
      return total + 0.42;
    }

    if (/[\u3040-\u30ff\u3400-\u9fff]/.test(character)) {
      return total + 1.02;
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

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function getQuestionBounds(themeId: ThemeId, width: number, height: number): QuestionBounds {
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

export function layoutScore(
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

export function getQuestionLayout(
  text: string,
  width: number,
  height: number,
  themeId: ThemeId,
): QuestionLayout {
  const baseBounds = getQuestionBounds(themeId, width, height);
  const cjkLabel = /[\u3040-\u30ff\u3400-\u9fff]/.test(text);
  const compactLabel = height < 24;
  const mediumLabel = height < 34;
  const stripLabel = width / height > 2.45;
  const bounds = {
    ...baseBounds,
    minWidth: clamp(
      baseBounds.minWidth +
        (stripLabel ? width * (cjkLabel ? 0.19 : 0.12) : compactLabel ? width * 0.018 : 0),
      baseBounds.minWidth,
      width * (cjkLabel ? 0.9 : 0.82),
    ),
    maxWidth: clamp(
      baseBounds.maxWidth +
        (stripLabel
          ? width * (cjkLabel ? 0.31 : 0.21)
          : compactLabel
            ? width * 0.085
            : mediumLabel
              ? width * 0.05
              : 0),
      baseBounds.minWidth,
      width * (stripLabel ? (cjkLabel ? 0.985 : 0.95) : cjkLabel ? 0.88 : 0.82),
    ),
    minHeight: clamp(
      baseBounds.minHeight + (stripLabel ? height * 0.065 : compactLabel ? height * 0.02 : 0),
      baseBounds.minHeight,
      height * (cjkLabel ? 0.62 : 0.58),
    ),
    maxHeight: clamp(
      baseBounds.maxHeight +
        (stripLabel
          ? height * (cjkLabel ? 0.19 : 0.16)
          : compactLabel
            ? height * 0.14
            : mediumLabel
              ? height * 0.08
              : 0),
      baseBounds.minHeight,
      height * (stripLabel ? (cjkLabel ? 0.7 : 0.66) : cjkLabel ? 0.62 : 0.58),
    ),
  };
  const maxFontSize = stripLabel
    ? cjkLabel
      ? 3.76
      : 3.62
    : compactLabel
      ? 2.94
      : height >= 46
        ? 3.34
        : 3.02;
  const preferredMin = stripLabel
    ? cjkLabel
      ? 2.34
      : 2.22
    : compactLabel
      ? 1.84
      : height >= 46
        ? 2.04
        : 1.84;
  const absoluteMin = stripLabel
    ? cjkLabel
      ? 1.84
      : 1.74
    : compactLabel
      ? 1.38
      : height >= 46
        ? 1.48
        : 1.32;
  let best: QuestionLayout | null = null;
  let emergency: QuestionLayout | null = null;
  let bestScore = -Infinity;
  const baseHorizontalPaddingFactor = stripLabel
    ? themeId === "moon"
      ? 1.06
      : themeId === "garden" ||
          themeId === "undersea" ||
          themeId === "circus-night" ||
          themeId === "cloud-mail" ||
          themeId === "desk-treasures"
        ? 0.92
        : 1.2
    : themeId === "moon"
      ? 2.18
      : themeId === "garden" ||
          themeId === "undersea" ||
          themeId === "circus-night" ||
          themeId === "cloud-mail" ||
          themeId === "desk-treasures"
        ? 1.85
        : 3.1;
  const baseVerticalPaddingFactor = stripLabel
    ? themeId === "moon"
      ? 0.96
      : themeId === "garden" ||
          themeId === "undersea" ||
          themeId === "circus-night" ||
          themeId === "cloud-mail" ||
          themeId === "desk-treasures"
        ? 0.88
        : 1.02
    : themeId === "moon"
      ? 1.92
      : themeId === "garden" ||
          themeId === "undersea" ||
          themeId === "circus-night" ||
          themeId === "cloud-mail" ||
          themeId === "desk-treasures"
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
      fontSize: best.fontSize * (cjkLabel ? 1.04 : 1.02),
      lineHeight: best.lineHeight * (cjkLabel ? 1.03 : 1.02),
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

export function getMoodLayout(
  title: string,
  rows: string[],
  width: number,
  height: number,
  themeId: ThemeId,
): QuestionLayout {
  const squareish = width / height < 1.15;
  const cjkRows = rows.some((row) => /[\u3040-\u30ff\u3400-\u9fff]/.test(row));
  const baseBounds = getQuestionBounds(themeId, width, height);
  const bounds = {
    centerX: baseBounds.centerX,
    centerY: baseBounds.centerY + (squareish ? height * 0.01 : 0),
    minWidth: width * (squareish ? (cjkRows ? 0.78 : 0.74) : 0.56),
    maxWidth: width * (squareish ? (cjkRows ? 0.95 : 0.91) : 0.82),
    minHeight: height * (squareish ? 0.74 : 0.68),
    maxHeight: height * (squareish ? (cjkRows ? 0.89 : 0.86) : 0.84),
    rx: Math.max(4.4, baseBounds.rx),
  };
  const longestRow = rows.reduce((max, row) => Math.max(max, measureLine(row)), 1);

  for (
    let rowFont = height >= 60 ? 3.02 : height >= 46 ? 2.5 : 1.98;
    rowFont >= 1.32;
    rowFont -= 0.04
  ) {
    const titleFont = rowFont * 0.88;
    const starSize = rowFont * 0.66;
    const labelWidth = longestRow * rowFont * (cjkRows ? 1.1 : 1.03);
    const starSpan = starSize * 2 * 5 + starSize * 0.54 * 4;
    const rowGap = rowFont * (cjkRows ? 1.64 : 1.58);
    const columnGap = rowFont * (cjkRows ? 0.46 : 0.42);
    const innerPadding = rowFont * (cjkRows ? 0.22 : 0.3);
    const contentWidth = labelWidth + columnGap + starSpan + innerPadding * 2;
    const boxWidth = clamp(
      contentWidth + rowFont * (cjkRows ? 0.52 : 0.7),
      bounds.minWidth,
      bounds.maxWidth,
    );
    const boxHeight = clamp(
      rows.length * rowGap + rowFont * (cjkRows ? 1.42 : 1.56),
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
      trackerColumnGap: columnGap,
      trackerInnerPadding: innerPadding,
      starSize,
    };
  }

  const fallbackRowFont = squareish ? 1.78 : 1.42;

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
    trackerLabelWidth: longestRow * fallbackRowFont * (cjkRows ? 1.1 : 1.03),
    trackerColumnGap: fallbackRowFont * (cjkRows ? 0.46 : 0.42),
    trackerInnerPadding: fallbackRowFont * (cjkRows ? 0.22 : 0.3),
    starSize: fallbackRowFont * 0.66,
  };
}
