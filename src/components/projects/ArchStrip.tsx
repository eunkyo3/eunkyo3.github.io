import type { Layer } from "@/content/types";

const LAYERS: { id: Layer; short: string; name: string }[] = [
  { id: "frontend", short: "FE", name: "Frontend" },
  { id: "backend", short: "BE", name: "Backend" },
  { id: "database", short: "DB", name: "Database" },
  { id: "infra", short: "Infra", name: "Infra" },
];

/** Four-layer architecture strip; the layers this person owned are drawn in the accent. */
export function ArchStrip({ owned }: { owned: Layer[] }) {
  const ownedNames = LAYERS.filter((l) => owned.includes(l.id)).map((l) => l.name);

  return (
    <figure>
      <ol className="flex items-center" aria-hidden>
        {LAYERS.map((layer, i) => {
          const mine = owned.includes(layer.id);
          return (
            <li key={layer.id} className="flex flex-1 items-center last:flex-none">
              <span
                className={`rounded-[2px] border px-2 py-1 font-mono text-[11px] leading-none tracking-[0.06em] uppercase ${
                  mine ? "border-accent bg-accent-soft text-accent" : "border-dashed border-line-strong text-muted"
                }`}
              >
                {layer.short}
              </span>
              {i < LAYERS.length - 1 && <span className="h-px min-w-3 flex-1 bg-line-strong" />}
            </li>
          );
        })}
      </ol>
      <figcaption className="mt-2 font-mono text-[11px] text-muted">
        <span aria-hidden className="mr-1.5 inline-block size-2 bg-accent align-middle" />
        담당 계층<span className="sr-only">: {ownedNames.join(", ")}</span>
      </figcaption>
    </figure>
  );
}
