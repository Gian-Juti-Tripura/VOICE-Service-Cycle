import React, { useMemo } from 'react';

interface Petal {
  id: number;
  flower: string;
  left: number;
  duration: number;
  delay: number;
  size: number;
  driftX: number;
  rotEnd: number;
  opacity: number;
}

const FLOWER_ICONS = [
  '🌸', // Pink Lotus / Cherry Blossom
  '🪷', // Sacred Lotus
  '🌼', // Jasmine Blossom
  '🏵️', // Golden Marigold
  '🌺', // Hibiscus
  '💮', // White Jasmine
  '🌸', // Lotus Petal
  '🪷', // Blue/Pink Lotus
  '✨', // Golden Sparkle
  '🌿', // Sacred Tulasi Leaf
  '🍃', // Fluttering Green Leaf
  '⭐', // Celestial Star
  '🌸', // Lotus
  '🌼', // Yellow Blossom
  '🏵️'  // Saffron Kadamba
];

export const FallingFlowers: React.FC = () => {
  const petals: Petal[] = useMemo(() => {
    // 32 delicate, small floating flower petals & sacred elements
    return Array.from({ length: 32 }, (_, i) => {
      const flower = FLOWER_ICONS[i % FLOWER_ICONS.length];
      // Evenly distribute across screen width (1% to 98%)
      const left = ((i * 3.1 + (i % 5) * 4.2) % 96) + 2;
      // Gentle, floating fall durations (8s - 16s)
      const duration = 8.5 + ((i * 3) % 7) * 1.2;
      // Staggered smooth continuous delays (0s - 14s)
      const delay = ((i * 0.55) % 13.5);
      // Delicate smaller sizes: 8px to 13px
      const size = 8 + (i % 4) * 1.5;
      // Subtle natural breeze drift (-20px to +25px)
      const driftX = -20 + (i % 5) * 9;
      // Smooth spinning rotations
      const rotEnd = 140 + (i % 5) * 70;
      // Soft divine transparency
      const opacity = 0.32 + (i % 4) * 0.10;

      return {
        id: i,
        flower,
        left,
        duration,
        delay,
        size,
        driftX,
        rotEnd,
        opacity
      };
    });
  }, []);

  return (
    <div 
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-20 overflow-hidden select-none"
    >
      {petals.map((p) => (
        <div
          key={p.id}
          className="flower-petal drop-shadow-xs"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            ['--drift-x' as string]: `${p.driftX}px`,
            ['--rot-end' as string]: `${p.rotEnd}deg`,
          }}
        >
          {p.flower}
        </div>
      ))}
    </div>
  );
};

export default FallingFlowers;
