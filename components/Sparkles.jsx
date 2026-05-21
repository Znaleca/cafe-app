'use client';

import { useEffect, useState } from 'react';
import { BsStars } from 'react-icons/bs';

export default function Sparkles() {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    // Generate a few sparkles randomly positioned
    const newSparkles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      duration: Math.random() * 5 + 3,
    }));
    setSparkles(newSparkles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {sparkles.map((sparkle) => (
        <BsStars
          key={sparkle.id}
          className="sparkle"
          style={{
            left: `${sparkle.x}vw`,
            top: `${sparkle.y}vh`,
            fontSize: `${sparkle.size}px`,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: `${sparkle.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
