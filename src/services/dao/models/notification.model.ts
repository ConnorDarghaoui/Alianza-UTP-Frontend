export interface Notification {
  id: number;
  message: string;
  type: 'info' | 'warning' | 'event_reminder';
  is_read: boolean;
  created_at: string;
  link?: string; // Un enlace opcional para ir a la actividad/club relacionado
}