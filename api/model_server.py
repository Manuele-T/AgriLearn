from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np

app = Flask(__name__)

# Load the ML model
model = load_model('ML_Model/improved_model.h5')

# Class mapping
class_map = {
    0: "Apple - Apple scab",
    1: "Apple - Black rot",
    2: "Apple - Cedar apple rust",
    3: "Apple - Healthy",
    4: "Blueberry - Healthy",
    5: "Cherry - Healthy",
    6: "Cherry - Powdery mildew",
    7: "Bell pepper - Bacterial spot",
    8: "Bell pepper - Healthy",
    9: "Potato - Early blight",
    10: "Potato - Healthy",
    11: "Potato - Late blight",
    12: "Raspberry - Healthy",
    13: "Squash - Powdery mildew",
    14: "Strawberry - Healthy",
    15: "Tomato - Early blight",
    16: "Tomato - Healthy",
    17: "Tomato - Late blight",
    18: "Tomato - Septoria leaf spot"
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

    if confidence < 0.65:
        return jsonify({"result": "The leaf was not recognized", "confidence": float(confidence)})
    else:
        return jsonify({"result": class_map[predicted_class], "confidence": float(confidence)})

if __name__ == '__main__':
    app.run(port=5000)