import { RoleType, UserType } from '../../types/types';

export const fake_users: UserType[] = [
  {
    id: '001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'active',
    password: 'test123',
  },
  {
    id: '002',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    role: 'Editor',
    status: 'active',
    password: 'test123',
  },
  {
    id: '003',
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert.johnson@example.com',
    role: 'Viewer',
    status: 'inactive',
    password: 'test123',
  },
  {
    id: '004',
    firstName: 'Emily',
    lastName: 'Williams',
    email: 'emily.williams@example.com',
    role: 'Editor',
    status: 'pending',
    password: 'test123',
  },
  {
    id: '005',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@example.com',
    role: 'Admin',
    status: 'active',
    password: 'test123',
  },
  {
    id: '006',
    firstName: 'Sarah',
    lastName: 'Davis',
    email: 'sarah.davis@example.com',
    role: 'Viewer',
    status: 'inactive',
    password: 'test123',
  },
  {
    id: '007',
    firstName: 'David',
    lastName: 'Miller',
    email: 'david.miller@example.com',
    role: 'Editor',
    status: 'active',
    password: 'test123',
  },
  {
    id: '008',
    firstName: 'Jessica',
    lastName: 'Wilson',
    email: 'jessica.wilson@example.com',
    role: 'Viewer',
    status: 'pending',
    password: 'test123',
  },
  {
    id: '009',
    firstName: 'Thomas',
    lastName: 'Anderson',
    email: 'thomas.anderson@example.com',
    role: 'Admin',
    status: 'active',
    password: 'test123',
  },
  {
    id: '010',
    firstName: 'Lisa',
    lastName: 'Taylor',
    email: 'lisa.taylor@example.com',
    role: 'Editor',
    status: 'active',
    password: 'test123',
  },
  {
    id: '011',
    firstName: 'James',
    lastName: 'Moore',
    email: 'james.moore@example.com',
    role: 'Viewer',
    status: 'inactive',
    password: 'test123',
  },
  {
    id: '012',
    firstName: 'Patricia',
    lastName: 'Jackson',
    email: 'patricia.jackson@example.com',
    role: 'Editor',
    status: 'pending',
    password: 'test123',
  },
  {
    id: '013',
    firstName: 'Richard',
    lastName: 'White',
    email: 'richard.white@example.com',
    role: 'Admin',
    status: 'active',
    password: 'test123',
  },
  {
    id: '014',
    firstName: 'Jennifer',
    lastName: 'Harris',
    email: 'jennifer.harris@example.com',
    role: 'Viewer',
    status: 'inactive',
    password: 'test123',
  },
  {
    id: '015',
    firstName: 'Charles',
    lastName: 'Martin',
    email: 'charles.martin@example.com',
    role: 'Editor',
    status: 'active',
    password: 'test123',
  },
];

export const fake_availableBuckets = [
  {
    id: 'software-engineer',
    name: 'Software Engineer',
    description: 'Develops and maintains software applications',
  },
  {
    id: 'frontend-developer',
    name: 'Frontend Developer',
    description: 'Specializes in user interfaces and experiences',
  },
  {
    id: 'backend-developer',
    name: 'Backend Developer',
    description: 'Focuses on server-side logic and databases',
  },
  {
    id: 'fullstack-developer',
    name: 'Fullstack Developer',
    description: 'Works on both frontend and backend systems',
  },
  {
    id: 'devops-engineer',
    name: 'DevOps Engineer',
    description: 'Manages deployment, infrastructure, and operations',
  },
  {
    id: 'qa-engineer',
    name: 'QA Engineer',
    description: 'Ensures software quality through testing',
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    description: 'Analyzes and interprets complex data',
  },
  {
    id: 'ui-ux-designer',
    name: 'UI/UX Designer',
    description: 'Creates user interfaces and experiences',
  },
  {
    id: 'product-manager',
    name: 'Product Manager',
    description: 'Oversees product development and strategy',
  },
  {
    id: 'project-manager',
    name: 'Project Manager',
    description: 'Manages project timelines and resources',
  },
];

// Import allPermissions from constants to avoid duplication
import { allPermissions } from '@app/constants/constants';
export { allPermissions };

export const roles: RoleType[] = [
  {
    id: '1',
    name: 'Admin',
    permissions: {
      'User Management': [
        'user.create',
        'user.edit',
        'user.delete',
        'user.view',
        'user.assign_role',
        'user.assign_permission',
        'user.view_permissions',
      ],
      'Roles & Permissions': [
        'role.create',
        'role.edit',
        'role.delete',
        'role.view',
        'permission.view_all',
      ],
      Dashboards: ['dashboard.admin.view', 'dashboard.team_lead.view', 'dashboard.user.view'],
    },
  },
  {
    id: '2',
    name: 'CTO',
    permissions: {
      'User Management': ['user.view', 'user.assign_role'],
      'Roles & Permissions': ['role.view'],
      Dashboards: ['dashboard.admin.view'],
      'Evaluation & Promotions': [
        'evaluation.view',
        'evaluation.summary.view',
        'evaluation.report.download',
      ],
    },
  },
  {
    id: '3',
    name: 'Team Lead',
    permissions: {
      'User Management': ['user.view', 'user.edit'],
      Dashboards: ['dashboard.team_lead.view'],
      'Evaluation & Promotions': ['evaluation.create', 'evaluation.view', 'evaluation.comment'],
      Reports: ['report.user.view', 'report.user.summary'],
    },
  },
  {
    id: '4',
    name: 'User',
    permissions: {
      'User Management': ['user.view'],
      Dashboards: ['dashboard.user.view'],
      Reports: ['report.user.view'],
    },
  },
];

export const availableRoles = [
  { id: 'admin', name: 'Admin', description: 'Full system access' },
  { id: 'editor', name: 'Editor', description: 'Can edit content but not settings' },
  { id: 'viewer', name: 'Viewer', description: 'Read-only access' },
  { id: 'manager', name: 'Manager', description: 'Can manage users and content' },
  { id: 'contributor', name: 'Contributor', description: 'Can add content but not edit others' },
];

export const EXPERIENCE_LEVELS = [
  { value: 'intern', label: 'Intern (0-1 Yr.)' },
  { value: 'junior', label: 'Junior (1-2 Yr.)' },
  { value: 'medior', label: 'Medior (2-5 Yr.)' },
  { value: 'senior', label: 'Senior (5+ Yr.)' },
  { value: 'lead', label: 'Lead (8+ Yr.)' },
];
