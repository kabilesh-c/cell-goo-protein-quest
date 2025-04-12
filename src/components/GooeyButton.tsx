
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Play } from 'lucide-react';

interface GooeyButtonProps {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

const GooeyButton: React.FC<GooeyButtonProps> = ({
  onClick,
  className,
  children,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    // Create SVG filter element for the gooey effect if it doesn't exist
    if (!document.getElementById('gooey-filter')) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('style', 'position: absolute; width: 0; height: 0');
      
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      
      const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
      filter.setAttribute('id', 'gooey-filter');
      
      const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
      feGaussianBlur.setAttribute('in', 'SourceGraphic');
      feGaussianBlur.setAttribute('stdDeviation', '10');
      feGaussianBlur.setAttribute('result', 'blur');
      
      const feColorMatrix = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix');
      feColorMatrix.setAttribute('in', 'blur');
      feColorMatrix.setAttribute('mode', 'matrix');
      feColorMatrix.setAttribute('values', '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9');
      feColorMatrix.setAttribute('result', 'gooey');
      
      const feComposite = document.createElementNS('http://www.w3.org/2000/svg', 'feComposite');
      feComposite.setAttribute('in', 'SourceGraphic');
      feComposite.setAttribute('in2', 'gooey');
      feComposite.setAttribute('operator', 'atop');
      
      filter.appendChild(feGaussianBlur);
      filter.appendChild(feColorMatrix);
      filter.appendChild(feComposite);
      defs.appendChild(filter);
      svg.appendChild(defs);
      
      document.body.appendChild(svg);
    }

    // Create bubble elements within the button
    const bubblesContainer = document.createElement('span');
    bubblesContainer.classList.add('bubbles');

    // Create 6 bubbles
    for (let i = 0; i < 6; i++) {
      const bubble = document.createElement('span');
      bubble.classList.add('bubble');
      
      // Randomize bubble positions
      bubble.style.left = `${Math.random() * 100}%`;
      bubble.style.bottom = `${Math.random() * 50}%`;
      
      // Randomize bubble sizes
      const size = 5 + Math.random() * 10;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      
      // Randomize animation delay
      bubble.style.animationDelay = `${Math.random() * 2}s`;
      
      bubblesContainer.appendChild(bubble);
    }

    button.classList.add('gooey-button');
    button.appendChild(bubblesContainer);

    return () => {
      if (button.contains(bubblesContainer)) {
        button.removeChild(bubblesContainer);
      }
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={cn(
        'relative overflow-hidden px-8 py-4 rounded-full',
        'bg-gradient-to-r from-violet-600 to-cyan-400',
        'text-white font-medium shadow-lg hover:shadow-xl',
        'transform transition-all duration-300 hover:scale-105',
        'flex items-center gap-2 border border-violet-400/30',
        'group',
        className
      )}
    >
      <span className="flex items-center justify-center bg-white/20 rounded-full p-1 
        transform transition-all duration-300 group-hover:bg-white/30 group-hover:rotate-45">
        <Play className="h-4 w-4" />
      </span>
      {children}
      <span className="absolute inset-0 bg-gradient-to-r from-purple-600/40 via-transparent to-cyan-400/40 
        opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></span>
    </button>
  );
};

export default GooeyButton;
