// Prototype "why did you leave a Move" store backed by localStorage. Front-end
// only — no backend or moderation infrastructure. Reasons are optional and are
// private / moderation-facing: they are NEVER shown publicly and are NOT used as
// public reviews. Leaving a Move is never a no-show and never a trust penalty.

const LEAVE_REASONS_KEY = "brio_leave_reasons";

export interface LeaveReason {
  id: string;
  moveId: string;
  moveName: string;
  reasonType: string;
  details: string;
  createdAt: number;
  status: "submitted";
}

function read(): LeaveReason[] {
  try {
    const raw = localStorage.getItem(LEAVE_REASONS_KEY);
    return raw ? (JSON.parse(raw) as LeaveReason[]) : [];
  } catch {
    return [];
  }
}

export function getLeaveReasons(): LeaveReason[] {
  return read().sort((a, b) => b.createdAt - a.createdAt);
}

export function saveLeaveReason(input: {
  moveId: string;
  moveName: string;
  reasonType: string;
  details: string;
}): void {
  const list = read();
  list.push({
    id: "lr_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
    moveId: input.moveId,
    moveName: input.moveName,
    reasonType: input.reasonType,
    details: input.details,
    createdAt: Date.now(),
    status: "submitted",
  });
  try {
    localStorage.setItem(LEAVE_REASONS_KEY, JSON.stringify(list));
  } catch {
    // Ignore quota / serialization errors in the prototype.
  }
}
