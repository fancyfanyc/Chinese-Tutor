import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import HanziWriter from 'hanzi-writer';

interface HanziCanvasProps {
  character: string;
  size?: number;
  onLoad?: () => void;
  onError?: (err: any) => void;
}

export interface HanziCanvasHandle {
  animate: () => void;
  loop: () => void;
  quiz: () => void;
  stop: () => void;
}

const HanziCanvas = forwardRef<HanziCanvasHandle, HanziCanvasProps>(({ character, size = 300, onLoad, onError }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriter | null>(null);
  const [isLooping, setIsLooping] = useState(false);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    animate: () => {
      if (writerRef.current) {
        setIsLooping(false);
        writerRef.current.cancelQuiz();
        writerRef.current.animateCharacter();
      }
    },
    loop: () => {
      if (writerRef.current) {
        setIsLooping(true);
        writerRef.current.cancelQuiz();
        // Start the recursive loop
        const loopAnim = () => {
           if (writerRef.current) { // Check ref again inside closure
             writerRef.current.animateCharacter({
               onComplete: () => {
                 // Use a small timeout to allow the 'cancel' state to be checked effectively if user stopped it
                 setTimeout(() => {
                   if (isLooping) loopAnim();
                 }, 1000); 
               }
             });
           }
        };
        loopAnim();
      }
    },
    quiz: () => {
      if (writerRef.current) {
        setIsLooping(false);
        writerRef.current.quiz();
      }
    },
    stop: () => {
      setIsLooping(false);
      if (writerRef.current) {
        writerRef.current.cancelQuiz();
        writerRef.current.hideCharacter();
      }
    }
  }));

  // Clean up loop state when character changes
  useEffect(() => {
    setIsLooping(false);
  }, [character]);

  useEffect(() => {
    if (!containerRef.current || !character) return;

    // Clear previous instance
    containerRef.current.innerHTML = '';

    try {
      const writer = HanziWriter.create(containerRef.current, character, {
        width: size,
        height: size,
        padding: 20,
        showOutline: true,
        strokeAnimationSpeed: 1, // 1x speed
        delayBetweenStrokes: 200, // ms
        strokeColor: '#1a1a1a', // Ink black
        radicalColor: '#e63946', // Cinnabar red for radical
        outlineColor: '#ddd',
        drawingWidth: 20,
        showCharacter: true,
        showHintAfterMisses: 3,
        highlightOnVariation: true,
      });

      writerRef.current = writer;
      if (onLoad) onLoad();
      
      // Add Mi Zi Ge (Rice Grid) manually using SVG since we want specific styling
      // HanziWriter has basic grid support, but manual SVG gives us Tailwind control
      
    } catch (err) {
      if (onError) onError(err);
    }

    return () => {
      // Cleanup handled by clearing innerHTML on next run, 
      // but explicitly stopping animations is good practice.
      if (writerRef.current) {
        writerRef.current.cancelQuiz();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character, size]);

  return (
    <div className="relative inline-block bg-rice-paper shadow-inner border-2 border-stone-200 rounded-lg overflow-hidden">
      {/* Mi Zi Ge Background - Absolute positioned SVG */}
      <svg 
        className="absolute inset-0 pointer-events-none opacity-20" 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
      >
        <line x1="0" y1="0" x2={size} y2={size} stroke="#e63946" strokeWidth="1" strokeDasharray="5,5" />
        <line x1={size} y1="0" x2="0" y2={size} stroke="#e63946" strokeWidth="1" strokeDasharray="5,5" />
        <line x1={size/2} y1="0" x2={size/2} y2={size} stroke="#e63946" strokeWidth="1" strokeDasharray="5,5" />
        <line x1="0" y1={size/2} x2={size} y2={size/2} stroke="#e63946" strokeWidth="1" strokeDasharray="5,5" />
        <rect x="0" y="0" width={size} height={size} stroke="#e63946" strokeWidth="2" fill="none" />
      </svg>
      
      {/* Target Div for HanziWriter */}
      <div ref={containerRef} className="cursor-crosshair relative z-10" />
    </div>
  );
});

export default HanziCanvas;