// Define la estructura de los datos del usuario
export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  docType: string;
  docNumber: string;
  birthDate: string; // Formato 'YYYY-MM-DD'
  gender: 'Masculino' | 'Femenino';
  about_me?: string; // El '?' indica que es opcional
  career?: string;
  profile_image_url?: string;
  roles?: string[]; // Añadido roles como opcional
  notifications?: any[]; // Añadido notifications como opcional
}

// Define la estructura de la respuesta de la API al hacer login
export interface LoginResponse {
  login_success: boolean;
  message: string;
  token: string;
  user: UserProfile; // La respuesta incluye el perfil del usuario
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