import {
  BoardCandidate,
  InterviewFlowResponse,
  UpdateStageRequest,
  UpdateStageResponse,
} from '../types/positionBoard';

const BASE_URL = 'http://localhost:3010';

export const fetchInterviewFlow = async (
  positionId: string
): Promise<InterviewFlowResponse> => {
  const response = await fetch(`${BASE_URL}/position/${positionId}/interviewflow`);
  if (!response.ok) {
    if (response.status === 404) throw new Error('Position not found');
    throw new Error('Failed to load interview flow');
  }
  // The API wraps the payload under an extra `interviewFlow` key:
  // { interviewFlow: { positionName, interviewFlow: { interviewSteps } } }
  // Unwrap to match the InterviewFlowResponse type.
  const json = await response.json();
  return json.interviewFlow as InterviewFlowResponse;
};

export const fetchPositionCandidates = async (
  positionId: string
): Promise<BoardCandidate[]> => {
  const response = await fetch(`${BASE_URL}/position/${positionId}/candidates`);
  if (!response.ok) {
    if (response.status === 404) throw new Error('Position not found');
    throw new Error('Failed to load candidates');
  }
  return response.json();
};

export const updateCandidateStage = async (
  candidateId: string,
  body: UpdateStageRequest
): Promise<UpdateStageResponse> => {
  const response = await fetch(`${BASE_URL}/candidates/${candidateId}/stage`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error('Failed to update candidate stage');
  }
  return response.json();
};
