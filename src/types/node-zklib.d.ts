declare module 'node-zklib' {
  export interface ZKUser {
    uid: number;
    userId: string;
    name: string;
    role: number;
    password?: string;
    cardno?: string;
  }

  export interface ZKAttendance {
    userSn: number;
    deviceUserId: string;
    ip: string;
    recordTime: Date;
    attendanceType: number | undefined;
  }

  export interface ZKLibResponse<T> {
    code: number;
    message: string;
    data: T[];
  }

  export default class ZKLib {
    constructor(
      ip: string,
      port: number,
      timeout?: number,
      inport?: number,
      commKey?: number
    );

    createSocket(): Promise<void>;
    disconnect(): Promise<void>;

    getUsers(): Promise<ZKLibResponse<ZKUser>>;
    getAttendances(): Promise<ZKLibResponse<ZKAttendance>>;

    enableDevice(): Promise<void>;
    disableDevice(): Promise<void>;
    getInfo(): Promise<Record<string, any>>;
    clearAttendanceLog(): Promise<void>;
    testVoice(): Promise<void>;
  }
}
