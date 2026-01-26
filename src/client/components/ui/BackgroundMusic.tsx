import React, { useEffect, useRef, useState, useCallback, memo, useMemo } from 'react';

/**
 * BackgroundMusic Component
 *
 * Autoplay: starts muted (browsers allow this), then unmutes on first user
 * click/tap/keypress anywhere. Shows "Tap anywhere to unmute" when playing muted.
 * Default file: /public/background_music.mp3
 *
 * @example
 * <BackgroundMusic src="/background_music.mp3" volume={0.3} autoPlay loop />
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

// Global audio instance to persist across route changes
let globalAudioInstance: HTMLAudioElement | null = null;
type StateSetters = {
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentVolume: React.Dispatch<React.SetStateAction<number>>;
  setIsAvailable: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
};
const globalStateSetters: Set<StateSetters> = new Set();

export const BackgroundMusic: React.FC<BackgroundMusicProps> = memo(({
  src,
  volume = 0.3,
  autoPlay = true,
  loop = true,
  showControls = true,
  controlsPosition = 'bottom-right',
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasUnmutedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(() => {
    // Initialize from global instance if available
    return globalAudioInstance ? !globalAudioInstance.paused : false;
  });
  const [isMuted, setIsMuted] = useState(() => {
    return globalAudioInstance ? globalAudioInstance.muted : true;
  });
  const [currentVolume, setCurrentVolume] = useState(() => {
    return globalAudioInstance ? globalAudioInstance.volume : volume;
  });
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);

  const unmute = useCallback(() => {
    if (hasUnmutedRef.current) return;
    hasUnmutedRef.current = true;
    const audio = audioRef.current || globalAudioInstance;
    if (audio) {
      audio.muted = false;
      audio.volume = currentVolume;
      setIsMuted(false);
    }
  }, [currentVolume]);

  // OPTIMIZED: Memoize defaultSrc to prevent unnecessary re-renders
  const defaultSrcMemo = useMemo(() => src || '/background_music.mp3', [src]);

  useEffect(() => {
    // Early return for admin paths
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      return;
    }

    // Reuse existing audio instance if available
    let audio = globalAudioInstance;
    
    // Register this component's state setters
    const stateSetters: StateSetters = {
      setIsPlaying,
      setIsMuted,
      setCurrentVolume,
      setIsAvailable,
      setError,
    };
    globalStateSetters.add(stateSetters);
    
    if (!audio) {
      // Create audio instance only once
      const audioEl = new Audio();
      audio = audioEl;
      globalAudioInstance = audioEl;
      audioEl.volume = volume;
      audioEl.muted = true;
      audioEl.loop = loop;
      audioEl.preload = 'auto';
      audioEl.src = defaultSrcMemo;

      const notifyAllComponents = (updater: (s: StateSetters) => void) => {
        globalStateSetters.forEach(updater);
      };

      const handlePlay = () => {
        notifyAllComponents(s => s.setIsPlaying(true));
      };
      const handlePause = () => {
        notifyAllComponents(s => s.setIsPlaying(false));
      };
      const handleEnded = () => {
        notifyAllComponents(s => s.setIsPlaying(false));
      };
      const handleError = () => {
        notifyAllComponents(s => {
          s.setIsAvailable(false);
          s.setIsPlaying(false);
        });
      };
      const onAudioVolumeChange = () => {
        notifyAllComponents(s => {
          s.setCurrentVolume(audioEl.volume);
          s.setIsMuted(audioEl.muted);
        });
      };
      const handleLoadedData = () => {
        notifyAllComponents(s => {
          s.setIsAvailable(true);
          s.setError(null);
        });
      };
      const handleCanPlay = () => {
        notifyAllComponents(s => {
          s.setIsAvailable(true);
          s.setError(null);
        });
        if (autoPlay && audioEl.paused) {
          audioEl.play().catch(() => {});
        }
      };

      audioEl.addEventListener('play', handlePlay);
      audioEl.addEventListener('pause', handlePause);
      audioEl.addEventListener('ended', handleEnded);
      audioEl.addEventListener('error', handleError);
      audioEl.addEventListener('volumechange', onAudioVolumeChange);
      audioEl.addEventListener('loadeddata', handleLoadedData);
      audioEl.addEventListener('canplay', handleCanPlay);

      if (autoPlay && audioEl.readyState >= 2) {
        audioEl.play().catch(() => {});
      }
    } else {
      setIsPlaying(!audio.paused);
      setIsMuted(audio.muted);
      setCurrentVolume(audio.volume);
    }

    audioRef.current = audio;

    // Add unmute listeners only once
    if (autoPlay && !hasUnmutedRef.current) {
      document.addEventListener('click', unmute, { once: true, passive: true });
      document.addEventListener('touchstart', unmute, { once: true, passive: true });
      document.addEventListener('keydown', unmute, { once: true, passive: true });
    }

    // Cleanup: remove this component's state setters
    return () => {
      globalStateSetters.delete(stateSetters);
      audioRef.current = null;
      // Don't destroy audio instance - keep it playing across route changes
    };
    // OPTIMIZED: Use memoized defaultSrcMemo and stable dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultSrcMemo, loop, autoPlay, volume]); // Removed unmute from deps - it's stable

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = currentVolume;
    }
  }, [currentVolume]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    unmute(); // User gesture: unmute if still muted
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (audioRef.current.readyState >= 2) {
        audioRef.current.play().catch(() => setError('Failed to play. Try again.'));
      } else {
        audioRef.current.addEventListener('canplay', () => {
          audioRef.current?.play().catch(() => setError('Failed to play. Try again.'));
        }, { once: true });
      }
    }
  }, [isPlaying, unmute]);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setCurrentVolume(newVolume);
    if (audioRef.current) {
      unmute();
      audioRef.current.muted = false;
      audioRef.current.volume = newVolume;
    }
  }, [unmute]);

  // Position classes for controls
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  // Hide controls if not available, showControls is false, or admin path
  if (!showControls || !isAvailable || (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin'))) {
    return null;
  }

  return (
    <div
      className={`fixed ${positionClasses[controlsPosition]} z-50 bg-gold-900/97 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-3.5 lg:p-4 shadow-[0_12px_32px_rgba(255,194,51,0.4),0_0_0_1px_rgba(255,194,51,0.2)_inset] border-2 border-gold-700/60 hover:border-gold-600/80 transition-all duration-300 hover:shadow-[0_16px_40px_rgba(255,194,51,0.5),0_0_0_1px_rgba(255,194,51,0.3)_inset] group`}
      style={{ minWidth: 'clamp(180px, 200px, 240px)' }}
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-gold-500/25 via-musical-500/15 to-gold-500/25 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md pointer-events-none" aria-hidden />
      <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-3.5 relative z-10">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-gold-900 min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] shadow-[0_4px_12px_rgba(255,194,51,0.4)] hover:shadow-[0_8px_20px_rgba(255,194,51,0.6)] group/play"
          aria-label={isPlaying ? 'Pause' : 'Play'}
          title={isPlaying ? 'Pause music' : 'Play music'}
        >
          <div className="absolute -inset-1 bg-gold-400/40 rounded-full opacity-0 group-hover/play:opacity-100 transition-opacity duration-300 blur-sm pointer-events-none" aria-hidden />
          {isPlaying ? (
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 transition-transform duration-300 group-hover/play:scale-110"
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
              className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5 relative z-10 transition-transform duration-300 group-hover/play:scale-110"
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

          {/* Enhanced Volume Slider */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : currentVolume}
            onChange={handleVolumeChange}
            className="flex-1 h-1.5 sm:h-2 bg-gold-800/60 rounded-lg appearance-none cursor-pointer accent-gold-400 min-w-0 hover:accent-gold-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-400/60 focus:ring-offset-2 focus:ring-offset-gold-900"
            style={{
              background: `linear-gradient(to right, #ffc233 0%, #ffc233 ${(isMuted ? 0 : currentVolume) * 100}%, rgba(74, 85, 104, 0.6) ${(isMuted ? 0 : currentVolume) * 100}%, rgba(74, 85, 104, 0.6) 100%)`,
            }}
            aria-label="Volume"
          />
        </div>
      </div>

      {/* Tap to unmute hint - when autoplay muted */}
      {isPlaying && isMuted && (
        <div className="mt-2 sm:mt-2.5 text-xs sm:text-sm text-gold-300/95 text-center animate-pulse font-medium leading-relaxed relative z-10">
          <span className="inline-flex items-center gap-1.5">
            <span className="text-base sm:text-lg animate-float">🎵</span>
            <span>Tap anywhere to unmute</span>
          </span>
        </div>
      )}

      {error && error !== 'File not found' && (
        <div className="mt-2 sm:mt-2.5 text-xs sm:text-sm text-red-300 bg-red-900/40 p-2 sm:p-2.5 rounded-lg text-center border border-red-700/50 relative z-10">
          {error}
        </div>
      )}

      <div className="mt-2 sm:mt-2.5 text-xs sm:text-sm text-gold-300/80 text-center font-medium leading-relaxed relative z-10">
        <span className="inline-flex items-center gap-1.5">
          <span className="text-base sm:text-lg animate-float font-musical" style={{ animationDelay: '0.5s' }}>♪</span>
          <span>Background Music</span>
        </span>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Prevent re-render if props haven't changed
  return (
    prevProps.src === nextProps.src &&
    prevProps.volume === nextProps.volume &&
    prevProps.autoPlay === nextProps.autoPlay &&
    prevProps.loop === nextProps.loop &&
    prevProps.showControls === nextProps.showControls &&
    prevProps.controlsPosition === nextProps.controlsPosition
  );
});

BackgroundMusic.displayName = 'BackgroundMusic';
