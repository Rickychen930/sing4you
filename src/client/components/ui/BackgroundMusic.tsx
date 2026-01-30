import React, { useEffect, useRef, useState, useCallback, memo, useMemo } from 'react';
import { cn } from '../../utils/helpers';

/**
 * BackgroundMusic Component
 *
 * Autoplay: starts muted (browsers allow this), then unmutes on first user
 * click/tap/keypress anywhere. Shows "Tap anywhere to unmute" when playing muted.
 * Default: public/background_music.mp3 served at /background_music.mp3 (Vite public dir).
 * To avoid cache after replacing the file, set VITE_BACKGROUND_MUSIC_VERSION in .env and bump it.
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
  /** Hide widget on mobile (<=768px) to reduce distraction; audio still loads but no UI */
  disableOnMobile?: boolean;
  /** Use compact mode (icon only, expands on click) */
  compact?: boolean;
  /** Custom bottom offset for positioning */
  bottomOffset?: string;
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

const MOBILE_BREAKPOINT = 768;

export const BackgroundMusic: React.FC<BackgroundMusicProps> = memo(({
  src,
  volume = 0.3,
  autoPlay = true,
  loop = true,
  showControls = true,
  controlsPosition = 'bottom-right',
  disableOnMobile = false,
  compact = true,
  bottomOffset,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasUnmutedRef = useRef(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT
  );
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

  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  // Public file: public/background_music.mp3 → /background_music.mp3 (Vite serves public/ at root)
  // Cache-bust: set VITE_BACKGROUND_MUSIC_VERSION in .env and bump when you replace the file
  const defaultSrcMemo = useMemo(() => {
    const base = src ?? '/background_music.mp3';
    const version = import.meta.env.VITE_BACKGROUND_MUSIC_VERSION;
    return typeof version === 'string' && version.length > 0 ? `${base}?v=${version}` : base;
  }, [src]);

  useEffect(() => {
    if (!disableOnMobile) return;
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [disableOnMobile]);

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
      // Set src after error handler is attached
      audioEl.src = defaultSrcMemo;
      
      // Force load the audio file
      audioEl.load();

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
      const handleError = (e: Event) => {
        const audioError = e.target as HTMLAudioElement;
        let errorMessage = 'Failed to load audio';
        if (audioError.error) {
          switch (audioError.error.code) {
            case MediaError.MEDIA_ERR_ABORTED:
              errorMessage = 'Audio loading aborted';
              break;
            case MediaError.MEDIA_ERR_NETWORK:
              errorMessage = 'Network error loading audio';
              break;
            case MediaError.MEDIA_ERR_DECODE:
              errorMessage = 'Audio decode error';
              break;
            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorMessage = 'Audio format not supported';
              break;
            default:
              errorMessage = 'Failed to load audio file';
          }
        }
        notifyAllComponents(s => {
          s.setIsAvailable(false);
          s.setIsPlaying(false);
          s.setError(errorMessage);
        });
        if (process.env.NODE_ENV === 'development') {
          console.error('BackgroundMusic error:', errorMessage, audioError.error);
        }
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
      audioEl.addEventListener('error', handleError as EventListener);
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
    'bottom-right': bottomOffset ? undefined : 'bottom-4 right-4', // Use custom bottomOffset if provided
  };

  // Hide on mobile when disableOnMobile (reduces distraction)
  if (disableOnMobile && isMobile) return null;

  // Hide controls if not available, showControls is false, or admin path
  if (!showControls || !isAvailable || (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin'))) {
    return null;
  }

  // Compact mode: show only icon button, expand on click
  if (compact && !isExpanded) {
    return (
      <button
        onClick={toggleExpand}
        className={cn(
          'fixed',
          !bottomOffset && positionClasses[controlsPosition],
          'w-12 h-12 sm:w-14 sm:h-14 rounded-full',
          'bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600',
          'hover:from-gold-500 hover:via-gold-400 hover:to-gold-500',
          'text-white flex items-center justify-center',
          'transition-all duration-300 hover:scale-110 active:scale-95',
          'focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-jazz-900',
          'shadow-[0_8px_24px_rgba(255,194,51,0.5),0_0_0_1px_rgba(255,194,51,0.2),0_0_20px_rgba(255,194,51,0.2)]',
          'hover:shadow-[0_12px_32px_rgba(255,194,51,0.7),0_0_0_2px_rgba(255,194,51,0.4),0_0_30px_rgba(255,194,51,0.3)]',
          'backdrop-blur-sm border-2 border-gold-400/40 hover:border-gold-400/70',
          'group min-w-[48px] min-h-[48px] sm:min-w-[56px] sm:min-h-[56px]',
          'relative overflow-hidden z-[9997]'
        )}
        style={{
          // Ensure fixed positioning doesn't affect document flow
          position: 'fixed',
          contain: 'layout style paint',
          // Prevent layout shift
          margin: 0,
          padding: 0,
          // Align horizontally (same right position)
          right: '1rem',
          // Use custom bottomOffset if provided, otherwise use positionClasses
          ...(bottomOffset ? { bottom: bottomOffset } : {}),
          zIndex: 9997
        }}
        aria-label="Background Music Controls"
        title="Background Music"
      >
        <div className="absolute -inset-1 bg-gold-400/40 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-md pointer-events-none" aria-hidden />
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 relative z-10 transition-transform duration-300 group-hover:scale-110"
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
        {isPlaying && (
          <div className="absolute top-0 right-0 w-2 h-2 bg-gold-300 rounded-full animate-pulse" aria-hidden />
        )}
      </button>
    );
  }

  return (
    <div
      className={cn(
        'fixed',
        !bottomOffset && positionClasses[controlsPosition],
        'bg-gold-900/97 backdrop-blur-sm rounded-xl sm:rounded-2xl',
        'p-2.5 sm:p-3 lg:p-3.5',
        'shadow-[0_8px_24px_rgba(255,194,51,0.4),0_0_0_1px_rgba(255,194,51,0.2)_inset,0_0_20px_rgba(255,194,51,0.2)]',
        'border-2 border-gold-700/60 hover:border-gold-600/80',
        'transition-all duration-300 hover:shadow-[0_12px_32px_rgba(255,194,51,0.5),0_0_0_2px_rgba(255,194,51,0.3)_inset,0_0_30px_rgba(255,194,51,0.3)]',
        'group background-music-controls',
        'max-w-[calc(100vw-2rem)] sm:max-w-none', // Prevent overflow on mobile
        compact && 'animate-fade-in-up'
      )}
      style={{ 
        zIndex: 9997,
        // Ensure fixed positioning doesn't affect document flow
        position: 'fixed',
        // Prevent layout shift and height changes
        contain: 'layout style paint',
        // Ensure no margin/padding that could affect layout
        margin: 0,
        // Prevent affecting document height
        height: 'auto',
        width: 'auto',
        // Align horizontally (same right position)
        right: '1rem',
        // Use custom bottomOffset if provided, otherwise use positionClasses
        ...(bottomOffset ? { bottom: bottomOffset } : {})
      }}
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-gold-500/25 via-musical-500/15 to-gold-500/25 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md pointer-events-none" aria-hidden />
      
      {/* Close button for compact mode */}
      {compact && (
        <button
          onClick={toggleExpand}
          className="absolute -top-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gold-800/90 hover:bg-gold-700 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gold-400 z-20 border border-gold-600/50"
          aria-label="Close music controls"
          title="Close"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      
      <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3 relative z-10">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-gold-900 min-w-[44px] min-h-[44px] sm:min-w-[48px] sm:min-h-[48px] lg:min-w-[56px] lg:min-h-[56px] shadow-[0_8px_24px_rgba(255,194,51,0.5),0_0_0_1px_rgba(255,194,51,0.2),0_0_20px_rgba(255,194,51,0.2)] hover:shadow-[0_12px_32px_rgba(255,194,51,0.7),0_0_0_2px_rgba(255,194,51,0.4),0_0_30px_rgba(255,194,51,0.3)] group/play border-2 border-gold-400/40 hover:border-gold-400/70"
          aria-label={isPlaying ? 'Pause' : 'Play'}
          title={isPlaying ? 'Pause music' : 'Play music'}
        >
          <div className="absolute -inset-1 bg-gold-400/40 rounded-full opacity-0 group-hover/play:opacity-30 transition-opacity duration-300 blur-md pointer-events-none" aria-hidden />
          <div className="absolute -inset-2 bg-gold-500/20 rounded-full opacity-0 group-hover/play:opacity-20 transition-opacity duration-300 blur-lg pointer-events-none" aria-hidden />
          {isPlaying ? (
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 relative z-10 transition-transform duration-300 group-hover/play:scale-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
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
              className="w-6 h-6 sm:w-7 sm:h-7 ml-0.5 relative z-10 transition-transform duration-300 group-hover/play:scale-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
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
            className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 text-gold-200 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-gold-900 rounded-lg min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center touch-manipulation hover:bg-gold-900/30"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || currentVolume === 0 ? (
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
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
                className="w-5 h-5 sm:w-6 sm:h-6"
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
            className="flex-1 h-1.5 sm:h-2 bg-gold-800/60 rounded-lg appearance-none cursor-pointer accent-gold-400 min-w-[60px] sm:min-w-[80px] hover:accent-gold-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-400/60 focus:ring-offset-2 focus:ring-offset-gold-900 background-music-volume-slider"
            style={{
              '--volume-percent': `${(isMuted ? 0 : currentVolume) * 100}%`,
            } as React.CSSProperties}
            aria-label="Volume"
          />
        </div>
      </div>

      {/* Tap to unmute hint - when autoplay muted (only show when expanded) */}
      {isPlaying && isMuted && (
        <div className="mt-1.5 sm:mt-2 text-xs text-gold-300/95 text-center animate-pulse font-medium leading-relaxed relative z-10">
          <span className="inline-flex items-center gap-1">
            <span className="text-sm animate-float">🎵</span>
            <span className="hidden sm:inline">Tap anywhere to unmute</span>
            <span className="sm:hidden">Tap to unmute</span>
          </span>
        </div>
      )}

      {error && (
        <div className="mt-1.5 sm:mt-2 text-xs text-red-300 bg-red-900/40 p-1.5 sm:p-2 rounded-lg text-center border border-red-700/50 relative z-10">
          {error}
        </div>
      )}

      {/* Label - hide on very small screens */}
      <div className="mt-1.5 sm:mt-2 text-xs text-gold-300/80 text-center font-medium leading-relaxed relative z-10 hidden sm:block">
        <span className="inline-flex items-center gap-1">
          <span className="text-sm animate-float font-musical background-music-note">♪</span>
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
    prevProps.controlsPosition === nextProps.controlsPosition &&
    prevProps.disableOnMobile === nextProps.disableOnMobile &&
    prevProps.compact === nextProps.compact
  );
});

BackgroundMusic.displayName = 'BackgroundMusic';
