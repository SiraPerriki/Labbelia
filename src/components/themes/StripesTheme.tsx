import { Palette } from "../../types";
import { QuestionLayout } from "../../lib/measure";
import { plaquePath, QuestionText } from "./shared";
import { seeded, mixColors, enrichColor } from "../../lib/color";

export function StripesTheme(
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
  const stripeStory =
    stripeStories[Math.floor(seeded(seed, 5840) * stripeStories.length)] ?? stripeStories[0];
  const stripeColors = stripeStory.map((color, colorIndex) =>
    enrichColor(
      mixColors(
        color,
        colorIndex % 2 === 0 ? palette.accent : palette.pop,
        0.06 + seeded(seed, 5860 + colorIndex) * 0.18,
      ),
      {
        hueShift: (seeded(seed, 5890 + colorIndex) - 0.5) * 10,
        saturationMult: 1.12 + seeded(seed, 5920 + colorIndex) * 0.42,
        lightnessShift: -0.08 + seeded(seed, 5950 + colorIndex) * 0.08,
      },
    ),
  );
  stripeColors.push(
    enrichColor(mixColors("#ffffff", palette.paper, 0.04), {
      saturationMult: 0.82,
      lightnessShift: 0.02,
    }),
    enrichColor(mixColors("#ffd7e6", palette.soft, 0.12), {
      saturationMult: 1.1,
      lightnessShift: -0.03,
    }),
    enrichColor(mixColors("#b6f0de", palette.soft, 0.16), {
      saturationMult: 1.1,
      lightnessShift: -0.07,
    }),
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
    let size: number;
    let gap: number;
    let opacity: number;

    if (styleMode === "pinstripe") {
      const isHero = rhythm > 0.9;
      size = isHero
        ? 1.8 + seeded(seed, 6080 + index) * 2.8
        : 0.18 + seeded(seed, 6120 + index) * 0.78;
      gap = 0.02 + seeded(seed, 6160 + index) * (isHero ? 0.28 : 0.16);
      opacity = isHero ? 0.94 : 0.72 + seeded(seed, 6200 + index) * 0.16;
    } else if (styleMode === "candy") {
      const isHero = rhythm > 0.68;
      size = isHero
        ? 4.2 + seeded(seed, 6240 + index) * 5.8
        : 1.1 + seeded(seed, 6280 + index) * 3.4;
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
      size = isRibbon
        ? 3 + seeded(seed, 6720 + index) * 7.4
        : 0.4 + seeded(seed, 6760 + index) * 1.8;
      gap = 0.03 + seeded(seed, 6800 + index) * 0.2;
      opacity = isRibbon ? 0.95 : 0.74 + seeded(seed, 6840 + index) * 0.18;
    }

    bands.push({
      offset: cursor,
      size,
      color:
        stripeColors[(index + Math.floor(seeded(seed, 6880 + index) * 3)) % stripeColors.length],
      opacity,
    });
    cursor += size + gap;
    index += 1;
  }

  const accentCount =
    styleMode === "pinstripe" ? 34 : styleMode === "candy" ? 18 : styleMode === "grouped" ? 24 : 22;
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

      <path
        d={outerPath}
        fill={mixColors(palette.border, palette.soft, 0.72)}
        opacity="0.12"
        transform="translate(0.7 0.9)"
      />
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
          const shine = mixColors(
            "#ffffff",
            stripeColors[(glintIndex + 1) % stripeColors.length],
            0.18,
          );
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
      <path d={outerPath} fill="none" stroke={palette.border} strokeWidth="0.24" />
      <rect
        x={panel.x + 0.34}
        y={panel.y + 0.42}
        width={panel.width}
        height={panel.height}
        rx={panel.rx}
        fill={mixColors(palette.border, palette.paper, 0.76)}
        opacity="0.02"
      />
      <rect
        x={panel.x}
        y={panel.y}
        width={panel.width}
        height={panel.height}
        rx={panel.rx}
        fill={`url(#${panelId})`}
        fillOpacity="0.68"
        stroke={mixColors(palette.border, palette.paper, 0.18)}
        strokeWidth="0.18"
      />
      <QuestionText
        clipId={clipId}
        layout={layout}
        ink={mixColors(palette.ink, palette.paper, 0.18)}
        lines={lines}
      />
    </g>
  );
}
