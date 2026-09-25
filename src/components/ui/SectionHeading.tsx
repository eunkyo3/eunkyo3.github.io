/** Mono route label (`GET /`, `Service Layer`) above a large display heading. */
export function SectionHeading({
  id,
  route,
  node,
  title,
  description,
}: {
  id: string;
  route: string;
  node: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-10 sm:mb-14">
      <p className="font-mono text-xs tracking-[0.08em] text-accent uppercase">
        {route}
        <span className="text-muted"> · {node}</span>
      </p>
      <h2 id={id} className="mt-4 font-display text-4xl font-bold tracking-[-0.025em] sm:text-5xl">
        {title}
      </h2>
      {description && <p className="mt-4 max-w-xl text-muted">{description}</p>}
    </header>
  );
}
