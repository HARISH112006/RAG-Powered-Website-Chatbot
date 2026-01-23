import { useCallback, useState } from 'react';
import { CloudRain } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

/**
 * Glassmorphic Flow Upload: Soft, floating interaction zone for document processing.
 */
export function UploadSection({ onFileSelect, selectedFile }) {
    const [isDragging, setIsDragging] = useState(false);

    const handleFile = useCallback((file) => {
        if (file?.type === 'application/pdf') onFileSelect(file);
        else alert('Payload rejected: Requires PDF format.');
    }, [onFileSelect]);

    return (
        <div className="w-full max-w-4xl mx-auto mb-10">
            <label
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
                className={twMerge(
                    "glass-card flex flex-col items-center text-center cursor-pointer group",
                    isDragging && "bg-white/70 scale-[0.99] border-rose-200"
                )}
            >
                <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-700 shadow-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-400/10 to-transparent" />
                    <CloudRain className="w-10 h-10 text-rose-400 relative z-10" strokeWidth={1.5} />
                </div>

                <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                        {selectedFile ? 'Document Ready' : 'Load your Document'}
                    </h3>
                    <p className="text-sm font-medium text-slate-400 max-w-[240px] leading-relaxed mx-auto">
                        {selectedFile ? `Analyzing: ${selectedFile.name}` : 'Drop your PDF here to initiate the semantic flow.'}
                    </p>
                </div>

                <input
                    type="file" className="hidden" accept=".pdf"
                    onChange={(e) => handleFile(e.target.files[0])}
                />

                <div className="mt-10 px-8 py-3 bg-slate-800 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-900 hover:scale-105 transition-all shadow-xl active:scale-95">
                    {selectedFile ? 'Swap Payload' : 'Begin Ingest'}
                </div>
            </label>
        </div>
    );
}
