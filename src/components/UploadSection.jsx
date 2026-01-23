import { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

/**
 * Component for handling file uploads via drag-and-drop or click.
 * @param {Object} props
 * @param {function} props.onFileSelect - Callback when a file is selected
 * @param {File} props.selectedFile - The currently selected file
 */
export function UploadSection({ onFileSelect, selectedFile }) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            // Validate file type
            if (file.type === 'application/pdf') {
                onFileSelect(file);
            } else {
                alert('Please upload a PDF file.');
            }
        }
    }, [onFileSelect]);

    /**
     * Handles standard file input change event.
     */
    const handleFileInputChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.type === 'application/pdf') {
                onFileSelect(file);
            } else {
                alert('Please upload a PDF file.');
            }
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto mb-8">
            {!selectedFile ? (
                <label
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={twMerge(
                        "glass p-8 rounded-[2rem] shadow-premium text-center space-y-4 group cursor-pointer border border-transparent hover:border-indigo-200 transition-all duration-300 block",
                        isDragging && "scale-[0.98] border-indigo-300 bg-indigo-50/30"
                    )}
                >
                    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Upload className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-lg font-semibold outfit text-slate-800">Drop your document here</p>
                        <p className="text-xs text-slate-500">Support PDF up to 10MB</p>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        accept=".pdf"
                        onChange={handleFileInputChange}
                    />
                </label>
            ) : (
                <div className="glass p-8 rounded-[2rem] shadow-premium flex items-center justify-between group animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                            <Upload className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold text-slate-800 line-clamp-1 outfit">{selectedFile.name}</p>
                            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Ready for analysis</p>
                        </div>
                    </div>
                    <button
                        onClick={() => onFileSelect(null)}
                        className="text-xs font-bold text-red-400 hover:text-red-500 uppercase tracking-widest"
                    >
                        Change
                    </button>
                </div>
            )}
        </div>
    );
}
