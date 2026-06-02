// Lightweight prototype notification store backed by localStorage. Front-end only —
// no backend, push, or permissions. Key actions (join / leave / create / cancel /
// feedback) call pushNotification, which also dispatches a window event so any open
// view (e.g. the Discover bell dot) updates live without a navigation.

const NOTIF_KEY = "brio_notifications";
const MAX_NOTIFS = 50;
export const NOTIF_EVENT = "brio:notifications";

export type NotifKind = "join" | "leave" | "create" | "cancel" | "feedback" | "request" | "question" | "safety" | "report";

export interface AppNotification {
  id: string;
  kind: NotifKind;
  text: string;
  createdAt: number;
  read: boolean;
}

function read(): AppNotification[] {
  try {
    const raw = localStorage.getItem(NOTIF_KEY);
    return raw ? (JSON.parse(raw) as AppNotification[]) : [];
  } catch {
    return [];
  }
}

function write(list: AppNotification[]) {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(NOTIF_EVENT));
}

// Newest first.
export function getNotifications(): AppNotification[] {
  return read().sort((a, b) => b.createdAt - a.createdAt);
}

export function pushNotification(kind: NotifKind, text: string) {
  const list = read();
  list.push({
    id: "ntf_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
    kind,
    text,
    createdAt: Date.now(),
    read: false,
  });
  write(list.slice(-MAX_NOTIFS));
}

export function markAllNotificationsRead() {
  const list = read();
  if (!list.some(n => !n.read)) return;
  write(list.map(n => ({ ...n, read: true })));
}

// "now" / "2m ago" / "3h ago" / "Yesterday" / "4d ago"
export function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return "Yesterday";
  return `${d}d ago`;
}
