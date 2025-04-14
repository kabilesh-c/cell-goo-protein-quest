
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Loader, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomVideoPlayerProps {
  videoUrl: string;
  className?: string;
  autoPlay?: boolean;
  title?: string;
}

const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  videoUrl,
  className = '',
  autoPlay = false,
  title
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract Google Drive file ID from URL if present
  const getProperVideoUrl = (url: string): string => {
    // Check if it's a Google Drive URL
    if (url.includes('drive.google.com')) {
      // Extract the file ID from different types of Drive URLs
      let fileId = '';
      if (url.includes('/file/d/')) {
        const fileIdMatch = url.match(/\/file\/d\/([^/]+)/);
        if (fileIdMatch && fileIdMatch[1]) {
          fileId = fileIdMatch[1];
        }
      } else if (url.includes('id=')) {
        const fileIdMatch = url.match(/id=([^&]+)/);
        if (fileIdMatch && fileIdMatch[1]) {
          fileId = fileIdMatch[1];
        }
      }
      
      if (fileId) {
        // Use preview format instead of download for better streaming
        return `https://drive.google.com/uc?export=preview&id=${fileId}`;
      }
    }
    return url;
  };

  // Format time in MM:SS format
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  // Initialize video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Event listeners
    const handleCanPlay = () => {
      setLoading(false);
      setDuration(video.duration);
    };
    
    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
        setCurrentTime(video.currentTime);
      }
    };
    
    const handleEnded = () => setIsPlaying(false);
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setLoading(false);
    };

    // Add event listeners
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    // Set proper video source
    video.src = getProperVideoUrl(videoUrl);

    return () => {
      // Remove event listeners on cleanup
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [videoUrl]);

  // Handle auto play when component mounts
  useEffect(() => {
    if (autoPlay && videoRef.current && !loading) {
      togglePlay();
    }
  }, [autoPlay, loading]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(err => {
        console.error("Error playing video:", err);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !video.muted;
    setIsMuted(!isMuted);
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = progressBarRef.current;
    const video = videoRef.current;
    
    if (!progressBar || !video) return;
    
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    
    video.currentTime = clickPosition * video.duration;
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => {
        console.error("Error exiting fullscreen:", err);
      });
    } else {
      container.requestFullscreen().catch(err => {
        console.error("Error entering fullscreen:", err);
      });
    }
  };

  return (
    <div className="video-wrapper rounded-xl overflow-hidden shadow-lg border border-primary/20 bg-black/5 backdrop-blur-sm transition-all hover:shadow-primary/10 hover:border-primary/30">
      {title && (
        <div className="p-3 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-md">
          <h3 className="text-lg font-medium text-white">{title}</h3>
        </div>
      )}
      
      <div 
        ref={containerRef}
        className={cn('relative w-full h-full rounded-lg overflow-hidden group', className)}
      >
        {/* Video */}
        <video 
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted={isMuted}
          preload="metadata"
          controlsList="nodownload"
        />
        
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="relative">
              <Loader className="w-12 h-12 text-primary animate-spin" />
              <div className="absolute inset-0 blur-xl bg-primary/20 rounded-full"></div>
            </div>
          </div>
        )}
        
        {/* Controls overlay - appears on hover */}
        <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end">
          {/* Progress bar */}
          <div 
            ref={progressBarRef}
            className="w-full h-2 bg-gray-700/50 cursor-pointer relative group"
            onClick={handleProgressBarClick}
          >
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
              style={{ width: `${progress}%` }}
            />
            <div 
              className="absolute h-4 w-4 bg-white rounded-full shadow-glow -mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${progress}%`, top: '0', transform: 'translateX(-50%)' }}
            />
          </div>
          
          {/* Time indicators */}
          <div className="px-4 pt-1 pb-2 flex justify-between text-xs text-white/70">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          
          {/* Controls */}
          <div className="w-full flex items-center justify-between px-4 py-3">
            <button 
              onClick={togglePlay}
              className="rounded-full bg-primary/20 backdrop-blur-md p-2 hover:bg-primary/40 transition-all hover:scale-110"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying 
                ? <Pause className="w-5 h-5 text-white" /> 
                : <Play className="w-5 h-5 text-white ml-0.5" />
              }
            </button>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={toggleMute}
                className="rounded-full bg-primary/20 backdrop-blur-md p-2 hover:bg-primary/40 transition-all hover:scale-110"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted 
                  ? <VolumeX className="w-5 h-5 text-white" /> 
                  : <Volume2 className="w-5 h-5 text-white" />
                }
              </button>
              
              <button 
                onClick={toggleFullscreen}
                className="rounded-full bg-primary/20 backdrop-blur-md p-2 hover:bg-primary/40 transition-all hover:scale-110"
                aria-label="Fullscreen"
              >
                <Maximize className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Play overlay when video is paused */}
        {!isPlaying && !loading && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
            onClick={togglePlay}
          >
            <div className="rounded-full bg-primary/20 backdrop-blur-md p-4 hover:bg-primary/40 transition-all hover:scale-110">
              <Play className="w-10 h-10 text-white ml-1" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomVideoPlayer;
