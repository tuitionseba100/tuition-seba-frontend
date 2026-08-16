import { axiosWithFallback as axios } from "../services/fetchWithFallback";

export const checkDayStarted = async () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
        const response = await axios.get("https://tuition-seba-backend-a0pb.onrender.com/api/attendance/is-day-started", {
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
