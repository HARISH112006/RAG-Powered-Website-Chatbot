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
        <div className="w-full max-w-2xl mx-auto mb-8">
            <div className="glass p-8 rounded-[2rem] shadow-premium">
                <h2 className="text-xl font-bold text-slate-800 mb-6 outfit">Step 2: <span className="gradient-text">Ask a Question</span></h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 gradient-bg rounded-2xl blur opacity-10 group-focus-within:opacity-25 transition duration-500"></div>
                        <textarea
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your question about the document..."
                            disabled={isLoading}
                            className="relative w-full min-h-[120px] p-5 text-base bg-white border border-slate-100 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400 text-slate-700 shadow-sm"
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <button
                            type="submit"
                            disabled={!question.trim() || isLoading}
                            className={clsx(
                                "w-full flex items-center justify-center gap-3 py-4 px-8 rounded-2xl font-bold text-white transition-all shadow-lg active:scale-95",
                                question.trim() && !isLoading
                                    ? "gradient-bg hover:shadow-indigo-200"
                                    : "bg-slate-200 cursor-not-allowed text-slate-400"
                            )}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="outfit tracking-wide">Analyzing Document...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    <span className="outfit tracking-wide">Get Answer</span>
                                </>
                            )}
                        </button>
                        {!question.trim() && !isLoading && (
                            <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                Powered by RAG-Assist Neural Retrieval
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
