import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { spawn } from 'child_process';
import { EventEmitter } from 'events';
import { SensorData, FaultEvent, DeviceType } from './src/types.js';

const PORT = 3000;

// --- Shadow C++ Engine (Simulated) ---
class ShadowCPPEngine extends EventEmitter {
  devices = [
    { id: 'D-01', type: 'Temperature' as DeviceType, base: 75, unit: '°C' },
    { id: 'D-02', type: 'Pressure' as DeviceType, base: 1200, unit: 'PSI' },
    { id: 'D-03', type: 'Voltage' as DeviceType, base: 230, unit: 'V' }
  ];

  start() {
    setInterval(() => {
      this.devices.forEach(d => {
        const val = d.base + (Math.random() - 0.5) * 10;
        const data: SensorData = { 
          deviceId: d.id, 
          type: d.type, 
          value: Number(val.toFixed(2)), 
          unit: d.unit, 
          timestamp: Date.now(),
          status: 'Normal',
          version: 1
        };
        this.emit('raw_data', data);
      });
    }, 1000);
  }
}

// --- Python Diagnostics Orchestrator ---
class DiagnosticsOrchestrator extends EventEmitter {
  pythonProcess: any;
  private buffer: string = '';

  constructor() {
    super();
    this.init();
  }

  init() {
    this.pythonProcess = spawn('python3', [path.join(process.cwd(), 'logic/diagnostics.py')]);

    this.pythonProcess.stdout.on('data', (data: Buffer) => {
      this.buffer += data.toString();
      const lines = this.buffer.split('\n');
      this.buffer = lines.pop() || '';

      lines.forEach(line => {
        if (line.trim()) {
          try {
            const parsed = JSON.parse(line);
            this.emit('analysis', parsed);
          } catch (e) {
            console.log('Python Log:', line.trim());
          }
        }
      });
    });

    this.pythonProcess.stderr.on('data', (data: Buffer) => {
      console.error('Python Error:', data.toString());
    });
  }

  analyze(rawData: any) {
    if (this.pythonProcess.stdin.writable) {
      this.pythonProcess.stdin.write(JSON.stringify(rawData) + '\n');
    }
  }
}

// --- CERN-Grade Event Manager ---
class EventManager {
  private history: FaultEvent[] = [];
  private maxHistory = 100;
  private pendingAcks = new Map<string, { event: FaultEvent, retries: number, timer: NodeJS.Timeout }>();
  private wss: WebSocketServer;

  constructor(wss: WebSocketServer) {
    this.wss = wss;
  }

  private generateId(deviceId: string, type: string): string {
    const timestamp = Date.now();
    const uuid = Math.random().toString(36).substr(2, 6);
    return `${deviceId}-${type.replace(/\s+/g, '_').toUpperCase()}-${timestamp}-${uuid}`;
  }

  broadcast(event: FaultEvent) {
    this.history.push(event);
    if (this.history.length > this.maxHistory) this.history.shift();

    const message = JSON.stringify({ type: 'FAULT_EVENT', payload: event });
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });

    // Start ACK tracking
    this.trackAck(event);
  }

  private trackAck(event: FaultEvent) {
    const timer = setTimeout(() => this.retry(event.id), 5000);
    this.pendingAcks.set(event.id, { event, retries: 0, timer });
  }

  private retry(id: string) {
    const entry = this.pendingAcks.get(id);
    if (!entry) return;

    if (entry.retries < 3) {
      entry.retries++;
      console.log(`Retrying event ${id} (Attempt ${entry.retries})`);
      
      const message = JSON.stringify({ type: 'FAULT_EVENT', payload: entry.event, isRetry: true });
      this.wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) client.send(message);
      });

      entry.timer = setTimeout(() => this.retry(id), 5000);
    } else {
      console.error(`Event ${id} failed after max retries.`);
      this.pendingAcks.delete(id);
    }
  }

  acknowledge(id: string) {
    const entry = this.pendingAcks.get(id);
    if (entry) {
      clearTimeout(entry.timer);
      this.pendingAcks.delete(id);
      console.log(`Event ${id} acknowledged.`);
    }
  }

  replay(ws: WebSocket) {
    console.log('Replaying last 10 minutes of events...');
    ws.send(JSON.stringify({ type: 'REPLAY_START' }));
    this.history.forEach(event => {
      ws.send(JSON.stringify({ type: 'FAULT_EVENT', payload: event, isReplay: true }));
    });
    ws.send(JSON.stringify({ type: 'REPLAY_END' }));
  }

  createFault(deviceId: string, type: string, message: string): FaultEvent {
    return {
      id: this.generateId(deviceId, type),
      version: 1,
      deviceId,
      type,
      level: 'CRITICAL',
      source: 'PYTHON_DIAGNOSTICS',
      message,
      timestamp: Date.now()
    };
  }
}

// --- Server Setup ---

async function startServer() {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });
  
  const shadowEngine = new ShadowCPPEngine();
  const diagnostics = new DiagnosticsOrchestrator();
  const eventManager = new EventManager(wss);

  wss.on('connection', (ws) => {
    console.log('Client connected to ASIDS-X CERN-Grade Gateway');
    
    // Initial Replay
    eventManager.replay(ws);

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === 'ACK') {
          eventManager.acknowledge(data.payload.id);
        } else if (data.type === 'REPLAY_REQUEST') {
          eventManager.replay(ws);
        }
      } catch (e) {
        console.error('Failed to parse client message');
      }
    });

    const onAnalysis = (data: any) => {
      if (ws.readyState === WebSocket.OPEN) {
        const sensorUpdate: SensorData = {
          deviceId: data.raw.deviceId,
          type: data.raw.type,
          value: data.raw.value,
          unit: data.raw.unit,
          timestamp: data.raw.timestamp,
          status: data.analysis.isAnomaly ? 'Critical' : 'Normal',
          version: 1
        };
        
        ws.send(JSON.stringify({ type: 'SENSOR_UPDATE_BATCH', payload: [sensorUpdate] }));

        if (data.analysis.isAnomaly) {
          const fault = eventManager.createFault(
            data.raw.deviceId,
            data.analysis.diagnostics.rootCause,
            data.analysis.message
          );
          eventManager.broadcast(fault);
        }
      }
    };

    diagnostics.on('analysis', onAnalysis);

    ws.on('close', () => {
      diagnostics.off('analysis', onAnalysis);
    });
  });

  // Pipe Shadow Engine to Python
  shadowEngine.on('raw_data', (data) => {
    diagnostics.analyze(data);
  });

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ASIDS-X Systems Operational', layers: ['CPP_SHADOW', 'PYTHON_DIAG', 'NODE_GW'] });
  });

  app.post('/api/inject-fault', (req, res) => {
    // Simulate a massive spike that Python will catch
    const spike = { deviceId: 'D-01', type: 'Temperature', value: 150.0, unit: '°C', timestamp: Date.now() };
    diagnostics.analyze(spike);
    res.json({ status: 'Chaos Injected into Core' });
  });

  // Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  shadowEngine.start();

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`ASIDS-X Gateway running at http://localhost:${PORT}`);
  });
}

startServer();
