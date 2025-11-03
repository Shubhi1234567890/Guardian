import * as tf from './tf.min.js';
import * as toxicity from './toxicity.min.js';
import * as sentiment from './sentiment.min.js';

let ready = false;
let tox, sent;

async function loadModels() {
  const [t, s] = await Promise.all([toxicity.load(0.7), sentiment.load()]);
  tox = t; sent = s; ready = true;
  console.log("✅ Models ready");
}
loadModels();

async function analyze(text) {
  if (!ready) return { ready: false };

  const [toxRes, sentRes] = await Promise.all([
    tox.classify([text]),
    sent.predict(text)
  ]);

  const toxic = toxRes.some(i => i.results[0].match);
  const pos = sentRes.score > 0.85;

  return { isToxic: toxic, isHighPositive: pos, score: sentRes.score };
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type !== "ANALYZE_TEXT") return;

  analyze(msg.text).then((res) => {
    chrome.runtime.sendMessage({
      type: "ANALYSIS_RESULT",
      payload: {
        ...res,
        elementId: msg.elementId,
        originalText: msg.text
      }
    });
  });
});
