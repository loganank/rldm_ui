import './App.css';
import {useEffect, useRef, useState} from "react";

function App() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const inputTextAreaRef = useRef(null);
    const maxInputRows= 8;
    const [continueMessage, setContinueMessage] = useState(false);
    const continueText = "You may now send a message.";
    const [showInitialMessage, setShowInitialMessage] = useState(true);
    const initialMessageText = `Please ask 50 questions. 
        After each question, the ai will make a decision
        which you will tell it is correct or incorrect
        by selecting the decision it should have made.
        Have fun!
        `

    const handleMessageSend = async () => {
        if (inputMessage.trim() === '') return;

        setShowInitialMessage(false);
        setLoading(true); // Set loading to true before making the request

        try {
            const userMessage = {text: inputMessage, sender: 'user'};
            const response = await sendMessage(inputMessage);
            const modelMessage = {text: response, sender: 'api'};

            // Add both the user and API messages to the messages array
            setMessages([...messages, userMessage, modelMessage]);
            setInputMessage(''); // Clear the input field
            setOptions([
                "Generated a Response",
                "Asked for Clarification",
                "Unsure, so Provided Options"
            ]);
        } finally {
            setLoading(false);
        }
    };

    const showAndHideMessage = () => {
        setContinueMessage(true);
        setTimeout(() => {
            setContinueMessage(false);
        }, 3000); // Adjust the duration (in milliseconds) as needed
    };

    const handleOptionSelect = async (index, option) => {
        // Handle the selected option
        console.log(`Selected Option: ${option}`);
        const correctDecision = index;
        console.log("correct decision: " + correctDecision);
        await sendCorrectDecision(correctDecision);
        // Clear the options after selection
        setOptions([]);
        showAndHideMessage();
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

    const sendCorrectDecision = async (correct_decision) => {
        // Simulate API response after a short delay
        let response = await fetch('http://localhost:5000/sendCorrectDecision', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(correct_decision)
        });

        let json_response = await response.json();
        let dm_response = json_response.status;
        console.log("The response is: " + dm_response);
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
                    {showInitialMessage && (
                        <div className="alert alert-info mt-3 fade show text-center" role="alert">
                            {initialMessageText}
                        </div>
                    )}
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`message-container mx-auto rounded p-2 ${
                                message.sender === 'user' ? 'text-user' : 'text-chatbot'
                            }`} style={{ maxWidth: '50vw' }}
                        >
                            {message.sender === 'api' && (
                                <span className="circle-container">
                                    <img id="circle" src={"circle.png"} alt={"circle"} />
                                </span>
                            )}
                            <span
                                className={`message p-2 ${
                                    message.sender === 'user' ? 'text-white' : 'text-white'
                                }`}
                            >
                                {message.text}
                            </span>
                        </div>
                    ))}
                    {options.length > 0 && (
                        <div className="options-container mx-auto mt-3 text-center">
                            <h2>What was the correct response to your message?</h2>
                            {options.map((option, index) => (
                                <button
                                    key={index}
                                    className="btn btn-light m-2"
                                    onClick={() => handleOptionSelect(index, option)}
                                    disabled={loading}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    )}
                    {continueMessage && (
                        <div className="alert alert-info mt-3 show text-center" role="alert" >
                            {continueText}
                        </div>
                    )}
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
