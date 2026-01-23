import { FlaskConical } from 'lucide-react';

/**
 * Cyber-Luxe V3 Header: Features the "Neural Keeper" branding and drifting core orb.
 */
export function Header() {
    return (
        <div className="glass-panel rounded-[2.5rem] p-10 flex flex-col items-start gap-6 relative overflow-hidden shrink-0">
            <div className="neural-core" />
            <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 shadow-inner">
                <FlaskConical className="w-10 h-10 text-violet-500" strokeWidth={1.5} />
            </div>
            <div className="space-y-1">
                <h1 className="text-3xl font-black space-font tracking-tighter uppercase leading-none">
                    NEURAL<br /><span className="text-violet-500">KEEPER</span>
                </h1>
                <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-gray-400 mt-2">
                    Autonomous RAG System
                </p>
            </div>
        </div>
    );
}
