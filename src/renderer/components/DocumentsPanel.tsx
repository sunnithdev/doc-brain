import React, { useState } from 'react';
import { useDocStore, DocFile } from '../store/docStore';

function DocumentsPanel() {
    const { files, addFile, updateFileStatus, deleteFile } = useDocStore();
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const droppedFiles = Array.from(e.dataTransfer.files);

        if (droppedFiles.length === 0) {
            console.warn("No files dropped");
            return;
        }

        for (const file of droppedFiles) {
            const filePath = window.electronAPI.getFilePath(file);

            console.log("Retrieved file path:", filePath); // Debug log

            if (!filePath) {
                console.error("No file path found for object:", file);
                continue;
            }

            const newFile: DocFile = {
                name: file.name,
                path: filePath,
                size: (file.size / 1024).toFixed(1) + ' KB',
                status: 'processing'
            };

            addFile(newFile);

            try {
                const result = await window.electronAPI.parseFile(filePath);
                console.log('Parsed text length:', result.text.length);

                updateFileStatus(filePath, 'parsed', result.text);
            } catch (error) {
                console.error('Failed to parse:', error);
                updateFileStatus(filePath, 'error');
            }
        }
    };

    return (
        <div className="w-72 bg-base-100 border-l border-base-200 flex flex-col h-full">
            <div className="p-4 border-b border-base-200 flex items-center justify-between">
                <span className="font-semibold text-sm uppercase tracking-wider opacity-70">
                    Knowledge
                </span>
                <span className="badge badge-sm badge-ghost">{files.length} Files</span>
            </div>

            <div className="p-4">
                <div
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group
                        ${isDragging ? 'border-primary bg-primary/10' : 'border-base-300 hover:border-primary hover:bg-base-200/30'}
                    `}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-base-content/40 group-hover:text-primary mb-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <span className="text-sm font-medium">Upload PDF</span>
                    <span className="text-xs text-base-content/50 mt-1">Drag & drop to process</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2">
                <ul className="menu w-full p-0">
                    {files.map((file, idx) => (
                        <li key={idx} className="mb-1 group">
                            <div className="flex items-center gap-2 hover:bg-base-200 rounded-lg py-3 px-2">
                                {file.status === 'processing' ? (
                                    <span className="loading loading-spinner loading-xs text-warning"></span>
                                ) : file.status === 'error' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-error">
                                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-success">
                                        <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
                                        <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                                    </svg>
                                )}

                                <div className="flex flex-col min-w-0 flex-1">
                                    <span className="text-sm font-medium truncate">{file.name}</span>
                                    <span className="text-xs opacity-50">{file.size} • {file.status}</span>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteFile(file.path);
                                    }}
                                    className="btn btn-ghost btn-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Delete file"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </li>
                    ))}

                    {files.length === 0 && (
                        <li className="text-center opacity-50 text-xs py-10">
                            No files loaded yet.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default DocumentsPanel;
