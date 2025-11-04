import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import pickle
import os

# Step 1: Load sample dataset (for now we simulate it)
data = pd.DataFrame({
    'flow_rate': [12, 19, 15, 20, 10, 17, 14, 18, 11, 16],
    'pressure': [35, 48, 40, 50, 33, 45, 38, 47, 36, 42],
    'level': [6, 17, 10, 19, 5, 15, 8, 18, 7, 12],
    'leak': [0, 1, 0, 1, 0, 1, 0, 1, 0, 0]  # 0 = normal, 1 = leak
})

# Step 2: Split data
X = data[['flow_rate', 'pressure', 'level']]
y = data['leak']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 3: Train model
model = RandomForestClassifier(n_estimators=10, random_state=42)
model.fit(X_train, y_train)

# Step 4: Evaluate
preds = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, preds))

# Step 5: Save model
os.makedirs('../models', exist_ok=True)
with open('../models/leak_detector.pkl', 'wb') as f:
    pickle.dump(model, f)

print("Model saved to ../models/leak_detector.pkl")
