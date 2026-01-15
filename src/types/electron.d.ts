/**
 * Project: KNOUX Player X™
 * Purpose: Extend Window object with the Secure Bridge API.
 */

export interface IElectronAPI {
    send(channel: string, data?: any): void;
    receive(channel: string, func: (...args: any[]) => void): void;
    invoke<T>(channel: string, ...args: any[]): Promise<T>;
    removeAllListeners(channel: string): void;
    
    // Native System Info
    platform: string;
}

declare global {
    interface Window {
        knouxAPI: IElectronAPI;
    }
}
