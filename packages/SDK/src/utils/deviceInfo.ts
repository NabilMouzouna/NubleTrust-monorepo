export type DeviceInfo = {
    userAgent: string;
    platform: string;
    language: string;
    timezone: string;
};

export function getDeviceInfo(): DeviceInfo {
    if (typeof window === 'undefined') {
        // Return a default or empty object when running on the server
        return {
            userAgent: 'server',
            platform: 'server',
            language: 'server',
            timezone: 'server',
        };
    }
    return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
}
