import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

model_path = "models_balanced/final"   # ✅ Updated model folder

tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForSequenceClassification.from_pretrained(model_path)

# ✅ Get id2label dictionary from model config
id2label = model.config.id2label

def predict(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True)
    with torch.no_grad():
        outputs = model(**inputs)

    logits = outputs.logits
    predicted_class_id = logits.argmax().item()
    return id2label[predicted_class_id]

print("✅ Model Loaded! Type a message to test. Type 'exit' to quit.")

while True:
    txt = input("\nEnter message: ")
    if txt.lower() == "exit":
        break
    print("Prediction:", predict(txt))
