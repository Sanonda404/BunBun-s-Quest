const SYSTEM_SCHEMES = ["chrome://", "edge://", "about:", "chrome-extension://", "brave://"];

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!tab.url) return;

  // Immediately release system/blank tabs
  if (SYSTEM_SCHEMES.some((scheme) => tab.url.startsWith(scheme)) || tab.url === "about:blank") {
    chrome.tabs.sendMessage(tabId, { action: "ALLOW_PAGE" }).catch(() => {});
    return;
  }

  // Trigger evaluation at document start / early load
  if (changeInfo.status === "loading" || changeInfo.status === "complete") {
    let searchQuery = "";
    try {
      const urlObj = new URL(tab.url);
      searchQuery = urlObj.searchParams.get("q") || urlObj.searchParams.get("query") || "";
    } catch (e) {}

    try {
      const res = await fetch("http://localhost:8000/api/guard/check-distraction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: tab.url,
          title: tab.title || "",
          search_query: searchQuery
        }),
      });

      if (!res.ok) {
        chrome.tabs.sendMessage(tabId, { action: "ALLOW_PAGE" }).catch(() => {});
        return;
      }

      const data = await res.json();

      if (data.is_distraction) {
        chrome.tabs.sendMessage(tabId, {
          action: "SHOW_DISTRACTION_PROMPT",
          url: tab.url,
          title: tab.title || tab.url,
          message: data.message || "Bun Bun intercepted this off-topic page!"
        }).catch(() => {});
      } else {
        // Unhide/approve safe pages
        chrome.tabs.sendMessage(tabId, { action: "ALLOW_PAGE" }).catch(() => {});
      }
    } catch (err) {
      console.error("Guard API Error:", err);
      // Fallback: allow access if API fails
      chrome.tabs.sendMessage(tabId, { action: "ALLOW_PAGE" }).catch(() => {});
    }
  }
});