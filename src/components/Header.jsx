import { Radio } from 'lucide-react';

/**
 * Glassmorphic Flow Header: Features a soft branding experience with high-end typography.
 */
export function Header() {
    return (
        <header className="flex flex-col items-center justify-center text-center space-y-4 mb-12">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-100 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Radio className="w-8 h-8 text-rose-500 relative z-10" strokeWidth={2.5} />
            </div>
            <div className="space-y-1">
                <h1 className="text-4xl font-black tracking-tight text-slate-800">
                    RAG<span className="gradient-text italic px-1">Flow</span>
                </h1>
                <div className="flex items-center justify-center gap-2">
                    <span className="pulse-online" />
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-slate-400">Processing Core Active</span>
                </div>
            </div>
        </header>
    );
}
