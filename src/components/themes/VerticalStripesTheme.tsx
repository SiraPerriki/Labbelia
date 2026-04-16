import { Palette } from "../../types";
import { QuestionLayout } from "../../lib/measure";
import { StripesTheme } from "./StripesTheme";

export function VerticalStripesTheme(props: {
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
