export type IssueCategory = 
  | 'road' 
  | 'garbage' 
  | 'water' 
  | 'electricity' 
  | 'sewage' 
  | 'streetlight' 
  | 'other';

export type IssueStatus = 'pending' | 'in-progress' | 'resolved';
export type IssuePriority = 'low' | 'medium' | 'high';

export interface IssueUpdate {
  id: string;
  date: string;
  title: string;
  description: string;
}

export interface Issue {
  id: string;
  title: string;
  category: IssueCategory;
  status: IssueStatus;
  priority: IssuePriority;
  description: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  images: string[];
  reportCount: number;
  createdAt: string;
  updatedAt: string;
  updates: IssueUpdate[];
}

export const categoryLabels: Record<IssueCategory, string> = {
  road: 'Road & Pavement',
  garbage: 'Garbage & Waste',
  water: 'Water Supply',
  electricity: 'Electricity',
  sewage: 'Sewage & Drainage',
  streetlight: 'Street Lighting',
  other: 'Other',
};

export const categoryIcons: Record<IssueCategory, string> = {
  road: 'Construction',
  garbage: 'Trash2',
  water: 'Droplets',
  electricity: 'Zap',
  sewage: 'PipetteOff',
  streetlight: 'Lightbulb',
  other: 'HelpCircle',
};

export const statusLabels: Record<IssueStatus, string> = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  resolved: 'Resolved',
};

export const priorityLabels: Record<IssuePriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

// Mock data for demo
export const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Large pothole on Main Street',
    category: 'road',
    status: 'in-progress',
    priority: 'high',
    description: 'There is a large pothole approximately 2 feet wide near the intersection of Main Street and Oak Avenue. It poses a safety hazard for vehicles and cyclists.',
    location: {
      address: '123 Main Street, Downtown',
      lat: 40.7128,
      lng: -74.0060,
    },
    images: [
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400&h=300&fit=crop',
    ],
    reportCount: 12,
    createdAt: '2024-01-15T09:30:00Z',
    updatedAt: '2024-01-18T14:20:00Z',
    updates: [
      {
        id: 'u1',
        date: '2024-01-18T14:20:00Z',
        title: 'Repair Scheduled',
        description: 'Road maintenance team has been dispatched. Repair expected within 48 hours.',
      },
      {
        id: 'u2',
        date: '2024-01-16T10:00:00Z',
        title: 'Issue Verified',
        description: 'Site inspection completed. Issue confirmed and prioritized.',
      },
      {
        id: 'u3',
        date: '2024-01-15T09:30:00Z',
        title: 'Report Submitted',
        description: 'Issue reported by community member.',
      },
    ],
  },
  {
    id: '2',
    title: 'Overflowing garbage bins at Central Park',
    category: 'garbage',
    status: 'pending',
    priority: 'medium',
    description: 'Multiple garbage bins near the north entrance of Central Park are overflowing. Waste is spilling onto the walkway and creating an unsanitary condition.',
    location: {
      address: 'Central Park North Entrance',
      lat: 40.7829,
      lng: -73.9654,
    },
    images: [],
    reportCount: 5,
    createdAt: '2024-01-19T16:45:00Z',
    updatedAt: '2024-01-19T16:45:00Z',
    updates: [
      {
        id: 'u1',
        date: '2024-01-19T16:45:00Z',
        title: 'Report Submitted',
        description: 'Issue reported by community member.',
      },
    ],
  },
  {
    id: '3',
    title: 'Broken streetlight on Elm Avenue',
    category: 'streetlight',
    status: 'resolved',
    priority: 'low',
    description: 'The streetlight outside 456 Elm Avenue has been non-functional for the past week, making the area very dark at night.',
    location: {
      address: '456 Elm Avenue',
      lat: 40.7484,
      lng: -73.9857,
    },
    images: [],
    reportCount: 3,
    createdAt: '2024-01-10T20:15:00Z',
    updatedAt: '2024-01-17T11:30:00Z',
    updates: [
      {
        id: 'u1',
        date: '2024-01-17T11:30:00Z',
        title: 'Issue Resolved',
        description: 'Streetlight bulb replaced and tested. Issue resolved.',
      },
      {
        id: 'u2',
        date: '2024-01-14T09:00:00Z',
        title: 'Parts Ordered',
        description: 'Replacement bulb ordered. Expected delivery in 2-3 days.',
      },
      {
        id: 'u3',
        date: '2024-01-10T20:15:00Z',
        title: 'Report Submitted',
        description: 'Issue reported by community member.',
      },
    ],
  },
  {
    id: '4',
    title: 'Water main leak near Oak Street',
    category: 'water',
    status: 'in-progress',
    priority: 'high',
    description: 'Significant water leak from underground pipe causing water pooling on the street. Water pressure in nearby buildings has dropped.',
    location: {
      address: '789 Oak Street',
      lat: 40.7589,
      lng: -73.9851,
    },
    images: [
      'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400&h=300&fit=crop',
    ],
    reportCount: 8,
    createdAt: '2024-01-18T07:00:00Z',
    updatedAt: '2024-01-19T08:00:00Z',
    updates: [
      {
        id: 'u1',
        date: '2024-01-19T08:00:00Z',
        title: 'Emergency Repair Started',
        description: 'Water utility crew on site. Temporary water shutoff in progress.',
      },
      {
        id: 'u2',
        date: '2024-01-18T07:00:00Z',
        title: 'Report Submitted',
        description: 'Issue reported as urgent by community member.',
      },
    ],
  },
  {
    id: '5',
    title: 'Blocked storm drain causing flooding',
    category: 'sewage',
    status: 'pending',
    priority: 'medium',
    description: 'Storm drain near the corner of Pine Street and 5th Avenue is blocked with debris, causing water to accumulate during rain.',
    location: {
      address: 'Pine Street & 5th Avenue',
      lat: 40.7527,
      lng: -73.9772,
    },
    images: [],
    reportCount: 2,
    createdAt: '2024-01-19T12:30:00Z',
    updatedAt: '2024-01-19T12:30:00Z',
    updates: [
      {
        id: 'u1',
        date: '2024-01-19T12:30:00Z',
        title: 'Report Submitted',
        description: 'Issue reported by community member.',
      },
    ],
  },
];

export function getIssueStats() {
  const total = mockIssues.length;
  const highPriority = mockIssues.filter(i => i.priority === 'high').length;
  const resolved = mockIssues.filter(i => i.status === 'resolved').length;
  const pending = mockIssues.filter(i => i.status === 'pending').length;
  const inProgress = mockIssues.filter(i => i.status === 'in-progress').length;
  
  return { total, highPriority, resolved, pending, inProgress };
}

export function getRecentIssues(limit: number = 5): Issue[] {
  return [...mockIssues]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function getIssueById(id: string): Issue | undefined {
  return mockIssues.find(issue => issue.id === id);
}
