import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, LogOut, Trash2, Loader, MessageSquare, FileText } from 'lucide-react';

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentPdf, setCurrentPdf] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        const loadPdfInfo = async () => {
            try {
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
                    query_text: inputMessage,
                    document: currentPdf?.id || null
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
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
            {/* Main Chat Area */}
            <div className="flex flex-col w-full h-full">
                {/* Header */}
                <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={goToDashboard}
                            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        
                        {currentPdf ? (
                            <div className="flex items-center gap-2">
                                <FileText size={16} className="text-orange-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {currentPdf.title}
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <span className="font-bold text-orange-500">DoctChat</span>
                                <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 italic">Smart document conversations</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button
                            onClick={clearChat}
                            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            title="Clear conversation"
                        >
                            <Trash2 size={18} />
                        </button>
                        
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            title="Log out"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </header>

                {/* Error banner */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 px-4 py-3 border-b border-red-100 dark:border-red-800">
                        <div className="text-sm text-red-700 dark:text-red-400">
                            {error}
                        </div>
                    </div>
                )}

                {/* Messages area */}
                <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800">
                    <div className="max-w-3xl mx-auto px-4 py-6">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full space-y-4 py-16">
                                <div className="p-4 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                                    <MessageSquare size={32} className="text-orange-500 dark:text-orange-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                                    Welcome to DoctChat
                                </h3>
                                <p className="text-center text-gray-500 dark:text-gray-400 max-w-md">
                                    {currentPdf 
                                        ? `Ask questions about "${currentPdf.title}" and I'll try to answer based on its content.`
                                        : 'Your intelligent document assistant. Upload a document to start chatting with its content.'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-xl px-4 py-3 rounded-lg ${
                                                message.sender === 'user'
                                                    ? 'bg-orange-600 text-white'
                                                    : message.isError
                                                        ? 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                                        : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-200'
                                            }`}
                                        >
                                            <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                                            <p
                                                className={`text-xs mt-2 ${
                                                    message.sender === 'user'
                                                        ? 'text-orange-200'
                                                        : 'text-gray-500 dark:text-gray-400'
                                                }`}
                                            >
                                                {formatTime(message.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {/* Typing indicator */}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="max-w-xl px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                                            <div className="flex space-x-2 items-center">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Input area */}
                <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <div className="max-w-3xl mx-auto">
                        <form onSubmit={handleSendMessage} className="relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Ask a question..."
                                disabled={isLoading}
                                className="w-full pr-12 py-3 pl-4 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-orange-400 text-gray-900 dark:text-gray-200 disabled:opacity-75"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !inputMessage.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <Loader size={20} className="animate-spin" />
                                ) : (
                                    <Send size={20} />
                                )}
                            </button>
                        </form>
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                            {currentPdf ? `Chatting with: ${currentPdf.title}` : 'Upload a document from Dashboard to get more accurate answers'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;