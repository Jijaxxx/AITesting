import { useCallback, useState, useMemo } from 'react';
import speechService from '../services/speech';

interface UseSpeechOptions {
  pitch?: number;
  rate?: number;
  volume?: number;
  onEnd?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook React pour utiliser Web Speech API
 * Permet de lire du texte facilement dans les composants
 */
export function useSpeech(options?: UseSpeechOptions) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Mémoriser les options pour éviter les re-renders
  const memoizedOptions = useMemo(() => options, [
    options?.pitch,
    options?.rate,
    options?.volume,
  ]);

  const speak = useCallback(
    async (text: string) => {
      setIsSpeaking(true);
      setIsPaused(false);

      try {
        await speechService.speak(text, {
          ...memoizedOptions,
          onEnd: () => {
            setIsSpeaking(false);
            setIsPaused(false);
            memoizedOptions?.onEnd?.();
          },
          onError: (error) => {
            setIsSpeaking(false);
            setIsPaused(false);
            memoizedOptions?.onError?.(error);
          },
        });
      } catch (error) {
        setIsSpeaking(false);
        setIsPaused(false);
        throw error;
      }
    },
    [memoizedOptions]
  );

  const stop = useCallback(() => {
    speechService.stop();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    speechService.pause();
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    speechService.resume();
    setIsPaused(false);
  }, []);

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
  };
}
