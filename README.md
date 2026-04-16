# ASIDS-X: Advanced Smart Industrial Device Simulator

## Architecture Overview

ASIDS-X is a multi-layered industrial control simulation platform designed for high-performance monitoring and diagnostics.

### 1. Core Systems Layer (C++)
- **Location**: `/core/engine.cpp`
- **Role**: High-speed device simulation.
- **Features**: Multi-threaded device manager, OO sensor models, fault injection.

### 2. Control System Layer (Python)
- **Location**: `/logic/diagnostics.py`
- **Role**: Data aggregation and anomaly detection.
- **Features**: Moving average analysis, fault classification, root cause diagnostics.

### 3. Communication Layer (Node.js)
- **Location**: `/server.ts`
- **Role**: Real-time bridge and WebSocket gateway.
- **Features**: Process orchestration, streaming updates, system state management.

### 4. Visualization Layer (React)
- **Location**: `/src/`
- **Role**: Immersive "Ancient Engineering" interface.
- **Features**: SVG gauges, Runic alerts, Parchment logs.

## Data Flow
1. `C++ Engine` generates raw sensor data (JSON).
2. `Python Engine` consumes raw data, performs statistical analysis, and identifies anomalies.
3. `Node.js Gateway` broadcasts the enriched data to all connected clients.
4. `React Frontend` visualizes the data using the "Ancient Core" theme.

## Design Decisions
- **Event-Driven**: Uses internal event buses and WebSockets for asynchronous updates.
- **Modular**: Each layer is decoupled, allowing for independent scaling or replacement (e.g., swapping Python for a C++ diagnostics engine).
- **Immersive UX**: The "Ancient" theme provides a unique, high-contrast interface that improves operator focus compared to generic dashboards.
