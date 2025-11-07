import ZKLib from 'node-zklib';
import type { DeviceLogsAttributes } from './deviceTypes.js';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      SERVER_PORT: string;
      DB_NAME: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_HOST: string;
      DB_PORT: number;
      FINGERPRINT_IP: string;
      FINGERPRINT_PORT: number;
    }
  }
  namespace Express {
    interface Request {
      zkInstance: any;
      deviceLogs: DeviceLogsAttributes;
    }
  }
}

export {};
