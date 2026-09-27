export function ExternalLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const isWeb = href.startsWith("http");
  return (
    <a
      href={href}
      {...(isWeb ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`-my-1 inline-flex items-center gap-1 py-1 font-mono text-[13px] text-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-fg hover:decoration-accent ${className}`}
    >
      {children}
      {isWeb && (
        <>
          <span aria-hidden>↗</span>
          <span className="sr-only">(새 창)</span>
        </>
      )}
    </a>
  );
}
