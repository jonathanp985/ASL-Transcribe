# ASL Translator

**A full-stack web application that translates American Sign Language (ASL) hand gestures into readable text using a PyTorch-based deep learning model. 
The project features a React frontend for real-time webcam capture and a Flask backend that performs inference using a transfer-learned MobileNetV3 model.**

- Translates ASL hand signs (A–Z) from webcam input.

- React-based webcam interface for real-time gesture capture.

- Transfer learning with MobileNetV3 for high efficiency.

- Data augmentations to improve generalization on custom images.

- Trained on a dataset of 87,000+ labeled ASL gesture images.

- Stores translated messages in a SQLALCHEMY database.


 **Prerequisites**
  - `Python ≥ 3.8`
  - `Node.js ≥ 16`
  - `pip, virtualenv`


**Backend (Flask + PyTorch)**
  ```
  cd backend
  python -m venv venv
  source venv/bin/activate  # or venv\Scripts\activate on Windows
  pip install -r requirements.txt
  python run.py
  ```



**Frontend (React)**
```
cd frontend
npm install
npm run dev
```
**The React app will run at http://localhost:5173 and communicate with the backend at http://localhost:5000**

**API Endpoints**
| Route	| Method	| Description |
| :------- | :------: | -------: |
| /get_letter |	POST	| Receives image, returns ASL label |
| /get_message	| POST	| Adds message to SQLAlchemy Database | 
| /messages	 | GET	 | Returns previous translations / Lists Messages |
| /delete_message	| DELETE	| Clears message history | 
| /update_message	| POST	| Updates selected message from unique id | 

**Model Training Summary**
  - Architecture: MobileNetV3 (pretrained)
  - Input size: 224x224 RGB
  - Training Transformations:
    - Resize (64,64)
    - Random Rotation, Affine, Erasing
    - Normalization with ImageNet mean/std
  - Dataset size: 87,000 images across 29 classes (A–Z, space, del, nothing)
