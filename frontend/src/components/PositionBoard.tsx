import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  fetchInterviewFlow,
  fetchPositionCandidates,
  updateCandidateStage,
} from '../services/positionBoardService';
import { BoardCandidate, DragState, InterviewStep } from '../types/positionBoard';
import KanbanColumn from './KanbanColumn';
import Toast from './Toast';

// Keyboard-accessible drag-and-drop (select-then-confirm) is a future enhancement.
// HTML5 DnD is mouse-only by spec.

const PositionBoard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [positionName, setPositionName] = useState<string>('');
  const [steps, setSteps] = useState<InterviewStep[]>([]);
  const [candidates, setCandidates] = useState<BoardCandidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const [flowResponse, candidatesResponse] = await Promise.all([
          fetchInterviewFlow(id),
          fetchPositionCandidates(id),
        ]);
        setPositionName(flowResponse.positionName);
        const sorted = [...flowResponse.interviewFlow.interviewSteps].sort(
          (a, b) => a.orderIndex - b.orderIndex || a.id - b.id
        );
        setSteps(sorted);
        setCandidates(candidatesResponse);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load position data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const showToast = (message: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(message);
    toastTimerRef.current = setTimeout(() => setToast(null), 3000);
  };

  const handleDismissToast = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(null);
  };

  const handleDragStart = (candidateName: string, fromStepId: number) => {
    setDragState({ candidateName, fromStepId });
  };

  const handleDrop = async (toStepId: number) => {
    if (!dragState) return;

    const { candidateName, fromStepId } = dragState;

    if (toStepId === fromStepId) {
      setDragState(null);
      return;
    }

    const toStep = steps.find((s) => s.id === toStepId);
    const fromStep = steps.find((s) => s.id === fromStepId);
    if (!toStep || !fromStep) {
      setDragState(null);
      return;
    }

    // Optimistic update: move candidate to new step
    const prevCandidates = candidates;
    setCandidates((prev) =>
      prev.map((c) =>
        c.fullName === candidateName && c.currentInterviewStep === fromStep.name
          ? { ...c, currentInterviewStep: toStep.name }
          : c
      )
    );
    setDragState(null);

    // The candidates API does not return candidateId — guard the PUT call accordingly
    const candidateId: string | null = null;

    if (candidateId === null) {
      console.warn(
        `Cannot persist stage update for "${candidateName}": candidate ID not available from API`
      );
      showToast('Unable to persist — candidate ID not available');
      return;
    }

    try {
      const response = await updateCandidateStage(candidateId, {
        applicationId: candidateId,
        currentInterviewStep: String(toStepId),
      });
      showToast(response.message);
    } catch {
      // Revert optimistic update on failure
      setCandidates(prevCandidates);
      showToast('Failed to update candidate stage');
    }
  };

  const handleDragEnd = () => {
    setDragState(null);
  };

  const handleBackClick = () => navigate('/positions');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f9f9]">
        <p className="font-space text-[14px] text-[#484831] p-[48px]">LOADING...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] px-[48px] py-[48px]">
        <div className="rounded-none border-2 border-red-300 bg-red-50 text-red-800 p-[16px]">
          {error}
        </div>
      </div>
    );
  }

  const isDragActive = dragState !== null;
  const lastStep = steps[steps.length - 1];

  const candidatesForStep = (stepId: number): BoardCandidate[] => {
    const step = steps.find((s) => s.id === stepId);
    if (!step) return [];
    return candidates.filter((c) => c.currentInterviewStep === step.name);
  };

  return (
    <div
      className="min-h-screen bg-[#f9f9f9]"
      onDragEnd={handleDragEnd}
    >
      <div className="px-[48px] py-[48px]">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-[16px]">
          <span className="font-space font-bold text-[14px] text-[#484831] uppercase">
            <Link to="/" className="hover:underline">HOME</Link>
            {' > '}
            <Link to="/positions" className="hover:underline">POSITIONS</Link>
            {' > '}
            <span aria-current="page">{positionName}</span>
          </span>
        </nav>

        {/* Back button + headline row */}
        <div className="flex items-end gap-[24px] mb-[0px]">
          <button
            onClick={handleBackClick}
            aria-label="Go back to positions"
            className="bg-[#ffff00] border-2 border-[#1a1c1c] drop-shadow-[4px_4px_0px_#1a1c1c] font-space font-bold text-[14px] text-[#1a1c1c] px-[16px] py-[10px] hover:bg-[#1a1c1c] hover:text-[#ffff00] transition-none shrink-0 self-center"
          >
            ← BACK
          </button>
          <h1 className="font-hanken font-black text-[72px] uppercase tracking-[-0.04em] leading-[72px] text-[#1a1c1c] border-b-4 border-[#1a1c1c] pb-[8px] flex-1">
            {positionName}
          </h1>
        </div>

        {/* Divider below headline area */}
        <div className="border-t-4 border-[#1a1c1c] mb-[24px]" />

        {/* Toolbar row */}
        <div className="flex items-center justify-between mb-[24px]">
          <div className="flex items-center gap-[8px]">
            <input
              type="text"
              placeholder="SEARCH..."
              aria-label="Search candidates"
              className="bg-white border-2 border-[#1a1c1c] font-space text-[14px] text-[#1a1c1c] placeholder-[#484831] px-[12px] py-[8px] focus:outline-none focus:border-[3px]"
            />
            <button
              aria-label="Filter candidates"
              tabIndex={0}
              className="bg-white border-2 border-[#1a1c1c] font-space font-bold text-[14px] text-[#1a1c1c] px-[16px] py-[8px] hover:bg-[#1a1c1c] hover:text-white transition-none"
            >
              FILTER
            </button>
          </div>
          <button
            onClick={() => navigate(`/add-candidate?positionId=${id}`)}
            aria-label="Add new candidate"
            tabIndex={0}
            className="bg-[#ffff00] border-2 border-[#1a1c1c] drop-shadow-[4px_4px_0px_#1a1c1c] font-space font-bold text-[14px] text-[#1a1c1c] px-[16px] py-[10px] hover:bg-[#1a1c1c] hover:text-[#ffff00] transition-none"
          >
            + ADD CANDIDATE
          </button>
        </div>

        {/* Kanban board */}
        <div
          role="region"
          aria-label="Kanban board"
          className="bg-[#eeeeee] border-2 border-[#1a1c1c] p-[16px] overflow-x-auto"
        >
          <div className="flex gap-[16px]">
            {steps.map((step) => (
              <KanbanColumn
                key={step.id}
                step={step}
                candidates={candidatesForStep(step.id)}
                isLast={lastStep ? step.id === lastStep.id : false}
                isDragActive={isDragActive}
                onDragStart={handleDragStart}
                onDrop={handleDrop}
              />
            ))}
          </div>
        </div>
      </div>

      {toast && <Toast message={toast} onDismiss={handleDismissToast} />}
    </div>
  );
};

export default PositionBoard;
