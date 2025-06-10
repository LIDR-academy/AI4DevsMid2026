import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PositionBoard: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/positions');
    };

    return (
        <div className="mt-12 max-w-5xl mx-auto px-4">
            <button
                onClick={handleGoBack}
                className="mb-4 inline-flex items-center px-3 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
                &larr; Back to Positions
            </button>
            <h1 className="text-2xl font-semibold mb-2">Position {id}</h1>
            <p className="text-gray-600">Position details will be displayed here.</p>
        </div>
    );
};

export default PositionBoard;
