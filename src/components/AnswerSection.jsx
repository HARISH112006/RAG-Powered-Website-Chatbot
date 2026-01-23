import { Terminal } from 'lucide-react';

/**
 * Cyber-Luxe V3 Answer: Cinematic conversation stream with technical taxonomy.
 */
export function AnswerSection({ answer, isLoading }) {
    if (!answer && !isLoading) return null;

    return (
        <div className="flex-1 overflow-y-auto space-y-12 pr-4 custom-scrollbar">
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-left-4 duration-700">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-violet-400">System_C01_Response</span>
                </div>

                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] max-w-[90%] leading-relaxed text-gray-300 text-sm shadow-2xl">
                    {isLoading ? (
                        <div className="flex gap-2">
                            <span className="w-1 h-1 bg-violet-500/50 rounded-full animate-bounce" />
                            <span className="w-1 h-1 bg-violet-500/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <span className="w-1 h-1 bg-violet-500/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                    ) : (
                        <p>{answer}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
