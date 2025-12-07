
import { create } from 'zustand';

export interface DocFile {
    name: string;
    path: string;
    size: string;
    status: 'parsed' | 'processing' | 'error';
    content?: string;
}

interface DocState {
    files: DocFile[];
    addFile: (file: DocFile) => void;
    updateFileStatus: (path: string, status: DocFile['status'], content?: string) => void;
    deleteFile: (path: string) => void;
}

export const useDocStore = create<DocState>((set) => ({
    files: [],
    addFile: (file) => set((state) => ({ files: [...state.files, file] })),
    updateFileStatus: (path, status, content) => set((state) => ({
        files: state.files.map((f) =>
            f.path === path ? { ...f, status, content: content || f.content } : f
        ),
    })),
    deleteFile: (path) => set((state) => ({
        files: state.files.filter((f) => f.path !== path)
    })),
}));
