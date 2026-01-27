import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { QuestionSection } from './components/QuestionSection';
import { AnswerFormatter } from './components/AnswerFormatter';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { useChat } from './hooks/useChat';

function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [mode, setMode] = useState('human');
    const [hasDocuments, setHasDocuments] = useState(false);
    const [backendHealth, setBackendHealth] = useState(null);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [isFullAnswer, setIsFullAnswer] = useState(false);
    const [lastQuestion, setLastQuestion] = useState('');
    const [lastTopK, setLastTopK] = useState(4);
    
    const { 
        answer, 
        isLoading, 
        uploadStatus, 
        askQuestion, 
        uploadFile, 
        uploadUrl, 
        uploadText, 
        clearAnswer, 
        clearUploadStatus,
        checkHealth,
        getAnalytics,
        clearLogs,
        getApiUrl
    } = useChat();

    useEffect(() => {
        if (lastQuestion && hasDocuments && !isLoading) {
            console.log(`🔄 Mode changed to ${mode}, re-asking: "${lastQuestion}"`);
            askQuestion(lastQuestion, mode, lastTopK);
        }
    }, [mode]);

    
    useEffect(() => {
        const checkBackendHealth = async () => {
            const health = await checkHealth();
            setBackendHealth(health);
        };
        
        checkBackendHealth();
        
        const interval = setInterval(checkBackendHealth, 30000);
        return () => clearInterval(interval);
    }, [checkHealth]);

    
    useEffect(() => {
        if (uploadStatus?.success) {
            setHasDocuments(true);
        }
    }, [uploadStatus]);

    
    useEffect(() => {
        console.log('🔗 Current API URL:', getApiUrl());
        
        window.setQuestionFromSuggestion = (question) => {
            if (hasDocuments) {
                console.log('🎯 Auto-asking suggested question:', question);
                handleQuestion(question, mode, lastTopK);
            }
        };
        
        return () => {
            delete window.setQuestionFromSuggestion;
        };
    }, [getApiUrl, hasDocuments, mode, lastTopK]);

    const handleFileUpload = async (file) => {
        if (!file) return;
        
        setSelectedFile(file);
        clearAnswer();
        clearUploadStatus();
        
        try {
            await uploadFile(file);
        } catch (error) {
            console.error('File upload failed:', error);
        }
    };

    const handleUrlUpload = async (url) => {
        if (!url) return;
        
        setSelectedFile(null);
        clearAnswer();
        clearUploadStatus();
        
        try {
            await uploadUrl(url);
        } catch (error) {
            console.error('URL upload failed:', error);
        }
    };

    const handleTextUpload = async (text) => {
        if (!text) return;
        
        setSelectedFile(null);
        clearAnswer();
        clearUploadStatus();
        
        try {
            await uploadText(text);
        } catch (error) {
            console.error('Text upload failed:', error);
        }
    };

    const handleQuestion = async (question, selectedMode, topK, language = 'en') => {
        if (!hasDocuments) {
            alert('Please upload a document first before asking questions.');
            return;
        }
        
        console.log('🔄 Starting question:', question, 'Mode:', selectedMode);
        
        setLastQuestion(question);
        setLastTopK(topK);
        
        try {
            console.log('📤 Calling askQuestion function...');
            await askQuestion(question, selectedMode, topK, language);
            console.log('✅ Question completed successfully');
        } catch (error) {
            console.error('❌ Question failed:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8 relative overflow-x-hidden">
            <div className="fixed top-20 left-20 w-[40rem] h-[40rem] bg-rose-200/20 rounded-full blur-[120px] -z-10" />
            <div className="fixed bottom-20 right-20 w-[45rem] h-[45rem] bg-indigo-200/20 rounded-full blur-[140px] -z-10" />

            
            {backendHealth && (
                <div className="fixed top-4 right-4 z-50">
                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-full text-xs font-bold ${
                        backendHealth.status === 'healthy' || backendHealth.status === 'up' || backendHealth.status === 'ok'
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                        <div className={`w-2 h-2 rounded-full ${
                            backendHealth.status === 'healthy' || backendHealth.status === 'up' || backendHealth.status === 'ok'
                                ? 'bg-green-500'
                                : 'bg-red-500'
                        }`} />
                        <span>
                            Backend {backendHealth.status === 'healthy' || backendHealth.status === 'up' || backendHealth.status === 'ok' ? 'Online' : 'Offline'}
                        </span>
                    </div>
                </div>
            )}

            <div className="fixed bottom-4 left-4 z-50">
                <div className="px-3 py-2 bg-slate-800 text-white rounded-full text-xs font-mono">
                    API: {getApiUrl()}
                </div>
            </div>

            <div className="fixed bottom-4 right-4 z-50">
                <button
                    onClick={() => setShowAnalytics(true)}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full text-sm font-bold transition-colors shadow-lg"
                >
                    📊 Analytics
                </button>
            </div>

            <div className="max-w-5xl w-full flex flex-col items-center">
                <Header />

                <main className="w-full space-y-8 flex flex-col">
                    <UploadSection
                        onFileSelect={handleFileUpload}
                        onUrlUpload={handleUrlUpload}
                        onTextUpload={handleTextUpload}
                        selectedFile={selectedFile}
                        uploadStatus={uploadStatus}
                    />

                    <AnswerFormatter
                        answer={answer}
                        isLoading={isLoading}
                        onToggleFullAnswer={setIsFullAnswer}
                    />

                    <QuestionSection
                        onSendMessage={handleQuestion}
                        isLoading={isLoading}
                        mode={mode}
                        setMode={setMode}
                        hasDocuments={hasDocuments}
                        lastQuestion={lastQuestion}
                    />
                </main>

                <footer className="mt-16 text-center">
                    <p className="text-xs text-slate-400">
                        Powered by AI • Upload documents and get intelligent answers
                    </p>
                </footer>
            </div>

            <AnalyticsPanel
                isVisible={showAnalytics}
                onClose={() => setShowAnalytics(false)}
                getAnalytics={getAnalytics}
                clearLogs={clearLogs}
            />
        </div>
    );
}

export default App;

