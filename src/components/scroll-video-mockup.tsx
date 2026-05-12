"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type ScrollVideoMockupProps = {
  videoSrc: string;
  fallbackImage: string;
};

export function ScrollVideoMockup({ videoSrc, fallbackImage }: ScrollVideoMockupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Decoupled state: scroll updates targetTime, loop updates video.currentTime
  const targetTimeRef = useRef(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setIsVideoLoaded(true);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    
    // Performance: Pre-load the video
    video.load();

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId: number;

    // Render Loop (Constraint 2)
    const renderLoop = () => {
      // Seeking Guard (Constraint 3)
      if (!video.seeking && Math.abs(video.currentTime - targetTimeRef.current) > 0.01) {
        // Smooth interpolation for better feel
        const smoothing = 0.1;
        const nextTime = video.currentTime + (targetTimeRef.current - video.currentTime) * smoothing;
        
        // Clamp to video duration
        video.currentTime = Math.max(0, Math.min(nextTime, video.duration || 0));
      }
      
      rafId = requestAnimationFrame(renderLoop);
    };

    rafId = requestAnimationFrame(renderLoop);

    // Scroll Listener (Constraint 1)
    const handleScroll = () => {
      if (!containerRef.current || !video.duration) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress based on when the container enters and leaves the viewport
      // We want the video to play as the user scrolls through the hero section.
      const total = rect.height + windowHeight;
      
      const progress = Math.max(0, Math.min(1, 1 - (rect.bottom / total)));
      
      // Update targetTime variable only (Decoupling)
      targetTimeRef.current = progress * video.duration;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isVideoLoaded]);

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-[340px] perspective-1000">
      {/* Central Glow */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-[100px]" />
      
      {/* Main Device Container */}
      <div className="sns-card relative overflow-hidden rounded-[3rem] border-[10px] border-stone-800 bg-stone-950 shadow-[0_40px_80px_-20px_rgba(15,23,42,0.5)]">
        <div className="absolute left-1/2 top-0 z-10 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-stone-800" />
        
        <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[2.2rem] bg-stone-900">
          {/* Fallback Image (shown while video loads or if video fails) */}
          <Image
            src={fallbackImage}
            alt="Agentix Dashboard Fallback"
            fill
            className={`object-cover object-top transition-opacity duration-700 ${isVideoLoaded ? 'opacity-0' : 'opacity-100'}`}
            sizes="(max-width: 640px) 340px, 400px"
            priority
          />
          
          {/* Scroll-driven Video */}
          <video
            ref={videoRef}
            src={videoSrc}
            className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
            muted
            playsInline
            preload="auto"
          />
        </div>
      </div>
    </div>
  );
}
