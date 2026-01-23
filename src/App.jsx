import { useState } from 'react';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { QuestionSection } from './components/QuestionSection';
import { AnswerSection } from './components/AnswerSection';
import { useChat } from './hooks/useChat';

/**
 * Main application entry point that manages the document analysis flow.
 * Coordinates between file uploading, chat interaction, and AI responses.
 */
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
        <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-slate-50/50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 flex items-center justify-center p-6">
            <div className="max-w-2xl w-full space-y-8 py-10">
                <Header />

                <main className="space-y-6">
                    {/* Primary document upload interface */}
                    <UploadSection
                        onFileSelect={handleFileSelect}
                        selectedFile={selectedFile}
                    />

                    {/* Historical and current AI analysis responses */}
                    <AnswerSection
                        answer={answer}
                        isLoading={isLoading}
                    />

                    {/* Real-time conversational input bar */}
                    <QuestionSection
                        onSendMessage={handleSendMessage}
                        isLoading={isLoading}
                    />
                </main>
            </div>
        </div>
    );
}

export default App;
