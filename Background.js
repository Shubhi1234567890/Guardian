console.log("✅ Guardian background worker ready");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("📩 BG received message:", message);

  if (message.type === "NEW_DM_MESSAGE") {
    console.log("💬 Message from Instagram:", message.text);

    sendResponse({ status: "received", echoed: message.text });
  }
});
