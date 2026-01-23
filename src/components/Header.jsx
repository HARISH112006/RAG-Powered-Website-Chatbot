import { Bot } from 'lucide-react';

/**
 * Header component displaying the branding.
 */
export function Header() {
    return (
        <header className="flex flex-col items-center text-center space-y-2 mb-8">
            <div className="flex items-center space-x-2">
                <div className="w-10 h-10 gradient-bg rounded-xl shadow-lg flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold outfit tracking-tight text-slate-900">RAG <span className="gradient-text">Chatbot</span></h1>
            </div>
            <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
                <span className="w-2 h-2 bg-emerald-500 rounded-full pulse-online"></span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">AI Assistant Online</span>
            </div>
        </header>
    );
}
