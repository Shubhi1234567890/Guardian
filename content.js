console.log("✅ Guardian content script loaded");

// Observe DOM for new messages
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType !== 1) return;

      // Instagram text bubble selector (works for most layouts)
      const textBubble = node.querySelector('div[dir="auto"]');
      if (!textBubble) return;

      const text = textBubble.innerText?.trim();
      if (!text) return;

      // Avoid duplications
      if (node.dataset.guardianSeen) return;
      node.dataset.guardianSeen = "1";

      console.log("📩 NEW IG DM:", text);

      // Send to background
      chrome.runtime.sendMessage({
        type: "NEW_DM_MESSAGE",
        text,
      }, (res) => {
        console.log("↪️ BG Response:", res);
      });
    });
  }
});

observer.observe(document.body, { childList: true, subtree: true });

console.log("👀 Listening for IG messages...");
