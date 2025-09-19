import { RiskFactors, SessionData, UserSession } from '@/types/session';

export class RiskCalculator {
  private static readonly RISK_WEIGHTS = {
    deviceChange: 30,
    locationChange: 25,
    ipChange: 20,
    unusualTime: 15,
    rapidRequests: 10,
    suspiciousUserAgent: 10,
    newDevice: 40,
    highRiskLocation: 35,
    vpnDetected: 25,
  };

  private static readonly RISK_THRESHOLDS = {
    LOW: 30,
    MEDIUM: 60,
    HIGH: 80,
    CRITICAL: 90,
  };

  /**
   * Calculate risk score based on current session data and previous session
   */
  static calculateRiskScore(
    currentSession: SessionData,
    previousSession?: UserSession,
    riskEvents: any[] = []
  ): { riskScore: number; riskFactors: RiskFactors } {
    const riskFactors: RiskFactors = {
      deviceChange: false,
      locationChange: false,
      ipChange: false,
      unusualTime: false,
      rapidRequests: false,
      suspiciousUserAgent: false,
    };

    let totalRisk = 0;

    // Check for device fingerprint changes
    if (previousSession && currentSession.deviceFingerprint !== previousSession.deviceFingerprint) {
      riskFactors.deviceChange = true;
      totalRisk += this.RISK_WEIGHTS.deviceChange;
    }

    // Check for location changes
    if (previousSession && currentSession.location !== previousSession.location) {
      riskFactors.locationChange = true;
      totalRisk += this.RISK_WEIGHTS.locationChange;
    }

    // Check for IP address changes
    if (previousSession && currentSession.ipAddress !== previousSession.ipAddress) {
      riskFactors.ipChange = true;
      totalRisk += this.RISK_WEIGHTS.ipChange;
    }

    // Check for unusual access times (outside normal hours)
    const currentHour = new Date().getHours();
    if (currentHour < 6 || currentHour > 22) {
      riskFactors.unusualTime = true;
      totalRisk += this.RISK_WEIGHTS.unusualTime;
    }

    // Check for rapid requests (more than 5 in last minute)
    const recentEvents = riskEvents.filter(
      event => new Date().getTime() - new Date(event.createdAt).getTime() < 60000
    );
    if (recentEvents.length > 5) {
      riskFactors.rapidRequests = true;
      totalRisk += this.RISK_WEIGHTS.rapidRequests;
    }

    // Check for suspicious user agent
    if (this.isSuspiciousUserAgent(currentSession.userAgent)) {
      riskFactors.suspiciousUserAgent = true;
      totalRisk += this.RISK_WEIGHTS.suspiciousUserAgent;
    }

    // Additional risk factors
    if (!previousSession) {
      riskFactors.newDevice = true;
      totalRisk += this.RISK_WEIGHTS.newDevice;
    }

    // Check for high-risk locations (you can expand this)
    if (this.isHighRiskLocation(currentSession.location)) {
      riskFactors.highRiskLocation = true;
      totalRisk += this.RISK_WEIGHTS.highRiskLocation;
    }

    // Check for VPN/Proxy detection
    if (this.isVpnDetected(currentSession.ipAddress)) {
      riskFactors.vpnDetected = true;
      totalRisk += this.RISK_WEIGHTS.vpnDetected;
    }

    return {
      riskScore: Math.min(totalRisk, 100), // Cap at 100
      riskFactors,
    };
  }

  /**
   * Determine if access should be allowed based on risk score
   */
  static shouldAllowAccess(riskScore: number): { allowed: boolean; reason?: string } {
    if (riskScore >= this.RISK_THRESHOLDS.CRITICAL) {
      return { allowed: false, reason: 'Critical risk detected' };
    }
    
    if (riskScore >= this.RISK_THRESHOLDS.HIGH) {
      return { allowed: false, reason: 'High risk detected' };
    }
    
    if (riskScore >= this.RISK_THRESHOLDS.MEDIUM) {
      return { allowed: true, reason: 'Medium risk - additional verification recommended' };
    }
    
    return { allowed: true, reason: 'Low risk' };
  }

  /**
   * Get risk level description
   */
  static getRiskLevel(riskScore: number): string {
    if (riskScore >= this.RISK_THRESHOLDS.CRITICAL) return 'CRITICAL';
    if (riskScore >= this.RISK_THRESHOLDS.HIGH) return 'HIGH';
    if (riskScore >= this.RISK_THRESHOLDS.MEDIUM) return 'MEDIUM';
    return 'LOW';
  }

  private static isSuspiciousUserAgent(userAgent: string): boolean {
    const suspiciousPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /curl/i,
      /wget/i,
      /python/i,
      /java/i,
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(userAgent));
  }

  private static isHighRiskLocation(location: string): boolean {
    // You can implement your own logic here
    // For now, we'll consider certain countries as high risk
    const highRiskCountries = ['XX', 'YY']; // Replace with actual country codes
    return highRiskCountries.some(country => location.includes(country));
  }

  private static isVpnDetected(ipAddress: string): boolean {
    // This is a simplified check - in production, you'd use a VPN detection service
    // For now, we'll check for known VPN IP ranges or use a service like IPQualityScore
    return false; // Implement actual VPN detection logic
  }
}
