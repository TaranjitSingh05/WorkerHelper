import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useClerkAuth } from '../../contexts/ClerkAuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Icon from '../AppIcon';
import { sendMessage, getHealthTopicSuggestions, detectEmergencyKeywords } from '../../utils/gemini';
import voiceManager from '../../utils/voice';

const FloatingHealthChatbot = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { workerData } = useClerkAuth();
  
  // UI State
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Chat state
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm your AI health assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState('en');
  
  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false); // Default off for floating widget
  const [microphonePermission, setMicrophonePermission] = useState(null);
  
  // UI state
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatboxRef = useRef(null);
  
  // Auto-detect language based on user input
  const detectAndSetLanguage = (text) => {
    const detectedLang = voiceManager.detectLanguage(text);
    if (detectedLang !== detectedLanguage) {
      console.log('🔍 Language detected:', detectedLang, 'for text:', text.substring(0, 50));
      setDetectedLanguage(detectedLang);
      voiceManager.setLanguage(detectedLang);
    }
    return detectedLang;
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Set initial voice language
  useEffect(() => {
    voiceManager.setLanguage(detectedLanguage);
  }, [detectedLanguage]);

  // Auto-minimize when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatboxRef.current && !chatboxRef.current.contains(event.target) && isOpen && !isMinimized) {
        setIsMinimized(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, isMinimized]);

  const checkMicrophonePermission = async () => {
    const hasPermission = await voiceManager.requestMicrophonePermission();
    setMicrophonePermission(hasPermission);
  };

  const handleSendMessage = async (messageText = inputText) => {
    if (!messageText.trim() || isLoading) return;

    // Auto-detect language from user input
    const detectedLang = detectAndSetLanguage(messageText.trim());

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText.trim(),
      timestamp: new Date(),
      language: detectedLang
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setShowSuggestions(false);
    setHasNewMessage(false);

    // Check for emergency keywords
    const isEmergency = detectEmergencyKeywords(messageText);
    if (isEmergency) {
      const emergencyResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: "🚨 **EMERGENCY** 🚨\n\nThis may be a medical emergency. Please:\n• **Call emergency services immediately (108/911)**\n• **Go to the nearest hospital**\n• **Don't wait for online advice**\n\nSeek immediate professional medical help.",
        timestamp: new Date(),
        isEmergency: true
      };
      
      setMessages(prev => [...prev, emergencyResponse]);
      setIsLoading(false);
      setHasNewMessage(true);
      
      // Speak emergency message if voice is enabled
      if (voiceEnabled && !isSpeaking) {
        speakMessage("Emergency detected. Please call emergency services immediately.");
      }
      return;
    }

    try {
      // Prepare user context from worker data
      const userContext = {};
      if (user) {
        userContext.name = user.firstName || workerData?.full_name;
      }
      
      if (workerData) {
        userContext.occupation = workerData.occupation_type;
        userContext.healthData = {
          age: workerData.age,
          gender: workerData.gender,
          chronicDiseases: workerData.chronic_diseases?.split(',').filter(Boolean) || []
        };
      }

      const response = await sendMessage(messageText, userContext);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setHasNewMessage(true);
      
      // Speak the response if voice is enabled
      if (voiceEnabled && !isSpeaking) {
        speakMessage(response);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I'm sorry, I encountered an error. Please try again or consult a healthcare professional if urgent.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setHasNewMessage(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputText(suggestion);
    handleSendMessage(suggestion);
  };

  const startVoiceRecognition = async () => {
    console.log('🎤 Starting voice recognition...');
    
    // Check browser support first
    if (!voiceManager.isSpeechRecognitionSupported()) {
      const browserInfo = `Browser: ${navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Other'}`;
      alert(`Voice recognition is not supported in your browser.\n\n${browserInfo}\n\nTry using Chrome or Edge for better voice support.`);
      return;
    }

    // Check microphone permission
    if (!microphonePermission) {
      console.log('🔐 Requesting microphone permission...');
      const hasPermission = await voiceManager.requestMicrophonePermission();
      setMicrophonePermission(hasPermission);
      if (!hasPermission) {
        alert('Microphone permission is required for voice input.\n\nPlease:\n1. Click the microphone icon in your browser address bar\n2. Allow microphone access\n3. Try again');
        return;
      }
    }

    setIsListening(true);
    voiceManager.stopSpeaking();

    console.log('👂 Starting to listen for voice input...');
    
    voiceManager.startListening(
      (transcript, confidence) => {
        console.log('✅ Voice input received:', { transcript, confidence });
        setInputText(transcript);
        
        // For floating chatbot, auto-send even with lower confidence
        if (confidence > 0.5 && transcript.trim().length > 2) {
          console.log('📤 Auto-sending voice message');
          setTimeout(() => {
            setIsListening(false);
            handleSendMessage(transcript);
          }, 800);
        } else {
          // Just set the text, let user decide to send
          setIsListening(false);
          console.log('📝 Voice text set, waiting for user to send');
        }
      },
      (error) => {
        console.error('❌ Voice recognition error:', error);
        setIsListening(false);
        
        // Show helpful error messages
        if (error.includes('not-allowed') || error.includes('permission')) {
          alert('Microphone access denied.\n\nTo fix this:\n1. Click the microphone icon in your address bar\n2. Choose "Always allow"\n3. Refresh the page');
        } else if (error.includes('network')) {
          alert('Network error for voice recognition.\n\nPlease check your internet connection.');
        } else if (!error.includes('No speech detected') && !error.includes('aborted')) {
          alert(`Voice recognition error:\n${error}\n\nTry speaking clearly and check your microphone.`);
        }
      },
      () => {
        console.log('🏁 Voice recognition ended');
        setIsListening(false);
      }
    );
  };

  const stopVoiceRecognition = () => {
    voiceManager.stopListening();
    setIsListening(false);
  };

  const speakMessage = async (text) => {
    if (!voiceManager.isTextToSpeechSupported()) {
      return;
    }

    try {
      setIsSpeaking(true);
      await voiceManager.speak(text, { 
        lang: voiceManager.getSupportedLanguages()[detectedLanguage]?.code,
        rate: 0.9,
        volume: 0.8
      });
    } catch (error) {
      console.error('Text-to-speech error:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    voiceManager.stopSpeaking();
    setIsSpeaking(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const toggleChatbot = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
      setHasNewMessage(false);
      // Focus input when opening
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setIsOpen(false);
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    setHasNewMessage(false);
  };

  // Don't render if user is not signed in
  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={toggleChatbot}
            className={`w-16 h-16 bg-primary rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110 ${
              hasNewMessage ? 'animate-bounce' : ''
            }`}
            title="Open Health Assistant"
          >
            <Icon name="Bot" size={24} className="text-white" />
            {hasNewMessage && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            )}
          </button>
        )}

        {/* Chat Window */}
        {isOpen && (
          <div
            ref={chatboxRef}
            className={`bg-card rounded-2xl shadow-2xl border border-border transition-all duration-300 ${
              isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
            }`}
            style={{ 
              transformOrigin: 'bottom right',
              marginBottom: isMinimized ? '0' : '80px',
              marginRight: isMinimized ? '0' : '0'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-primary rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Icon name="Bot" size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-white text-sm">HealthBot</h3>
                  {!isMinimized && (
                    <p className="text-white/80 text-xs">AI Medical Assistant</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {!isMinimized && (
                  <>
                    {/* Language Indicator (Auto-detected) */}
                    <div className="text-xs text-white/80 px-2 py-1 bg-white/10 rounded">
                      {detectedLanguage.toUpperCase()}
                    </div>
                    
                    {/* Voice Toggle */}
                    <Button
                      variant={voiceEnabled ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => setVoiceEnabled(!voiceEnabled)}
                      iconName={voiceEnabled ? "Volume2" : "VolumeX"}
                      className="w-8 h-8 p-0"
                    />
                  </>
                )}
                
                {/* Minimize Button */}
                <button
                  onClick={toggleMinimize}
                  className="text-white/80 hover:text-white p-1 rounded"
                >
                  <Icon name={isMinimized ? "ChevronUp" : "Minus"} size={16} />
                </button>
                
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white p-1 rounded"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 h-80">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] p-2 rounded-lg text-sm ${
                          message.type === 'user'
                            ? 'bg-primary text-white'
                            : message.isEmergency
                            ? 'bg-red-100 border-red-500 border text-red-900'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        <div className="text-xs mt-1 opacity-70">
                          {formatTimestamp(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted p-2 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Icon name="Loader" size={12} className="animate-spin" />
                          <span className="text-xs">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Suggestions */}
                {showSuggestions && (
                  <div className="px-4 pb-2">
                    <div className="flex flex-wrap gap-1">
                      {getHealthTopicSuggestions().slice(0, 2).map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded-md transition-colors"
                        >
                          {suggestion.split(' ').slice(0, 2).join(' ')}...
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <Input
                        ref={inputRef}
                        type="text"
                        placeholder="Ask your health question..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                        className="text-sm h-8"
                      />
                    </div>
                    
                    {/* Voice Input Button */}
                    {voiceManager.isSpeechRecognitionSupported() && (
                      <Button
                        variant={isListening ? "destructive" : "outline"}
                        size="sm"
                        onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
                        disabled={isLoading}
                        iconName={isListening ? "Square" : "Mic"}
                        className={`w-8 h-8 p-0 ${isListening ? "animate-pulse" : ""}`}
                      />
                    )}
                    
                    {/* Send Button */}
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleSendMessage()}
                      disabled={isLoading || !inputText.trim()}
                      iconName={isLoading ? "Loader" : "Send"}
                      className={`w-8 h-8 p-0 ${isLoading ? "animate-spin" : ""}`}
                    />
                  </div>
                  
                  {/* Voice Status */}
                  {isListening && (
                    <div className="mt-2 text-center">
                      <div className="flex items-center justify-center space-x-2 text-xs text-primary font-medium">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span>🎤 Listening... Speak now!</span>
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Speak clearly into your microphone
                      </div>
                    </div>
                  )}
                  
                  {/* Voice Debug Info */}
                  <div className="mt-1 text-center">
                    <div className="text-xs text-muted-foreground">
                      Voice: {voiceManager.isSpeechRecognitionSupported() ? '✅' : '❌'} | 
                      Mic: {microphonePermission === true ? '✅' : microphonePermission === false ? '❌' : '❓'}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default FloatingHealthChatbot;