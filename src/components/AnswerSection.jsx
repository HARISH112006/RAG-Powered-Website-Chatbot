import { Stars } from 'lucide-react';

/**
 * Glassmorphic Flow Answer: Light, airy conversational stream.
 */
export function AnswerSection({ answer, isLoading }) {
    if (!answer && !isLoading) return null;

    return (
        <div className="w-full space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-white/60">
                    <Stars className="w-6 h-6 text-purple-400" strokeWidth={2} />
                </div>

                <div className="soft-glass rounded-[40px] p-10 max-w-3xl leading-relaxed text-slate-600 text-lg font-medium shadow-[0_30px_60px_-15px_rgba(100,116,139,0.1)] border-white/80">
                    {isLoading ? (
                        <div className="flex justify-center items-center space-x-2 py-4">
                            <div className="w-2 h-2 bg-rose-300 rounded-full animate-bounce [animation-duration:1s]" />
                            <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.2s]" />
                            <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.4s]" />
                        </div>
                    ) : (
                        <p className="italic">"{answer}"</p>
                    )}
                </div>
            </div>
        </div>
    );
}
