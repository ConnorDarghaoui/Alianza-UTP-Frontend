// Define la estructura de los datos del usuario
export interface UserProfile {
  userId: number;
  name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  doc_type: string;
  doc_number: string;
  birth_date: string;
  gender: string;
  about_me?: string;
  career?: string;
  profile_photo_url?: string;
  role: string[];
  unread_notifications: number;
}

// Define la estructura de la respuesta de la API al hacer login
export interface LoginResponse {
  login_success: boolean;
  message: string;
  token: string;
  user: UserProfile;
}

export interface AuthLoginRequestDTO {
  username?: string;
  email?: string;
  password: string;
}

export interface UserEnrollDTO {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  docType: string;
  docNumber: string;
  birthDate: string;
  gender: 'Masculino' | 'Femenino';
  password: string;
}

export interface SubmitPasswordResetRequestDTO {
  newPassword: string;
}

export interface VerifyCodeRequestDTO {
  verificationCode: string;
}