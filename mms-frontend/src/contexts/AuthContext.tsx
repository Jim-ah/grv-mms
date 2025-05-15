import  {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react';

interface User { id: string; role: string; }
interface AuthContextType { user: User | null; }

const AuthContext = createContext<AuthContextType>({ user: null });

/** Parse the JWT payload (middle segment) */
export function parseJwt<T>(token: string): T {
    const base64 = token.split('.')[1]
        .replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
        atob(base64)
            .split('')
            .map(c => '%' + ('00'+c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );
    return JSON.parse(json) as T;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User|null>(null);

    // function to refresh user from localStorage
    const updateUser = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUser(null);
            return;
        }
        try {
            const { id, role } = parseJwt<{ id: string; role: string }>(token);
            setUser({ id, role });
        } catch {
            setUser(null);
        }
    };

    useEffect(() => {
        // on mount, and whenever login/logout events fire:
        updateUser();
        window.addEventListener('login', updateUser);
        window.addEventListener('logout', updateUser);
        return () => {
            window.removeEventListener('login', updateUser);
            window.removeEventListener('logout', updateUser);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
