import { Stars, BookOpen, BarChart2, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export function AnswerSection({ answer, isLoading }) {
    if (!answer && !isLoading) return null;

    const data = typeof answer === 'string' ? { answer } : answer;
    const isInterview = typeof data?.answer === 'object';
    const hasError = data?.error;

    return (
        <div className="w-full space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-white/60">
                    {hasError ? (
                        <AlertTriangle className="w-6 h-6 text-red-400" strokeWidth={2} />
                    ) : (
                        <Stars className="w-6 h-6 text-purple-400" strokeWidth={2} />
                    )}
                </div>

                <div className="soft-glass rounded-[40px] p-10 max-w-3xl w-full leading-relaxed text-slate-600 text-lg font-medium shadow-[0_30px_60px_-15px_rgba(100,116,139,0.1)] border-white/80">
                    {isLoading ? (
                        <div className="flex flex-col items-center space-y-4 py-8">
                            <div className="flex justify-center items-center space-x-2">
                                <div className="w-2 h-2 bg-rose-300 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                                <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                            </div>
                            <p className="text-sm text-slate-400">Processing your question...</p>
                        </div>
                    ) : (
                        <div className="text-left space-y-6">
                            {hasError && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <AlertTriangle className="w-5 h-5 text-red-500" />
                                        <span className="font-bold text-red-800">Error</span>
                                    </div>
                                    <p className="text-red-700">{data.answer}</p>
                                </div>
                            )}

                            {!hasError && isInterview && (
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <h4 className="text-xl font-bold text-slate-800">Interview Response</h4>
                                    </div>
                                    
                                    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border border-blue-100">
                                        <h5 className="text-lg font-bold text-slate-800 mb-3">Definition</h5>
                                        <p className="text-slate-700">{data.answer.definition}</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-white/50 rounded-2xl border border-white">
                                            <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Why Used</span>
                                            <p className="text-sm mt-2 text-slate-700">{data.answer.why_used}</p>
                                        </div>
                                        <div className="p-4 bg-white/50 rounded-2xl border border-white">
                                            <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Architecture</span>
                                            <p className="text-sm mt-2 text-slate-700">{data.answer.architecture}</p>
                                        </div>
                                    </div>
                                    
                                    {data.answer.example && (
                                        <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                                            <span className="text-xs uppercase tracking-widest text-green-600 font-bold">Example</span>
                                            <p className="text-sm mt-2 text-green-800">{data.answer.example}</p>
                                        </div>
                                    )}
                                    
                                    <div className="p-6 bg-slate-800 text-slate-100 rounded-3xl">
                                        <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Perfect Interview Answer</span>
                                        <p className="text-md mt-3 italic leading-relaxed">"{data.answer.interview_answer}"</p>
                                    </div>
                                </div>
                            )}

                            {!hasError && !isInterview && (
                                <div className="space-y-4">
                                    <p className="text-xl leading-relaxed text-slate-700">{data?.answer}</p>
                                </div>
                            )}

                            {!hasError && data?.processing_time_ms && (
                                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                                    <div className="flex items-center space-x-2">
                                        <Clock className="w-3 h-3" />
                                        <span>Processed in {data.processing_time_ms}ms</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span>Mode: {data.mode}</span>
                                        {data.session_id && <span>• Session: {data.session_id.slice(-6)}</span>}
                                    </div>
                                </div>
                            )}

                            {!hasError && data?.sources && data.sources.length > 0 && (
                                <div className="pt-6 border-t border-slate-200/50 mt-6 flex flex-col space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2 text-slate-400">
                                            <BarChart2 className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Confidence Score</span>
                                        </div>
                                        <span className="text-sm font-black text-rose-400">
                                            {Math.round((data.confidence_score || 0) * 100)}%
                                        </span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-rose-300 to-purple-400 transition-all duration-1000"
                                            style={{ width: `${(data.confidence_score || 0) * 100}%` }}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2 text-slate-400 mb-2">
                                            <BookOpen className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-wider">
                                                Sources ({data.sources.length})
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            {data.sources.map((source, i) => (
                                                <div 
                                                    key={i} 
                                                    className="p-3 bg-white/50 border border-slate-100 rounded-xl hover:border-purple-200 transition-colors group"
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-xs font-bold text-slate-600">
                                                            {source.document.split('/').pop()}
                                                        </span>
                                                        {source.relevance_score && (
                                                            <span className="text-xs text-slate-400">
                                                                {Math.round(source.relevance_score * 100)}% match
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-600 transition-colors">
                                                        {source.chunk}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!hasError && (!data?.sources || data.sources.length === 0) && (
                                <div className="pt-4 border-t border-slate-200/50">
                                    <div className="flex items-center space-x-2 text-amber-500">
                                        <AlertTriangle className="w-4 h-4" />
                                        <span className="text-xs font-bold">No relevant sources found</span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">
                                        The response may not be based on your uploaded documents.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

