// Voice utility for speech-to-text and text-to-speech functionality

class VoiceManager {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isListening = false;
    this.currentLanguage = 'en-US';
    this.supportedLanguages = {
      'en': { code: 'en-US', name: 'English', voice: 'en-US' },
      'hi': { code: 'hi-IN', name: 'हिन्दी', voice: 'hi-IN' },
      'bn': { code: 'bn-IN', name: 'বাংলা', voice: 'bn-IN' },
      'ta': { code: 'ta-IN', name: 'தமிழ்', voice: 'ta-IN' },
      'ml': { code: 'ml-IN', name: 'മലയാളം', voice: 'ml-IN' },
      'pa': { code: 'pa-IN', name: 'ਪੰਜਾਬੀ', voice: 'pa-IN' },
      'te': { code: 'te-IN', name: 'తెలుగు', voice: 'te-IN' },
      'kn': { code: 'kn-IN', name: 'ಕನ್ನಡ', voice: 'kn-IN' },
      'gu': { code: 'gu-IN', name: 'ગુજરાતી', voice: 'gu-IN' },
      'mr': { code: 'mr-IN', name: 'मराठी', voice: 'mr-IN' },
    };
    this.initializeSpeechRecognition();
  }

  // Initialize speech recognition
  initializeSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    // Configure recognition settings
    this.recognition.continuous = false;
    this.recognition.interimResults = true; // Enable interim results for better feedback
    this.recognition.maxAlternatives = 3;
    this.recognition.lang = this.currentLanguage;
    
    console.log('Speech recognition initialized with language:', this.currentLanguage);
  }

  // Check if speech recognition is supported
  isSpeechRecognitionSupported() {
    const hasSupport = this.recognition !== null;
    console.log('Speech recognition support check:', {
      hasSupport,
      hasWebkitSpeechRecognition: 'webkitSpeechRecognition' in window,
      hasSpeechRecognition: 'SpeechRecognition' in window,
      userAgent: navigator.userAgent,
      language: navigator.language
    });
    return hasSupport;
  }

  // Check if text-to-speech is supported
  isTextToSpeechSupported() {
    return 'speechSynthesis' in window;
  }

  // Set language for both recognition and synthesis
  setLanguage(languageCode) {
    if (this.supportedLanguages[languageCode]) {
      this.currentLanguage = this.supportedLanguages[languageCode].code;
      if (this.recognition) {
        this.recognition.lang = this.currentLanguage;
      }
    }
  }

  // Get current language
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  // Get supported languages
  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  // Start voice recognition
  async startListening(onResult, onError, onEnd) {
    if (!this.recognition) {
      console.error('Speech recognition not available');
      onError && onError('Speech recognition not supported in this browser');
      return;
    }

    if (this.isListening) {
      console.log('Already listening, ignoring start request');
      return;
    }

    // First ensure we have microphone permission
    try {
      const hasPermission = await this.requestMicrophonePermission();
      if (!hasPermission) {
        onError && onError('Microphone permission is required for voice input');
        return;
      }
    } catch (error) {
      console.error('Error requesting microphone permission:', error);
      onError && onError('Unable to access microphone');
      return;
    }

    this.isListening = true;
    console.log('Starting speech recognition...');

    // Reset recognition settings for better speech completion detection
    this.recognition.continuous = true; // Allow continuous listening
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 3;
    this.recognition.lang = this.currentLanguage;

    let finalTranscript = '';
    let interimTranscript = '';
    let speechEndTimer = null;
    let hasReceivedSpeech = false;

    this.recognition.onstart = () => {
      console.log('✅ Speech recognition started successfully');
    };

    this.recognition.onaudiostart = () => {
      console.log('🎤 Audio input started');
    };

    this.recognition.onsoundstart = () => {
      console.log('🔊 Sound detected');
    };

    this.recognition.onspeechstart = () => {
      console.log('🗣️ Speech detected');
    };

    this.recognition.onresult = (event) => {
      console.log('📝 Speech recognition result event:', event);
      hasReceivedSpeech = true;
      
      // Clear any existing timer
      if (speechEndTimer) {
        clearTimeout(speechEndTimer);
        speechEndTimer = null;
      }
      
      interimTranscript = '';
      let newFinalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence;
        
        console.log(`Result ${i}:`, { transcript, confidence, isFinal: result.isFinal });
        
        if (result.isFinal) {
          newFinalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      // Update final transcript
      finalTranscript += newFinalTranscript;

      // Show current progress to user
      const currentTranscript = finalTranscript + interimTranscript;
      if (currentTranscript.trim()) {
        console.log('🎯 Showing interim result:', { transcript: currentTranscript });
        // Don't call onResult yet, just show the text
      }
      
      // If we got final results, start a timer to wait for more speech
      if (newFinalTranscript.trim()) {
        console.log('⏳ Final result received, waiting for speech end...');
        speechEndTimer = setTimeout(() => {
          console.log('🏁 Speech appears to be complete');
          const completeTranscript = finalTranscript.trim();
          if (completeTranscript && hasReceivedSpeech) {
            const confidence = event.results[event.results.length - 1][0].confidence || 0.9;
            console.log('🎯 Calling onResult with complete speech:', { transcript: completeTranscript, confidence });
            onResult && onResult(completeTranscript, confidence);
            this.stopListening();
          }
        }, 2000); // Wait 2 seconds after final result before processing
      }
    };

    this.recognition.onerror = (event) => {
      console.error('❌ Speech recognition error:', event.error, event);
      this.isListening = false;
      
      let errorMessage = 'Voice recognition error';
      switch (event.error) {
        case 'no-speech':
          console.log('⚠️ No speech detected');
          onEnd && onEnd();
          return; // Don't show error for no speech
        case 'audio-capture':
          errorMessage = 'Microphone not accessible. Please check permissions.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone permission denied. Please allow microphone access.';
          break;
        case 'network':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        case 'language-not-supported':
          errorMessage = `Language ${this.currentLanguage} not supported for voice recognition.`;
          break;
        case 'aborted':
          console.log('🛑 Speech recognition aborted');
          onEnd && onEnd();
          return; // Don't show error for abort
        case 'service-not-allowed':
          errorMessage = 'Speech recognition service not allowed. Please check browser settings.';
          break;
        default:
          errorMessage = `Voice recognition error: ${event.error}`;
      }
      
      console.error('Reporting error:', errorMessage);
      onError && onError(errorMessage);
    };

    this.recognition.onend = () => {
      console.log('🏁 Speech recognition ended');
      this.isListening = false;
      onEnd && onEnd();
    };

    try {
      console.log('🚀 Attempting to start recognition...');
      this.recognition.start();
      
      // Set a longer timeout for better user experience
      setTimeout(() => {
        if (this.isListening) {
          console.log('⏰ Speech recognition timeout after 15 seconds');
          this.stopListening();
        }
      }, 15000); // 15 seconds timeout
      
    } catch (error) {
      console.error('💥 Failed to start speech recognition:', error);
      this.isListening = false;
      onError && onError('Failed to start voice recognition: ' + error.message);
    }
  }

  // Stop voice recognition
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // Check if currently listening
  getIsListening() {
    return this.isListening;
  }

  // Text-to-speech functionality
  speak(text, options = {}) {
    if (!this.isTextToSpeechSupported()) {
      console.warn('Text-to-speech not supported');
      return Promise.reject('Text-to-speech not supported');
    }

    // Stop any ongoing speech
    this.stopSpeaking();

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set voice properties
      utterance.lang = options.lang || this.currentLanguage;
      utterance.rate = options.rate || 0.9;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 0.8;

      // Find appropriate voice
      const voices = this.synthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang === utterance.lang || 
        voice.lang.startsWith(utterance.lang.split('-')[0])
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => {
        console.log('Speech synthesis finished');
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        reject(event.error);
      };

      try {
        this.synthesis.speak(utterance);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Stop text-to-speech
  stopSpeaking() {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }
  }

  // Check if currently speaking
  isSpeaking() {
    return this.synthesis.speaking;
  }

  // Get available voices
  getAvailableVoices() {
    return this.synthesis.getVoices();
  }

  // Auto-detect language from text (basic implementation)
  detectLanguage(text) {
    const patterns = {
      'hi': /[\u0900-\u097F]/,  // Devanagari script
      'bn': /[\u0980-\u09FF]/,  // Bengali script
      'ta': /[\u0B80-\u0BFF]/,  // Tamil script
      'ml': /[\u0D00-\u0D7F]/,  // Malayalam script
      'te': /[\u0C00-\u0C7F]/,  // Telugu script
      'kn': /[\u0C80-\u0CFF]/,  // Kannada script
      'gu': /[\u0A80-\u0AFF]/,  // Gujarati script
      'pa': /[\u0A00-\u0A7F]/,  // Punjabi script
      'mr': /[\u0900-\u097F]/,  // Marathi uses Devanagari
    };

    for (const [lang, pattern] of Object.entries(patterns)) {
      if (pattern.test(text)) {
        return lang;
      }
    }

    return 'en'; // Default to English
  }

  // Request microphone permission
  async requestMicrophonePermission() {
    try {
      // First check if we already have permission
      const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
      
      if (permissionStatus.state === 'granted') {
        return true;
      }
      
      if (permissionStatus.state === 'denied') {
        console.warn('Microphone permission was denied');
        return false;
      }
      
      // Request permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      // Stop the stream since we just needed permission
      stream.getTracks().forEach(track => track.stop());
      
      return true;
    } catch (error) {
      console.error('Microphone permission error:', error);
      
      if (error.name === 'NotAllowedError') {
        console.warn('Microphone permission denied by user');
      } else if (error.name === 'NotFoundError') {
        console.warn('No microphone found');
      } else {
        console.warn('Error accessing microphone:', error.message);
      }
      
      return false;
    }
  }
}

// Create a singleton instance
const voiceManager = new VoiceManager();

export default voiceManager;