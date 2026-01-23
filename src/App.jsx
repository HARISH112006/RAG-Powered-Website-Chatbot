import { useState } from 'react';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { QuestionSection } from './components/QuestionSection';
import { AnswerSection } from './components/AnswerSection';
import { useChat } from './hooks/useChat';

/**
 * Cyber-Luxe V3 Entry Point: High-density neural interface.
 * Implements an asymmetric split-screen layout for focused interaction.
 */
function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const { answer, isLoading, askQuestion, clearAnswer } = useChat();

    const handleFile = (file) => {
        setSelectedFile(file);
        if (file) clearAnswer();
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative">
            <div className="scanlines" />
            <div className="neural-bg" />

            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 h-[90vh] max-h-[1000px]">

                {/* Asymmetric Sidebar: Identity & Protocols */}
                <aside className="md:col-span-4 flex flex-col gap-8 h-full">
                    <Header />
                    <UploadSection
                        onFileSelect={handleFile}
                        selectedFile={selectedFile}
                    />

                    {/* System Latency Metrics */}
                    <div className="glass-panel rounded-[2.5rem] p-6 flex justify-between items-center bg-white/[0.02] shrink-0">
                        <div className="space-y-1">
                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Latency</p>
                            <p className="text-sm font-bold text-cyan-400">0.02ms</p>
                        </div>
                        <div className="h-8 w-[1px] bg-white/10" />
                        <div className="space-y-1 text-right">
                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Model</p>
                            <p className="text-sm font-bold text-violet-400">GPT-NEURAL</p>
                        </div>
                    </div>
                </aside>

                {/* Main Viewport: Neural Link Stream */}
                <main className="md:col-span-8 glass-panel rounded-[3rem] p-10 flex flex-col overflow-hidden relative">
                    <AnswerSection answer={answer} isLoading={isLoading} />
                    <QuestionSection
                        onSendMessage={(q) => selectedFile ? askQuestion(q) : alert('Protocols inactive: Upload PDF first.')}
                        isLoading={isLoading}
                    />
                </main>
            </div>
        </div>
    );
}

export default App;
