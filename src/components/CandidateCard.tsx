import { LabelCard, LabelSize, Locale } from "../types";
import { LabelSvg } from "./LabelSvg";

interface CandidateCardProps {
  card: LabelCard;
  size: LabelSize;
  locale: Locale;
  onDownload: (card: LabelCard) => void;
  onRefreshLook: () => void;
  onRefreshQuestion?: () => void;
  downloadLabel: string;
  refreshLookLabel: string;
  refreshQuestionLabel?: string;
}

export function CandidateCard(props: CandidateCardProps) {
  const { card, locale, size } = props;

  return (
    <article className="candidate-card">
      <div className={`candidate-preview candidate-preview-${size.id}`}>
        <div className="candidate-preview-toolbar">
          <button
            className="preview-chip"
            onClick={props.onRefreshLook}
            type="button"
          >
            {props.refreshLookLabel}
          </button>
          {props.onRefreshQuestion && props.refreshQuestionLabel ? (
            <button
              className="preview-chip"
              onClick={props.onRefreshQuestion}
              type="button"
            >
              {props.refreshQuestionLabel}
            </button>
          ) : null}
        </div>
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
