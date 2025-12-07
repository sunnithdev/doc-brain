import React from 'react';
import Sidebar from './Sidebar';

import DocumentsPanel from './DocumentsPanel';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content flex flex-col h-screen bg-base-100">
                <div className="navbar bg-base-100 lg:hidden border-b border-base-300">
                    <div className="flex-none">
                        <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </label>
                    </div>
                    <div className="flex-1 px-2 mx-2 font-bold text-lg">DocBrain</div>
                    <div className="flex-none">
                        <label htmlFor="docs-drawer" className="btn btn-square btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                        </label>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    <main className="flex-1 relative min-w-0">
                        {children}
                    </main>

                    <div className="hidden lg:block">
                        <DocumentsPanel />
                    </div>
                </div>
            </div>

            <Sidebar />

            <div className="drawer drawer-end lg:hidden">
                <input id="docs-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-side z-30">
                    <label htmlFor="docs-drawer" className="drawer-overlay"></label>
                    <DocumentsPanel />
                </div>
            </div>
        </div>
    );
};

export default Layout;
