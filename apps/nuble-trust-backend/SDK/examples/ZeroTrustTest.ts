/**
 * Zero Trust System Test
 * 
 * This file demonstrates how to test the zero trust authentication system
 * and shows various risk scenarios.
 */

import { DeviceFingerprint } from '../utils/device-fingerprint';
import { RiskCalculator } from '../../libs/risk-calculator';
import { SessionData, UserSession } from '../../types/session';

export class ZeroTrustTest {
  /**
   * Test device fingerprinting
   */
  static async testDeviceFingerprint() {
    console.log('🔍 Testing Device Fingerprinting...');
    
    try {
      const fingerprint = await DeviceFingerprint.generateFingerprint();
      console.log('✅ Device fingerprint generated:', {
        fingerprint: fingerprint.deviceFingerprint.substring(0, 16) + '...',
        ipAddress: fingerprint.ipAddress,
        location: fingerprint.location,
        userAgent: fingerprint.userAgent.substring(0, 50) + '...',
        screenResolution: fingerprint.screenResolution,
        timezone: fingerprint.timezone,
        language: fingerprint.language,
        platform: fingerprint.platform
      });
      
      return fingerprint;
    } catch (error) {
      console.error('❌ Device fingerprinting failed:', error);
      return null;
    }
  }

  /**
   * Test browser capabilities detection
   */
  static testBrowserCapabilities() {
    console.log('🔍 Testing Browser Capabilities...');
    
    try {
      const capabilities = DeviceFingerprint.getBrowserCapabilities();
      console.log('✅ Browser capabilities detected:', capabilities);
      return capabilities;
    } catch (error) {
      console.error('❌ Browser capabilities detection failed:', error);
      return null;
    }
  }

  /**
   * Test risk calculation scenarios
   */
  static testRiskScenarios() {
    console.log('🔍 Testing Risk Calculation Scenarios...');

    // Scenario 1: Normal session (low risk)
    const normalSession: SessionData = {
      deviceFingerprint: 'normal-device-fingerprint-123',
      ipAddress: '192.168.1.100',
      location: 'New York, NY, US',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      screenResolution: '1920x1080',
      timezone: 'America/New_York',
      language: 'en-US',
      platform: 'Win32'
    };

    const previousSession: UserSession = {
      id: 'session-123',
      userId: 'user-456',
      jwtTokenId: 'jwt-789',
      riskScore: 10,
      deviceFingerprint: 'normal-device-fingerprint-123',
      ipAddress: '192.168.1.100',
      location: 'New York, NY, US',
      createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      expiresAt: new Date(Date.now() + 86400000) // 1 day from now
    };

    const { riskScore: normalRisk, riskFactors: normalFactors } = RiskCalculator.calculateRiskScore(
      normalSession,
      previousSession,
      []
    );

    console.log('✅ Normal session risk:', {
      riskScore: normalRisk,
      riskLevel: RiskCalculator.getRiskLevel(normalRisk),
      riskFactors: normalFactors,
      accessDecision: RiskCalculator.shouldAllowAccess(normalRisk)
    });

    // Scenario 2: Device change (medium risk)
    const deviceChangeSession: SessionData = {
      ...normalSession,
      deviceFingerprint: 'new-device-fingerprint-456',
      ipAddress: '192.168.1.200'
    };

    const { riskScore: deviceChangeRisk, riskFactors: deviceChangeFactors } = RiskCalculator.calculateRiskScore(
      deviceChangeSession,
      previousSession,
      []
    );

    console.log('⚠️ Device change session risk:', {
      riskScore: deviceChangeRisk,
      riskLevel: RiskCalculator.getRiskLevel(deviceChangeRisk),
      riskFactors: deviceChangeFactors,
      accessDecision: RiskCalculator.shouldAllowAccess(deviceChangeRisk)
    });

    // Scenario 3: High risk session (location + device change)
    const highRiskSession: SessionData = {
      ...normalSession,
      deviceFingerprint: 'suspicious-device-fingerprint-789',
      ipAddress: '10.0.0.1',
      location: 'Unknown Location, XX, XX',
      userAgent: 'curl/7.68.0' // Suspicious user agent
    };

    const { riskScore: highRisk, riskFactors: highRiskFactors } = RiskCalculator.calculateRiskScore(
      highRiskSession,
      previousSession,
      []
    );

    console.log('🚨 High risk session:', {
      riskScore: highRisk,
      riskLevel: RiskCalculator.getRiskLevel(highRisk),
      riskFactors: highRiskFactors,
      accessDecision: RiskCalculator.shouldAllowAccess(highRisk)
    });

    // Scenario 4: Critical risk session (multiple factors)
    const criticalRiskSession: SessionData = {
      ...normalSession,
      deviceFingerprint: 'bot-device-fingerprint-999',
      ipAddress: '1.2.3.4',
      location: 'High Risk Country, XX, XX',
      userAgent: 'python-requests/2.25.1', // Bot user agent
      timezone: 'UTC'
    };

    const { riskScore: criticalRisk, riskFactors: criticalFactors } = RiskCalculator.calculateRiskScore(
      criticalRiskSession,
      previousSession,
      []
    );

    console.log('🔥 Critical risk session:', {
      riskScore: criticalRisk,
      riskLevel: RiskCalculator.getRiskLevel(criticalRisk),
      riskFactors: criticalFactors,
      accessDecision: RiskCalculator.shouldAllowAccess(criticalRisk)
    });

    return {
      normal: { riskScore: normalRisk, riskFactors: normalFactors },
      deviceChange: { riskScore: deviceChangeRisk, riskFactors: deviceChangeFactors },
      highRisk: { riskScore: highRisk, riskFactors: highRiskFactors },
      critical: { riskScore: criticalRisk, riskFactors: criticalFactors }
    };
  }

  /**
   * Test risk level thresholds
   */
  static testRiskThresholds() {
    console.log('🔍 Testing Risk Level Thresholds...');

    const testScores = [0, 15, 30, 45, 60, 75, 80, 90, 100];

    testScores.forEach(score => {
      const level = RiskCalculator.getRiskLevel(score);
      const decision = RiskCalculator.shouldAllowAccess(score);
      
      console.log(`Score ${score}: ${level} - ${decision.allowed ? '✅ ALLOWED' : '❌ BLOCKED'} ${decision.reason ? `(${decision.reason})` : ''}`);
    });
  }

  /**
   * Run all tests
   */
  static async runAllTests() {
    console.log('🚀 Starting Zero Trust System Tests...\n');

    // Test device fingerprinting
    await this.testDeviceFingerprint();
    console.log('');

    // Test browser capabilities
    this.testBrowserCapabilities();
    console.log('');

    // Test risk scenarios
    this.testRiskScenarios();
    console.log('');

    // Test risk thresholds
    this.testRiskThresholds();
    console.log('');

    console.log('✅ All tests completed!');
  }

  /**
   * Simulate a real-world scenario
   */
  static async simulateRealWorldScenario() {
    console.log('🌍 Simulating Real-World Zero Trust Scenario...\n');

    // Step 1: User logs in from their home
    console.log('1. User logs in from home device...');
    const homeFingerprint = await DeviceFingerprint.generateFingerprint();
    console.log(`   Device: ${homeFingerprint.deviceFingerprint.substring(0, 16)}...`);
    console.log(`   Location: ${homeFingerprint.location}`);
    console.log(`   IP: ${homeFingerprint.ipAddress}`);
    console.log('   ✅ Login successful (low risk)\n');

    // Step 2: User tries to access from different location
    console.log('2. User tries to access from different location...');
    const travelFingerprint = {
      ...homeFingerprint,
      ipAddress: '203.0.113.1',
      location: 'London, England, GB',
      deviceFingerprint: homeFingerprint.deviceFingerprint // Same device
    };

    const homeSession: UserSession = {
      id: 'home-session',
      userId: 'user-123',
      jwtTokenId: 'jwt-home',
      riskScore: 5,
      deviceFingerprint: homeFingerprint.deviceFingerprint,
      ipAddress: homeFingerprint.ipAddress,
      location: homeFingerprint.location,
      createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
      expiresAt: new Date(Date.now() + 86400000)
    };

    const { riskScore: travelRisk, riskFactors: travelFactors } = RiskCalculator.calculateRiskScore(
      travelFingerprint,
      homeSession,
      []
    );

    console.log(`   Device: ${travelFingerprint.deviceFingerprint.substring(0, 16)}...`);
    console.log(`   Location: ${travelFingerprint.location}`);
    console.log(`   IP: ${travelFingerprint.ipAddress}`);
    console.log(`   Risk Score: ${travelRisk}`);
    console.log(`   Risk Level: ${RiskCalculator.getRiskLevel(travelRisk)}`);
    console.log(`   Risk Factors: ${Object.keys(travelFactors).filter(k => travelFactors[k]).join(', ')}`);
    
    const travelDecision = RiskCalculator.shouldAllowAccess(travelRisk);
    console.log(`   ${travelDecision.allowed ? '✅ Access allowed' : '❌ Access denied'}: ${travelDecision.reason}\n`);

    // Step 3: Suspicious activity detected
    console.log('3. Suspicious bot activity detected...');
    const botFingerprint = {
      ...homeFingerprint,
      deviceFingerprint: 'bot-fingerprint-12345',
      ipAddress: '198.51.100.1',
      location: 'Unknown Location, XX, XX',
      userAgent: 'python-requests/2.25.1'
    };

    const { riskScore: botRisk, riskFactors: botFactors } = RiskCalculator.calculateRiskScore(
      botFingerprint,
      homeSession,
      []
    );

    console.log(`   Device: ${botFingerprint.deviceFingerprint.substring(0, 16)}...`);
    console.log(`   Location: ${botFingerprint.location}`);
    console.log(`   IP: ${botFingerprint.ipAddress}`);
    console.log(`   User Agent: ${botFingerprint.userAgent}`);
    console.log(`   Risk Score: ${botRisk}`);
    console.log(`   Risk Level: ${RiskCalculator.getRiskLevel(botRisk)}`);
    console.log(`   Risk Factors: ${Object.keys(botFactors).filter(k => botFactors[k]).join(', ')}`);
    
    const botDecision = RiskCalculator.shouldAllowAccess(botRisk);
    console.log(`   ${botDecision.allowed ? '✅ Access allowed' : '❌ Access denied'}: ${botDecision.reason}\n`);

    console.log('🎯 Zero Trust system successfully detected and blocked suspicious activity!');
  }
}

// Export for use in browser console or tests
if (typeof window !== 'undefined') {
  (window as any).ZeroTrustTest = ZeroTrustTest;
}

export default ZeroTrustTest;
