import type { Metric } from "@/content/types";

const SIZES = {
  xl: "text-[clamp(2.5rem,7vw,4.5rem)]",
  lg: "text-3xl sm:text-4xl",
  md: "text-2xl",
};

/** A result number, set large: `1.2s → 180ms`. */
export function MetricValue({ metric, size = "lg" }: { metric: Metric; size?: keyof typeof SIZES }) {
  return (
    <div>
      <p className="font-mono text-xs text-muted">{metric.label}</p>
      <p className={`mt-1 font-display leading-[1.05] font-bold tracking-[-0.035em] tabular-nums ${SIZES[size]}`}>
        {metric.before && (
          <>
            <span className="text-muted">{metric.before}</span>
            <span className="mx-[0.2em] text-accent" aria-hidden>
              →
            </span>
            <span className="sr-only">에서 </span>
          </>
        )}
        <span>{metric.after}</span>
      </p>
    </div>
  );
}
