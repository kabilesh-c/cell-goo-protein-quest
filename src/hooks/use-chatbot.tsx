
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

  // Send initial greeting when the chat is first opened
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          content: "Hello, I am BioBuddy, and I'm here to assist you. Feel free to ask me anything related to protein synthesis!",
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    }
  }, [messages.length]);

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

    // Show loading state
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Get response from our chatbot data
      const botReply = await chatbotResponse(userMessage);
      
      // Add bot message to chat
      setMessages((prev) => [
        ...prev,
        {
          content: botReply,
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          content: "I'm sorry, I couldn't process your request at the moment. Please try again later.",
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    isLoading,
  };
};
