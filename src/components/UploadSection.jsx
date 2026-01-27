import { useCallback, useState } from 'react';
import { CloudRain, Globe, Type, CheckCircle, AlertCircle, FileText, Sparkles } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

/**
 * Enhanced Upload Section with support for PDF, URL, and text input
 */
export function UploadSection({ onFileSelect, onUrlUpload, onTextUpload, selectedFile, uploadStatus }) {
    const [isDragging, setIsDragging] = useState(false);
    const [activeTab, setActiveTab] = useState('file');
    const [urlInput, setUrlInput] = useState('');
    const [textInput, setTextInput] = useState('');

    const handleFile = useCallback((file) => {
        if (file?.type === 'application/pdf') {
            onFileSelect(file);
        } else {
            alert('Please select a PDF file only.');
        }
    }, [onFileSelect]);

    const handleUrlSubmit = (e) => {
        e.preventDefault();
        if (urlInput.trim()) {
            onUrlUpload(urlInput.trim());
            setUrlInput('');
        }
    };

    const handleTextSubmit = (e) => {
        e.preventDefault();
        if (textInput.trim()) {
            onTextUpload(textInput.trim());
            setTextInput('');
        }
    };

    const tabs = [
        { id: 'file', label: 'PDF File', icon: FileText },
        { id: 'url', label: 'Website URL', icon: Globe },
        { id: 'text', label: 'Raw Text', icon: Type }
    ];

    return (
        <div className="w-full max-w-4xl mx-auto mb-10">
            <div className="flex justify-center space-x-2 mb-6">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={twMerge(
                                "flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold transition-all",
                                isActive
                                    ? "bg-slate-800 text-white shadow-lg scale-105"
                                    : "bg-white/40 text-slate-400 hover:bg-white/60"
                            )}
                        >
                            <Icon className="w-3 h-3" />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {uploadStatus && (
                <div className={twMerge(
                    "mb-6 p-4 rounded-2xl border",
                    uploadStatus.success 
                        ? "bg-green-50 border-green-200 text-green-800"
                        : "bg-red-50 border-red-200 text-red-800"
                )}>
                    <div className="flex items-center space-x-2 mb-2">
                        {uploadStatus.success ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className="font-bold">
                            {uploadStatus.success ? 'Document Processed Successfully!' : 'Upload Failed'}
                        </span>
                    </div>
                    
                    {uploadStatus.success ? (
                        <div className="space-y-2 text-sm">
                            <p><strong>Summary:</strong> {uploadStatus.summary}</p>
                            <p><strong>Chunks Created:</strong> {uploadStatus.chunks_created}</p>
                        </div>
                    ) : (
                        <p className="text-sm">{uploadStatus.error}</p>
                    )}
                </div>
            )}

            {activeTab === 'file' && (
                <label
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => { 
                        e.preventDefault(); 
                        setIsDragging(false); 
                        handleFile(e.dataTransfer.files[0]); 
                    }}
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
                            {selectedFile ? 'Document Ready' : 'Load your PDF'}
                        </h3>
                        <p className="text-sm font-medium text-slate-400 max-w-[240px] leading-relaxed mx-auto">
                            {selectedFile ? `Analyzing: ${selectedFile.name}` : 'Drop your PDF here or click to select.'}
                        </p>
                    </div>

                    <input
                        type="file" 
                        className="hidden" 
                        accept=".pdf"
                        onChange={(e) => handleFile(e.target.files[0])}
                    />

                    <div className="mt-10 px-8 py-3 bg-slate-800 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-900 hover:scale-105 transition-all shadow-xl active:scale-95">
                        {selectedFile ? 'Swap Document' : 'Select PDF'}
                    </div>
                </label>
            )}

            {activeTab === 'url' && (
                <div className="glass-card flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mb-8 shadow-sm relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent" />
                        <Globe className="w-10 h-10 text-blue-400 relative z-10" strokeWidth={1.5} />
                    </div>

                    <div className="space-y-2 mb-8">
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                            Load from Website
                        </h3>
                        <p className="text-sm font-medium text-slate-400 max-w-[300px] leading-relaxed mx-auto">
                            Enter a website URL to extract and analyze its content.
                        </p>
                    </div>

                    <form onSubmit={handleUrlSubmit} className="w-full max-w-md space-y-4">
                        <input
                            type="url"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder="https://example.com/article"
                            className="w-full px-6 py-4 bg-white/50 border border-white/60 rounded-2xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white/70 focus:border-blue-200 transition-all"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full px-8 py-3 bg-slate-800 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-900 hover:scale-105 transition-all shadow-xl active:scale-95"
                        >
                            Process URL
                        </button>
                    </form>
                </div>
            )}

            {activeTab === 'text' && (
                <div className="glass-card flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-purple-50 rounded-[2rem] flex items-center justify-center mb-8 shadow-sm relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-transparent" />
                        <Sparkles className="w-10 h-10 text-purple-400 relative z-10" strokeWidth={1.5} />
                    </div>

                    <div className="space-y-2 mb-8">
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                            Input Raw Text
                        </h3>
                        <p className="text-sm font-medium text-slate-400 max-w-[300px] leading-relaxed mx-auto">
                            Paste your text content directly for immediate analysis.
                        </p>
                    </div>

                    <form onSubmit={handleTextSubmit} className="w-full max-w-2xl space-y-4">
                        <textarea
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder="Paste your text content here..."
                            rows={8}
                            className="w-full px-6 py-4 bg-white/50 border border-white/60 rounded-2xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white/70 focus:border-purple-200 transition-all resize-none"
                            required
                            minLength={50}
                        />
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>Minimum 50 characters required</span>
                            <span>{textInput.length} characters</span>
                        </div>
                        <button
                            type="submit"
                            disabled={textInput.length < 50}
                            className="w-full px-8 py-3 bg-slate-800 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-900 hover:scale-105 transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Process Text
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
