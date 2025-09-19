export interface SessionData {
  deviceFingerprint: string;
  ipAddress: string;
  location: string;
  userAgent: string;
  screenResolution?: string;
  timezone?: string;
  language?: string;
  platform?: string;
}

export interface RiskFactors {
  deviceChange: boolean;
  locationChange: boolean;
  ipChange: boolean;
  unusualTime: boolean;
  rapidRequests: boolean;
  suspiciousUserAgent: boolean;
  [key: string]: any;
}

export interface RiskEvent {
  eventType: string;
  riskFactors: RiskFactors;
  calculatedRisk: number;
  timestamp: Date;
}

export interface UserSession {
  id: string;
  userId: string;
  jwtTokenId: string;
  riskScore: number;
  deviceFingerprint: string;
  ipAddress: string;
  location: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface RefreshTokenRequest {
  sessionData: SessionData;
  previousSessionId?: string;
}
