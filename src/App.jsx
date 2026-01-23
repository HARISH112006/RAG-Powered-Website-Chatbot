import { useState } from 'react';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { QuestionSection } from './components/QuestionSection';
import { AnswerSection } from './components/AnswerSection';
import { useChat } from './hooks/useChat';

function App() {
    const [selectedFile, setSelectedFile] = useState(null);

    const { answer, isLoading, askQuestion, clearAnswer } = useChat();

    const handleFileSelect = (file) => {
        setSelectedFile(file);
        if (file) {

            clearAnswer();
        }
    };

    const handleSendMessage = (question) => {
        if (!selectedFile) {
            alert('Please upload a PDF file first.');
            return;
        }

        askQuestion(question);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-slate-50/50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
            <div className="max-w-3xl mx-auto px-6 py-12 min-h-screen flex flex-col">
                <Header />

                <main className="flex-1 w-full space-y-2">
                    {/* File Upload Area */}
                    <UploadSection
                        onFileSelect={handleFileSelect}
                        selectedFile={selectedFile}
                    />

                    {/* Chat Experience Area */}
                    <div className="transition-all duration-500 ease-in-out">
                        <QuestionSection
                            onSendMessage={handleSendMessage}
                            isLoading={isLoading}
                        />

                        <AnswerSection
                            answer={answer}
                            isLoading={isLoading}
                        />
                    </div>
                </main>

                <footer className="py-12 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        © {new Date().getFullYear()} RAG Chatbot &bull; Built for Performance
                    </p>
                </footer>
            </div>
        </div>
    );
}

export default App;
