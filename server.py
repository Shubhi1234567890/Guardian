from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

app = FastAPI()

# ✅ Correct model path
MODEL_DIR = "./models_balanced/final"

# ✅ Load tokenizer & model
tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
model = AutoModelForSequenceClassification.from_pretrained(
    MODEL_DIR,
    trust_remote_code=True
)
model.eval()

# ✅ Allow Chrome Extension (localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextRequest(BaseModel):
    text: str

@app.get("/")
def home():
    return {"message": "Guardian ML API is running ✅"}

@app.post("/predict")
def predict(req: TextRequest):
    # Tokenize text
    inputs = tokenizer(
        req.text,
        return_tensors="pt",
        truncation=True,
        padding=True
    )

    # Model inference
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_class = torch.argmax(logits, dim=1).item()

    # Convert class index to label
    id2label = model.config.id2label
    label = id2label[predicted_class]

    return {
        "text": req.text,
        "prediction": label
    }
