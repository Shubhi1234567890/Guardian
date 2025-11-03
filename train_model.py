import pandas as pd
from datasets import Dataset, DatasetDict
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    Trainer,
    TrainingArguments,
    DataCollatorWithPadding
)

# ✅ Load BALANCED dataset
df = pd.read_csv("dataset.csv", encoding="latin-1")

# ✅ Convert correct columns to string
df["text"] = df["text"].astype(str)
df["label"] = df["label"].astype(str)

# ✅ Remove empty or invalid rows
df = df.dropna(subset=["text", "label"])
df = df[df["text"].str.strip() != ""]
df = df[df["label"].str.strip() != ""]
df = df[df["label"].str.lower() != "nan"]

# ✅ Map labels → numbers
unique_labels = sorted(df["label"].unique())
label2id = {label: idx for idx, label in enumerate(unique_labels)}
id2label = {idx: label for label, idx in label2id.items()}
df["label"] = df["label"].map(label2id)

print("✅ Labels:", id2label)
print("✅ Total Samples:", len(df))

# ✅ Train-Validation Split (90% train, 10% validation)
train_df = df.sample(frac=0.9, random_state=42)
val_df = df.drop(train_df.index)

dataset = DatasetDict({
    "train": Dataset.from_pandas(train_df),
    "validation": Dataset.from_pandas(val_df)
})

# ✅ Load Tokenizer
model_name = "distilbert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)

def tokenize(batch):
    return tokenizer(batch["text"], truncation=True)

dataset = dataset.map(tokenize, batched=True)

# ✅ Data padding
data_collator = DataCollatorWithPadding(tokenizer=tokenizer)

# ✅ Load pretrained model for classification
model = AutoModelForSequenceClassification.from_pretrained(
    model_name,
    num_labels=len(label2id),
    id2label=id2label,
    label2id=label2id
)

# ✅ Training configuration
training_args = TrainingArguments(
    output_dir="models_balanced",
    learning_rate=2e-5,
    per_device_train_batch_size=8,
    num_train_epochs=4,          # ✅ slightly higher since dataset balanced now
    weight_decay=0.01,
    save_strategy="epoch",
    eval_strategy="epoch", # ✅ evaluate every epoch
    logging_steps=20
)

# ✅ Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset["train"],
    eval_dataset=dataset["validation"],
    data_collator=data_collator
)

# ✅ Train & Save
trainer.train()
trainer.save_model("models_balanced/final")
tokenizer.save_pretrained("models_balanced/final")

print("\nTRAINING DONE! Model saved at → models_balanced/final")
print("Classes:", id2label)
