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
        <div className="w-full max-w-2xl mx-auto mb-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Upload PDF</h2>

                {!selectedFile ? (
                    <label
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={twMerge(
                            "flex flex-col items-center justify-center w-full min-h-[240px] border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 bg-gray-50/50",
                            isDragging
                                ? "border-indigo-500 bg-indigo-50/50"
                                : "border-slate-200 hover:border-indigo-400 hover:bg-slate-50"
                        )}
                    >
                        <div className="flex flex-col items-center justify-center py-6 px-4">
                            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                                <Upload className="w-8 h-8 text-indigo-600" />
                            </div>

                            <div className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg mb-3 transition-colors shadow-sm">
                                Upload PDF
                            </div>

                            <p className="text-sm text-gray-500">
                                or drag and drop your PDF here
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
                    <div className="flex flex-col items-center justify-center w-full min-h-[240px] border-2 border-solid border-gray-200 rounded-xl bg-gray-50">
                        <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4">
                            <Upload className="w-8 h-8 text-teal-600" />
                        </div>
                        <p className="text-lg font-medium text-gray-900 mb-2">{selectedFile.name}</p>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onFileSelect(null);
                            }}
                            className="text-sm text-red-500 hover:text-red-700 font-medium"
                        >
                            Remove File
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
