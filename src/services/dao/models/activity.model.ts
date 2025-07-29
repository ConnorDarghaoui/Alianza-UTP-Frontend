export interface Activity {
  id: number; // o string
  activity_name: string;
  activity_description: string;
  max_participants: number;
  activity_type: 'Taller' | 'Conferencia' | 'Evento Social'; // Adapta a tus tipos
  start_date: string; // Formato de fecha-hora ISO, ej: '2025-07-24T19:00:00'
  end_time: string;
  location: string;
  club_id: number;
  club_name: string;
}