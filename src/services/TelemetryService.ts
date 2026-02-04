import { app } from "electron";
import os from "os";

export class TelemetryService {
    async collectMetrics() {
        const gpuInfo = await app.getGPUInfo("basic");
        return {
            app: {
                version: app.getVersion(),
                uptime: process.uptime(),
                memory: process.memoryUsage()
            },
            system: {
                platform: process.platform,
                arch: process.arch,
                cpus: os.cpus().length,
                memory: os.totalmem(),
                load: os.loadavg()
            },
            gpu: gpuInfo?.gpuDevice?.[0] ?? null,
            network: {
                interfaces: Object.keys(os.networkInterfaces() ?? {})
            }
        };
    }
}
