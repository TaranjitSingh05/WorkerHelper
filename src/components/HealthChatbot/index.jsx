import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useClerkAuth } from '../../contexts/ClerkAuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Icon from '../AppIcon';
import { sendMessage, getHealthTopicSuggestions, detectEmergencyKeywords } from '../../utils/gemini';
import voiceManager from '../../utils/voice';

const HealthChatbot = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { workerData } = useClerkAuth();
  
  // Chat state
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm HealthBot, your medical assistant. I'm here to help you with health-related questions and provide guidance. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  
  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [microphonePermission, setMicrophonePermission] = useState(null);
  
  // UI state
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // Language options
  const languageOptions = [
    { value: 'en', label: '🇺🇸 English' },
    { value: 'hi', label: '🇮🇳 हिन्दी' },
    { value: 'bn', label: '🇧🇩 বাংলা' },
    { value: 'ta', label: '🇮🇳 தமிழ்' },
    { value: 'ml', label: '🇮🇳 മലയാളം' },
    { value: 'pa', label: '🇮🇳 ਪੰਜਾਬੀ' },
    { value: 'te', label: '🇮🇳 తెలుగు' },
    { value: 'kn', label: '🇮🇳 ಕನ್ನಡ' },
    { value: 'gu', label: '🇮🇳 ગુજરાતી' },
    { value: 'mr', label: '🇮🇳 मराठी' },
  ];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check microphone permission on mount
  useEffect(() => {
    checkMicrophonePermission();
    
    // Set voice language when component language changes
    voiceManager.setLanguage(currentLanguage);
  }, [currentLanguage]);

  const checkMicrophonePermission = async () => {
    const hasPermission = await voiceManager.requestMicrophonePermission();
    setMicrophonePermission(hasPermission);
  };

  const handleSendMessage = async (messageText = inputText) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setShowSuggestions(false);

    // Check for emergency keywords
    const isEmergency = detectEmergencyKeywords(messageText);
    if (isEmergency) {
      const emergencyResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: "🚨 **EMERGENCY ALERT** 🚨\n\nBased on your message, this may be a medical emergency. Please:\n\n• **Call emergency services immediately (108 in India, 911 in US)**\n• **Go to the nearest hospital emergency room**\n• **Don't wait for online advice**\n\nYour safety is the top priority. Seek immediate professional medical help.",
        timestamp: new Date(),
        isEmergency: true
      };
      
      setMessages(prev => [...prev, emergencyResponse]);
      setIsLoading(false);
      
      // Speak emergency message if voice is enabled
      if (voiceEnabled && !isSpeaking) {
        speakMessage("Emergency detected. Please call emergency services immediately and seek professional medical help.");
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
      
      // Speak the response if voice is enabled
      if (voiceEnabled && !isSpeaking) {
        speakMessage(response);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I'm sorry, I encountered an error while processing your request. Please try again, or contact a healthcare professional if your question is urgent.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputText(suggestion);
    handleSendMessage(suggestion);
  };

  const startVoiceRecognition = async () => {
    if (!microphonePermission) {
      const hasPermission = await voiceManager.requestMicrophonePermission();
      setMicrophonePermission(hasPermission);
      if (!hasPermission) {
        alert('Microphone permission is required for voice input. Please enable it in your browser settings.');
        return;
      }
    }

    if (!voiceManager.isSpeechRecognitionSupported()) {
      alert('Voice recognition is not supported in your browser. Please use a modern browser like Chrome or Edge.');
      return;
    }

    setIsListening(true);
    voiceManager.stopSpeaking(); // Stop any ongoing speech

    voiceManager.startListening(
      (transcript, confidence) => {
        console.log('Voice input received:', transcript, 'Confidence:', confidence);
        setInputText(transcript);
        setIsListening(false);
        
        // Auto-send if confidence is high
        if (confidence > 0.7) {
          setTimeout(() => handleSendMessage(transcript), 500);
        }
      },
      (error) => {
        console.error('Voice recognition error:', error);
        setIsListening(false);
        alert(`Voice recognition error: ${error}`);
      },
      () => {
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
      console.warn('Text-to-speech not supported');
      return;
    }

    try {
      setIsSpeaking(true);
      
      // Detect language and set appropriate voice
      const detectedLang = voiceManager.detectLanguage(text);
      const voiceLang = voiceManager.getSupportedLanguages()[detectedLang]?.code || currentLanguage;
      
      await voiceManager.speak(text, { 
        lang: voiceManager.getSupportedLanguages()[currentLanguage]?.code,
        rate: 0.9,
        pitch: 1,
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

  // Authentication guard
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-96">
        <Icon name="Loader" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="bg-card rounded-xl border border-border p-8 text-center">
        <Icon name="Lock" size={48} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Sign In Required</h2>
        <p className="text-muted-foreground mb-6">
          Please sign in to access the medical chatbot.
        </p>
        <Button
          variant="default"
          size="lg"
          onClick={() => window.location.href = '/sign-in'}
          iconName="LogIn"
          iconPosition="left"
        >
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Icon name="Bot" size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">HealthBot</h3>
            <p className="text-sm text-muted-foreground">Medical Assistant</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Language Selector */}
          <Select
            options={languageOptions}
            value={currentLanguage}
            onChange={setCurrentLanguage}
            placeholder="Language"
            className="w-32"
          />
          
          {/* Voice Toggle */}
          <Button
            variant={voiceEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            iconName={voiceEnabled ? "Volume2" : "VolumeX"}
          />
          
          {/* Speaking Indicator */}
          {isSpeaking && (
            <Button
              variant="destructive"
              size="sm"
              onClick={stopSpeaking}
              iconName="Square"
              className="animate-pulse"
            >
              Stop
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-primary text-white'
                  : message.isEmergency
                  ? 'bg-red-100 border-red-500 border text-red-900'
                  : 'bg-muted text-foreground'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              <div className={`text-xs mt-1 opacity-70`}>
                {formatTimestamp(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="Loader" size={16} className="animate-spin" />
                <span className="text-sm">HealthBot is typing...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {showSuggestions && (
        <div className="px-4 pb-2">
          <div className="text-xs text-muted-foreground mb-2">Quick suggestions:</div>
          <div className="flex flex-wrap gap-2">
            {getHealthTopicSuggestions().slice(0, 4).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 rounded-full transition-colors"
              >
                {suggestion}
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
              type="textarea"
              placeholder="Ask your health question..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="resize-none"
              rows={1}
            />
          </div>
          
          {/* Voice Input Button */}
          {voiceManager.isSpeechRecognitionSupported() && (
            <Button
              variant={isListening ? "destructive" : "outline"}
              size="lg"
              onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
              disabled={isLoading}
              iconName={isListening ? "Square" : "Mic"}
              className={isListening ? "animate-pulse" : ""}
            />
          )}
          
          {/* Send Button */}
          <Button
            variant="default"
            size="lg"
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputText.trim()}
            iconName={isLoading ? "Loader" : "Send"}
            className={isLoading ? "animate-spin" : ""}
          />
        </div>
        
        {/* Voice Status */}
        {isListening && (
          <div className="mt-2 text-center">
            <div className="text-sm text-primary font-medium">
              🎤 Listening... Speak your question
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthChatbot;