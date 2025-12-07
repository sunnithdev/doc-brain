import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import 'dotenv/config';
import { RagService } from './rag-service';

const pdfParse = require('pdf-parse');

let ragService: RagService | null = null;

async function getRagService() {
    if (!ragService) {
        ragService = new RagService();
    }
    return ragService;
}

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        backgroundColor: '#111827', // Tailwind gray-900
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        titleBarStyle: 'hiddenInset', // Mac-style seamless titlebar
    });

    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    }
}

ipcMain.handle('parse-file', async (event, filePath) => {
    try {
        console.log(`Processing file: ${filePath}`);
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);

        const service = await getRagService();
        await service.ingestFile(data.text, path.basename(filePath));

        return {
            text: data.text,
            info: data.info,
            metadata: data.metadata,
        };
    } catch (error) {
        console.error('Error parsing/ingesting PDF:', error);
        throw error;
    }
});

ipcMain.handle('ask-doc-brain', async (event, question) => {
    try {
        const service = await getRagService();
        const answer = await service.ask(question);
        return answer;
    } catch (error) {
        console.error('Error in ask-doc-brain:', error);
        throw error;
    }
});

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
