// 1. Instantly hide body before page elements load to prevent peek/flash
const hideStyle = document.createElement("style");
hideStyle.id = "bunbun-preblock-style";
hideStyle.textContent = "html { display: none !important; }";
document.documentElement.appendChild(hideStyle);

// Function to unhide page if Gemini approves
function allowPageAccess() {
  const style = document.getElementById("bunbun-preblock-style");
  if (style) style.remove();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "ALLOW_PAGE") {
    allowPageAccess();
  } else if (request.action === "SHOW_DISTRACTION_PROMPT") {
    renderBunBunBlockPage(request.url, request.title, request.message);
  }
});

function renderBunBunBlockPage(url, title, message) {
  // Stop page loading/media immediately
  window.stop && window.stop();

  // Reveal document root for our overlay
  allowPageAccess();

  if (document.getElementById("bunbun-block-screen")) return;

  const blockScreen = document.createElement("div");
  blockScreen.id = "bunbun-block-screen";

  blockScreen.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    background-color: #fcf8f2 !important;
    background-image: radial-gradient(#e0d7c6 1px, transparent 1px) !important;
    background-size: 20px 20px !important;
    z-index: 2147483647 !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif !important;
    color: #4a3e3d !important;
    padding: 20px !important;
    box-sizing: border-box !important;
  `;

  blockScreen.innerHTML = `
    <div style="
      background: #ffffff;
      border: 2px solid #e76f51;
      border-radius: 24px;
      padding: 36px 32px;
      max-width: 440px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
    ">
      <div style="
        font-size: 48px;
        background: #ffe8ec;
        width: 80px;
        height: 80px;
        line-height: 80px;
        border-radius: 50%;
        margin: 0 auto 16px auto;
        border: 2px solid #f4a261;
      ">🐰</div>

      <h1 style="
        font-size: 22px;
        font-weight: 800;
        color: #e76f51;
        margin: 0 0 6px 0;
      ">404 — Focus Zone Guard</h1>

      <p style="
        font-size: 11px;
        color: #8d99ae;
        font-weight: 700;
        letter-spacing: 1px;
        margin: 0 0 20px 0;
        text-transform: uppercase;
      ">DISTRACTION INTERCEPTED BY BUN BUN</p>

      <div style="
        background: #fff9fa;
        border: 1px solid #ffe5d9;
        border-radius: 16px;
        padding: 16px;
        font-size: 13px;
        line-height: 1.5;
        color: #5d4037;
        margin-bottom: 24px;
      ">
        "${message}"
      </div>

      <button id="bunbun-block-inbox-btn" style="
        width: 100%;
        background-color: #e76f51;
        color: #ffffff;
        border: none;
        padding: 14px 18px;
        border-radius: 14px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(231, 111, 81, 0.3);
      ">📥 Save to Inbox & Close</button>
    </div>
  `;

  document.body.appendChild(blockScreen);
  document.body.style.overflow = "hidden";

  // Action: Save to Inbox via FastAPI and close tab / redirect away
  document.getElementById("bunbun-block-inbox-btn").onclick = async () => {
    const btn = document.getElementById("bunbun-block-inbox-btn");
    btn.innerText = "⏳ Saving...";

    try {
      await fetch("http://localhost:8000/api/inbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url,
          title: title || url,
          saved_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })
      });
      btn.innerText = "✨ Saved!";
    } catch (e) {
      console.error("Failed to add to inbox:", e);
    }

    setTimeout(() => {
      window.location.href = "about:blank";
    }, 400);
  };
}