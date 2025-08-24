import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, LogOut, MessageSquare, Plus, Upload, File, FileText } from 'lucide-react';

const Dashboard = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [documents, setDocuments] = useState([]);
    const [isLoadingDocs, setIsLoadingDocs] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showNewChat, setShowNewChat] = useState(true);


    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        setIsLoadingDocs(true);
        try {
            const token = localStorage.getItem('access_token') || localStorage.getItem('token');
            const response = await fetch('https://doctchat-backend.onrender.com/api/documents/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setDocuments(data);
            }
        } catch (error) {
            console.error('Error loading documents:', error);
        } finally {
            setIsLoadingDocs(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
            setError('');
            if (!title) {
                setTitle(file.name.replace('.pdf', ''));
            }
        } else {
            setSelectedFile(null);
            setError('Please select a valid PDF file');
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            setError('Please select a PDF file');
            return;
        }

        setIsUploading(true);
        setError('');
        setSuccess('');

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('title', title || selectedFile.name);
            formData.append('description', description);

            const token = localStorage.getItem('access_token') || localStorage.getItem('token');
            const response = await fetch('https://doctchat-backend.onrender.com/api/upload-document/', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    throw new Error('Session expired. Please login again.');
                }
                throw new Error(data.detail || data.error || 'Upload failed');
            }

            setSuccess(data.msg || 'PDF uploaded successfully!');
            setSelectedFile(null);
            setTitle('');
            setDescription('');

            const fileInput = document.getElementById('pdf-file');
            if (fileInput) fileInput.value = '';

            loadDocuments();

            console.log('Upload successful:', data);

        } catch (error) {
            console.error('Upload error:', error);
            setError(error.message || 'Upload failed. Please try again.');

            if (error.message.includes('login') || error.message.includes('Session expired')) {
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1500);
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleDocumentSelect = (document) => {
        setSelectedDocument(document);
        setShowNewChat(false); // Switch to document view when selecting document
        localStorage.setItem('currentPdf', JSON.stringify(document));
    };

    const goToChatWithDocument = (document) => {
        localStorage.setItem('currentPdf', JSON.stringify(document));
        window.location.href = '/chatpage';
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.removeItem('currentPdf');
        window.location.href = '/';
    };

     const handleNewChat = () => {
        setSelectedDocument(null);
        setShowNewChat(true);
    };


    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="flex h-screen bg-white dark:bg-gray-900 overflow-hidden">
            {/* ChatGPT-like Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col bg-gray-900 text-white transition-all duration-300 ease-in-out h-full`}>
                {/* Branding */}
                <div className="p-4 border-b border-gray-800">
                    {sidebarOpen ? (
                        <div>
                            <h1 className="text-xl font-bold text-orange-500">DoctChat</h1>
                            <p className="text-xs text-gray-400">Chat with your documents</p>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <h1 className="text-xl font-bold text-orange-500">DC</h1>
                        </div>
                    )}
                </div>
                
                {/* New Chat Button */}
                <div className="p-3">
                    <button
                        onClick={handleNewChat}
                        className="flex items-center justify-center w-full p-3 bg-orange-600 hover:bg-orange-700 rounded-md transition-colors text-sm gap-2"
                    >
                        {sidebarOpen ? (
                            <>
                                <Plus size={16} />
                                <span>New Chat</span>
                            </>
                        ) : (
                            <Plus size={20} />
                        )}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="p-3">
                        {sidebarOpen && <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2 px-2">Recent Documents</h3>}
                        
                        {isLoadingDocs ? (
                            <div className="text-center py-2 text-gray-400 text-xs">Loading...</div>
                        ) : documents.length === 0 ? (
                            <div className="text-center py-2 text-gray-400 text-xs">No documents</div>
                        ) : (
                            <div className="space-y-1">
                                {documents.map((doc) => (
                                    <button
                                        key={doc.id}
                                        className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                            selectedDocument?.id === doc.id 
                                                ? 'bg-orange-600/20 text-orange-400' 
                                                : 'hover:bg-gray-800'
                                        }`}
                                        onClick={() => handleDocumentSelect(doc)}
                                    >
                                        {sidebarOpen ? (
                                            <>
                                                <FileText size={16} className="flex-shrink-0" />
                                                <span className="truncate">{doc.title}</span>
                                            </>
                                        ) : (
                                            <FileText size={20} className="mx-auto" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="p-3 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleLogout}
                            className={`flex items-center gap-2 text-gray-300 hover:text-white transition-colors p-2 rounded-md hover:bg-gray-800 text-sm ${!sidebarOpen && 'justify-center'}`}
                        >
                            {sidebarOpen ? (
                                <>
                                    <LogOut size={16} />
                                    <span>Log out</span>
                                </>
                            ) : (
                                <LogOut size={20} />
                            )}
                        </button>
                        
                        <button 
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-gray-300 hover:text-white p-2 rounded-md hover:bg-gray-800"
                        >
                            {sidebarOpen ? (
                                <ChevronLeft size={16} />
                            ) : (
                                <ChevronRight size={16} />
                            )}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-800 overflow-hidden">
                {showNewChat ? (
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                                Upload Document
                            </h1>
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                <span className="hidden sm:inline">DoctChat</span>
                                <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
                                <span className="italic text-xs">Your document knowledge assistant</span>
                            </div>
                        </header>

                        {/* Upload Form */}
                        <div className="flex-1 overflow-auto">
                            <div className="max-w-lg mx-auto mt-10">
                                <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-6">
                                    <div className="flex justify-center mb-6">
                                        <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-600">
                                            <Upload size={24} className="text-gray-700 dark:text-gray-300" />
                                        </div>
                                    </div>
                                    
                                    <h2 className="text-lg font-semibold mb-6 text-center text-gray-900 dark:text-gray-300">
                                        Upload New PDF Document
                                    </h2>

                                    <form onSubmit={handleUpload} className="space-y-4">
                                        {error && (
                                            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3">
                                                <div className="text-sm text-red-700 dark:text-red-400">{error}</div>
                                            </div>
                                        )}

                                        {success && (
                                            <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-3">
                                                <div className="text-sm text-green-700 dark:text-green-400">{success}</div>
                                            </div>
                                        )}

                                        <div>
                                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                                                Document Title
                                            </label>
                                            <input
                                                id="title"
                                                name="title"
                                                type="text"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                disabled={isUploading}
                                                className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800 disabled:opacity-50"
                                                placeholder="Enter document title"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                                                Description (Optional)
                                            </label>
                                            <textarea
                                                id="description"
                                                name="description"
                                                rows={2}
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                disabled={isUploading}
                                                className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800 disabled:opacity-50"
                                                placeholder="Enter document description"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="pdf-file" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                                                PDF Document
                                            </label>
                                            <div className="mt-1 flex items-center justify-center px-6 py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                                                <div className="space-y-2 text-center">
                                                    <File className="mx-auto h-12 w-12 text-gray-400" />
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                                        <label htmlFor="pdf-file" className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-gray-700 dark:text-gray-300 hover:text-gray-500 focus-within:outline-none">
                                                            <span>Select a PDF file</span>
                                                            <input
                                                                id="pdf-file"
                                                                name="pdf-file"
                                                                type="file"
                                                                accept=".pdf"
                                                                required
                                                                onChange={handleFileChange}
                                                                disabled={isUploading}
                                                                className="sr-only"
                                                            />
                                                        </label>
                                                    </div>
                                                    <p className="text-xs text-gray-500">PDF up to 10MB</p>
                                                </div>
                                            </div>
                                            {selectedFile && (
                                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                                                    Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isUploading || !selectedFile}
                                            className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                        >
                                            {isUploading ? (
                                                <>
                                                    <span className="mr-2 animate-spin">◌</span>
                                                    Uploading...
                                                </>
                                            ) : (
                                                <>
                                                    <Upload size={16} className="mr-2" />
                                                    Upload PDF
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col h-full">
                        {/* Document Header */}
                        <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-200 truncate">
                                {selectedDocument?.title}
                            </h1>
                            <div className="flex items-center gap-4">
                                <div className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">
                                    <span>DoctChat</span>
                                    <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
                                    <span className="italic text-xs">Unlock your document's knowledge</span>
                                </div>
                                <button
                                    onClick={() => goToChatWithDocument(selectedDocument)}
                                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm font-medium flex items-center gap-2"
                                >
                                    <MessageSquare size={16} />
                                    Chat with Document
                                </button>
                            </div>
                        </header>

                        {/* Document Details */}
                        <div className="flex-1 overflow-auto p-6">
                            <div className="max-w-3xl mx-auto">
                                {selectedDocument && (
                                    <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-6">
                                        <div className="mb-8 flex justify-center">
                                            <div className="p-4 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                                                <FileText size={28} className="text-orange-600 dark:text-orange-400" />
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                                                    Title
                                                </label>
                                                <p className="mt-1 text-gray-900 dark:text-gray-300 text-lg">{selectedDocument.title}</p>
                                            </div>
                                            
                                            {selectedDocument.description && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                                                        Description
                                                    </label>
                                                    <p className="mt-1 text-gray-900 dark:text-gray-300">{selectedDocument.description}</p>
                                                </div>
                                            )}
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                                                    Uploaded Date
                                                </label>
                                                <p className="mt-1 text-gray-900 dark:text-gray-300">{formatDate(selectedDocument.uploaded_at)}</p>
                                            </div>
                                            
                                            <div className="pt-6">
                                                <button
                                                    onClick={() => goToChatWithDocument(selectedDocument)}
                                                    className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-md font-medium flex items-center justify-center gap-2"
                                                >
                                                    <MessageSquare size={16} />
                                                    Start Chat with This Document
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;