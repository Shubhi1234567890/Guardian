console.log("✅ Guardian background worker ready");

// --- ML classification function ---
async function classifyMessage(text) {
  try {
    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const data = await response.json();
    console.log("🤖 ML Response:", data);

    return data.prediction; 
  } catch (error) {
    console.error("❌ ML API error:", error);
    return "safe"; 
  }
}

// --- Listen for messages from content script & popup ---
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("📩 BG received:", message);

  // 🔗 popup.html → background.js handshake
  if (message.type === "POPUP_PING") {
    console.log("📡 Popup connected");
    sendResponse({ ok: true, message: "Background alive ✅" });
    return;
  }

  // 🚫 Unshield user request
  if (message.type === "UNSHIELD_USER") {
    console.log(`🛑 Unshielding user: ${message.username}`);

    // (Optional) maintain an internal memory set of shielded users
    // shieldedUsers.delete(message.username);

    sendResponse({ status: "unshielded", user: message.username });
    return;
  }

  // 💬 New DM message from content.js → classify
  if (message.type === "NEW_DM_MESSAGE") {
    console.log("📝 Classifying:", message.text);

    classifyMessage(message.text).then(prediction => {
      console.log("🎯 Prediction:", prediction);

      sendResponse({
        status: "classified",
        text: message.text,
        prediction
      });
    });

    return true; // ✅ keep async channel open
  }
});
