import React, { useState, useEffect } from 'react'

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

    // Load documents on component mount
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
            // Auto-generate title from filename if not set
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
            
            // Reload documents after successful upload
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
        // Store selected document in localStorage for chat page
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-80' : 'w-16'} bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
                {/* Sidebar Header */}
                <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                        <h2 className={`font-bold text-lg ${!sidebarOpen && 'hidden'}`}>
                            My Documents
                        </h2>
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-1 hover:bg-gray-700 rounded"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Documents List */}
                <div className="flex-1 overflow-y-auto p-2">
                    {sidebarOpen && (
                        <>
                            {isLoadingDocs ? (
                                <div className="text-center py-4 text-gray-400">Loading documents...</div>
                            ) : documents.length === 0 ? (
                                <div className="text-center py-4 text-gray-400">No documents uploaded yet</div>
                            ) : (
                                <div className="space-y-2">
                                    {documents.map((doc) => (
                                        <div
                                            key={doc.id}
                                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                                selectedDocument?.id === doc.id
                                                    ? 'bg-indigo-600'
                                                    : 'hover:bg-gray-700'
                                            }`}
                                            onClick={() => handleDocumentSelect(doc)}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-sm truncate">{doc.title}</h3>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {formatDate(doc.uploaded_at)}
                                                    </p>
                                                    {doc.description && (
                                                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                                            {doc.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        goToChatWithDocument(doc);
                                                    }}
                                                    className="ml-2 p-1 hover:bg-gray-600 rounded text-xs"
                                                    title="Chat with this document"
                                                >
                                                    💬
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-gray-700">
                    {sidebarOpen && (
                        <button
                            onClick={handleLogout}
                            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded text-sm font-medium"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {selectedDocument ? `Selected: ${selectedDocument.title}` : 'Dashboard'}
                            </h1>
                            <div className="flex items-center space-x-3">
                                {selectedDocument && (
                                    <button
                                        onClick={() => goToChatWithDocument(selectedDocument)}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                                    >
                                        Chat with Document
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-auto p-6">
                    {selectedDocument ? (
                        // Document Details View
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                                    Document Details
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Title
                                        </label>
                                        <p className="mt-1 text-gray-900 dark:text-white">{selectedDocument.title}</p>
                                    </div>
                                    {selectedDocument.description && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Description
                                            </label>
                                            <p className="mt-1 text-gray-900 dark:text-white">{selectedDocument.description}</p>
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Uploaded Date
                                        </label>
                                        <p className="mt-1 text-gray-900 dark:text-white">
                                            {formatDate(selectedDocument.uploaded_at)}
                                        </p>
                                    </div>
                                    <div className="pt-4">
                                        <button
                                            onClick={() => goToChatWithDocument(selectedDocument)}
                                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
                                        >
                                            Start Chat with This Document
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Upload Form
                        <div className="max-w-md mx-auto">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                <h2 className="text-xl font-bold mb-6 text-center text-gray-900 dark:text-white">
                                    Upload New PDF Document
                                </h2>

                                <form onSubmit={handleUpload} className="space-y-4">
                                    {error && (
                                        <div className="rounded-md bg-red-50 p-3 dark:bg-red-900/20">
                                            <div className="text-sm text-red-700 dark:text-red-400">
                                                {error}
                                            </div>
                                        </div>
                                    )}

                                    {success && (
                                        <div className="rounded-md bg-green-50 p-3 dark:bg-green-900/20">
                                            <div className="text-sm text-green-700 dark:text-green-400">
                                                {success}
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Document Title
                                        </label>
                                        <input
                                            id="title"
                                            name="title"
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            disabled={isUploading}
                                            className="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 dark:bg-white/5 dark:text-white dark:outline-white/10 disabled:opacity-50"
                                            placeholder="Enter document title"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Description (Optional)
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            rows={2}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            disabled={isUploading}
                                            className="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 dark:bg-white/5 dark:text-white dark:outline-white/10 disabled:opacity-50"
                                            placeholder="Enter document description"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="pdf-file" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            PDF Document
                                        </label>
                                        <input
                                            id="pdf-file"
                                            name="pdf-file"
                                            type="file"
                                            accept=".pdf"
                                            required
                                            onChange={handleFileChange}
                                            disabled={isUploading}
                                            className="mt-1 block w-full text-sm text-gray-900 file:mr-3 file:rounded file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100 dark:text-white dark:file:bg-indigo-900/50 dark:file:text-indigo-300"
                                        />
                                        {selectedFile && (
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isUploading || !selectedFile}
                                        className="w-full flex justify-center items-center py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isUploading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Uploading...
                                            </>
                                        ) : 'Upload PDF'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;