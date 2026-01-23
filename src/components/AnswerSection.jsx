import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { clsx } from 'clsx';

/**
 * Component responsible for displaying the answer.
 * @param {Object} props
 * @param {string|null} props.answer - The answer text to display
 * @param {boolean} props.isLoading - Loading state
 */
export function AnswerSection({ answer, isLoading }) {
    const [showFull, setShowFull] = useState(false);

    return (
        <div className="w-full space-y-6 mb-8">
            {!answer && !isLoading ? (
                <div className="glass p-10 rounded-[2rem] shadow-premium text-center border-2 border-dashed border-slate-100 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                        <FileText className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-slate-400 text-sm font-medium max-w-[200px]">
                        The analysis result will appear here as a conversation
                    </p>
                </div>
            ) : (
                <div className="space-y-6 animate-in fade-in duration-700">
                    <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                            <span className="text-[10px] font-bold text-slate-400">AI</span>
                        </div>
                        <div className="glass p-5 rounded-3xl rounded-tl-none shadow-premium max-w-[85%] border-l-4 border-l-indigo-500">
                            {isLoading ? (
                                <div className="flex items-center space-x-2 py-2">
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                </div>
                            ) : (
                                <div className="text-sm leading-relaxed text-slate-700">
                                    {answer}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
