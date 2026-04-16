import { motion } from 'motion/react';

interface AncientGaugeProps {
  key?: string | number;
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  status: 'Normal' | 'Warning' | 'Critical';
}

export default function AncientGauge({ label, value, min, max, unit, status }: AncientGaugeProps) {
  const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);
  const rotation = (percentage / 100) * 270 - 135; // -135 to 135 degrees for a 3/4 circle

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full">
      {/* Needle */}
      <motion.div
        className="absolute w-1 h-[140px] bg-fire bottom-1/2 origin-bottom shadow-[0_0_10px_#ff4e00] z-10"
        animate={{ rotate: rotation }}
        transition={{ type: 'spring', stiffness: 50, damping: 10 }}
      />
      
      {/* Center Point */}
      <div className="absolute w-5 h-5 bg-gold rounded-full z-20 shadow-lg" />

      {/* Label */}
      <div className="absolute bottom-10 text-xs text-[#8b7355] uppercase tracking-widest font-serif">
        {label}
      </div>

      {/* Value Display */}
      <div className="absolute top-1/2 translate-y-8 text-2xl font-mono text-[#f2f2f2] glow-rune">
        {value} <span className="text-sm opacity-50">{unit}</span>
      </div>
    </div>
  );
}
