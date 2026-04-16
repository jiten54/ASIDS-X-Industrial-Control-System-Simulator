import { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Settings, ShieldAlert, Zap, Thermometer, Gauge, Activity, RotateCcw, Flame } from 'lucide-react';
import { SensorData, FaultEvent } from './types';
import AncientGauge from './components/AncientGauge';
import RuneAlert from './components/RuneAlert';
import ScrollLog from './components/ScrollLog';

export default function App() {
  const [sensors, setSensors] = useState<SensorData[]>([]);
  const [faults, setFaults] = useState<FaultEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const socket = new WebSocket(`${protocol}//${host}`);
    wsRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
      console.log('Connected to Ancient Console');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'SENSOR_UPDATE_BATCH') {
        setSensors(prev => {
          const next = [...prev];
          data.payload.forEach((update: SensorData) => {
            const index = next.findIndex(s => s.deviceId === update.deviceId);
            if (index > -1) next[index] = update;
            else next.push(update);
          });
          return next;
        });
      } else if (data.type === 'FAULT_EVENT') {
        const fault = data.payload;
        
        // Send ACK for new events (not replays)
        if (!data.isReplay) {
          socket.send(JSON.stringify({ type: 'ACK', payload: { id: fault.id } }));
        }

        setFaults(prev => {
          if (prev.some(f => f.id === fault.id)) return prev;
          return [fault, ...prev].slice(0, 100);
        });
      } else if (data.type === 'REPLAY_START') {
        console.log('Receiving system chronicles...');
        setFaults([]); // Clear for fresh replay
      }
    };

    socket.onclose = () => {
      setConnected(false);
      console.log('Disconnected from Ancient Console');
    };

    wsRef.current = socket;

    return () => {
      socket.close();
    };
  }, []);

  const injectFault = async () => {
    try {
      await fetch('/api/inject-fault', { method: 'POST' });
    } catch (err) {
      console.error('Failed to inject fault:', err);
    }
  };

  const resetLogs = () => setFaults([]);

  return (
    <div className="console-frame">
      {/* Header */}
      <header className="border-b-2 border-bronze flex justify-between items-center px-10">
        <div className="text-[32px] tracking-[4px] uppercase font-bold glow-rune">
          ASIDS-X // Ancient Core
        </div>
        <div className="flex gap-5 text-sm text-fire">
          <span>᚛ SYSTEM ACTIVE ᚜</span>
          <span>᚛ {connected ? 'SYNCHRONIZED' : 'DISCONNECTED'} ᚜</span>
        </div>
      </header>

      {/* Main Display */}
      <main className="grid grid-cols-[280px_1fr_280px] gap-5 items-stretch overflow-hidden">
        {/* Side Panel Left */}
        <div className="stone-panel space-y-6 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] uppercase tracking-[2px] text-[#8b7355] mb-2">Thermal Essence</div>
          {sensors.slice(0, 3).map((sensor) => (
            <div key={sensor.deviceId} className="mb-6">
              <div className="text-[10px] uppercase tracking-[2px] text-[#8b7355] mb-1">{sensor.type}</div>
              <div className="text-[28px] font-mono text-[#f2f2f2]">{sensor.value} {sensor.unit}</div>
              {sensor.status !== 'Normal' && (
                <div className="w-10 h-10 border border-fire flex items-center justify-center text-2xl mt-2 bg-fire/10 shadow-[0_0_15px_rgba(255,78,0,0.3)] text-fire">
                  ᛏ
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Center Altar */}
        <div className="flex flex-col items-center justify-center relative">
          <div className="w-[320px] h-[320px] border-[8px] border-double border-bronze rounded-full flex items-center justify-center relative bg-[radial-gradient(circle,#2a2218_0%,transparent_70%)]">
            <AncientGauge
              label="STABILITY INDEX"
              value={sensors.length > 0 ? Math.round((sensors.filter(s => s.status === 'Normal').length / sensors.length) * 100) : 100}
              unit="%"
              status={sensors.some(s => s.status !== 'Normal') ? 'Critical' : 'Normal'}
              min={0}
              max={100}
            />
          </div>
          {faults.length > 0 && (
            <div className="text-fire italic text-xs mt-4 text-center uppercase tracking-wider">
              ANOMALY DETECTED: {faults[0].message}
            </div>
          )}
        </div>

        {/* Side Panel Right */}
        <div className="stone-panel flex flex-col justify-between">
          <div className="space-y-6">
            <div className="sensor-block">
              <div className="text-[10px] uppercase tracking-[2px] text-[#8b7355] mb-1">Thread Count</div>
              <div className="text-[28px] font-mono text-[#f2f2f2]">16 Active</div>
            </div>
            <div className="sensor-block">
              <div className="text-[10px] uppercase tracking-[2px] text-[#8b7355] mb-1">Fault Prob.</div>
              <div className="text-[28px] font-mono text-[#f2f2f2]">0.12%</div>
            </div>
            <div className="h-40">
              <RuneAlert faults={faults} />
            </div>
          </div>
          
          <div className="flex flex-col gap-3 pt-4">
            <button onClick={injectFault} className="stone-btn">Inject Chaos</button>
            <button onClick={() => wsRef.current?.send(JSON.stringify({ type: 'REPLAY_REQUEST' }))} className="stone-btn">Replay Chronicles</button>
            <button onClick={resetLogs} className="stone-btn">Purge Scrolls</button>
          </div>
        </div>
      </main>

      {/* Scroll Log */}
      <section className="h-[200px] overflow-hidden">
        <ScrollLog logs={faults} />
      </section>
    </div>
  );
}
