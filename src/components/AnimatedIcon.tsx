import { useRef, useEffect, useState } from 'react';
import lottie from 'lottie-web';
import type { AnimationItem } from 'lottie-web';

interface AnimatedIconProps {
  src: object; // JSON import
  size?: number;
  className?: string;
  trigger?: 'hover' | 'click' | 'loop' | 'morph';
  isActive?: boolean;
  theme?: 'dark' | 'light';
}

export default function AnimatedIcon({
  src,
  size = 24,
  className = '',
  trigger = 'hover',
  isActive: _isActive = false,
  theme: _theme = 'dark'
}: AnimatedIconProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    animationRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: src,
    });

    // Stop at first frame
    animationRef.current.goToAndStop(0, true);

    return () => {
      animationRef.current?.destroy();
    };
  }, [src, trigger]);

  const handleMouseEnter = () => {
    if (!animationRef.current || isPlaying) return;

    setIsPlaying(true);

    // Play from frame 0
    animationRef.current.goToAndPlay(0, true);

    // Calculate duration
    const duration = (animationRef.current.totalFrames / animationRef.current.frameRate) * 1000;

    // Reset flag after duration
    setTimeout(() => {
      setIsPlaying(false);
      animationRef.current?.goToAndStop(0, true);
    }, duration + 100); // Add 100ms buffer
  };

  const handleClick = () => {
    if (!animationRef.current || isPlaying) return;

    setIsPlaying(true);
    animationRef.current.goToAndPlay(0, true);

    const duration = (animationRef.current.totalFrames / animationRef.current.frameRate) * 1000;
    setTimeout(() => {
      setIsPlaying(false);
      animationRef.current?.goToAndStop(0, true);
    }, duration + 100);
  };

  return (
    <>
      <style>{`
        .animated-icon-container svg path,
        .animated-icon-container svg rect,
        .animated-icon-container svg circle {
          fill: currentColor !important;
        }
        .animated-icon-container svg path[stroke]:not([stroke="none"]),
        .animated-icon-container svg rect[stroke]:not([stroke="none"]),
        .animated-icon-container svg circle[stroke]:not([stroke="none"]) {
          stroke: currentColor !important;
        }
      `}</style>
      <div
        ref={containerRef}
        className={`animated-icon-container ${className}`}
        style={{
          width: size,
          height: size,
          color: 'currentColor',
        }}
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
      />
    </>
  );
}
