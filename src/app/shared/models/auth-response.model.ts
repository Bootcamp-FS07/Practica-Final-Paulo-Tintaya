export interface AuthResponse {
  access_token: string;
  user?: {
    _id: string;
    username: string;
  };
}
