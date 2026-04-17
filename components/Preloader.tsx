import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const percentageRef = useRef<HTMLSpanElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Animate logo in
    tl.fromTo(logoRef.current, 
      { opacity: 0, y: 20, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' }
    );

    // Progress bar animation
    tl.to(progressBarRef.current, {
      width: '100%',
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: function() {
        const progress = Math.round(this.progress() * 100);
        if (percentageRef.current) {
          percentageRef.current.textContent = `${progress}%`;
        }
      }
    }, '+=0.3');

    // Fade out preloader
    tl.to(preloaderRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        onComplete();
      }
    }, '+=0.5');

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div 
      ref={preloaderRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
    >
      <div ref={logoRef} className="text-center mb-12">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight glow-text">
          Matheus Lima
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-4 tracking-wider">
          FULL STACK DEVELOPER
        </p>
      </div>

      <div className="w-64 md:w-96">
        <div className="h-1 bg-secondary rounded-full overflow-hidden relative">
          <div 
            ref={progressBarRef}
            className="h-full bg-primary glow-border rounded-full"
            style={{ width: '0%' }}
          />
        </div>
        <div className="text-center mt-4">
          <span ref={percentageRef} className="text-primary font-medium text-sm tracking-widest">
            0%
          </span>
        </div>
      </div>

      {/* Floating orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
};

export default Preloader;
