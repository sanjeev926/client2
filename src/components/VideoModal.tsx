import React, { useRef, useState, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, ExternalLink, Smartphone } from 'lucide-react';
import { ReelMedia, instagramProfileUrl } from '../data/media';
import { RealInstagramIcon } from './BrandIcons';
import { resolvePlayableUrl, isDeviceMediaKey } from '../utils/mediaStorage';

interface VideoModalProps {
  reel: ReelMedia | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ reel, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [playableVideoUrl, setPlayableVideoUrl] = useState<string>('');
  const [playableThumbUrl, setPlayableThumbUrl] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    if (reel) {
      setIsPlaying(true);

      // Resolve video
      if (reel.videoUrl) {
        if (isDeviceMediaKey(reel.videoUrl)) {
          resolvePlayableUrl(reel.videoUrl).then((url) => {
            if (isMounted) setPlayableVideoUrl(url);
          });
        } else {
          setPlayableVideoUrl(reel.videoUrl);
        }
      } else {
        setPlayableVideoUrl('');
      }

      // Resolve thumbnail
      if (reel.thumbnailUrl) {
        if (isDeviceMediaKey(reel.thumbnailUrl)) {
          resolvePlayableUrl(reel.thumbnailUrl).then((url) => {
            if (isMounted) setPlayableThumbUrl(url);
          });
        } else {
          setPlayableThumbUrl(reel.thumbnailUrl);
        }
      } else {
        setPlayableThumbUrl('');
      }
    }

    return () => {
      isMounted = false;
    };
  }, [reel]);

  if (!reel) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const isFromDevice = isDeviceMediaKey(reel.videoUrl) || isDeviceMediaKey(reel.thumbnailUrl);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl bg-[#14161C] border border-white/20 rounded-3xl overflow-hidden shadow-2xl text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors border border-white/10 cursor-pointer"
          aria-label="Close video"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Player */}
        <div className="relative aspect-video sm:aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
          {playableVideoUrl ? (
            <video
              ref={videoRef}
              src={playableVideoUrl}
              poster={playableThumbUrl || reel.thumbnailUrl}
              autoPlay
              loop
              playsInline
              className="w-full h-full object-cover"
              onClick={togglePlay}
            />
          ) : (
            <img
              src={playableThumbUrl || reel.thumbnailUrl}
              alt={reel.title}
              className="w-full h-full object-cover"
            />
          )}

          {/* Controls overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none flex flex-col justify-between p-5">
            <div className="flex items-center gap-2">
              <span className="bg-[#0066FF] text-white text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full">
                {reel.categoryTag}
              </span>
              {isFromDevice && (
                <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <Smartphone className="w-3 h-3" />
                  <span>Device Upload</span>
                </span>
              )}
            </div>

            <div className="flex items-center justify-between pointer-events-auto">
              <div className="min-w-0 pr-4">
                <h4 className="font-bold text-base sm:text-lg font-display text-white truncate">{reel.title}</h4>
                {reel.description && (
                  <p className="text-xs text-neutral-300 max-w-md line-clamp-1">{reel.description}</p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={togglePlay}
                  className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>
                <button
                  onClick={toggleMute}
                  className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div className="p-4 bg-[#101216] border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-neutral-400">
            Filmed at Ramy&apos;s Dance Studio, Ranchi
          </span>
          <a
            href={reel.instagramUrl || instagramProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-white hover:text-[#0066FF] transition-colors flex items-center gap-1.5"
          >
            <RealInstagramIcon className="w-3.5 h-3.5 shrink-0" />
            <span>Watch on Instagram</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
