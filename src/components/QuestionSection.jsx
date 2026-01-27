import { useState } from 'react';
import { ArrowUp, User, Cpu, Settings } from 'lucide-react';

export function QuestionSection({ onSendMessage, isLoading, mode, setMode, hasDocuments, lastQuestion }) {
    const [query, setQuery] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [topK, setTopK] = useState(4);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim() && !isLoading && hasDocuments) {
            onSendMessage(query, mode, topK);
            setQuery('');
        }
    };

    const modes = [
        { 
            id: 'human', 
            label: 'Human', 
            icon: User,
            description: 'Simple, conversational responses'
        },
        { 
            id: 'technical', 
            label: 'Technical', 
            icon: Cpu,
            description: 'Detailed technical explanations'
        },
    ];

    const suggestedQuestions = [
        "What are the main topics covered in this document?",
        "Can you summarize the key findings?",
        "What are the most important concepts explained?",
        "How does this relate to current industry practices?",
        "What are the practical applications mentioned?"
    ];

    return (
        <div className="w-full max-w-2xl mx-auto mt-12 pb-10">
            <div className="flex justify-center space-x-4 mb-6">
                {modes.map((m) => {
                    const Icon = m.icon;
                    const isActive = mode === m.id;
                    return (
                        <button
                            key={m.id}
                            onClick={() => setMode(m.id)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold transition-all group relative ${
                                isActive
                                    ? 'bg-slate-800 text-white shadow-lg scale-105'
                                    : 'bg-white/40 text-slate-400 hover:bg-white/60'
                            }`}
                            title={m.description}
                        >
                            <Icon className="w-3 h-3" />
                            <span>{m.label}</span>
                            {isActive && lastQuestion && (
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            )}
                        </button>
                    );
                })}
            </div>

            {isLoading && lastQuestion && (
                <div className="flex items-center justify-center space-x-2 mb-4 text-xs text-slate-500">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                    <span>Switching to {mode} mode...</span>
                </div>
            )}

            <div className="flex justify-center mb-4">
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center space-x-2 px-3 py-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <Settings className="w-3 h-3" />
                    <span>Advanced Settings</span>
                </button>
            </div>

            {showAdvanced && (
                <div className="mb-6 p-4 bg-white/30 rounded-2xl border border-white/40">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-600">
                            Retrieval Depth (top-k):
                        </label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={topK}
                                onChange={(e) => setTopK(parseInt(e.target.value))}
                                className="w-20"
                            />
                            <span className="text-sm font-bold text-slate-700 w-6">{topK}</span>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                        Higher values retrieve more context but may include less relevant information.
                    </p>
                </div>
            )}

            <form 
                onSubmit={handleSubmit} 
                className="soft-glass rounded-[30px] p-2 flex items-center shadow-2xl group transition-all duration-500 focus-within:bg-white/60"
            >
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={hasDocuments ? "Ask anything about the document..." : "Upload a document first..."}
                    disabled={isLoading || !hasDocuments}
                    className="flex-1 bg-transparent px-8 text-base text-slate-700 placeholder:text-slate-300 focus:outline-none font-medium disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={!query.trim() || isLoading || !hasDocuments}
                    className="bg-slate-800 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <ArrowUp className="w-6 h-6 transition-transform hover:-translate-y-1" strokeWidth={3} />
                    )}
                </button>
            </form>

            {hasDocuments && !isLoading && (
                <div className="mt-6">
                    <p className="text-xs font-bold text-slate-400 text-center mb-3 uppercase tracking-wider">
                        Suggested Questions
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {suggestedQuestions.slice(0, 3).map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => setQuery(suggestion)}
                                className="px-3 py-1 bg-white/30 hover:bg-white/50 text-xs text-slate-600 rounded-full border border-white/40 hover:border-slate-200 transition-all hover:scale-105"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex items-center justify-center space-x-4 mt-8">
                <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${hasDocuments ? 'bg-green-400' : 'bg-slate-300'}`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {hasDocuments ? 'Ready' : 'No Documents'}
                    </span>
                </div>
            </div>
        </div>
    );
}

