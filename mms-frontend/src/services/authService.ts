import api from './api';

export async function login({ email, password }: {email:string, password:string}) {
    const { data } = await api.post<{ token: string }>('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    // tell the world we just logged in
    window.dispatchEvent(new Event('login'));
}

export function logout() {
    localStorage.removeItem('token');
    // tell the world we just logged out
    window.dispatchEvent(new Event('logout'));
}
