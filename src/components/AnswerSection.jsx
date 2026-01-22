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
        <div className="w-full max-w-2xl mx-auto mb-12">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[300px] flex flex-col">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Answer</h2>

                {!answer && !isLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <FileText className="w-10 h-10 text-gray-300" />
                        </div>
                        <p className="text-gray-500 max-w-xs mx-auto">
                            Upload a PDF and ask a question to see the answer here
                        </p>
                    </div>
                ) : (
                    <div className="animate-in fade-in duration-500">
                        {isLoading ? (
                            <div className="space-y-4 py-4">
                                <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
                                <div className="h-4 bg-gray-100 rounded w-11/12 animate-pulse"></div>
                                <div className="h-4 bg-gray-100 rounded w-4/5 animate-pulse"></div>
                                <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
                            </div>
                        ) : (
                            <>
                                <div className={clsx(
                                    "prose prose-blue max-w-none text-gray-700 leading-relaxed",
                                    !showFull && "line-clamp-6"
                                )}>
                                    {answer}
                                </div>
                                {answer && answer.length > 300 && (
                                    <button
                                        onClick={() => setShowFull(!showFull)}
                                        className="flex items-center gap-1 mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
                                    >
                                        {showFull ? (
                                            <>Show Less <ChevronUp className="w-4 h-4" /></>
                                        ) : (
                                            <>Show Full <ChevronDown className="w-4 h-4" /></>
                                        )}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
