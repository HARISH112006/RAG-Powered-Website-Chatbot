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
        <div className="w-full max-w-2xl mx-auto mb-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Ask a Question</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your question here..."
                        disabled={isLoading}
                        className="w-full min-h-[120px] p-4 text-base bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all placeholder:text-gray-400"
                    />

                    <div className="flex flex-col gap-3">
                        <button
                            type="submit"
                            disabled={!question.trim() || isLoading}
                            className={clsx(
                                "w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold text-white transition-all shadow-sm",
                                question.trim() && !isLoading
                                    ? "bg-blue-600 hover:bg-blue-700 active:scale-[0.99]"
                                    : "bg-blue-400 cursor-not-allowed opacity-80"
                            )}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Generating Answer...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Submit Question
                                </>
                            )}
                        </button>
                        <p className="text-center text-sm text-gray-500">
                            Please upload a PDF first
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
