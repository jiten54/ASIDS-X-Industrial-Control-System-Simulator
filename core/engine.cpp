#include <iostream>
#include <vector>
#include <string>
#include <thread>
#include <chrono>
#include <random>
#include <json/json.h> // Assuming jsoncpp is available in a real prod env

/**
 * ASIDS-X Core Engine
 * Production-grade C++ Device Simulation Layer
 */

enum class Status { Normal, Warning, Critical, Failure };

struct SensorData {
    std::string deviceId;
    std::string type;
    double value;
    std::string unit;
    long long timestamp;
    Status status;
};

class Device {
protected:
    std::string id;
    std::string type;
    double baseValue;
    std::string unit;
    double noiseRange;
    long long startTime;
    int errorCount = 0;

public:
    Device(std::string id, std::string type, double base, std::string unit, double noise)
        : id(id), type(type), baseValue(base), unit(unit), noiseRange(noise) {
        startTime = std::chrono::system_clock::to_time_t(std::chrono::system_clock::now());
    }

    virtual SensorData generateData() = 0;

    std::string getId() const { return id; }
    int getErrorCount() const { return errorCount; }
};

class TemperatureSensor : public Device {
public:
    TemperatureSensor(std::string id, double base) : Device(id, "Temperature", base, "°C", 2.0) {}

    SensorData generateData() override {
        static std::default_random_engine generator;
        std::uniform_real_distribution<double> distribution(-noiseRange, noiseRange);
        double val = baseValue + distribution(generator);
        
        Status s = Status::Normal;
        if (val > baseValue + 1.5) s = Status::Warning;
        if (val > baseValue + 3.0) s = Status::Critical;

        return {id, type, val, unit, std::chrono::system_clock::to_time_t(std::chrono::system_clock::now()), s};
    }
};

// ... More sensor types (Pressure, Voltage) would be here ...

class DeviceManager {
private:
    std::vector<Device*> devices;
    bool running = false;

public:
    void addDevice(Device* d) { devices.push_back(d); }

    void start() {
        running = true;
        while (running) {
            for (auto& d : devices) {
                SensorData data = d->generateData();
                // In a real system, this would publish to an Event Bus or write to a socket
                std::cout << "{\"deviceId\":\"" << data.deviceId << "\", \"value\":" << data.value << "}" << std::endl;
            }
            std::this_thread::sleep_for(std::chrono::milliseconds(1000));
        }
    }

    void stop() { running = false; }
};

int main() {
    DeviceManager manager;
    manager.addDevice(new TemperatureSensor("D-01", 75.0));
    // manager.addDevice(new PressureSensor("D-02", 1200.0));
    
    std::cout << "ASIDS-X Core Engine Initialized." << std::endl;
    manager.start();
    
    return 0;
}
