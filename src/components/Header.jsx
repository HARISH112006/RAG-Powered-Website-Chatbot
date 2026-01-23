import { Bot } from 'lucide-react';

/**
 * Header component displaying the branding.
 */
export function Header() {
    return (
        <header className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">RAG Chatbot</h1>
                <p className="text-sm text-gray-500 font-medium">AI-Powered Document Assistant</p>
            </div>
        </header>
    );
}
