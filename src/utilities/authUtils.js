export const isTokenExpired = (token) => {
    if (!token) return true;

    try {
        const payloadBase64 = token.split('.')[1];
        const decodedJson = atob(payloadBase64);
        const decoded = JSON.parse(decodedJson);
        const exp = decoded.exp;

        if (!exp) return false; // If no exp claim, assume valid (or handle as needed)

        // JWT exp is in seconds, Date.now() is in milliseconds
        return (Date.now() >= exp * 1000);
    } catch (e) {
        return true; // If decoding fails, treat as expired/invalid
    }
};
