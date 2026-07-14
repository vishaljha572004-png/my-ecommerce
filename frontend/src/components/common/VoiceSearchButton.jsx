import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const VoiceSearchButton = ({ onSearch }) => {
  const { t, i18n } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      setRecognition(recognitionInstance);
    }
  }, []);

  useEffect(() => {
    if (recognition) {
      // Update language based on current i18n selection
      recognition.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-IN';
    }
  }, [i18n.language, recognition]);

  const toggleListening = () => {
    if (!recognition) {
      toast.error('Voice search is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
        setIsListening(true);
        toast(t('voice.listening') || "Listening...", { icon: '🎤' });
      } catch (err) {
        console.error("Speech recognition error:", err);
        setIsListening(false);
      }
    }
  };

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onSearch(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      if (event.error !== 'no-speech') {
        toast.error('Voice recognition failed. Please try again.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
    };
  }, [recognition, onSearch]);

  return (
    <button
      onClick={toggleListening}
      className={`p-2 rounded-full transition-all flex items-center justify-center shrink-0 ${
        isListening
          ? 'bg-red-100 text-red-600 animate-pulse'
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-primary'
      }`}
      title="Voice Search"
    >
      {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
    </button>
  );
};

export default VoiceSearchButton;
