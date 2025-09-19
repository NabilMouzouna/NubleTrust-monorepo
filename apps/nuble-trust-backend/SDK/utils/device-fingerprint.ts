import { SessionData } from '../../types/session';

export class DeviceFingerprint {
  /**
   * Generate a comprehensive device fingerprint
   */
  static async generateFingerprint(): Promise<SessionData> {
    const fingerprint = {
      deviceFingerprint: await this.generateDeviceFingerprint(),
      ipAddress: await this.getPublicIP(),
      location: await this.getLocation(),
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
    };

    return fingerprint;
  }

  /**
   * Generate a unique device fingerprint based on browser characteristics
   */
  private static async generateDeviceFingerprint(): Promise<string> {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      navigator.platform,
      navigator.cookieEnabled,
      typeof(Storage) !== 'undefined',
    ];

    // Add canvas fingerprint
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
      components.push(canvas.toDataURL());
    }

    // Add WebGL fingerprint
    try {
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          components.push(gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL));
          components.push(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
        }
      }
    } catch (e) {
      // WebGL not available
    }

    // Add audio context fingerprint
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const analyser = audioContext.createAnalyser();
      const gainNode = audioContext.createGain();
      const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);

      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(10000, audioContext.currentTime);

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      oscillator.connect(analyser);
      analyser.connect(scriptProcessor);
      scriptProcessor.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(0);
      const fingerprint = analyser.frequencyBinCount;
      oscillator.stop();
      audioContext.close();
      
      components.push(fingerprint.toString());
    } catch (e) {
      // Audio context not available
    }

    // Hash the components
    const fingerprintString = components.join('|');
    return await this.hashString(fingerprintString);
  }

  /**
   * Get public IP address
   */
  private static async getPublicIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'unknown';
    }
  }

  /**
   * Get approximate location based on IP
   */
  private static async getLocation(): Promise<string> {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return `${data.city}, ${data.region}, ${data.country}`;
    } catch (error) {
      return 'unknown';
    }
  }

  /**
   * Hash a string using Web Crypto API
   */
  private static async hashString(str: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Get browser capabilities for additional fingerprinting
   */
  static getBrowserCapabilities(): Record<string, any> {
    return {
      cookies: navigator.cookieEnabled,
      localStorage: typeof(Storage) !== 'undefined',
      sessionStorage: typeof(Storage) !== 'undefined',
      indexedDB: 'indexedDB' in window,
      webGL: this.hasWebGL(),
      webRTC: this.hasWebRTC(),
      geolocation: 'geolocation' in navigator,
      notifications: 'Notification' in window,
      serviceWorker: 'serviceWorker' in navigator,
      pushManager: 'PushManager' in window,
      touch: 'ontouchstart' in window,
      doNotTrack: navigator.doNotTrack,
      hardwareConcurrency: navigator.hardwareConcurrency,
      maxTouchPoints: navigator.maxTouchPoints,
      deviceMemory: (navigator as any).deviceMemory,
    };
  }

  private static hasWebGL(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
      return false;
    }
  }

  private static hasWebRTC(): boolean {
    return !!(window.RTCPeerConnection || (window as any).webkitRTCPeerConnection || (window as any).mozRTCPeerConnection);
  }
}
