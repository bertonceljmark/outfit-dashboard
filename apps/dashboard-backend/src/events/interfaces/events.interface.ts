export interface IEvent {
  id?: string;
  name: string;
  description: string;
  type: 'crosspromo' | 'liveops' | 'app' | 'ads';
  priority: number;
}
