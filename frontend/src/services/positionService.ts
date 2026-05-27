import { Position } from '../types/dashboard';

export const fetchPositions = async (): Promise<Position[]> => {
  const response = await fetch('http://localhost:3010/position');
  if (!response.ok) throw new Error('Failed to fetch positions');
  return response.json();
};
