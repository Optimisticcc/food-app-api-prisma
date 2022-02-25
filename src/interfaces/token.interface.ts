export interface ToKens {
  accessToken: string;
  refreshToken: string;
}


export interface SessionInformation {
  sessionId : string;
  email: string;
  valid: boolean;
  name: string;
  userId: string;
}