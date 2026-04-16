import { motion, AnimatePresence } from 'motion/react';
import { FaultEvent } from '../types';
import { ScrollText } from 'lucide-react';

interface ScrollLogProps {
  logs: FaultEvent[];
}

export default function ScrollLog({ logs }: ScrollLogProps) {
  return (
    <div className="parchment h-full flex flex-col border border-[#d2b48c] overflow-hidden">
      {/* Scanline effect overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,0,0,0.05)_50%,transparent_50%)] bg-[length:100%_4px] z-10" />
      
      <div className="p-4 border-b border-bronze flex items-center gap-2 bg-stone-900/5 text-gold font-bold">
        <ScrollText className="w-5 h-5 text-bronze" />
        <span className="font-serif text-sm uppercase tracking-widest">Chronicles of the Machine</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-[13px] text-ink relative z-0">
        <AnimatePresence initial={false}>
          {logs.length === 0 ? (
            <div className="text-center opacity-30 italic mt-10">
              The scrolls are empty. Peace reigns in the engine room.
            </div>
          ) : (
            logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`border-l-4 pl-3 py-1 ${
                  log.level === 'CRITICAL' ? 'border-fire' : 
                  log.level === 'WARNING' ? 'border-orange-500' : 'border-bronze'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#8b4513] font-bold">
                    [{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}]
                  </span>
                  <span className="text-[9px] opacity-50 uppercase tracking-tighter">
                    {log.source} v{log.version}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-stone-600 uppercase mb-0.5">
                    {log.id}
                  </span>
                  <span className="leading-tight">{log.message}</span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
