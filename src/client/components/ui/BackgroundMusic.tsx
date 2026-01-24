import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * BackgroundMusic Component
 * 
 * Plays 90s-themed background music with volume and mute controls.
 * Uses HTML5 audio with autoplay allowed after user interaction.
 * 
 * @example
 * <BackgroundMusic 
 *   src="/music/90s-jazz.mp3"
 *   volume={0.3}
 *   autoPlay={true}
 * />
 */
interface BackgroundMusicProps {
  /** Audio source URL */
  src?: string;
  /** Volume (0-1), default: 0.3 */
  volume?: number;
  /** Auto play after user interaction */
  autoPlay?: boolean;
  /** Loop audio */
  loop?: boolean;
  /** Show control UI */
  showControls?: boolean;
  /** Control position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' */
  controlsPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const BackgroundMusic: React.FC<BackgroundMusicProps> = ({
  src,
  volume = 0.3,
  autoPlay = true,
  loop = true,
  showControls = true,
  controlsPosition = 'bottom-right',
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(volume);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);

  // Default 90s style music - using external or local URL
  // Users can provide their own audio files in the public/music/ folder
  // Example: /music/90s-jazz.mp3 or external URL
  // Fallback: if local file not found, can use external URL
  const defaultSrc = src || '/music/90s-background.mp3';
  
  // Fallback URLs for 90s music (optional, can be enabled if needed)
  // Uncomment one if you want to use fallback:
  // const fallbackSrc = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

  // Handle user interaction untuk enable autoplay
  const handleUserInteraction = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
      if (autoPlay && audioRef.current) {
        audioRef.current.play().catch((err) => {
          console.warn('Autoplay failed:', err);
          setError('Autoplay not allowed. Please click the play button.');
        });
      }
    }
  }, [hasInteracted, autoPlay]);

  // Setup audio element
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audio.loop = loop;
    audio.preload = 'auto';

    // Event listeners
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.addEventListener('ended', () => setIsPlaying(false));
    audio.addEventListener('error', () => {
      // If file not found, hide controls gracefully
      // Users can add file at /public/music/90s-background.mp3
      // or provide URL via src prop
      setIsAvailable(false);
      setIsPlaying(false);
      // Don't log error to console to avoid spam
      // Audio file is optional, so no error message needed
    });
    audio.addEventListener('volumechange', () => {
      setCurrentVolume(audio.volume);
      setIsMuted(audio.muted);
    });
    audio.addEventListener('loadeddata', () => {
      // Audio loaded successfully
      setIsAvailable(true);
      setError(null);
    });
    audio.addEventListener('canplay', () => {
      // Audio ready to play
      setIsAvailable(true);
      setError(null);
    });

    // Set src setelah event listeners
    audio.src = defaultSrc;
    audioRef.current = audio;

    // Add global click listener untuk enable autoplay
    if (autoPlay) {
      const events = ['click', 'touchstart', 'keydown'];
      events.forEach((event) => {
        document.addEventListener(event, handleUserInteraction, { once: true });
      });
    }

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
      if (autoPlay) {
        const events = ['click', 'touchstart', 'keydown'];
        events.forEach((event) => {
          document.removeEventListener(event, handleUserInteraction);
        });
      }
    };
  }, [defaultSrc, loop, autoPlay, handleUserInteraction, volume]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = currentVolume;
    }
  }, [currentVolume]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.error('Play failed:', err);
        setError('Failed to play audio.');
      });
    }
    setHasInteracted(true);
  }, [isPlaying]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
    setHasInteracted(true);
  }, []);

  // Handle volume change
  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setCurrentVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.muted = false;
    }
    setHasInteracted(true);
  }, []);

  // Position classes untuk kontrol
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  // Sembunyikan kontrol jika tidak tersedia atau showControls false
  if (!showControls || !isAvailable) {
    return null;
  }

  return (
    <div
      className={`fixed ${positionClasses[controlsPosition]} z-50 bg-gold-900/90 backdrop-blur-sm rounded-lg sm:rounded-xl p-2.5 sm:p-3 shadow-lg border border-gold-700/50`}
      style={{ minWidth: 'clamp(180px, 200px, 240px)' }}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gold-600 hover:bg-gold-500 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-gold-900 min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px]"
          aria-label={isPlaying ? 'Pause' : 'Play'}
          title={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? (
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        {/* Volume Control */}
        <div className="flex-1 flex items-center gap-1.5 sm:gap-2 min-w-0">
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 text-gold-200 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-gold-900 rounded min-w-[28px] min-h-[28px] sm:min-w-[32px] sm:min-h-[32px] flex items-center justify-center"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || currentVolume === 0 ? (
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4.617-3.793a1 1 0 011.383.07zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4.617-3.793a1 1 0 011.383.07zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>

          {/* Volume Slider */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : currentVolume}
            onChange={handleVolumeChange}
            className="flex-1 h-1.5 sm:h-2 bg-gold-800 rounded-lg appearance-none cursor-pointer accent-gold-400 min-w-0"
            style={{
              background: `linear-gradient(to right, #ffc233 0%, #ffc233 ${(isMuted ? 0 : currentVolume) * 100}%, #4a5568 ${(isMuted ? 0 : currentVolume) * 100}%, #4a5568 100%)`,
            }}
            aria-label="Volume"
          />
        </div>
      </div>

      {/* Error Message - only for errors other than file not found */}
      {error && error !== 'File not found' && (
        <div className="mt-1.5 sm:mt-2 text-xs text-red-300 bg-red-900/30 p-1.5 sm:p-2 rounded text-center">
          {error}
        </div>
      )}

      {/* Info Text */}
      <div className="mt-1.5 sm:mt-2 text-xs text-gold-300/70 text-center">
        🎵 90s Music
      </div>
    </div>
  );
};
