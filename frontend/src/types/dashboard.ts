export type Position = {
  id: number;
  title: string;
  status: string;
  location: string;
  department: string;
  applicationDeadline: string | null;
  companyName: string;
  hiringManager?: string;
  hiringManagerAvatar?: string;
  hiringManagerInitials?: string;
  activeApplicants?: number;
};

export type StatCardProps = {
  label: string;
  value: string;
  suffix?: string;
};

export type StatusChipStatus = 'OPEN' | 'PAUSED' | 'CLOSED' | 'DRAFT';

export type StatusChipProps = {
  status: StatusChipStatus;
};

export type PipelineBarProps = {
  total: number;
  activeCount: number;
};

export type ManagerCellProps = {
  name: string;
  avatarUrl?: string;
  initials?: string;
};

export type PositionRowProps = {
  position: Position;
  onView: (id: number) => void;
};

export type PositionsTableProps = {
  positions: Position[];
  onView: (id: number) => void;
};

export type FiltersRowProps = {
  search: string;
  department: string;
  location: string;
  status: string;
  departments: string[];
  locations: string[];
  onSearchChange: (v: string) => void;
  onDepartmentChange: (v: string) => void;
  onLocationChange: (v: string) => void;
  onStatusChange: (v: string) => void;
};
