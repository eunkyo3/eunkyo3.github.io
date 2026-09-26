export type Layer = "frontend" | "backend" | "database" | "infra";

export interface Link {
  label: string;
  href: string;
}

export interface Profile {
  /** Display name, set in the display face. */
  name: string;
  /** Name in Korean, shown small beside the display name. */
  nameLocal?: string;
  /** ASCII slug used in the hero request line: `GET /{handle}`. */
  handle: string;
  tagline: string;
  role: string;
  company: string;
  /** Career start, `YYYY-MM`. Tenure is computed from this, so it never goes stale. */
  startedAt: string;
  about: string[];
  competencies: { layer: string; title: string; detail: string }[];
  email: string;
  links: Link[];
  siteUrl: string;
}

export interface Metric {
  label: string;
  before?: string;
  after: string;
}

export interface Decision {
  title: string;
  chosen: string;
  /** Only alternatives that were actually weighed; leave empty rather than invent one. */
  alternatives: string[];
  reason: string;
}

/** A problem hit in the work and how it was traced. `result` only when measured. */
export interface Incident {
  title: string;
  symptom: string;
  cause: string;
  fix: string;
  result?: string;
}

/** One part of a multi-repo system, described on its own inside the parent project. */
export interface SystemComponent {
  name: string;
  /** What it is and what it runs on. */
  kind: string;
  /** What this person owned in it. */
  share: string;
  summary: string;
  points: string[];
}

export type ProjectOrg = "company" | "personal";

export interface Project {
  slug: string;
  title: string;
  org: ProjectOrg;
  summary: string;
  period: string;
  role: string;
  /** Short state label, e.g. `진행 중`. Omit for finished work. */
  status?: string;
  /** Customer or delivery line, anonymised (e.g. `국내 대기업 A사`). */
  client?: string;
  /** The first featured project of each group is rendered large. */
  featured?: boolean;
  problem: string;
  approach: string;
  metrics: Metric[];
  /** Layers this person owned, highlighted in the architecture strip. */
  layers: Layer[];
  stack: string[];
  why: string;
  links: { live?: string; github?: string };
  media?: { type: "video" | "image"; src: string; poster?: string; alt: string };
  components?: SystemComponent[];
  caseStudy?: {
    context: string;
    decisions: Decision[];
    incidents?: Incident[];
    retrospective: string;
  };
}

export interface StackItem {
  name: string;
  /** Where it was actually used — one line, no ratings. */
  usedIn: string;
}

export interface StackGroup {
  id: "frontend" | "backend" | "database" | "infra";
  table: string;
  items: StackItem[];
}

export interface LogEntry {
  /** `YYYY-MM` */
  date: string;
  level: "INFO";
  message: string;
  highlights?: string[];
}

export interface Credential {
  /** `YYYY-MM` — award / issue / completion month. */
  date: string;
  kind: "AWARD" | "CERT" | "EDU";
  title: string;
  /** Issuing body or organizer. */
  issuer?: string;
  /** For multi-month programs, e.g. `2024.07 ~ 2024.10`. Shown when expanded. */
  period?: string;
  /** Optional lines shown when the row is expanded. */
  details?: string[];
  /** Optional verification or project link. */
  url?: string;
}
