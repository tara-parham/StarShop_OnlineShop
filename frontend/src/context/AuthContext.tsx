/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api } from "../lib/api";
interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "customer";
}
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string;
  login: (email: string, password: string, name?: string) => Promise<User>;
  logout: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    api<{ user: User | null }>("/auth/me")
      .then((data) => setUser(data.user))
      .catch(() =>
        setError("Unable to check your session. Please sign in again."),
      )
      .finally(() => setLoading(false));
  }, []);
  async function login(email: string, password: string, name?: string) {
    const data = await api<{ user: User }>(
      `/auth/${name === undefined ? "login" : "register"}`,
      { method: "POST", body: JSON.stringify({ email, password, name }) },
    );
    setUser(data.user);
    setError("");
    return data.user;
  }
  async function logout() {
    try {
      await api("/auth/logout", { method: "POST" });
      setUser(null);
      setError("");
    } catch {
      setError("Unable to sign out. Please try again.");
    }
  }
  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth requires AuthProvider");
  return value;
}
