import { useState, useEffect } from 'react';
import { 
    Stars, BookOpen, BarChart2, Clock, AlertTriangle, 
    Languages, Copy 
} from 'lucide-react';

export function AnswerFormatter({ answer, isLoading, onToggleFullAnswer }) {
    const [isFullAnswer, setIsFullAnswer] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [translatedAnswer, setTranslatedAnswer] = useState(null);
    const [isTranslating, setIsTranslating] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (answer && !isLoading) {
            setTranslatedAnswer(null);
            setSelectedLanguage('en');
        }
    }, [answer, isLoading]);

    if (!answer && !isLoading) return null;

    const data = typeof answer === 'string' ? { answer } : answer;
    const hasError = data?.error;

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Español' },
        { code: 'fr', name: 'Français' },
        { code: 'de', name: 'Deutsch' },
        { code: 'it', name: 'Italiano' },
        { code: 'pt', name: 'Português' },
        { code: 'ru', name: 'Русский' },
        { code: 'ja', name: '日本語' },
        { code: 'ko', name: '한국어' },
        { code: 'zh', name: '中文' }
    ];

    const handleTranslate = async (languageCode) => {
        if (languageCode === 'en') {
            setTranslatedAnswer(null);
            setSelectedLanguage('en');
            return;
        }

        setIsTranslating(true);
        setSelectedLanguage(languageCode);

        try {
            if (window.lastQuestionData) {
                console.log('🌐 Translating to:', languageCode, 'with data:', window.lastQuestionData);
                
                const response = await fetch(`${window.apiBaseUrl || 'http://localhost:8000'}/query`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...window.lastQuestionData,
                        language: languageCode
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('✅ Translation successful:', data);
                    setTranslatedAnswer(data.answer);
                } else {
                    const errorData = await response.json().catch(() => ({ detail: 'Translation failed' }));
                    throw new Error(errorData.detail || `Translation failed (${response.status})`);
                }
            } else {
                throw new Error('No previous question to translate. Please ask a question first.');
            }
        } catch (error) {
            console.error('❌ Translation failed:', error);
            alert(`Translation failed: ${error.message}`);
            setSelectedLanguage('en');
        } finally {
            setIsTranslating(false);
        }
    };

    const handleCopy = async () => {
        try {
            const currentAnswer = translatedAnswer || data?.answer;
            await navigator.clipboard.writeText(currentAnswer);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Copy failed:', error);
        }
    };

    const getDisplayAnswer = () => {
        const currentAnswer = translatedAnswer || data?.answer;
        
        return currentAnswer;
    };

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
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <select
                                        value={selectedLanguage}
                                        onChange={(e) => handleTranslate(e.target.value)}
                                        disabled={isTranslating}
                                        className="text-xs bg-white/50 border border-white/60 rounded-full px-3 py-1 focus:outline-none focus:border-purple-200"
                                    >
                                        {languages.map(lang => (
                                            <option key={lang.code} value={lang.code}>
                                                {lang.name}
                                            </option>
                                        ))}
                                    </select>
                                    
                                    {isTranslating && (
                                        <div className="flex items-center space-x-1 text-xs text-slate-400">
                                            <Languages className="w-3 h-3 animate-pulse" />
                                            <span>Translating...</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={handleCopy}
                                        className="p-1 hover:bg-white/50 rounded-full transition-colors"
                                        title="Copy answer"
                                    >
                                        <Copy className={`w-4 h-4 ${copied ? 'text-green-500' : 'text-slate-400'}`} />
                                    </button>
                                </div>
                            </div>

                            {hasError && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <AlertTriangle className="w-5 h-5 text-red-500" />
                                        <span className="font-bold text-red-800">Error</span>
                                    </div>
                                    <p className="text-red-700">{data.answer}</p>
                                </div>
                            )}

                            {!hasError && (
                                <div className="space-y-6">
                                    <div className="text-lg leading-relaxed text-slate-700">
                                        {(() => {
                                            const answer = getDisplayAnswer();
                                            if (typeof answer !== 'string') return answer;
                                            
                                            const cleanAnswer = answer.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
                                            const sections = cleanAnswer.split(/\n\s*\n/);
                                            
                                            return sections.map((section, index) => {
                                                const trimmedSection = section.trim();
                                                if (!trimmedSection) return null;
                                                
                                                if (trimmedSection.match(/^[🤖⚙️].+\*\*.*\*\*/)) {
                                                    return (
                                                        <div key={index} className="mb-8">
                                                            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
                                                                {trimmedSection.replace(/\*\*/g, '')}
                                                            </h2>
                                                        </div>
                                                    );
                                                }
                                                
                                                if (trimmedSection.match(/^\*\*[📖📄💡🔍🏗️🔧✅🎓🚀].+\*\*/)) {
                                                    const lines = trimmedSection.split('\n');
                                                    const header = lines[0].replace(/\*\*/g, '');
                                                    const content = lines.slice(1).join('\n').trim();
                                                    
                                                    return (
                                                        <div key={index} className="mb-6 p-6 bg-gradient-to-r from-white/50 to-white/30 rounded-3xl border border-white/60 backdrop-blur-sm shadow-lg">
                                                            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                                                                {header}
                                                            </h3>
                                                            {content && (
                                                                <div className="space-y-3">
                                                                    {content.split('\n').map((line, lineIndex) => {
                                                                        const trimmedLine = line.trim();
                                                                        if (!trimmedLine) return null;
                                                                        
                                                                        if (trimmedLine.startsWith('• ')) {
                                                                            return (
                                                                                <div key={lineIndex} className="flex items-start space-x-3 mb-2">
                                                                                    <span className="text-purple-500 text-lg mt-1 font-bold">•</span>
                                                                                    <span className="text-slate-700 leading-relaxed">{trimmedLine.substring(2)}</span>
                                                                                </div>
                                                                            );
                                                                        } else if (trimmedLine.match(/^\d+\./)) {
                                                                            return (
                                                                                <div key={lineIndex} className="flex items-start space-x-3 mb-2">
                                                                                    <span className="text-blue-500 text-sm mt-1 font-bold">{trimmedLine.match(/^\d+\./)[0]}</span>
                                                                                    <span className="text-slate-700 leading-relaxed">{trimmedLine.replace(/^\d+\.\s*/, '')}</span>
                                                                                </div>
                                                                            );
                                                                        } else {
                                                                            return (
                                                                                <p key={lineIndex} className="text-slate-700 leading-relaxed mb-2">
                                                                                    {trimmedLine.replace(/\*\*/g, '')}
                                                                                </p>
                                                                            );
                                                                        }
                                                                    })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                }
                                                
                                                if (trimmedSection.includes('• ') || trimmedSection.match(/^\d+\./m)) {
                                                    const lines = trimmedSection.split('\n');
                                                    return (
                                                        <div key={index} className="mb-6 p-4 bg-white/20 rounded-2xl border border-white/40">
                                                            {lines.map((line, lineIndex) => {
                                                                const trimmedLine = line.trim();
                                                                if (!trimmedLine) return null;
                                                                
                                                                if (trimmedLine.startsWith('• ')) {
                                                                    return (
                                                                        <div key={lineIndex} className="flex items-start space-x-3 mb-3">
                                                                            <span className="text-purple-500 text-lg mt-1 font-bold">•</span>
                                                                            <span className="text-slate-700 leading-relaxed">{trimmedLine.substring(2)}</span>
                                                                        </div>
                                                                    );
                                                                } else if (trimmedLine.match(/^\d+\./)) {
                                                                    return (
                                                                        <div key={lineIndex} className="flex items-start space-x-3 mb-3">
                                                                            <span className="text-blue-500 text-sm mt-1 font-bold">{trimmedLine.match(/^\d+\./)[0]}</span>
                                                                            <span className="text-slate-700 leading-relaxed">{trimmedLine.replace(/^\d+\.\s*/, '')}</span>
                                                                        </div>
                                                                    );
                                                                } else if (trimmedLine.match(/^\*\*.+\*\*:/)) {
                                                                    return (
                                                                        <h4 key={lineIndex} className="text-lg font-bold text-slate-800 mb-2 mt-4">
                                                                            {trimmedLine.replace(/\*\*/g, '')}
                                                                        </h4>
                                                                    );
                                                                } else if (trimmedLine) {
                                                                    return (
                                                                        <p key={lineIndex} className="text-slate-700 leading-relaxed mb-2">
                                                                            {trimmedLine}
                                                                        </p>
                                                                    );
                                                                }
                                                                return null;
                                                            })}
                                                        </div>
                                                    );
                                                }
                                                
                                                if (trimmedSection) {
                                                    return (
                                                        <div key={index} className="mb-4">
                                                            <p className="text-slate-700 leading-relaxed text-lg">
                                                                {trimmedSection.replace(/\*\*/g, '')}
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                
                                                return null;
                                            }).filter(Boolean);
                                        })()}
                                    </div>
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
                                        {selectedLanguage !== 'en' && <span>• Lang: {selectedLanguage}</span>}
                                    </div>
                                </div>
                            )}

                            {!hasError && (data?.context || (data?.sources && data.sources.length > 0)) && (
                                <div className="pt-6 border-t border-slate-200/50 mt-6 flex flex-col space-y-4">
                                    {data.confidence_score !== undefined && (
                                        <>
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
                                        </>
                                    )}

                                    {data.context && (
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-2 text-slate-400 mb-2">
                                                <BookOpen className="w-4 h-4" />
                                                <span className="text-xs font-bold uppercase tracking-wider">Context</span>
                                            </div>
                                            <div className="p-3 bg-white/50 border border-slate-100 rounded-xl">
                                                <p className="text-xs text-slate-600 leading-relaxed">{data.context}</p>
                                            </div>
                                        </div>
                                    )}

                                    {data.sources && data.sources.length > 0 && (
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
                                                                {source.document?.split('/').pop() || 'Document'}
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
                                    )}
                                </div>
                            )}

                            {!hasError && (!data?.sources || data.sources.length === 0) && !data?.context && (
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

                            {!hasError && data?.followup_questions && data.followup_questions.length > 0 && (
                                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                                    <div className="flex items-center space-x-2 mb-3">
                                        <span className="text-lg">🔄</span>
                                        <strong className="text-blue-800">Related Questions You Might Ask:</strong>
                                    </div>
                                    <div className="space-y-2">
                                        {data.followup_questions.map((question, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    if (window.setQuestionFromSuggestion) {
                                                        window.setQuestionFromSuggestion(question);
                                                    }
                                                }}
                                                className="w-full text-left p-3 bg-white hover:bg-blue-50 border border-blue-200 hover:border-blue-300 rounded-xl transition-all text-sm text-blue-800 hover:text-blue-900 font-medium"
                                            >
                                                <span className="flex items-start space-x-2">
                                                    <span className="text-blue-500 font-bold mt-0.5">→</span>
                                                    <span>{question}</span>
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-blue-600 mt-3 italic">
                                        💡 Click any question to explore further!
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