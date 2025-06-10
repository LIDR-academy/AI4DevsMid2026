import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Position = {
    id: number;
    title: string;
    status: string;
    location: string;
    applicationDeadline: string | null;
    companyName: string;
};

const statusBadgeColor = (status: string) => {
    switch (status) {
        case 'Open': return 'bg-yellow-500';
        case 'Filled': return 'bg-green-600';
        case 'Closed': return 'bg-red-500';
        case 'Draft': return 'bg-gray-500';
        default: return 'bg-gray-500';
    }
};

const Positions: React.FC = () => {
    const navigate = useNavigate();
    const [positions, setPositions] = useState<Position[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPositions = async () => {
            try {
                const response = await fetch('http://localhost:3010/position');
                if (!response.ok) throw new Error('Failed to fetch positions');
                const data = await response.json();
                setPositions(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchPositions();
    }, []);

    const handleViewProcess = (positionId: number) => {
        navigate(`/positions/${positionId}`);
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 mt-12 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 mt-12">
                <div className="rounded border border-red-300 bg-red-50 text-red-800 p-4">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 mt-12">
            <h2 className="text-center text-2xl font-semibold mb-6">Posiciones</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {positions.map((position) => (
                    <div key={position.id} className="rounded border border-gray-200 shadow-sm">
                        <div className="p-4">
                            <h3 className="text-lg font-medium">{position.title}</h3>
                            <p className="text-sm text-gray-700 mt-2">
                                <strong>Company:</strong> {position.companyName}<br />
                                <strong>Location:</strong> {position.location}<br />
                                {position.applicationDeadline && (
                                    <>
                                        <strong>Deadline:</strong> {new Date(position.applicationDeadline).toLocaleDateString()}
                                    </>
                                )}
                            </p>
                            <span className={`inline-block text-white text-xs font-medium px-2 py-1 rounded ${statusBadgeColor(position.status)} mt-2`}>
                                {position.status}
                            </span>
                            <div className="flex justify-between mt-4">
                                <button
                                    className="inline-flex items-center px-3 py-2 rounded bg-primary text-white hover:bg-primary-dark"
                                    onClick={() => handleViewProcess(position.id)}
                                >
                                    Ver proceso
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {positions.length === 0 && (
                    <p className="text-gray-500 col-span-3 text-center">No positions found.</p>
                )}
            </div>
        </div>
    );
};

export default Positions;
