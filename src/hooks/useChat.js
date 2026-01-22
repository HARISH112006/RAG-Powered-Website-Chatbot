import { useState } from 'react';

/**
 * Custom hook to manage chat state and simulate API responses.
 * This abstracts the logic away from the UI component.
 */
export function useChat() {
    const [answer, setAnswer] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Simulates sending a question to the backend and receiving an answer.
     * @param {string} question - The question text asked by the user.
     */
    const askQuestion = (question) => {
        setIsLoading(true);
        setAnswer(null);

        console.log(`Sending question to API: "${question}"`);

        // Simulate network delay for a more realistic feel
        setTimeout(() => {
            setIsLoading(false);
            setAnswer(
                "Based on the included financial report, the Q3 revenue showed a 12% increase compared to the previous year. " +
                "The primary contributing factors were strong performance in the cloud services division and strategic partnerships formed in the European market. " +
                "However, operating expenses also rose by 8% due to increased R&D investment. " +
                "The outlook for Q4 remains positive, with projected growth shifting towards 15% as new product lines launch."
            );
        }, 2000);
    };

    /**
     * Resets the chat answer, useful when a new file is uploaded.
     */
    const clearAnswer = () => {
        setAnswer(null);
    };

    return {
        answer,
        isLoading,
        askQuestion,
        clearAnswer
    };
}
