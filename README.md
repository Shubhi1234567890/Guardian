# 🛡️ Guardian – Tool for preotection against social media creeps
Protecting users from creepy, abusive, and harmful Instagram messages using AI.

---

## 📌 Overview  
Guardian is a Chrome extension that uses an AI model to detect creepy messages, harassment, stalking behavior, and toxic language in Instagram DMs — in real time.  

It reads messages from the Instagram web interface, classifies them using a custom NLP model, and highlights dangerous messages to warn the user.

Privacy-first: No cloud storage. No data leaks. Local inference only.

---

## 🎯 Features

✅ Real-time scanning of Instagram DMs | Detects new messages instantly  
✅ AI message classification | Creepy, harassment, stalking, safe  
✅ Risk level warnings | Color-coded alert system  
✅ Local processing | No data leaves device  
✅ 3-strike creep detection | Flags repeat offenders  
✅ Optional auto-hide toxic messages | Protects mental health  

---

## 🧠 AI Capabilities  
The ML model classifies messages into:

- ✅ Safe / Friendly  
- ⚠️ Creepy / uncomfortable tone  
- 🚨 Stalker vibes / obsessive tone  
- ❗ Mild harassment  
- ❗❗ Medium harassment  
- ❗❗❗ Strong / explicit harassment  

Trained on custom curated DM harassment dataset.

---

## 🧰 Tech Stack

Extension -> Chrome Manifest V3, JavaScript  
Backend -> Python (FastAPI / Flask)  
ML -> HuggingFace Transformers  
Dataset -> Custom labeled DM dataset  
Storage -> Chrome Local Storage  

---

## 🧠 System Architecture
```
Instagram Web → Content Script → Background Service Worker
        ↓                                 ↓
  Detected Text                 Sends to ML Inference API
        ↓                                 ↓
   Highlight Message ← Receive Classification
```
---

## 📂 Project Structure
```
Guardian/
│
├── extension/
│ ├── manifest.json
│ ├── content.js
│ ├── background.js
│ └── popup.html
│
├── ml-model/
│ ├── models_balanced/
│ ├── dataset.csv
│ ├── predict.py
│ ├── server.py
│ └── train_model.py
```
---

## 🛠️ Setup Instructions

### 🧩 Install Extension
1. Open `chrome://extensions/`
2. Enable **Developer Mode**
3. Click **Load Unpacked**
4. Select the `extension/` folder

### 🤖 Start ML Server
http://127.0.0.1:8000



