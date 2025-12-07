export interface ElectronAPI {
    parseFile: (filePath: string) => Promise<{ text: string; info: any }>;
    getFilePath: (file: File) => string;
    askDocBrain: (question: string) => Promise<string>;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}
