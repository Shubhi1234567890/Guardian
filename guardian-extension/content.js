console.log("✅ Guardian content script loaded");

// Observe DOM for new messages
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType !== 1) return;

      // Instagram text bubble selector — detects most IG chat layouts
      const textBubble = node.querySelector('div[dir="auto"]');
      if (!textBubble) return;

      const text = textBubble.innerText?.trim();
      if (!text) return;

      // Avoid duplicate processing
      if (node.dataset.guardianSeen) return;
      node.dataset.guardianSeen = "1";

      console.log("📩 NEW IG DM:", text);

      // Send message to background for ML classification
      chrome.runtime.sendMessage(
        { type: "NEW_DM_MESSAGE", text },
        (response) => {
          console.log("↪️ BG Response:", response);

          if (!response || !response.prediction) return;

          const verdict = response.prediction;

          if (verdict !== "safe") {
            console.log(`⚠️ Harassment detected: ${verdict}`);

            // 🔥 Highlight message bubble in red
            node.style.border = "2px solid red";
            node.style.borderRadius = "8px";

            // 🚨 Optional popup alert
            alert(
              `⚠️ Guardian Alert!\n` +
              `Suspicious message detected:\n"${text}"\n` +
              `Category: ${verdict}`
            );
          } else {
            // Mark safe messages lightly (optional)
            node.style.border = "1px solid #4caf50";
            node.style.borderRadius = "8px";
          }
        }
      );
    });
  }
});

observer.observe(document.body, { childList: true, subtree: true });

console.log("👀 Listening for IG messages...");
