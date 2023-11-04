import './App.css';
import {useState} from "react";

function App() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');

    const handleMessageSend = async () => {
        if (inputMessage.trim() === '') return;

        const userMessage = { text: inputMessage, sender: 'user' };
        const response = await sendMessage(inputMessage);
        const modelMessage = { text: response, sender: 'api' };

        // Add both the user and API messages to the messages array
        setMessages([...messages, userMessage, modelMessage]);
        setInputMessage(''); // Clear the input field
    };

    const sendMessage = async (message) => {
        // Simulate API response after a short delay
        await new Promise((resolve) => setTimeout(resolve, 10));
        return `API Response to: "${message}"`;
    };

    return (
        <div id="app-container" className="container-fluid text-white min-vh-100 d-flex flex-column">
                <div id="message-container" className="flex-grow-1 overflow-auto p-5" style={{ maxHeight: '87vh' }}>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`message-container mx-auto ${
                                message.sender === 'user' ? 'text-right' : 'text-left'
                            }`} style={{ maxWidth: '60vw' }}
                        >
                            <div
                                className={`message p-2 ${
                                    message.sender === 'user' ? 'text-white' : 'text-white'
                                }`}
                            >
                                {message.text}
                            </div>
                        </div>
                    ))}
                </div>
                <div id="chat-input" className="input-group m-3 w-50 mx-auto">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        className="form-control user-input"
                        placeholder="Type a message..."
                    />
                    <button onClick={handleMessageSend} className="btn btn-primary">
                        Send
                    </button>
                </div>
        </div>
    );
}

export default App;
