import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
    try {
        const response = await axiosInstance.post("/auth/signup", signupData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const login = async (loginData) => {
    try {
        const response = await axiosInstance.post("/auth/login", loginData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
    return response.data;
}

export const getAuthUser = async() => {
    try {
        const res =  await axiosInstance.get("/auth/me");  
        return res.data;
    } catch (error) {
        console.log("Error in getAuthUser", error);
        return null; // Return null if there's an error (e.g., not authenticated)
    }
}

export const completeOnboarding = async (userData) => {
    try {
        const response = await axiosInstance.post("/auth/onboarding", userData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getUserFriends = async () => {
    try {
        const response = await axiosInstance.get("/users/friends");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getRecommendedUsers = async () => {
    try {
        const response = await axiosInstance.get("/users");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getOutgoingFriendReqs() {
    const response = await axiosInstance.get("/users/outgoing-friend-requests");
    return response.data;
}

export async function sendFriendRequest(userId) {
    const response = await axiosInstance.post(`/users/friend-request/${userId}`);
    return response.data;
}

export async function getFriendRequests() {
    const response = await axiosInstance.get("/users/friend-requests");
    return response.data;
}

export async function acceptFriendRequest(requestId) {
    const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
    return response.data;
}

export async function getStreamToken() {
    const response = await axiosInstance.get("/chat/token");
    return { token: response.data.token };
}

