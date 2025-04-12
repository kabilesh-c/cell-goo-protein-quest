
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
}) => {
  const animationStyle = {
    animationDelay: `${delay}s`,
    width: `${size}px`,
    height: `${size}px`,
    top,
    left,
    right,
    bottom,
  };

  return (
    <div
      className={`goo-blob ${color} ${className}`}
      style={animationStyle}
    ></div>
  );
};

export default GooeyBlob;
