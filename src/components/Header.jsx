import { Bot } from 'lucide-react';

/**
 * Header component displaying the branding.
 */
export function Header() {
    return (
        <header className="flex flex-col items-center text-center space-y-4 mb-10">
            <div className="flex items-center space-x-3">
                <div className="w-12 h-12 gradient-bg rounded-2xl shadow-premium flex items-center justify-center transform hover:rotate-3 transition-transform duration-300">
                    <Bot className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 outfit">RAG <span className="gradient-text">Chatbot</span></h1>
                    <div className="flex items-center space-x-2 bg-white/50 border border-slate-100 px-2 py-0.5 rounded-full mt-1">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-soft"></span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">AI Assistant Online</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
