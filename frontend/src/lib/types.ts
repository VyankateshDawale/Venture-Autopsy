export interface TimelineEvent {
  id?: string;
  type?: string;
  event_type: string;
  title: string;
  description?: string;
  timestamp?: string;
  created_at?: string;
  payload?: any;
}
