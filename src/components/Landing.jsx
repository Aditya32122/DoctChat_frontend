import React, { useState, useEffect } from 'react';
import { FileText, MessageSquare, Zap, Brain, Upload, Search, ArrowRight, Menu, X, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock login state
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to handle navigation
  const handleNavigate = (path) => {
    // Close mobile menu if it's open
    if (isMenuOpen) setIsMenuOpen(false);
    navigate(path);
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Advanced AI understands context and nuance in your documents for meaningful conversations"
    },
    {
      icon: Search,
      title: "Instant Document Search",
      description: "Find specific information across all your PDFs in seconds with intelligent semantic search"
    },
    {
      icon: MessageSquare,
      title: "Natural Conversations",
      description: "Ask questions in plain language and get accurate, contextual answers from your documents"
    },
    {
      icon: Upload,
      title: "Easy Upload & Organize",
      description: "Drag and drop your PDFs, organize them into collections, and start chatting immediately"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get instant responses powered by cutting-edge technology and optimized processing"
    },
    {
      icon: FileText,
      title: "Multi-Document Analysis",
      description: "Compare and analyze information across multiple documents simultaneously"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                DoctChat
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium">How it Works</a>
              <a href="#pricing" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium">Pricing</a>
              {isLoggedIn ? (
                <button 
                  onClick={() => handleNavigate('/dashboard')}
                  className="bg-orange-600 dark:bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-500 dark:hover:bg-orange-400 transition-all duration-200 transform hover:scale-105 shadow-md"
                >
                  Go to Dashboard
                </button>
              ) : (
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => handleNavigate('/login')}
                    className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => handleNavigate('/signup')}
                    className="bg-orange-600 dark:bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-500 dark:hover:bg-orange-400 transition-all duration-200 transform hover:scale-105 shadow-md"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6 text-gray-700 dark:text-gray-300" /> : <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 shadow-lg">
            <div className="px-4 py-6 space-y-3">
              <a href="#features" className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-200 font-medium">Features</a>
              <a href="#how-it-works" className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-200 font-medium">How it Works</a>
              <a href="#pricing" className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-200 font-medium">Pricing</a>
              {isLoggedIn ? (
                <button
                  onClick={() => handleNavigate('/dashboard')}
                  className="block w-full bg-orange-600 dark:bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-500 dark:hover:bg-orange-400 transition-all duration-300 shadow-md hover:shadow-lg mt-2 text-center"
                >
                  Go to Dashboard
                </button>
              ) : (
                <div className="space-y-3 mt-2">
                  <button
                    onClick={() => handleNavigate('/login')}
                    className="block w-full text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-center"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleNavigate('/signup')}
                    className="block w-full bg-orange-600 dark:bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-500 dark:hover:bg-orange-400 transition-all duration-300 shadow-md hover:shadow-lg text-center"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div 
            className="transform transition-all duration-1000 ease-out"
            style={{ 
              transform: `translateY(${scrollY * 0.1}px)`,
              opacity: Math.max(0, 1 - scrollY * 0.001)
            }}
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="text-gray-900 dark:text-white">
                Chat with your PDFs
              </span>
              <br />
              <span className="text-orange-600 dark:text-orange-500 animate-pulse">
                intelligently
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform any PDF into an intelligent conversation partner. Upload, ask, and discover insights like never before.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              {isLoggedIn ? (
                <button 
                  onClick={() => handleNavigate('/dashboard')}
                  className="group bg-orange-600 dark:bg-orange-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-orange-500 dark:hover:bg-orange-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <>
                  <button
                  onClick={() => {
                    const token = localStorage.getItem('token'); 
                    if (token) {
                      handleNavigate('/dashboard');
                    } else {
                      handleNavigate('/login');
                    }
                  }}
                  className="group bg-orange-600 dark:bg-orange-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-orange-500 dark:hover:bg-orange-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center"
                >
                  Get Started
                </button>
                  <button 
                    onClick={() => handleNavigate('/demo')}
                    className="border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl text-lg font-semibold hover:border-orange-500 dark:hover:border-orange-400 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300 transform hover:scale-105 inline-flex items-center"
                  >
                    Watch Demo
                  </button>
                </>
              )}
            </div>

            {/* Animated PDF Preview */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-900/30 p-8 transform hover:scale-105 transition-all duration-500">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded-full mb-2 animate-pulse"></div>
                    <div className="h-3 bg-slate-100 rounded-full w-2/3 animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-slate-100 rounded-full animate-pulse"></div>
                  <div className="h-3 bg-slate-100 rounded-full w-4/5 animate-pulse"></div>
                  <div className="h-3 bg-slate-100 rounded-full w-3/5 animate-pulse"></div>
                </div>
                <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-orange-600" />
                    <span className="text-slate-700 italic">"What are the key findings in this research?"</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Everything you need to unlock the full potential of your documents
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-white dark:bg-gray-800/80 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-800/30"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              How it Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-white " >
            {[
              { step: "1", title: "Upload Your PDFs", description: "Drag and drop your documents or select them from your device", icon: Upload },
              { step: "2", title: "Ask Questions", description: "Type your questions in natural language about your documents", icon: MessageSquare },
              { step: "3", title: "Get Intelligent Answers", description: "Receive accurate, contextual responses with source citations", icon: Brain }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8 mx-auto w-24 h-24 border-4 border-white rounded-full flex items-center justify-center shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  {item.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
              Ready to transform how you work with documents?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who are already chatting with their PDFs intelligently.
            </p>
            {isLoggedIn ? (
              <button 
                onClick={() => handleNavigate('/dashboard')}
                className="bg-orange-600 dark:bg-orange-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-orange-500 dark:hover:bg-orange-400 transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            ) : (
              <button 
                onClick={() => handleNavigate('/signup')}
                className="bg-orange-600 dark:bg-orange-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-orange-500 dark:hover:bg-orange-400 transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">DoctChat</span>
            </div>
            <div className="flex space-x-8">
              <button onClick={() => handleNavigate('/privacy')} className="text-gray-400 hover:text-orange-500 transition-colors">Privacy</button>
              <button onClick={() => handleNavigate('/terms')} className="text-gray-400 hover:text-orange-500 transition-colors">Terms</button>
              <button onClick={() => handleNavigate('/support')} className="text-gray-400 hover:text-orange-500 transition-colors">Support</button>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 DoctChat. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;