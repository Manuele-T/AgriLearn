from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np

app = Flask(__name__)

# Load the ML model
model = load_model('ML_Model/improved_model_24_classes.keras')

# Class mapping
class_map = {
    0: "Apple - Apple scab",
    1: "Apple - Black rot",
    2: "Apple - Cedar apple rust",
    3: "Apple - Healthy",
    4: "Blueberry - Healthy",
    5: "Cherry - Healthy",
    6: "Cherry - Powdery mildew",
    7: "Grape - Black rot",
    8: "Grape - Esca (Black Measles)",
    9: "Grape - Healthy",
    10: "Peach - Bacterial spot",
    11: "Peach - Healthy",
    12: "Bell Pepper - Bacterial spot",
    13: "Bell Pepper - Healthy",
    14: "Potato - Early blight",
    15: "Potato - Healthy",
    16: "Potato - Late blight",
    17: "Raspberry - Healthy",
    18: "Strawberry - Healthy",
    19: "Strawberry - Leaf scorch",
    20: "Tomato - Early blight",
    21: "Tomato - Healthy",
    22: "Tomato - Late blight",
    23: "Tomato - Septoria leaf spot"
}

# Predict route
@app.route('/predict', methods=['POST'])
def predict():
    # Get uploaded image
    file = request.files['image']
    image = Image.open(file).resize((256, 256))  # Resize to match input size
    image_array = np.expand_dims(np.array(image) / 255.0, axis=0)

    # Predict and return result
    predictions = model.predict(image_array)
    confidence = predictions.max()
    predicted_class = predictions.argmax()

    if confidence < 0.55:
        return jsonify({"result": "The leaf was not recognized", "confidence": float(confidence)})
    else:
        return jsonify({"result": class_map[predicted_class], "confidence": float(confidence)})

if __name__ == '__main__':
    app.run(port=5000)