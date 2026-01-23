import { useCallback, useState } from 'react';
import { FileCode2 } from 'lucide-react';

/**
 * Cyber-Luxe V3 Upload: Modular ingest protocol with laser-scan feedback.
 */
export function UploadSection({ onFileSelect, selectedFile }) {
    const [isDragging, setIsDragging] = useState(false);

    const handleFile = useCallback((file) => {
        if (file?.type === 'application/pdf') onFileSelect(file);
        else alert('Payload rejected: Requires PDF format.');
    }, [onFileSelect]);

    return (
        <div className="glass-panel rounded-[2.5rem] p-10 flex flex-col items-center text-center glow-hover relative overflow-hidden group grow min-h-[300px]">
            <div className="upload-scan" />

            <div className="mb-8 w-24 h-24 bg-white/[0.03] rounded-3xl flex items-center justify-center border border-white/5 group-hover:bg-violet-600/10 group-hover:border-violet-500/30 transition-all duration-500 shadow-xl">
                <FileCode2 className="w-12 h-12 text-gray-500 group-hover:text-violet-400 group-hover:scale-110 transition-all duration-500" strokeWidth={1} />
            </div>

            <div className="space-y-2">
                <h3 className="text-xl font-bold space-font tracking-tight">Protocol: Data Ingest</h3>
                <p className="text-xs text-gray-500 max-w-[200px] leading-relaxed mx-auto">
                    {selectedFile ? `Encrypted payload: ${selectedFile.name}` : 'Awaiting encrypted PDF stream for multi-vector indexing.'}
                </p>
            </div>

            <label className="w-full mt-10">
                <input
                    type="file" className="hidden" accept=".pdf"
                    onChange={(e) => handleFile(e.target.files[0])}
                />
                <div className="py-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] cursor-pointer hover:bg-violet-600 hover:text-white transition-all shadow-lg active:scale-95">
                    {selectedFile ? 'Swap Payload' : 'Upload Payload'}
                </div>
            </label>
        </div>
    );
}
