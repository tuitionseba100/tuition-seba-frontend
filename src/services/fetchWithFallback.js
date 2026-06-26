import axios from 'axios';

const PRIMARY_DOMAIN = 'tuition-seba-backend-1.onrender.com';
const FALLBACK_DOMAIN = 'tuition-seba-backend-production.up.railway.app';

// ─── For native fetch() calls ───
export async function fetchWithFallback(input, init) {
    const inputStr = typeof input === 'string' ? input : input.toString();

    if (inputStr.includes(PRIMARY_DOMAIN)) {
        try {
            const response = await fetch(input, init);

            // Check if it is a temporary Gateway/Service failure
            if (response.status === 502 || response.status === 503 || response.status === 504) {
                throw new Error(`Server connection error: status ${response.status}`);
            }

            return response;
        } catch (error) {
            console.log('Primary Render backend failed, retrying via Railway...', error);
            const fallbackInput = inputStr.replace(PRIMARY_DOMAIN, FALLBACK_DOMAIN);
            return await fetch(fallbackInput, init);
        }
    }

    return await fetch(input, init);
}

// ─── For axios calls ───
const axiosWithFallback = axios.create();

axiosWithFallback.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config;

        // Only retry once and only for our primary backend
        if (config && !config._retryFallback) {
            const url = config.url || '';
            const baseURL = config.baseURL || '';
            const fullUrl = url.startsWith('http') ? url : baseURL + url;

            if (fullUrl.includes(PRIMARY_DOMAIN)) {
                const status = error.response?.status;

                // Retry on network errors or 502/503/504
                if (!error.response || status === 502 || status === 503 || status === 504) {
                    config._retryFallback = true;

                    // Replace domain in url
                    if (config.url && config.url.includes(PRIMARY_DOMAIN)) {
                        config.url = config.url.replace(PRIMARY_DOMAIN, FALLBACK_DOMAIN);
                    }
                    // Replace domain in baseURL
                    if (config.baseURL && config.baseURL.includes(PRIMARY_DOMAIN)) {
                        config.baseURL = config.baseURL.replace(PRIMARY_DOMAIN, FALLBACK_DOMAIN);
                    }

                    console.log('Primary Render backend failed, retrying via Railway...');
                    return axiosWithFallback(config);
                }
            }
        }

        return Promise.reject(error);
    }
);

export { axiosWithFallback };
