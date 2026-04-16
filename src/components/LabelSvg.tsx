import React, { Suspense } from "react";
const PostageTheme = React.lazy(() => import("./themes/PostageTheme").then(m => ({ default: m.PostageTheme })));
const MoonTheme = React.lazy(() => import("./themes/MoonTheme").then(m => ({ default: m.MoonTheme })));
const GardenTheme = React.lazy(() => import("./themes/GardenTheme").then(m => ({ default: m.GardenTheme })));
const GardenNightTheme = React.lazy(() => import("./themes/GardenNightTheme").then(m => ({ default: m.GardenNightTheme })));
const CircusNightTheme = React.lazy(() => import("./themes/CircusNightTheme").then(m => ({ default: m.CircusNightTheme })));
const CloudMailTheme = React.lazy(() => import("./themes/CloudMailTheme").then(m => ({ default: m.CloudMailTheme })));
const ForestCabinTheme = React.lazy(() => import("./themes/ForestCabinTheme").then(m => ({ default: m.ForestCabinTheme })));
const MushroomsTheme = React.lazy(() => import("./themes/MushroomsTheme").then(m => ({ default: m.MushroomsTheme })));
const RibbonsTheme = React.lazy(() => import("./themes/RibbonsTheme").then(m => ({ default: m.RibbonsTheme })));
const FruitsTheme = React.lazy(() => import("./themes/FruitsTheme").then(m => ({ default: m.FruitsTheme })));
const KawaiiCloudsTheme = React.lazy(() => import("./themes/KawaiiCloudsTheme").then(m => ({ default: m.KawaiiCloudsTheme })));
const SunnyKitchenTheme = React.lazy(() => import("./themes/SunnyKitchenTheme").then(m => ({ default: m.SunnyKitchenTheme })));
const DeskTreasuresTheme = React.lazy(() => import("./themes/DeskTreasuresTheme").then(m => ({ default: m.DeskTreasuresTheme })));
const FlowersTheme = React.lazy(() => import("./themes/FlowersTheme").then(m => ({ default: m.FlowersTheme })));
const BowsTheme = React.lazy(() => import("./themes/BowsTheme").then(m => ({ default: m.BowsTheme })));
const RainbowTheme = React.lazy(() => import("./themes/RainbowTheme").then(m => ({ default: m.RainbowTheme })));
const VerticalStripesTheme = React.lazy(() => import("./themes/VerticalStripesTheme").then(m => ({ default: m.VerticalStripesTheme })));
const HorizontalStripesTheme = React.lazy(() => import("./themes/HorizontalStripesTheme").then(m => ({ default: m.HorizontalStripesTheme })));
const HeartsTheme = React.lazy(() => import("./themes/HeartsTheme").then(m => ({ default: m.HeartsTheme })));
const GeometricsTheme = React.lazy(() => import("./themes/GeometricsTheme").then(m => ({ default: m.GeometricsTheme })));
const StarsTheme = React.lazy(() => import("./themes/StarsTheme").then(m => ({ default: m.StarsTheme })));
const ConfettiTheme = React.lazy(() => import("./themes/ConfettiTheme").then(m => ({ default: m.ConfettiTheme })));
const UnderseaTheme = React.lazy(() => import("./themes/UnderseaTheme").then(m => ({ default: m.UnderseaTheme })));
const MatchaCafeTheme = React.lazy(() => import("./themes/MatchaCafeTheme").then(m => ({ default: m.MatchaCafeTheme })));
import { PALETTES } from "../data/design";
import { getMoodTrackerRows, getMoodTrackerTemplate, getMoodTrackerTitle } from "../data/mood";
import { localize } from "../lib/i18n";
import { Palette, ThemeId } from "../types";
import { LabelTypefaceContext, SharedProps, ArtProps } from "./themes/shared";
import { getQuestionLayout, getMoodLayout, QuestionLayout } from "../lib/measure";
import { tunePalette, moonlitPalette } from "../lib/color";


export const SVG_FONT_IMPORT = `
  @import url("https://fonts.googleapis.com/css2?family=Gochi+Hand&family=Indie+Flower&family=Walter+Turncoat&family=Quicksand:wght@500;600;700&family=Zen+Maru+Gothic:wght@400;500;700;900&family=Yomogi&family=Yusei+Magic&display=swap");
`;

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
    case "matcha-cafe":
      return <MatchaCafeTheme {...props} />;
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
      <Suspense fallback={<g id="theme-loading" />} >
        <LabelTypefaceContext.Provider value={props.typeface ?? "gochi"}>
        <LabelArt
          card={props.card}
          locale={props.locale}
          size={props.size}
          width={size.widthMm}
          height={size.heightMm}
        />
      </LabelTypefaceContext.Provider>
      </Suspense>
    </svg>
  );
}

export function LabelGroup(props: SharedProps & { x: number; y: number }) {
  const { size, x, y } = props;

  return (
    <g transform={`translate(${x} ${y})`}>
      <Suspense fallback={<g id="theme-loading" />} >
        <LabelTypefaceContext.Provider value={props.typeface ?? "gochi"}>
        <LabelArt
          card={props.card}
          locale={props.locale}
          size={size}
          width={size.widthMm}
          height={size.heightMm}
        />
      </LabelTypefaceContext.Provider>
      </Suspense>
    </g>
  );
}
