import { useState } from 'react';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { QuestionSection } from './components/QuestionSection';
import { AnswerSection } from './components/AnswerSection';
import { useChat } from './hooks/useChat';

/**
 * Main Application Component
 * Orchestrates the flow between uploading a PDF and asking questions.
 */
function App() {
    // State for the uploaded file
    const [selectedFile, setSelectedFile] = useState(null);

    // Custom hook for chat logic logic
    const { answer, isLoading, askQuestion, clearAnswer } = useChat();

    /**
     * Helper to handle file selection changes.
     * Resets the previous answer when a new file is chosen.
     */
    const handleFileSelect = (file) => {
        setSelectedFile(file);
        if (file) {
            // Clear previous conversation context if a new file is uploaded
            clearAnswer();
        }
    };

    /**
     * Handles the form submission from the QuestionSection.
     */
    const handleSendMessage = (question) => {
        if (!selectedFile) {
            alert('Please upload a PDF file first.');
            return;
        }

        // Trigger the simulation
        askQuestion(question);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
            <div className="max-w-3xl mx-auto px-4 py-8 min-h-screen flex flex-col">
                <Header />

                <main className="flex-1 w-full">
                    {/* File Upload Area */}
                    <UploadSection
                        onFileSelect={handleFileSelect}
                        selectedFile={selectedFile}
                    />

                    {/* Question Input Area */}
                    <div className="transition-all duration-300 ease-in-out">
                        <QuestionSection
                            onSendMessage={handleSendMessage}
                            isLoading={isLoading}
                        />
                    </div>

                    {/* Answer Display Area */}
                    <AnswerSection
                        answer={answer}
                        isLoading={isLoading}
                    />
                </main>

                <footer className="py-8 text-center text-sm text-gray-400">
                    <p>© {new Date().getFullYear()} RAG Chatbot. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}

export default App;
