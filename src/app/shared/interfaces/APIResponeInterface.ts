export interface ApiBaseResponse {
  isSuccessful: boolean;
  statusCode: string;
  messages: string | null;
  payload: any[];
} 