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
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return `API Response to: "${message}"`;
    };

    return (
        <div className="App">
            <header className="App-header">
                <div id='message-container'>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`message-container ${message.sender}`}
                        >
                            <div className="message">{message.text}</div>
                        </div>
                    ))}
                </div>
                <div id="chat-input">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <button onClick={handleMessageSend}>Send</button>
                </div>
            </header>
        </div>
    );
}

export default App;
