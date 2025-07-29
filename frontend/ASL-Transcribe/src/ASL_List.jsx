import './ASL_List.css'
function ASL_List({ messages, updateMessage, updateCallback }){
    
    // Get the messages
    const handleDelete  = async (id) =>{
        try{
            const options = {
                method: "DELETE"
            }
            const response = await fetch(`http://localhost:5000/delete_message/${id}`, options)
            if (response.status === 200) {
                updateCallback()
            }
        }

        catch{
            alert(error);
        }
    }


    return(
        <>
        <div>
            <h2 className='message-header'>MESSAGES</h2>
            <ol>
                {messages.map((msg) => (
                <li className = "messages-container"key={msg.id}>
                    {msg.message + "   "}
                    <button onClick={() => updateMessage(msg)}>Update</button>
                    <button onClick={() => handleDelete(msg.id)}>Delete</button>
                </li>
            ))}
            </ol>
        </div>
        </>
    );
}

export default ASL_List