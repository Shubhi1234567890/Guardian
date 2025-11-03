# 🛡️ Guardian – Tool for protection against social media creeps
Protecting users from creepy, abusive, and harmful Instagram messages using AI.

---

## 📌 Overview  
Guardian is a Chrome extension that uses an AI model to detect creepy messages, harassment, stalking behavior, and toxic language in Instagram DMs — in real time.  

It reads messages from the Instagram web interface, classifies them using a custom NLP model, and highlights dangerous messages to warn the user.

Privacy-first: No cloud storage. No data leaks. Local inference only.

---
## 🧠 Core Idea

✅ Read Instagram DM messages automatically

✅ Use an ML model to classify messages as safe / harassment / creepy / abusive

✅ Track strikes per sender

✅ After 4 abusive messages, hide the sender and alert the user

✅ User can unhide anytime

---
## 📂 System Components
```
| Component             | Purpose                                                    |
| --------------------- | ---------------------------------------------------------- |
| Dataset (CSV)         | Collected DM text + harassment labels                      |
| ML Model (DistilBERT) | Trained to detect abusive text                             |
| FastAPI Server        | Serves the model on localhost                              |
| Chrome Extension      | Reads DMs, sends text to ML API, hides users after strikes |
```
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

- ✅ Safe 
- ⚠️ Creepy flirt 
- 🚨 Stalker behaviour 
- ❗ Mild harassment  
- ❗❗ Medium harassment  
- ❗❗❗ Severe harassment  

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

---
## ⚙️ How I Built It (Step-By-Step)

```
1. Made dataset with text + labels (safe, harassment types, creepy flirt, etc.)

2. Cleaned & balanced dataset to avoid model bias

3. Fine-tuned DistilBERT model using HuggingFace Trainer

4. Saved final model in models_balanced/final/

5. Created FastAPI server to return predictions for text

6. Built Chrome Extension with:

content.js → reads Instagram messages from DOM
background.js → calls ML server & manages strikes
popup.html → shows hidden users + unhide button

7. Added logic:
1st–3rd offensive messages → only counted
4th message → show alert + hide sender

8. Stored strike counts using chrome.storage so it stays even after refresh
```

## Tools Used

Python, HuggingFace Transformers
FastAPI
Chrome Extension (Manifest V3)
JavaScript, HTML

---
## 🛠️ Setup Instructions

### 🧩 Install Extension
1. Open `chrome://extensions/`
2. Enable **Developer Mode**
3. Click **Load Unpacked**
4. Select the `extension/` folder

### 🤖 Start ML Server
http://127.0.0.1:8000

---
Extension
<br>
<div style="text-align:center;">
  <img src="Screenshot 2025-11-01 012736.png" 
       alt="Guardian demo" 
       style="max-width:300px; width:40%; height:auto; border-radius:10px;">
</div>

<br>

Warning
<br>
<div style="text-align:center;">
  <img src="Screenshot 2025-11-03 115842.png" 
       alt="Guardian demo" 
       style="max-width:300px; width:40%; height:auto; border-radius:10px;">
</div>

<br>
received dms classified into different categories
<div style="text-align:center;">
  <img src="Screenshot 2025-11-03 155240.png" 
       alt="Guardian demo" 
       style="max-width:300px; width:40%; height:auto; border-radius:10px;">
</div>

<br>






