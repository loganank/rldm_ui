import './App.css';
import {useEffect, useRef, useState} from "react";

function App() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const inputTextAreaRef = useRef(null);
    const maxInputRows= 8;

    const handleMessageSend = async () => {
        if (inputMessage.trim() === '') return;

        const userMessage = { text: inputMessage, sender: 'user' };
        const response = await sendMessage(inputMessage);
        const modelMessage = { text: response, sender: 'api' };

        // Add both the user and API messages to the messages array
        setMessages([...messages, userMessage, modelMessage]);
        setInputMessage(''); // Clear the input field
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent the default behavior of submitting the form
            handleMessageSend(); // Call the submit function
        }
    };

    const sendMessage = async (message) => {
        // Simulate API response after a short delay
        await new Promise((resolve) => setTimeout(resolve, 10));
        return `API Response to: "${message}"`;
    };

    useEffect(() => {
        if (inputTextAreaRef.current) {
            const newLineCount = (inputMessage.match(/\n/g) || []).length + 1; // Count the new lines
            inputTextAreaRef.current.rows = Math.min(newLineCount, maxInputRows);
        }
    }, [inputMessage]);

    return (
        <div id="app-container" className="container-fluid text-white min-vh-100 d-flex flex-column">
                <div id="message-container" className="flex-grow-1 overflow-auto p-5" style={{ maxHeight: '87vh' }}>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`message-container mx-auto rounded ${
                                message.sender === 'user' ? 'text-user' : 'text-chatbot'
                            }`} style={{ maxWidth: '50vw' }}
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
                <div id="chat-input" className="input-group m-3 w-50 mx-auto bg-transparent">
                    <textarea
                        ref={inputTextAreaRef}
                        rows="1" // Allow for multiple lines
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="form-control user-input"
                        placeholder="Type a message..."
                    />
                    <button id="send-btn" onClick={handleMessageSend} className="btn">
                        Send
                    </button>
                </div>
        </div>
    );
}

export default App;
