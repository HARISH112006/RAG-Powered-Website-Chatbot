import { useState } from 'react';

// Backend API URL - change this to match your backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export function useChat() {
    const [answer, setAnswer] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substring(7)}`);
    const [analytics, setAnalytics] = useState({
        questionsAsked: 0,
        documentsUploaded: 0,
        commonTopics: []
    });

    // Log user interactions for analytics
    const logInteraction = (type, data) => {
        const logEntry = {
            timestamp: new Date().toISOString(),
            sessionId,
            type,
            data
        };
        
        // Store in localStorage for persistence
        const logs = JSON.parse(localStorage.getItem('ragChatLogs') || '[]');
        logs.push(logEntry);
        localStorage.setItem('ragChatLogs', JSON.stringify(logs.slice(-100))); // Keep last 100 logs
        
        // Update analytics
        if (type === 'question') {
            setAnalytics(prev => ({
                ...prev,
                questionsAsked: prev.questionsAsked + 1
            }));
        } else if (type === 'upload') {
            setAnalytics(prev => ({
                ...prev,
                documentsUploaded: prev.documentsUploaded + 1
            }));
        }
    };

    // Upload file with enhanced error handling and status tracking
    const uploadFile = async (file) => {
        setIsLoading(true);
        setUploadStatus(null);
        
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: 'Upload failed' }));
                throw new Error(errorData.detail || errorData.message || `Upload failed (${response.status})`);
            }

            const data = await response.json();
            console.log('Document uploaded successfully:', data);
            
            // Log the upload
            logInteraction('upload', {
                fileName: file.name,
                fileSize: file.size,
                status: 'success'
            });
            
            setUploadStatus({
                success: true,
                document_id: data.document_id || 'uploaded',
                summary: data.summary || 'Document uploaded successfully',
                chunks_created: data.chunks_created || 1,
                message: data.message
            });
            
            return data;
        } catch (error) {
            console.error('Upload error:', error);
            
            // Log the error
            logInteraction('upload', {
                fileName: file.name,
                fileSize: file.size,
                status: 'error',
                error: error.message
            });
            
            setUploadStatus({
                success: false,
                error: error.message || 'Upload failed. Please check if the backend is running.'
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Upload URL with validation
    const uploadUrl = async (url) => {
        setIsLoading(true);
        setUploadStatus(null);

        try {
            const response = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ url }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: 'URL upload failed' }));
                throw new Error(errorData.detail || errorData.message || `URL upload failed (${response.status})`);
            }

            const data = await response.json();
            console.log('URL uploaded successfully:', data);
            
            // Log the upload
            logInteraction('upload', {
                url,
                status: 'success'
            });
            
            setUploadStatus({
                success: true,
                document_id: data.document_id || 'uploaded',
                summary: data.summary || 'URL content processed successfully',
                chunks_created: data.chunks_created || 1,
                message: data.message
            });
            
            return data;
        } catch (error) {
            console.error('URL upload error:', error);
            
            // Log the error
            logInteraction('upload', {
                url,
                status: 'error',
                error: error.message
            });
            
            setUploadStatus({
                success: false,
                error: error.message || 'URL upload failed. Please check the URL and try again.'
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Upload text content
    const uploadText = async (text) => {
        setIsLoading(true);
        setUploadStatus(null);

        try {
            const response = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ text }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: 'Text upload failed' }));
                throw new Error(errorData.detail || errorData.message || `Text upload failed (${response.status})`);
            }

            const data = await response.json();
            console.log('Text uploaded successfully:', data);
            
            // Log the upload
            logInteraction('upload', {
                textLength: text.length,
                status: 'success'
            });
            
            setUploadStatus({
                success: true,
                document_id: data.document_id || 'uploaded',
                summary: data.summary || 'Text processed successfully',
                chunks_created: data.chunks_created || 1,
                message: data.message
            });
            
            return data;
        } catch (error) {
            console.error('Text upload error:', error);
            
            // Log the error
            logInteraction('upload', {
                textLength: text.length,
                status: 'error',
                error: error.message
            });
            
            setUploadStatus({
                success: false,
                error: error.message || 'Text upload failed. Please try again.'
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Enhanced question asking with better error handling
    const askQuestion = async (question, mode = 'human', topK = 4, language = 'en') => {
        if (!question.trim()) {
            alert('Please enter a question');
            return;
        }

        setIsLoading(true);
        setAnswer(null);

        try {
            // For compatibility with simpler backend, use basic query format
            const requestBody = {
                question: question.trim(),
                mode: mode,
                top_k: topK,
                language: language,
                session_id: sessionId
            };

            // Store globally for translation - ensure all parameters are included
            window.lastQuestionData = {
                question: question.trim(),
                mode: mode,
                top_k: topK,
                language: language,
                session_id: sessionId
            };
            window.apiBaseUrl = API_BASE_URL;

            console.log('🌐 Stored question data for translation:', window.lastQuestionData);

            const response = await fetch(`${API_BASE_URL}/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: 'Query failed' }));
                throw new Error(errorData.detail || errorData.message || `Query failed (${response.status})`);
            }

            const data = await response.json();
            console.log('Query response:', data);
            
            // Log the question and answer
            logInteraction('question', {
                question: question.trim(),
                mode,
                language,
                answerLength: typeof data.answer === 'string' ? data.answer.length : JSON.stringify(data.answer).length,
                sourcesCount: data.sources?.length || 0,
                confidence: data.confidence_score
            });
            
            setAnswer(data);
            return data;
        } catch (error) {
            console.error('Query failed:', error);
            
            // Log the error
            logInteraction('question', {
                question: question.trim(),
                mode,
                language,
                status: 'error',
                error: error.message
            });
            
            setAnswer({
                answer: `Error: ${error.message}`,
                context: '',
                sources: [],
                confidence_score: 0,
                mode,
                session_id: sessionId,
                error: true
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Check backend health
    const checkHealth = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/health`, {
                method: 'GET', // Try GET first, fallback to POST
            });
            
            if (!response.ok) {
                // Try POST method as fallback
                const postResponse = await fetch(`${API_BASE_URL}/health`, {
                    method: 'POST',
                });
                
                if (!postResponse.ok) {
                    throw new Error(`Health check failed (${response.status})`);
                }
                
                const data = await postResponse.json();
                console.log('Backend health (POST):', data);
                return data;
            }
            
            const data = await response.json();
            console.log('Backend health (GET):', data);
            return data;
        } catch (error) {
            console.error('Health check failed:', error);
            return { status: 'error', error: error.message };
        }
    };

    // Get backend statistics
    const getStats = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/stats`);
            
            if (!response.ok) {
                throw new Error(`Stats request failed (${response.status})`);
            }
            
            const data = await response.json();
            console.log('Backend stats:', data);
            return data;
        } catch (error) {
            console.error('Stats request failed:', error);
            return { error: error.message };
        }
    };

    // Get analytics data
    const getAnalytics = () => {
        const logs = JSON.parse(localStorage.getItem('ragChatLogs') || '[]');
        const questions = logs.filter(log => log.type === 'question');
        const uploads = logs.filter(log => log.type === 'upload');
        
        return {
            totalQuestions: questions.length,
            totalUploads: uploads.length,
            recentQuestions: questions.slice(-10).map(q => q.data.question),
            sessionStats: analytics
        };
    };

    // Clear logs
    const clearLogs = () => {
        localStorage.removeItem('ragChatLogs');
        setAnalytics({
            questionsAsked: 0,
            documentsUploaded: 0,
            commonTopics: []
        });
    };

    const clearAnswer = () => {
        setAnswer(null);
    };

    const clearUploadStatus = () => {
        setUploadStatus(null);
    };

    // Get current API base URL for display
    const getApiUrl = () => API_BASE_URL;

    return {
        answer,
        isLoading,
        uploadStatus,
        sessionId,
        analytics,
        askQuestion,
        uploadFile,
        uploadUrl,
        uploadText,
        clearAnswer,
        clearUploadStatus,
        checkHealth,
        getStats,
        getAnalytics,
        clearLogs,
        getApiUrl
    };
}

