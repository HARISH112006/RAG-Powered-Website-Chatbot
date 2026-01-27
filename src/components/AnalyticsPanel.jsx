import { useState, useEffect } from 'react';
import { BarChart3, MessageSquare, Upload, Clock, Trash2, Download } from 'lucide-react';

export function AnalyticsPanel({ isVisible, onClose, getAnalytics, clearLogs }) {
    const [analytics, setAnalytics] = useState(null);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        if (isVisible) {
            refreshAnalytics();
        }
    }, [isVisible]);

    const refreshAnalytics = () => {
        const data = getAnalytics();
        setAnalytics(data);
        
        const allLogs = JSON.parse(localStorage.getItem('ragChatLogs') || '[]');
        setLogs(allLogs.slice(-20));
    };

    const exportLogs = () => {
        const allLogs = JSON.parse(localStorage.getItem('ragChatLogs') || '[]');
        const dataStr = JSON.stringify(allLogs, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `rag-chat-logs-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleClearLogs = () => {
        if (window.confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
            clearLogs();
            refreshAnalytics();
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <BarChart3 className="w-6 h-6 text-purple-500" />
                        <h2 className="text-2xl font-bold text-slate-800">Usage Analytics</h2>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={exportLogs}
                            className="flex items-center space-x-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full text-sm font-medium transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            <span>Export</span>
                        </button>
                        <button
                            onClick={handleClearLogs}
                            className="flex items-center space-x-2 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-full text-sm font-medium transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Clear</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-full text-sm font-medium transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>

                {analytics && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                                <div className="flex items-center space-x-3 mb-3">
                                    <MessageSquare className="w-8 h-8 text-blue-600" />
                                    <div>
                                        <div className="text-2xl font-bold text-blue-800">{analytics.totalQuestions}</div>
                                        <div className="text-sm text-blue-600">Questions Asked</div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
                                <div className="flex items-center space-x-3 mb-3">
                                    <Upload className="w-8 h-8 text-green-600" />
                                    <div>
                                        <div className="text-2xl font-bold text-green-800">{analytics.totalUploads}</div>
                                        <div className="text-sm text-green-600">Documents Uploaded</div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
                                <div className="flex items-center space-x-3 mb-3">
                                    <Clock className="w-8 h-8 text-purple-600" />
                                    <div>
                                        <div className="text-2xl font-bold text-purple-800">{logs.length}</div>
                                        <div className="text-sm text-purple-600">Total Interactions</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {analytics.recentQuestions && analytics.recentQuestions.length > 0 && (
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Questions</h3>
                                <div className="space-y-2">
                                    {analytics.recentQuestions.slice(0, 5).map((question, index) => (
                                        <div key={index} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                            <p className="text-sm text-slate-700">"{question}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h3>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {logs.length === 0 ? (
                                    <p className="text-slate-500 text-center py-8">No activity recorded yet</p>
                                ) : (
                                    logs.reverse().map((log, index) => (
                                        <div key={index} className={`p-4 rounded-xl border ${
                                            log.type === 'question' 
                                                ? 'bg-blue-50 border-blue-200' 
                                                : 'bg-green-50 border-green-200'
                                        }`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-2">
                                                    {log.type === 'question' ? (
                                                        <MessageSquare className="w-4 h-4 text-blue-600" />
                                                    ) : (
                                                        <Upload className="w-4 h-4 text-green-600" />
                                                    )}
                                                    <span className={`text-sm font-medium ${
                                                        log.type === 'question' ? 'text-blue-800' : 'text-green-800'
                                                    }`}>
                                                        {log.type === 'question' ? 'Question' : 'Upload'}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-slate-500">
                                                    {new Date(log.timestamp).toLocaleString()}
                                                </span>
                                            </div>
                                            
                                            {log.type === 'question' && (
                                                <div className="space-y-1">
                                                    <p className="text-sm text-slate-700">
                                                        <strong>Q:</strong> {log.data.question}
                                                    </p>
                                                    {log.data.mode && (
                                                        <p className="text-xs text-slate-500">
                                                            Mode: {log.data.mode} • 
                                                            Sources: {log.data.sourcesCount || 0} • 
                                                            Confidence: {log.data.confidence ? Math.round(log.data.confidence * 100) + '%' : 'N/A'}
                                                        </p>
                                                    )}
                                                    {log.data.error && (
                                                        <p className="text-xs text-red-600">Error: {log.data.error}</p>
                                                    )}
                                                </div>
                                            )}
                                            
                                            {log.type === 'upload' && (
                                                <div className="space-y-1">
                                                    <p className="text-sm text-slate-700">
                                                        {log.data.fileName && <span><strong>File:</strong> {log.data.fileName}</span>}
                                                        {log.data.url && <span><strong>URL:</strong> {log.data.url}</span>}
                                                        {log.data.textLength && <span><strong>Text:</strong> {log.data.textLength} characters</span>}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        Status: {log.data.status}
                                                        {log.data.fileSize && ` • Size: ${Math.round(log.data.fileSize / 1024)}KB`}
                                                    </p>
                                                    {log.data.error && (
                                                        <p className="text-xs text-red-600">Error: {log.data.error}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-800 mb-3">Session Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-slate-600">Current Session:</span>
                                    <span className="ml-2 font-mono text-slate-800">
                                        {analytics.sessionStats?.questionsAsked || 0} questions
                                    </span>
                                </div>
                                <div>
                                    <span className="text-slate-600">Documents in Session:</span>
                                    <span className="ml-2 font-mono text-slate-800">
                                        {analytics.sessionStats?.documentsUploaded || 0} uploads
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}