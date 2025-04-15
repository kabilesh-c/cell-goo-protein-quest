
import { useState, useEffect } from 'react';
import { chatbotResponse } from '@/lib/chatbot-data';

export interface ChatMessage {
  content: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

export const useChatBot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');

  // Speech recognition setup
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.continuous = false;
  recognition.interimResults = false;

  // Text to speech function using ElevenLabs
  const speakMessage = async (text: string) => {
    if (!apiKey) return;
    
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL/stream', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      });

      if (!response.ok) throw new Error('TTS request failed');

      const blob = await response.blob();
      const audio = new Audio(URL.createObjectURL(blob));
      await audio.play();
    } catch (error) {
      console.error('Text-to-speech error:', error);
    }
  };

  // Send initial greeting when the chat is first opened
  useEffect(() => {
    if (messages.length === 0) {
      const greeting = "Hello, I am BioBuddy, and I'm here to assist you. Feel free to ask me anything related to protein synthesis!";
      setMessages([
        {
          content: greeting,
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
      if (apiKey) speakMessage(greeting);
    }
  }, [messages.length, apiKey]);

  // Speech recognition handlers
  const startListening = () => {
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognition.stop();
  };

  recognition.onresult = (event) => {
    const userMessage = event.results[0][0].transcript;
    sendMessage(userMessage);
  };

  recognition.onend = () => {
    setIsListening(false);
  };

  const sendMessage = async (userMessage: string) => {
    // Add user message to chat
    setMessages((prev) => [
      ...prev,
      {
        content: userMessage,
        sender: 'user',
        timestamp: new Date(),
      },
    ]);

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const botReply = await chatbotResponse(userMessage);
      
      setMessages((prev) => [
        ...prev,
        {
          content: botReply,
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);

      // Speak the bot's reply
      if (apiKey) speakMessage(botReply);
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      const errorMessage = "I'm sorry, I couldn't process your request at the moment. Please try again later.";
      
      setMessages((prev) => [
        ...prev,
        {
          content: errorMessage,
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
      
      if (apiKey) speakMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    isLoading,
    isListening,
    startListening,
    stopListening,
    setApiKey,
    apiKey,
  };
};
