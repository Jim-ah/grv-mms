/// <reference types="vite/client" />
declare module 'jwt-decode' {
    export default function jwtDecode<T = unknown>(token: string): T;
}
