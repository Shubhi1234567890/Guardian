console.log("✅ ServiceNow script active");

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "FROM_INSTAGRAM") {
    console.log("📥 From IG:", msg.text);

    const inputBox = document.querySelector("textarea, input[type=text]");
    if (inputBox) {
      inputBox.value = msg.text;
      inputBox.dispatchEvent(new Event("input", { bubbles: true }));
      console.log("✅ Auto-filled ServiceNow field");
    } else {
      console.warn("⚠️ Could not find input field");
    }
  }
});
