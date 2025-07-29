export interface ClubContact {
  name: string;
  type: 'email' | 'phone';
  value: string;
  primary: boolean;
}

export interface Club {
  id: number; // o string, dependiendo de tu API
  name: string;
  description: string;
  status: string; // 'Activo', 'Inactivo', etc.
  category: string;
  logo_url?: string;
  member_count: number;
  contact_info: ClubContact[];
}

export interface ClubMember {
  user_id: number;
  username: string;
  full_name: string;
  role: 'Admin' | 'Member'; // Roles que maneje tu sistema
  join_date: string;
}

export interface JoinRequest {
  request_id: number;
  user_id: number;
  username: string;
  request_date: string;
}