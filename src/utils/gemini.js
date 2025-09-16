import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Medical chatbot system prompt
const MEDICAL_SYSTEM_PROMPT = `You are HealthBot, an AI medical assistant for workers. You provide quick, helpful health guidance while maintaining safety..

IMPORTANT GUIDELINES:
1. **Response Style**: Keep responses SHORT (2-3 sentences max), conversational, and easy to understand.

2. **Language Detection**: AUTOMATICALLY detect the language of the user's question and respond in the SAME language. Do not ask which language to use.

3. **Emergency Situations**: If someone describes emergency symptoms (chest pain, difficulty breathing, severe injury), immediately say: "🚨 This sounds urgent! Call emergency services (108/911) right away!"

4. **Quick Help**: Provide concise guidance for:
   - Common symptoms and basic care
   - First aid basics
   - When to see a doctor
   - Workplace health tips
   - General wellness advice

5. **Always Include**: End serious health responses with "See a doctor if symptoms worsen."

6. **Worker-Focused**: Remember users are often workers with limited time and healthcare access.

7. **Multilingual**: Respond in the same language as the question (English, Hindi, Bengali, Tamil, Malayalam, Punjabi, etc.).

8. **Tone**: Be friendly, direct, and supportive. Like talking to a knowledgeable friend.

Keep it SHORT and helpful!`;

// Initialize the model with medical configuration
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: MEDICAL_SYSTEM_PROMPT,
  generationConfig: {
    temperature: 0.7,
    topP: 0.9,
    maxOutputTokens: 1024,
  },
  safetySettings: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_LOW_AND_ABOVE",
    },
  ],
});

// Chat session management
let chatSession = null;

export const initializeChatSession = () => {
  chatSession = model.startChat({
    history: [],
  });
  return chatSession;
};

export const sendMessage = async (message, userContext = {}) => {
  try {
    if (!chatSession) {
      initializeChatSession();
    }

    // Add user context if available
    let contextualMessage = message;
    if (userContext.name || userContext.occupation || userContext.healthData) {
      const context = [];
      if (userContext.name) context.push(`User name: ${userContext.name}`);
      if (userContext.occupation) context.push(`Occupation: ${userContext.occupation}`);
      if (userContext.healthData) {
        const { age, gender, chronicDiseases } = userContext.healthData;
        if (age) context.push(`Age: ${age}`);
        if (gender) context.push(`Gender: ${gender}`);
        if (chronicDiseases && chronicDiseases.length > 0) {
          context.push(`Health conditions: ${chronicDiseases.join(', ')}`);
        }
      }
      
      if (context.length > 0) {
        contextualMessage = `User context: ${context.join(', ')}\n\nUser question: ${message}`;
      }
    }

    const result = await chatSession.sendMessage(contextualMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error sending message to Gemini:', error);
    
    // Handle specific error cases
    if (error.message.includes('SAFETY')) {
      return "I apologize, but I cannot provide a response to that question due to safety guidelines. Please rephrase your question or consult with a healthcare professional for sensitive medical topics.";
    }
    
    if (error.message.includes('API_KEY')) {
      return "I'm sorry, there seems to be a configuration issue. Please try again later or contact support.";
    }
    
    return "I'm sorry, I encountered an error while processing your request. Please try asking your question again, or consider consulting with a healthcare professional if it's urgent.";
  }
};

export const resetChatSession = () => {
  chatSession = null;
};

// Pre-defined medical topic suggestions
export const getHealthTopicSuggestions = () => [
  "Common cold and flu symptoms",
  "First aid for workplace injuries",
  "Managing stress and mental health",
  "Nutrition for manual workers",
  "Preventing back pain from physical work",
  "Understanding vaccination requirements",
  "Heat stroke prevention and treatment",
  "Managing diabetes and blood pressure",
  "Skin care for outdoor workers",
  "Sleep hygiene and shift work",
];

// Emergency keywords detection
export const detectEmergencyKeywords = (message) => {
  const emergencyKeywords = [
    'chest pain', 'heart attack', 'stroke', 'can\'t breathe', 'difficulty breathing',
    'severe bleeding', 'unconscious', 'seizure', 'overdose', 'poisoning',
    'severe injury', 'broken bone', 'head injury', 'suicide', 'self harm'
  ];
  
  const lowerMessage = message.toLowerCase();
  return emergencyKeywords.some(keyword => lowerMessage.includes(keyword));
};

export default {
  initializeChatSession,
  sendMessage,
  resetChatSession,
  getHealthTopicSuggestions,
  detectEmergencyKeywords,
};