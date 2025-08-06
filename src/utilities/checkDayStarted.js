import axios from "axios";

export const checkDayStarted = async () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
        const response = await axios.get("https://tuition-seba-backend-1.onrender.com/api/attendance/is-day-started", {
            headers: {
                Authorization: token,
            },
        });

        return response.data?.isDayStarted || false;
    } catch (err) {
        console.error("Day check failed", err);
        return false;
    }
};
