import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchWithFallback } from '../services/fetchWithFallback';

const DEFAULT_WHATSAPP = '+8801633920928';
const DEFAULT_NOTICE = {
    enabled: false,
    text: '',
    link: '',
    bgColor: '#002B5B',
    textColor: '#ffffff',
    badgeText: 'বিজ্ঞপ্তি',
    speed: 6
};
const CACHE_KEY = '@public_settings';
const CACHE_TIME_KEY = '@public_settings_time';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes TTL

const PublicSettingsContext = createContext({
    whatsappNumber: DEFAULT_WHATSAPP,
    cleanWhatsAppDigits: '8801633920928',
    whatsappSchemeUrl: `whatsapp://send?phone=${DEFAULT_WHATSAPP}`,
    getWhatsAppUrl: () => `https://wa.me/8801633920928`,
    publicNotice: DEFAULT_NOTICE,
    refreshPublicSettings: () => {}
});

// Helper to sanitize phone digits for wa.me links
export const cleanDigits = (phone) => {
    if (!phone) return '8801633920928';
    let cleaned = String(phone).replace(/[^\d+]/g, '');
    if (cleaned.startsWith('+')) {
        cleaned = cleaned.substring(1);
    } else if (cleaned.startsWith('01') && cleaned.length === 11) {
        cleaned = '88' + cleaned;
    }
    return cleaned || '8801633920928';
};

export const PublicSettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(() => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (parsed) {
                    return {
                        whatsapp_number: parsed.whatsapp_number || DEFAULT_WHATSAPP,
                        public_notice: parsed.public_notice || DEFAULT_NOTICE
                    };
                }
            }
        } catch (e) {
            console.error('Error loading public settings cache:', e);
        }
        return { whatsapp_number: DEFAULT_WHATSAPP, public_notice: DEFAULT_NOTICE };
    });

    const fetchSettings = useCallback(async (force = false) => {
        try {
            const url = `https://tuition-seba-backend-1.onrender.com/api/settings/public?_t=${Date.now()}`;
            const res = await fetchWithFallback(url);
            if (res.ok) {
                const data = await res.json();
                if (data) {
                    const normalizedData = {
                        whatsapp_number: data.whatsapp_number || DEFAULT_WHATSAPP,
                        public_notice: data.public_notice || DEFAULT_NOTICE
                    };
                    setSettings(normalizedData);
                    localStorage.setItem(CACHE_KEY, JSON.stringify(normalizedData));
                    localStorage.setItem(CACHE_TIME_KEY, String(Date.now()));
                }
            }
        } catch (err) {
            console.error('Background fetch of public settings failed:', err);
        }
    }, []);

    useEffect(() => {
        // Fetch fresh settings on mount immediately
        fetchSettings(true);

        // Listen for internal admin updates in the current window
        const handleSettingsUpdated = () => fetchSettings(true);
        window.addEventListener('publicSettingsUpdated', handleSettingsUpdated);

        // Listen for admin updates from other open tabs
        const handleStorageChange = (e) => {
            if (e.key === '@admin_settings_updated' || e.key === CACHE_KEY) {
                fetchSettings(true);
            }
        };
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('publicSettingsUpdated', handleSettingsUpdated);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [fetchSettings]);

    const whatsappNumber = settings.whatsapp_number || DEFAULT_WHATSAPP;
    const digits = cleanDigits(whatsappNumber);
    const publicNotice = settings.public_notice || DEFAULT_NOTICE;

    const getWhatsAppUrl = useCallback((message = '') => {
        if (message && message.trim()) {
            return `https://wa.me/${digits}?text=${encodeURIComponent(message.trim())}`;
        }
        return `https://wa.me/${digits}`;
    }, [digits]);

    const whatsappSchemeUrl = `whatsapp://send?phone=${whatsappNumber.startsWith('+') ? whatsappNumber : (whatsappNumber.startsWith('88') ? `+${whatsappNumber}` : `+88${whatsappNumber}`)}`;

    const value = {
        whatsappNumber,
        cleanWhatsAppDigits: digits,
        whatsappSchemeUrl,
        getWhatsAppUrl,
        publicNotice,
        refreshPublicSettings: () => fetchSettings(true)
    };

    return (
        <PublicSettingsContext.Provider value={value}>
            {children}
        </PublicSettingsContext.Provider>
    );
};

export const usePublicSettings = () => useContext(PublicSettingsContext);
export default PublicSettingsContext;
