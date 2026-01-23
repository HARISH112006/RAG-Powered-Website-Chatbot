import { useState } from 'react';
import { Zap } from 'lucide-react';

/**
 * Cyber-Luxe V3 Input: Terminal-style query command with reactive glowing orbit.
 */
export function QuestionSection({ onSendMessage, isLoading }) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim() && !isLoading) {
            onSendMessage(query);
            setQuery('');
        }
    };

    return (
        <div className="mt-8 relative shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-3xl blur-xl opacity-10" />

            <form onSubmit={handleSubmit} className="relative bg-black/60 border border-white/10 rounded-3xl p-3 flex items-center gap-3 active:border-violet-500/30 transition-colors">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Execute query command..."
                    disabled={isLoading}
                    className="bg-transparent flex-1 px-5 text-sm text-white focus:outline-none placeholder:text-gray-700 font-medium"
                />
                <button
                    disabled={!query.trim() || isLoading}
                    className="bg-violet-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl hover:bg-violet-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    <Zap className={`w-6 h-6 transition-transform ${isLoading ? 'animate-spin' : 'group-hover:rotate-12'}`} strokeWidth={2} />
                </button>
            </form>

            <div className="flex justify-between items-center px-6 mt-4 opacity-30">
                <span className="text-[8px] font-black uppercase tracking-[0.3em]">Encrypted Tunnel: Secured</span>
                <span className="text-[8px] font-black uppercase tracking-[0.3em]">Neural core: v3.0</span>
            </div>
        </div>
    );
}
