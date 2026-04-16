import { motion, AnimatePresence } from 'motion/react';
import { FaultEvent } from '../types';

interface RuneAlertProps {
  faults: FaultEvent[];
}

const runes = ['ᚦ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚻ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛋ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛝ', 'ᛞ', 'ᛟ'];

export default function RuneAlert({ faults }: RuneAlertProps) {
  const activeFault = faults[0]; // Show the latest fault

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-[10px] uppercase tracking-[2px] text-[#8b7355] mb-2">Runic Status</div>
      <AnimatePresence mode="wait">
        {activeFault ? (
          <motion.div
            key={activeFault.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="w-16 h-16 border-2 border-fire flex items-center justify-center text-3xl bg-fire/10 shadow-[0_0_15px_rgba(255,78,0,0.3)] text-fire"
          >
            {runes[Math.floor(Math.random() * runes.length)]}
          </motion.div>
        ) : (
          <div className="w-16 h-16 border-2 border-bronze flex items-center justify-center text-3xl bg-stone-800 text-stone-600">
            ᛟ
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
