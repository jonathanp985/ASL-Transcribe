import torch
import base64
import os
from torch import nn
from PIL import Image
from label_dictionary import label_dict
from base_64_decode import base64_to_jpeg
from message_store import MessageStore
from torchvision import datasets
from torchvision import transforms
from flask import request, jsonify
from config import app, db
import torchvision.models as models




INSTANCE_PATH = app.instance_path

pred_model = models.mobilenet_v3_small(weights=True)
pred_model.classifier[3] = nn.Linear(in_features=1024, out_features=len(label_dict))
pred_model.load_state_dict(torch.load(os.path.join(INSTANCE_PATH, "ASL_MODEL.pth"), map_location=('cpu')))

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])



@app.route("/get_letter", methods = ["POST"])
def get_letter():
    try:
        # Convert base64 to jpeg
        src = request.json.get("imageSrc")
        if not src:
            return jsonify({"message": "no image sorce provided"}), 404 
        
        img_path = base64_to_jpeg(src, os.path.join(INSTANCE_PATH, "letter.jpeg"))

        # Convert to tensor and normalize
        img = Image.open(img_path)
        img_tensor = transform(img)

        # Get models prediction
        pred_tensor = pred_model(img_tensor.unsqueeze(0))
        pred_label = torch.softmax(pred_tensor.squeeze(), dim=0).argmax()
        letter = [key for key, val in label_dict.items() if val == pred_label][0]

        

        return jsonify({"predicted_letter": letter}), 201
    except Exception as e:
        print("Error in /get_letter:", e)
        return jsonify({"message": str(e)}), 404
    

@app.route("/create_message", methods = ["POST"])
def create_message():
    message = request.json.get("message")
    new_message = MessageStore()
    new_message.message = message

    try:
        db.session.add(new_message)
        db.session.commit()
    except Exception as e:
        return jsonify({"message", str(e)}), 404
    
    return jsonify({"message": "Message Created!"}), 200

@app.route("/messages", methods = ["GET"])
def messages():
    messages = MessageStore.query.all()
    json_contacts = list(map(lambda x: x.to_json(), messages))
    return jsonify({"messages": json_contacts})


@app.route("/update_message/<int:message_id>", methods=["PATCH"])
def update_message(message_id):
    message = MessageStore.query.get(message_id)

    if not message:
        return jsonify({"User not found"}), 404

    message.message = request.json.get("message")
    db.session.commit()

    return jsonify({"message": "Update Successfull"}), 200


@app.route("/delete_message/<int:message_id>", methods=["DELETE"])
def delete_message(message_id):
    message = MessageStore.query.get(message_id)

    if not message:
        jsonify({"message": "User not found"}), 404

    db.session.delete(message)
    db.session.commit()

    return jsonify({"message":"User Deleted"}), 200

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run()

