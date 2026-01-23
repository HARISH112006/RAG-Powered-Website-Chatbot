import { useState } from 'react';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { QuestionSection } from './components/QuestionSection';
import { AnswerSection } from './components/AnswerSection';
import { useChat } from './hooks/useChat';

/**
 * RAG Flow: Glassmorphic Main Entry.
 * Features a centered, floating architecture with soft pastel ambiance.
 */
function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const { answer, isLoading, askQuestion, clearAnswer } = useChat();

    const handleFile = (file) => {
        setSelectedFile(file);
        if (file) clearAnswer();
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8 relative overflow-x-hidden">
            {/* Ambient Background Glows */}
            <div className="fixed top-20 left-20 w-[40rem] h-[40rem] bg-rose-200/20 rounded-full blur-[120px] -z-10" />
            <div className="fixed bottom-20 right-20 w-[45rem] h-[45rem] bg-indigo-200/20 rounded-full blur-[140px] -z-10" />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-emerald-100/10 rounded-full blur-[160px] -z-10" />

            <div className="max-w-5xl w-full flex flex-col items-center">
                <Header />

                <main className="w-full space-y-8 flex flex-col">
                    <UploadSection
                        onFileSelect={handleFile}
                        selectedFile={selectedFile}
                    />

                    <AnswerSection
                        answer={answer}
                        isLoading={isLoading}
                    />

                    <QuestionSection
                        onSendMessage={(q) => selectedFile ? askQuestion(q) : alert('Flow Inactive: Load document first.')}
                        isLoading={isLoading}
                    />
                </main>
            </div>
        </div>
    );
}

export default App;
