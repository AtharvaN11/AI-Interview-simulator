import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestRegressor

# Load dataset
df = pd.read_csv("interview_dataset.csv")

# Combine question + answer
df['text'] = df['question'] + " " + df['answer']

# Features and labels
X = df['text']
y = df['score']

# Vectorization
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(X)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestRegressor()
model.fit(X_train, y_train)

# Save model + vectorizer
joblib.dump(model, "model.pkl")
joblib.dump(vectorizer, "vectorizer.pkl")

print(" Model trained and saved successfully!")

from sklearn.metrics import mean_absolute_error

# Predict on test data
y_pred = model.predict(X_test)

# Calculate MAE
mae = mean_absolute_error(y_test, y_pred)

# Convert to accuracy
accuracy = (1 - mae / 10) * 100

print(f"MAE: {mae}")
print(f"Model Accuracy: {accuracy:.2f}%")