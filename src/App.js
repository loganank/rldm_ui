import './App.css';
import {useEffect, useRef, useState} from "react";

function App() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const inputTextAreaRef = useRef(null);
    const maxInputRows= 8;

    const handleMessageSend = async () => {
        if (inputMessage.trim() === '') return;

        setLoading(true); // Set loading to true before making the request

        try {
            const userMessage = {text: inputMessage, sender: 'user'};
            const response = await sendMessage(inputMessage);
            const modelMessage = {text: response, sender: 'api'};

            // Add both the user and API messages to the messages array
            setMessages([...messages, userMessage, modelMessage]);
            setInputMessage(''); // Clear the input field
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent the default behavior of submitting the form
            handleMessageSend(); // Call the submit function
        }
    };

    const sendMessage = async (message) => {
        // Simulate API response after a short delay
        let response = await fetch('http://localhost:5000/sendMessage', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(message)
        });

        let json_response = await response.json();
        let server_decision = json_response.decision;
        return "The decision is: " + server_decision;
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
                            <div className="circle-container">
                                <img id="circle" src={"circle.png"} alt={"circle"} />
                            </div>
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
                        disabled={loading} // Disable input when loading
                    />
                    <button id="send-btn" onClick={handleMessageSend} className="btn" disabled={loading}>
                        {loading ? 'Sending...' : 'Send'}
                    </button>
                </div>
        </div>
    );
}

export default App;
