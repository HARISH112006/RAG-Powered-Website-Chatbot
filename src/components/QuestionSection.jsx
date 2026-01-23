import { useState } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * Glassmorphic Flow Input: Rounded, floating input bar with soft shadows.
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
        <div className="w-full max-w-2xl mx-auto mt-12 pb-10">
            <form onSubmit={handleSubmit} className="soft-glass rounded-[30px] p-2 flex items-center shadow-2xl group transition-all duration-500 focus-within:bg-white/60">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Tell me something..."
                    disabled={isLoading}
                    className="flex-1 bg-transparent px-8 text-base text-slate-700 placeholder:text-slate-300 focus:outline-none font-medium"
                />
                <button
                    disabled={!query.trim() || isLoading}
                    className="bg-slate-800 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed"
                >
                    <ArrowUp className={`w-6 h-6 transition-transform ${isLoading ? 'animate-pulse' : 'hover:-translate-y-1'}`} strokeWidth={3} />
                </button>
            </form>
            <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mt-8">
                Powered by Flow Neural Engine
            </p>
        </div>
    );
}
