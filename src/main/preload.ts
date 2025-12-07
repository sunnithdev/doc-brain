import { contextBridge, ipcRenderer, webUtils } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    parseFile: (filePath: string) => ipcRenderer.invoke('parse-file', filePath),
    getFilePath: (file: File) => webUtils.getPathForFile(file),
    askDocBrain: (question: string) => ipcRenderer.invoke('ask-doc-brain', question),
});
