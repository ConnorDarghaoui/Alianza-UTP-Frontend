export interface ClubContact {
  name: string;
  type: 'email' | 'phone';
  value: string;
  primary: boolean;
}

export interface Club {
  groupId: number;
  group_name: string;
  group_description: string;
  status: string;
  group_category: string;
  logo_url?: string;
  createdAt: string;
}

export interface ClubMember {
  userId: number;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
}

export interface JoinRequest {
  requestId: number;
  userId: number;
  userName: string;
  requestedAt: string;
  message: string;
}