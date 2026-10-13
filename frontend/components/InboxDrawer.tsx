import { useState, useEffect } from "react";

type InboxItem = {
  id: string;
  url: string;
  title: string;
  saved_at: string;
};

export default function InboxDrawer() {
  const [inboxItems, setInboxItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInbox = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/inbox");
      const data = await res.json();
      // If backend returns a list directly or under an "inbox" key
      const items = Array.isArray(data) ? data : data.inbox || [];
      setInboxItems(items);
    } catch (err) {
      console.error("Failed to fetch inbox:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
    // Poll inbox every 10 seconds for real-time Chrome Extension / test updates
    const interval = setInterval(fetchInbox, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/inbox/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      const items = Array.isArray(data.inbox) ? data.inbox : inboxItems.filter(i => i.id !== id);
      setInboxItems(items);
    } catch (err) {
      console.error("Failed to delete inbox item:", err);
    }
  };

  return (
    <div className="drawer-side z-50">
      <label htmlFor="inbox-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
      <div className="p-6 w-80 md:w-96 min-h-full bg-base-200 text-base-content border-l border-base-300 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center pb-4 border-b border-base-300">
            <h2 className="text-lg font-bold text-soft-brown flex items-center gap-2">
              📥 Look At Later Inbox
            </h2>
            <label htmlFor="inbox-drawer" className="btn btn-sm btn-circle btn-ghost">✕</label>
          </div>
          
          <p className="text-xs text-soft-brown/70 my-4">
            Bun Bun safely tucked away these distractions while you were studying so you can check them out during your break!
          </p>

          {/* Inbox Item Cards */}
          <div className="space-y-3">
            {loading && inboxItems.length === 0 ? (
              <div className="text-center py-8 text-soft-brown/60 text-xs">Loading items... 🌸</div>
            ) : inboxItems.length === 0 ? (
              <div className="text-center py-8 text-soft-brown/60 text-xs">
                Your inbox is clean! No distractions intercepted yet. ✨
              </div>
            ) : (
              inboxItems.map((item, idx) => (
                <div key={item.id || idx} className="p-3 bg-base-100 rounded-xl border border-base-300 shadow-xs space-y-1">
                  <div className="font-bold text-xs truncate text-soft-brown">{item.title || item.url}</div>
                  <div className="text-[10px] text-soft-brown/60 truncate">{item.url}</div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] text-soft-brown/50">{item.saved_at || "Recently"}</span>
                    <div className="flex gap-1">
                      <a href={item.url} target="_blank" rel="noreferrer" className="btn btn-xs btn-primary text-[10px]">Open</a>
                      <button onClick={() => handleDelete(item.id)} className="btn btn-xs btn-ghost text-error text-[10px]">Delete</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-base-300">
          <button onClick={fetchInbox} className="btn btn-outline btn-sm w-full rounded-xl">
            🔄 Refresh Inbox
          </button>
        </div>
      </div>
    </div>
  );
}