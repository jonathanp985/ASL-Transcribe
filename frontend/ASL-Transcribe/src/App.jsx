import { useState } from 'react'
import { useEffect} from 'react'
import './App.css'
import ASL_Form from './ASL_Form';
import ASL_List from './ASL_List';

function App() {
  const [messages, setMessages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentMessage, setCurrentMessage] = useState({})

  useEffect(() => {
    fetchMessages()
  }, []);

  const fetchMessages = async () => {
    const response = await fetch("http://127.0.0.1:5000/messages");
    const data = await response.json();
    setMessages(data.messages);
  };

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentMessage({})
  }

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true)
  }

  const openEditModal = (message) => {
    if (isModalOpen) return
    setCurrentMessage(message)
    setIsModalOpen(true)
  }

  const onUpdate = () => {
    closeModal()
    fetchMessages()
  }

  return (
    <>
      <ASL_List messages={messages} updateMessage={openEditModal} updateCallback={onUpdate} />
      <button onClick={openCreateModal}>Create New Message</button>
      {isModalOpen && <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <ASL_Form existingMessage={currentMessage} updateCallback={onUpdate} />
        </div>
      </div>
      }
    </>
  );
}


export default App
