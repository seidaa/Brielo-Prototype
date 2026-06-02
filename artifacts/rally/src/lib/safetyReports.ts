// Prototype safety / report store backed by localStorage. Front-end only — no
// backend or moderation infrastructure. Pre-Move "Something feels off" safety
// notes and post-Move formal reports are both stored here, distinguished by
// `reportContext`. Nothing here is ever shown publicly.

const SAFETY_REPORTS_KEY = "brio_safety_reports";

export type ReportContext = "preMove" | "postMove";

export interface SafetyReport {
  id: string;
  moveId: string;
  moveName: string;
  reportContext: ReportContext;
  reportType: string;
  details: string;
  createdAt: number;
  status: "submitted";
}

function read(): SafetyReport[] {
  try {
    const raw = localStorage.getItem(SAFETY_REPORTS_KEY);
    return raw ? (JSON.parse(raw) as SafetyReport[]) : [];
  } catch {
    return [];
  }
}

export function getSafetyReports(): SafetyReport[] {
  return read().sort((a, b) => b.createdAt - a.createdAt);
}

export function saveSafetyReport(input: {
  moveId: string;
  moveName: string;
  reportContext: ReportContext;
  reportType: string;
  details: string;
}): void {
  const list = read();
  list.push({
    id: "sr_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
    moveId: input.moveId,
    moveName: input.moveName,
    reportContext: input.reportContext,
    reportType: input.reportType,
    details: input.details,
    createdAt: Date.now(),
    status: "submitted",
  });
  try {
    localStorage.setItem(SAFETY_REPORTS_KEY, JSON.stringify(list));
  } catch {
    // Ignore quota / serialization errors in the prototype.
  }
}
