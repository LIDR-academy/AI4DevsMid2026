export type InterviewStep = {
  id: number;
  interviewFlowId: number;
  interviewTypeId: number;
  name: string;
  orderIndex: number;
};

export type InterviewFlow = {
  id: number;
  description: string;
  interviewSteps: InterviewStep[];
};

export type InterviewFlowResponse = {
  positionName: string;
  interviewFlow: InterviewFlow;
};

export type BoardCandidate = {
  fullName: string;
  currentInterviewStep: string;
  averageScore: number;
  highlighted?: boolean;
};

export type UpdateStageRequest = {
  applicationId: string;
  currentInterviewStep: string;
};

export type UpdateStageResponse = {
  message: string;
  data: {
    id: number;
    positionId: number;
    candidateId: number;
    applicationDate: string;
    currentInterviewStep: number;
    notes: string | null;
    interviews: unknown[];
  };
};

export type DragState = {
  candidateName: string;
  fromStepId: number;
};
