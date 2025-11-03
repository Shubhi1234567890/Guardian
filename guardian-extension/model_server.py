from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()
model = pipeline("text-classification", model="unitary/toxic-bert")

class TextInput(BaseModel):
    text: str

@app.post("/predict")
def predict(data: TextInput):
    result = model(data.text)[0]

    # Labels that mean harassment/toxic intent
    harassment_labels = [
        "TOXIC",
        "SEVERE_TOXIC",
        "INSULT",
        "PROFANITY",
        "IDENTITY_HATE",
        "THREAT"
    ]

    harassment = (result["label"] in harassment_labels) and (result["score"] > 0.6)
    score = result["score"]

    return {"harassment": harassment, "score": score}
