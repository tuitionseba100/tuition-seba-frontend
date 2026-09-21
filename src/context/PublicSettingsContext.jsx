import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchWithFallback } from '../services/fetchWithFallback';

const DEFAULT_WHATSAPP = '+8801633920928';
const CACHE_KEY = '@public_settings';
const CACHE_TIME_KEY = '@public_settings_time';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes TTL

const PublicSettingsContext = createContext({
    whatsappNumber: DEFAULT_WHATSAPP,
    cleanWhatsAppDigits: '8801633920928',
    whatsappSchemeUrl: `whatsapp://send?phone=${DEFAULT_WHATSAPP}`,
    getWhatsAppUrl: () => `https://wa.me/8801633920928`,
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
                if (parsed && parsed.whatsapp_number) {
                    return parsed;
                }
            }
        } catch (e) {
            console.error('Error loading public settings cache:', e);
        }
        return { whatsapp_number: DEFAULT_WHATSAPP };
    });

    const fetchSettings = useCallback(async (force = false) => {
        try {
            const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
            const isFresh = cachedTime && (Date.now() - Number(cachedTime) < CACHE_TTL_MS);

            // If cache is still fresh and not forced, skip network request entirely
            if (isFresh && !force) {
                return;
            }

            const res = await fetchWithFallback('https://tuition-seba-backend-1.onrender.com/api/settings/public');
            if (res.ok) {
                const data = await res.json();
                if (data && data.whatsapp_number) {
                    setSettings(data);
                    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
                    localStorage.setItem(CACHE_TIME_KEY, String(Date.now()));
                }
            }
        } catch (err) {
            console.error('Background fetch of public settings failed:', err);
        }
    }, []);

    useEffect(() => {
        // Background fetch on mount (non-blocking)
        fetchSettings();

        // Listen for internal admin updates or cross-tab updates
        const handleSettingsUpdated = () => fetchSettings(true);
        window.addEventListener('publicSettingsUpdated', handleSettingsUpdated);
        window.addEventListener('storage', handleSettingsUpdated);

        return () => {
            window.removeEventListener('publicSettingsUpdated', handleSettingsUpdated);
            window.removeEventListener('storage', handleSettingsUpdated);
        };
    }, [fetchSettings]);

    const whatsappNumber = settings.whatsapp_number || DEFAULT_WHATSAPP;
    const digits = cleanDigits(whatsappNumber);

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
