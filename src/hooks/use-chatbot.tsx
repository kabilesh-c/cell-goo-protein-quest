
import { useState, useEffect, useRef } from 'react';
import { chatbotResponse } from '@/lib/chatbot-data';
import { useToast } from '@/hooks/use-toast';

export interface ChatMessage {
  content: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

// Use a different voice ID and model to avoid the unusual activity error
const ELEVEN_LABS_API_KEY = 'sk_6118cd8f25b74cb67ce6800769d664c35ba55427a0f4d375';
const VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Rachel voice - different from previous one
const MODEL_ID = 'eleven_monolingual_v1'; // Using a different model

export const useChatBot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const isSpeakingRef = useRef<boolean>(false); // Track speaking state with a ref for better control

  // Speech recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        
        recognitionRef.current.onresult = (event: any) => {
          const userMessage = event.results[0][0].transcript;
          sendMessage(userMessage);
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
          toast({
            title: "Voice Recognition Error",
            description: `Error: ${event.error}. Please try again.`,
          });
        };
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        stopListening();
      }
    };
  }, []);

  // Stop any playing audio
  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    isSpeakingRef.current = false;
  };

  // Text to speech function using ElevenLabs - using a more reliable approach
  const speakMessage = async (text: string) => {
    // Stop any previous audio that might be playing
    stopSpeaking();
    isSpeakingRef.current = true;
    
    try {
      // Using a more basic text-to-speech endpoint
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': ELEVEN_LABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          model_id: MODEL_ID,
          voice_settings: {
            stability: 0.6,
            similarity_boost: 0.75,
          },
        }),
      });

      if (!response.ok) {
        console.error('TTS error response:', await response.text());
        throw new Error(`TTS request failed with status: ${response.status}`);
      }

      const blob = await response.blob();
      const audio = new Audio(URL.createObjectURL(blob));
      audioRef.current = audio;
      
      audio.onended = () => {
        audioRef.current = null;
        isSpeakingRef.current = false;
      };
      
      // Add error handling for audio playback
      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        audioRef.current = null;
        isSpeakingRef.current = false;
        toast({
          title: "Voice Playback Error",
          description: "Could not play the voice response. Please try again.",
        });
      };
      
      await audio.play();
    } catch (error) {
      console.error('Text-to-speech error:', error);
      isSpeakingRef.current = false;
      toast({
        title: "Voice Generation Error",
        description: "Could not generate the voice response. Using text only mode.",
      });
    }
  };

  // Function to check if the bot is currently speaking
  const isSpeaking = () => isSpeakingRef.current;

  // Send initial greeting when the chat is first opened
  useEffect(() => {
    const hasInitialGreeting = messages.length > 0;
    
    if (!hasInitialGreeting) {
      const greeting = "Hello, I am BioBuddy, and I'm here to assist you. Feel free to ask me anything related to protein synthesis!";
      setMessages([
        {
          content: greeting,
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
      
      // Small delay to ensure the component is fully mounted
      setTimeout(() => {
        speakMessage(greeting);
      }, 500);
    }
  }, [messages.length]);

  // Speech recognition handlers
  const startListening = () => {
    if (recognitionRef.current) {
      stopSpeaking(); // Stop speaking when starting to listen
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      toast({
        title: "Voice Input Not Available",
        description: "Speech recognition is not supported in your browser.",
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
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
      // Stop any ongoing speech when user sends a message
      stopSpeaking();
      
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

      // Speak the bot's response
      speakMessage(botReply);
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
      
      speakMessage(errorMessage);
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
    stopSpeaking,
    isSpeaking: isSpeaking(),
  };
};
