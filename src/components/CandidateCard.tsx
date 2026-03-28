import { LabelCard, LabelSize, Locale } from "../types";
import { LabelSvg } from "./LabelSvg";

interface CandidateCardProps {
  card: LabelCard;
  size: LabelSize;
  locale: Locale;
  onDownload: (card: LabelCard) => void;
  downloadLabel: string;
}

export function CandidateCard(props: CandidateCardProps) {
  const { card, locale, size } = props;

  return (
    <article className="candidate-card">
      <div className="candidate-preview">
        <LabelSvg
          card={card}
          locale={locale}
          size={size}
        />
      </div>
      <div className="candidate-actions">
        <button
          className="text-button"
          onClick={() => props.onDownload(card)}
          type="button"
        >
          {props.downloadLabel}
        </button>
      </div>
    </article>
  );
}
