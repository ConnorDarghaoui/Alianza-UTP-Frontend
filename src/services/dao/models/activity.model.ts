export interface Activity {
  activityId: number;
  name: string;
  start_date: string;
  end_time: string;
  location: string;
  status: string;
  enroll_count?: number; // Opcional, ya que no todas las listas de actividades lo tendrán
  activity_description?: string; // Opcional, para detalles
  max_participants?: number; // Opcional, para detalles
  activity_type?: string; // Opcional, para detalles
  club_id?: number; // Opcional, para detalles
  club_name?: string; // Opcional, para detalles
}