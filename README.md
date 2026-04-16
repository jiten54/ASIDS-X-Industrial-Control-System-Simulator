# 🏛️ ASIDS-X — Advanced Smart Industrial Device Simulator (Ancient Core Edition)
<img width="1906" height="850" alt="Screenshot 2026-04-15 175310" src="https://github.com/user-attachments/assets/12ce75ad-dbb5-4c78-8807-eb8c1a7581ce" />

A production-grade industrial control system simulation platform that combines **multi-language system design**, **real-time event streaming**, and a uniquely immersive **Ancient Engineering Console UI**.

Inspired by modern industrial control environments such as those used at CERN, ASIDS-X demonstrates how distributed systems, device integration, and fault-tolerant architectures operate in real-world scenarios.

---

## 🚀 Overview

ASIDS-X simulates a heterogeneous industrial environment where multiple devices generate real-time data, communicate through structured protocols, and are monitored via a centralized control system.

The system is designed to showcase:

* Real-time system integration
* Fault detection and diagnostics
* Distributed event-driven architecture
* Multi-layer data processing
* Advanced UI/UX for monitoring systems

---

## 🧠 System Architecture

The platform is built using a **multi-layered architecture**:

### 1. ⚙️ C++ Device Simulation Layer

* Multi-threaded simulation of industrial sensors:

  * Temperature
  * Pressure
  * Voltage
* Object-oriented design with base and derived device classes
* Fault injection engine (spikes, drift, noise, failures)
* Structured JSON output for interoperability
* Device health monitoring (uptime, error count, status)

---

### 2. 🐍 Python Integration & Diagnostics Layer

* Real-time data ingestion from device layer
* Data aggregation and processing
* Rule-based and statistical anomaly detection
* Diagnostics engine:

  * Fault classification
  * Root cause analysis
  * Suggested corrective actions
* State management and device registry

---

### 3. 🌐 Node.js / WebSocket Gateway

* Real-time communication bridge
* Event-driven architecture
* High-frequency data streaming via WebSockets
* Buffered parsing to handle partial data streams
* Unique event ID generation and deduplication
* Event acknowledgment and retry mechanisms (optional advanced)

---

### 4. 🎨 Ancient Engineering Console (Frontend)

Built using React + Tailwind CSS with a custom immersive design:

* 🏛️ Stone-textured panels with gold/bronze accents
* ⚙️ Real-time mechanical gauges (SVG-based)
* 🔥 Runic alert system (visual anomaly indicators)
* 📜 “Chronicles of the Machine” scroll log
* ⚡ System health & diagnostics indicators
* 🎛️ Interactive controls:

  * Inject Chaos (manual fault trigger)
  * Purge Logs

---

## 🔥 Key Features

### ✅ Real-Time Monitoring

* Live sensor data visualization
* High-frequency event streaming

### ✅ Fault Injection Engine

* Simulates real-world anomalies:

  * Sudden spikes
  * Sensor drift
  * Noise
  * Device failure

### ✅ Fault-Tolerant Event System

* Unique event ID generation
* Buffered stream parsing
* Client-side deduplication
* Event integrity guarantees

### ✅ Diagnostics Engine

* Automatic fault classification
* Root cause suggestions
* System health tracking

### ✅ Multi-Language Integration

* C++ (device layer)
* Python (processing layer)
* Node.js (communication layer)
* React (frontend)

---

## 🛠️ Tech Stack

| Layer              | Technology                                  |
| ------------------ | ------------------------------------------- |
| Device Simulation  | C++ (OOP, multi-threading)                  |
| Integration Engine | Python (data processing, anomaly detection) |
| Communication      | Node.js, Express, WebSockets                |
| Frontend           | React, Tailwind CSS                         |
| Styling            | Custom Ancient UI Theme                     |
| Data Format        | JSON                                        |
| Version Control    | Git + GitHub                                |

---

## ⚙️ Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/jiten54/Aegis-Intelligent-Code-Protection
cd ASIDS-X
```

---

### 2. Backend Setup (Node.js)

```bash
npm install
npm run dev
```

---

### 3. Python Integration Layer

```bash
pip install -r requirements.txt
python engine.py
```

---

### 4. C++ Device Simulation

```bash
g++ device.cpp -o device
./device
```

---

### 5. Frontend

```bash
npm run build
npm start
```

---

## 📡 Usage

1. Start all services (C++, Python, Node.js, Frontend)
2. Open the dashboard in your browser
3. Monitor real-time device data
4. Use **“Inject Chaos”** to simulate faults
5. Observe:

   * Runic alerts
   * Scroll logs
   * System stability

---

## 🎯 Use Cases

* Industrial control system simulation
* Distributed system learning
* Fault-tolerant architecture demonstration
* Real-time monitoring dashboards
* Systems engineering portfolio project

---

## 🚀 Benefits

* Demonstrates **real-world system integration**
* Showcases **advanced backend engineering skills**
* Combines **low-level (C++) and high-level (Python/JS) systems**
* Highlights **fault-tolerant architecture design**
* Provides a **unique and memorable UI experience**

---

## 🧠 Key Engineering Concepts Demonstrated

* Event-driven architecture
* Multi-threaded systems
* Fault injection & resilience
* Real-time data streaming
* Distributed system communication
* Diagnostics and observability

---

## 🔮 Future Enhancements

* OPC-UA protocol integration
* Distributed node simulation
* Database persistence (PostgreSQL / InfluxDB)
* Kubernetes deployment
* Advanced ML-based anomaly detection

---

## 📄 License

This project is for educational and demonstration purposes.

---

## 👤 Author

**Jiten Moni Das**

* GitHub: https://github.com/jiten54
* LinkedIn: https://www.linkedin.com/in/jiten-moni-das-01b3a032b

---

## 🌍 Inspiration

This project is inspired by industrial control systems used in large-scale scientific environments such as CERN, focusing on reliability, scalability, and system integration.

---

## ⭐ Final Note

ASIDS-X is not just a simulation — it is a demonstration of **system-level thinking**, combining software engineering, distributed systems, and creative interface design into a unified platform.
