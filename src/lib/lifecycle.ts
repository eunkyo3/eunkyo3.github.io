/**
 * The page is one HTTP request travelling through the stack.
 * Each hop maps to a section id; `ms` is the latency that hop adds,
 * so the rail's running total ends exactly at the hero log's number.
 */
export interface Hop {
  id: string;
  node: string;
  detail: string;
  section: string;
  ms: number;
  /** Side-effect hop drawn off the main path (logs are written, not traversed). */
  branch?: boolean;
}

export const hops: Hop[] = [
  { id: "client", node: "Client", detail: "GET /", section: "top", ms: 0 },
  { id: "middleware", node: "Middleware", detail: "auth · parse", section: "about", ms: 2 },
  { id: "service", node: "Service", detail: "handler()", section: "projects", ms: 24 },
  { id: "database", node: "Database", detail: "SELECT *", section: "stack", ms: 11 },
  { id: "logs", node: "Logs", detail: "access.log", section: "experience", ms: 1, branch: true },
  { id: "response", node: "Response", detail: "200 OK", section: "contact", ms: 4 },
];

export const totalMs = hops.reduce((sum, h) => sum + h.ms, 0);

export function elapsedAt(index: number) {
  return hops.slice(0, index + 1).reduce((sum, h) => sum + h.ms, 0);
}
