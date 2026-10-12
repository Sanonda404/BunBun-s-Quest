// Listen to active tab updates in Chrome
chrome.tabs.onUpdated.changeInfo || chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    console.log("🐰 Bun Bun is watching tab update:", tab.url, tab.title);
    
    // Send URL and title to FastAPI backend for distraction check (coming in Slice 6)
    fetch('http://localhost:8000/api/check-distraction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: tab.url, title: tab.title })
    })
    .then(res => res.json())
    .then(data => {
      console.log("Distraction Guard response:", data);
    })
    .catch(err => {
      // Backend might not have the route yet, safe to ignore for now
      console.log("Backend check pending route implementation.");
    });
  }
});