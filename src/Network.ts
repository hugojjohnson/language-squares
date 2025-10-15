import axios, { AxiosError } from "axios";
import { RequestResponse } from "./Interfaces";


// Points at the BACKEND
export const baseURL = import.meta.env.VITE_BASE_URL;

// ? "http://localhost:3002/language-squares/"
// : "https://example.com/language-squares/");

const apiClient = axios.create({
    baseURL: baseURL,
    timeout: 1000000,
    headers: { 'Content-Type': 'application/json' }
});

export async function get<T>(path: string, params: Record<string, unknown>): Promise<RequestResponse<T>> {
    try {
        const response = await apiClient.get(path, { params })
        if (response.status >= 200 && response.status <= 299) {
            return { success: true, data: response.data }
        }
        return { success: false, data: response.data }
    } catch (err: unknown) {
        console.error(err)
        if (err instanceof AxiosError && err.response && err.response.data) {
            return { success: false, data: err.response.data };
        }
        if (err instanceof AxiosError && err.message) {
            return { success: false, data: err.message };
        }
        return { success: false, data: "An unknown error ocurred." };
    }
}

export async function post<T>(path: string, params?: Record<string, unknown>, body?: Record<string, unknown>): Promise<RequestResponse<T>> {
    try {
        const response = await apiClient.post(path, body, { params: params })
        if (response.status >= 200 && response.status <= 299) {
            return { success: true, data: response.data }
        }
        return { success: false, data: response.data }
    } catch (err: unknown) {
        console.error(err)
        if (err instanceof AxiosError && err.response && err.response.data) {
            return { success: false, data: err.response.data };
        }
        if (err instanceof AxiosError && err.message) {
            return { success: false, data: err.message };
        }
        return { success: false, data: "An unknown error ocurred." };
    }
}