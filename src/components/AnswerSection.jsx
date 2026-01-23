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
        <div className="w-full max-w-2xl mx-auto mb-16">
            <div className="glass p-8 rounded-[2rem] shadow-premium min-h-[200px] flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                    <FileText className="w-12 h-12 text-indigo-500/10" />
                </div>

                <h2 className="text-xl font-bold text-slate-800 mb-8 outfit">Final <span className="gradient-text">Answer</span></h2>

                {!answer && !isLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-100 rounded-2xl bg-white/30">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                            <FileText className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-slate-400 text-sm font-medium max-w-[200px]">
                            Upload your documents to see the analysis output here
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {isLoading ? (
                            <div className="space-y-4 py-4">
                                <div className="h-4 bg-slate-100/50 rounded-full w-full animate-pulse"></div>
                                <div className="h-4 bg-slate-100/50 rounded-full w-11/12 animate-pulse"></div>
                                <div className="h-4 bg-slate-100/50 rounded-full w-4/5 animate-pulse"></div>
                                <div className="h-4 bg-slate-100/50 rounded-full w-[95%] animate-pulse"></div>
                            </div>
                        ) : (
                            <div className="group relative">
                                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-indigo-500 rounded-full opacity-20 group-hover:opacity-100 transition-opacity"></div>
                                <div className={clsx(
                                    "text-slate-700 leading-relaxed text-base font-medium",
                                    !showFull && answer && answer.length > 500 && "line-clamp-[12]"
                                )}>
                                    {answer}
                                </div>
                                {answer && answer.length > 500 && (
                                    <button
                                        onClick={() => setShowFull(!showFull)}
                                        className="flex items-center gap-2 mt-6 text-xs font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors"
                                    >
                                        {showFull ? (
                                            <>Collapse <ChevronUp className="w-4 h-4" /></>
                                        ) : (
                                            <>Read Full Analysis <ChevronDown className="w-4 h-4" /></>
                                        )}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
