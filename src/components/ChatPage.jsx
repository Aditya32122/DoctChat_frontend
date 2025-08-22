import React, { useState, useRef, useEffect } from 'react'

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentPdf, setCurrentPdf] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Load current PDF info from localStorage or API
    useEffect(() => {
        const loadPdfInfo = async () => {
            try {
                // You can modify this to fetch from your API
                const pdfInfo = localStorage.getItem('currentPdf');
                if (pdfInfo) {
                    setCurrentPdf(JSON.parse(pdfInfo));
                }
            } catch (error) {
                console.error('Error loading PDF info:', error);
            }
        };
        loadPdfInfo();
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            text: inputMessage,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('access_token') || localStorage.getItem('token');
            const response = await fetch('https://doctchat-backend.onrender.com/api/query/', {
                method: 'POST',
                headers: {
                        'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    query_text: inputMessage,  // Changed from 'message' to 'query_text'
                    document: currentPdf?.id || null  // Changed from 'pdf_id' to 'document'
                }),
            });

               const data = await response.json();
            console.log('Response data:', data);

            if (!response.ok) {
                throw new Error(data.error || data.detail || 'Failed to get response');
            }

            const botMessage = {
                id: Date.now() + 1,
                text: data.answer_text || data.response || 'No response received',
                sender: 'bot',
                timestamp: new Date(),
                source: data.source || null
            };

            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error('Chat error:', error);
            setError(error.message || 'Failed to send message. Please try again.');
            
            const errorMessage = {
                id: Date.now() + 1,
                text: 'Sorry, I encountered an error. Please try again.',
                sender: 'bot',
                timestamp: new Date(),
                isError: true
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    const clearChat = () => {
        setMessages([]);
        setError('');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.removeItem('currentPdf');
        window.location.href = '/';
    };

    const goToDashboard = () => {
        window.location.href = '/dashboard';
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={goToDashboard}
                                className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                                ← Dashboard
                            </button>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                PDF Chat
                            </h1>
                            {currentPdf && (
                                <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-900/20 dark:text-indigo-400">
                                    {currentPdf.name}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={clearChat}
                                className="rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 dark:bg-gray-500 dark:hover:bg-gray-400"
                            >
                                Clear Chat
                            </button>
                            <button
                                onClick={handleLogout}
                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error banner */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 dark:bg-red-900/20 dark:border-red-500">
                    <div className="text-sm text-red-700 dark:text-red-400">
                        {error}
                    </div>
                </div>
            )}

            {/* Chat messages area */}
            <div className="flex-1 overflow-hidden">
                <div className="h-full max-w-4xl mx-auto px-4 py-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow h-full flex flex-col">
                        {/* Messages container */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.length === 0 ? (
                                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                                    <div className="text-lg mb-2">👋 Welcome to PDF Chat!</div>
                                    <p>Ask me anything about your uploaded PDF document.</p>
                                    {!currentPdf && (
                                        <p className="text-sm mt-2">Upload a PDF from the dashboard to get started.</p>
                                    )}
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                message.sender === 'user'
                                                    ? 'bg-indigo-600 text-white'
                                                    : message.isError
                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                                    : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
                                            }`}
                                        >
                                            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                            <p
                                                className={`text-xs mt-1 ${
                                                    message.sender === 'user'
                                                        ? 'text-indigo-200'
                                                        : 'text-gray-500 dark:text-gray-400'
                                                }`}
                                            >
                                                {formatTime(message.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}

                            {/* Typing indicator */}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 max-w-xs">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input area */}
                        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                            <form onSubmit={handleSendMessage} className="flex space-x-4">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder="Ask a question about your PDF..."
                                    disabled={isLoading}
                                    className="flex-1 rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500 disabled:opacity-50"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !inputMessage.trim()}
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        'Send'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;