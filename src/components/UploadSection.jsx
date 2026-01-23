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
        <div className="w-full max-w-2xl mx-auto mb-10">
            <div className="glass p-8 rounded-[2rem] shadow-premium transition-all duration-300">
                <h2 className="text-xl font-bold text-slate-800 mb-6 outfit">Step 1: <span className="gradient-text">Upload Document</span></h2>

                {!selectedFile ? (
                    <label
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={twMerge(
                            "flex flex-col items-center justify-center w-full min-h-[220px] border-2 border-dashed rounded-[1.5rem] cursor-pointer transition-all duration-300 group",
                            isDragging
                                ? "border-indigo-500 bg-indigo-50/50 scale-[0.98]"
                                : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50"
                        )}
                    >
                        <div className="flex flex-col items-center justify-center py-6 px-4">
                            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                <Upload className="w-8 h-8" />
                            </div>

                            <div className="gradient-bg text-white font-semibold py-2.5 px-8 rounded-xl mb-3 transition-all shadow-md group-hover:shadow-lg active:scale-95">
                                Select PDF
                            </div>

                            <p className="text-sm text-slate-400 font-medium">
                                or drag and drop your document here
                            </p>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            accept=".pdf"
                            onChange={handleFileInputChange}
                        />
                    </label>
                ) : (
                    <div className="flex flex-col items-center justify-center w-full min-h-[220px] border border-emerald-100 rounded-[1.5rem] bg-emerald-50/30 backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 gradient-bg opacity-20"></div>
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-emerald-100 transform group-hover:rotate-6 transition-transform">
                            <Upload className="w-8 h-8 text-emerald-500" />
                        </div>
                        <div className="text-center px-6">
                            <p className="text-lg font-bold text-slate-800 mb-1 line-clamp-1 outfit">{selectedFile.name}</p>
                            <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest mb-4">Document Ready</p>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    onFileSelect(null);
                                }}
                                className="text-sm text-red-400 hover:text-red-500 font-bold hover:underline transition-colors"
                            >
                                Remove and replace
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
