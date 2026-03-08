import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AuthContextType, AuthUser } from "../types";

export const AuthContext = createContext<AuthContextType | null>(null);

const USERS_KEY = "apexlog_users";
const SESSION_KEY = "apexlog_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [user]);

  const getUsers = (): Record<string, { password: string; user: AuthUser }> => {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const signup = (name: string, email: string, password: string) => {
    if (!name.trim() || !email.trim() || !password.trim())
      return { success: false, error: "All fields are required." };
    if (password.length < 6)
      return {
        success: false,
        error: "Password must be at least 6 characters.",
      };

    const users = getUsers();
    const key = email.toLowerCase();
    if (users[key])
      return {
        success: false,
        error: "An account with this email already exists.",
      };

    const newUser: AuthUser = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      goal: "Build Muscle",
      height: "",
      weight: "",
      joinedDate: new Date().toISOString(),
    };

    users[key] = { password, user: newUser };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    // Initialize empty history for new user
    localStorage.setItem(`apexlog_history_${newUser.id}`, JSON.stringify([]));

    setUser(newUser);
    return { success: true };
  };

  const login = (email: string, password: string) => {
    if (!email.trim() || !password.trim())
      return { success: false, error: "Please enter your email and password." };

    const users = getUsers();
    const key = email.toLowerCase();
    const record = users[key];

    if (!record)
      return { success: false, error: "No account found with this email." };
    if (record.password !== password)
      return { success: false, error: "Incorrect password." };

    setUser(record.user);
    return { success: true };
  };

  const logout = () => setUser(null);

  const updateProfile = (data: Partial<AuthUser>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    const users = getUsers();
    const key = user.email.toLowerCase();
    if (users[key]) {
      users[key].user = updated;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  };

  // Each user gets their own history key — new users start with empty []
  const historyKey = user
    ? `apexlog_history_${user.id}`
    : "apexlog_history_guest";

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        historyKey,
        signup,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
