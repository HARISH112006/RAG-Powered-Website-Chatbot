import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

/**
 * Component for entering and submitting questions.
 * @param {Object} props
 * @param {function} props.onSendMessage - Callback when a message is sent
 * @param {boolean} props.isLoading - Whether an answer is currently being generated
 */
export function QuestionSection({ onSendMessage, isLoading }) {
    const [question, setQuestion] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (question.trim() && !isLoading) {
            onSendMessage(question);
            setQuestion('');
        }
    };

    /**
     * Submit on Enter key (without Shift)
     */
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute -inset-0.5 gradient-bg rounded-2xl blur opacity-10 group-focus-within:opacity-25 transition duration-1000"></div>
                <div className="relative glass rounded-2xl flex items-center px-6 py-4 space-x-4 shadow-xl">
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything about the document..."
                        disabled={isLoading}
                        rows={1}
                        className="bg-transparent flex-1 text-sm text-slate-800 placeholder-slate-400 focus:outline-none resize-none pt-1"
                    />
                    <button
                        type="submit"
                        disabled={!question.trim() || isLoading}
                        className={clsx(
                            "gradient-bg p-2 rounded-xl text-white shadow-md transition-all shrink-0",
                            question.trim() && !isLoading ? "hover:scale-105 active:scale-95" : "opacity-30 cursor-not-allowed"
                        )}
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </form>
            <footer className="text-center text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em] pt-8">
                Secured by AES-256 Encryption &bull; Powered by RAG-Assist
            </footer>
        </div>
    );
}
