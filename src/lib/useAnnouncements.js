import { useEffect, useState } from "react";
import announcements from "../data/announcements";

const readKey = "clawbot:announcements:read";
const dismissedKey = "clawbot:announcements:dismissed";
const ids = new Set(announcements.map((item) => item.id));

function parseIds(value) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((id) => typeof id === "string" && ids.has(id))
      : [];
  } catch {
    return [];
  }
}
function readIds(key) {
  try {
    return parseIds(localStorage.getItem(key));
  } catch {
    return [];
  }
}
function saveIds(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* The controls still work when storage is unavailable. */
  }
}

export default function useAnnouncements() {
  const [read, setRead] = useState(() => readIds(readKey));
  const [dismissed, setDismissed] = useState(() => readIds(dismissedKey));
  const [open, setOpen] = useState(false);
  const [initialId, setInitialId] = useState(null);
  const featured = announcements.find(
    (item) => item.banner && !dismissed.includes(item.id),
  );
  const isUnread = (item) => item.notify !== false && !read.includes(item.id);
  const unreadCount = announcements.filter(isUnread).length;

  useEffect(() => saveIds(readKey, read), [read]);
  useEffect(() => saveIds(dismissedKey, dismissed), [dismissed]);
  useEffect(() => {
    const sync = (event) => {
      if (event.key === readKey || event.key === null)
        setRead(readIds(readKey));
      if (event.key === dismissedKey || event.key === null)
        setDismissed(readIds(dismissedKey));
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  function markRead(id) {
    if (ids.has(id))
      setRead((previous) =>
        previous.includes(id) ? previous : [...previous, id],
      );
  }
  function openUpdates(id = announcements[0]?.id) {
    setInitialId(id);
    markRead(id);
    setOpen(true);
  }
  return {
    items: announcements,
    featured,
    open,
    initialId,
    unreadCount,
    isUnread,
    openUpdates,
    markRead,
    closeUpdates: () => setOpen(false),
    markAllRead: () => setRead([...ids]),
    dismiss: (id) =>
      setDismissed((previous) =>
        previous.includes(id) ? previous : [...previous, id],
      ),
  };
}
