
import React from 'react';

interface GooeyBlobProps {
  className?: string;
  color?: string;
  size?: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  delay?: number;
  opacity?: number;
  blur?: string;
  animate?: boolean;
}

const GooeyBlob: React.FC<GooeyBlobProps> = ({
  className = '',
  color = 'bg-primary',
  size = 300,
  top,
  left,
  right,
  bottom,
  delay = 0,
  opacity = 0.7,
  blur = 'xl',
  animate = true,
}) => {
  const animationStyle = {
    animationDelay: `${delay}s`,
    width: `${size}px`,
    height: `${size}px`,
    top,
    left,
    right,
    bottom,
    opacity,
  };

  return (
    <div
      className={`absolute ${color} rounded-full filter blur-${blur} ${animate ? 'animate-blob' : ''} ${className}`}
      style={{...animationStyle, mixBlendMode: 'screen'}}
    ></div>
  );
};

export default GooeyBlob;
