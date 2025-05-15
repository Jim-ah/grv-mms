// src/services/userService.ts
import api from "./api";
import {AxiosResponse} from "axios";

export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

// Fetch all users
export const getUsers = () => api.get<User[]>("/users");

// Fetch one user by ID
export const getUserById = (id: string) => api.get<User>(`/users/${id}`);

// Create a new user
export const createUser = (data: {
    name: string;
    email: string;
    password: string;
    role: string;
}) => api.post<User>("/users", data);

// Update an existing user
export const updateUser = (id: string, data: Partial<Pick<User, "name" | "email" | "role">>) =>
    api.put<User>(`/users/${id}`, data);

// Delete a user
export const deleteUser = (id: string) => api.delete(`/users/${id}`);

// Delete all users
export const deleteAllUsers = () => api.delete("/users");
export const getTechnicians = (): Promise<AxiosResponse<User[]>> =>
    api.get<User[]>('/users/technicians');