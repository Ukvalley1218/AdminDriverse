'use client';
import { useState, useEffect } from 'react';

export default function QuestionsPage() {
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswers, setNewAnswers] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editQuestion, setEditQuestion] = useState('');
    const [editAnswers, setEditAnswers] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all questions
    const fetchQuestions = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/question');
            if (!response.ok) {
                throw new Error('Failed to fetch questions');
            }
            const data = await response.json();
            console.log("data",data);
            setQuestions(data);
        } catch (error) {
            console.error('Error fetching questions:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    // Create a new question
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const answersArray = newAnswers.split(',').map(a => a.trim()).filter(a => a !== '');

            const response = await fetch('/api/question', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: newQuestion,
                    answers: answersArray
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create question');
            }

            setNewQuestion('');
            setNewAnswers('');
            await fetchQuestions();
        } catch (error) {
            console.error('Error creating question:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Start editing a question
    const startEditing = (question) => {
        setEditingId(question._id);
        setEditQuestion(question.question);
        setEditAnswers(question.answers.join(', '));
    };

    // Cancel editing
    const cancelEditing = () => {
        setEditingId(null);
        setEditQuestion('');
        setEditAnswers('');
    };

    // Update a question
    const handleUpdate = async () => {
        if (!editingId) return;
        setIsLoading(true);
        setError(null);
        
        try {
            const answersArray = editAnswers.split(',').map(a => a.trim()).filter(a => a !== '');

            const response = await fetch('/api/question', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingId,
                    question: editQuestion,
                    answers: answersArray
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update question');
            }

            cancelEditing();
            await fetchQuestions();
        } catch (error) {
            console.error('Error updating question:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Delete a question
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this question?')) return;
        
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/question', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete question');
            }

            await fetchQuestions();
        } catch (error) {
            console.error('Error deleting question:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Question Management</h1>

            {/* Error message */}
            {error && (
                <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
                    <p>{error}</p>
                </div>
            )}

            {/* Add new question form */}
            <div className="mb-10 p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Question</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Question:</label>
                        <input
                            type="text"
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your question"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Answers (comma separated):
                        </label>
                        <input
                            type="text"
                            value={newAnswers}
                            onChange={(e) => setNewAnswers(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Answer 1, Answer 2, Answer 3"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        type="submit"
                        className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Adding...' : 'Add Question'}
                    </button>
                </form>
            </div>

            {/* Questions list */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-700">Questions List</h2>
                    <button 
                        onClick={fetchQuestions}
                        className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        disabled={isLoading}
                    >
                        Refresh
                    </button>
                </div>

                {isLoading && !questions.length ? (
                    <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : questions.length === 0 ? (
                    <div className="p-6 text-center bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-500">No questions found. Add your first question above.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {questions.map((q) => (
                            <div key={q._id} className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                                {editingId === q._id ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Question:</label>
                                            <input
                                                type="text"
                                                value={editQuestion}
                                                onChange={(e) => setEditQuestion(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                required
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Answers:</label>
                                            <input
                                                type="text"
                                                value={editAnswers}
                                                onChange={(e) => setEditAnswers(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                required
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <div className="flex space-x-3 pt-2">
                                            <button
                                                onClick={handleUpdate}
                                                className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? 'Saving...' : 'Save Changes'}
                                            </button>
                                            <button
                                                onClick={cancelEditing}
                                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                                disabled={isLoading}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-2">{q.question}</h3>
                                        <div className="mb-4">
                                            <span className="text-sm font-medium text-gray-600">Answers:</span>
                                            <ul className="mt-1 pl-5 list-disc">
                                                {q.answers.map((answer, index) => (
                                                    <li key={index} className="text-gray-700">{answer}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="flex space-x-3 border-t pt-3">
                                            <button
                                                onClick={() => startEditing(q)}
                                                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(q._id)}
                                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}