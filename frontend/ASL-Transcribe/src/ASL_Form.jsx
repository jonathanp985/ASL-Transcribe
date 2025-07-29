import { useState } from 'react'
import './ASL_Form.css'
import { useRef, useEffect, useCallback} from 'react'
import Webcam from "react-webcam";

function ASL_Form({existingMessage = {}, updateCallback}){

  const webcamRef = useRef(null);
  const [imageSrc, updateImageSrc] = useState(null);
  const [curLetter, updateCurLetter] = useState('');
  const [curMessage, updateMessge] = useState("");

  const captureLetter = async () => {
      // Get Screenshot
      const imageSrc = webcamRef.current.getScreenshot();
      updateImageSrc(imageSrc);
      console.log(imageSrc);

      // Send to backend and receive prediction
      const options = {
        method:"POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({"imageSrc": imageSrc}) 
      }

      const response = await fetch("http://127.0.0.1:5000/get_letter", options);
      const data = await response.json();
      updateCurLetter(data.predicted_letter);

  }

  const saveLetter  = () => {
      updateMessge(curMessage + curLetter);
  }

  const saveMessage  = async () => {
    const updating = Object.entries(existingMessage).length !== 0

    const url = "http://127.0.0.1:5000/" + (updating ? `update_message/${existingMessage.id}` : "create_message")
    const options = {
        method: updating ? "PATCH" : "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"message" : curMessage})
    }
    const response = await fetch(url, options)
    if (response.status !== 201 && response.status !== 200) {
        const data = await response.json()
        alert(data.message)
    } 
    else{
      updateCallback()
    }
  } 
        
    

  return (
    <>
    <div className='webcam'>
      <Webcam
      audio={false}
      ref={webcamRef}
      videoConstraints={{ facingMode: "user" }}/>
    </div>

    <img className="screenshot" src={imageSrc} alt="Screenshot Placeholder" /><br />
    <button className = "button" onClick={captureLetter}> Take a Screenshot</button><br />
    <span>Predicted Letter: {curLetter} </span>
    <button className = "button" onClick={saveLetter}>Save Letter</button><br />
    <span>Send Message: {curMessage} </span>
    <button className = "button" onClick={() => saveMessage()}>Save Message</button>

    
    </>
  );
}

export default ASL_Form