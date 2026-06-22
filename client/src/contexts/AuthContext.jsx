import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../lib/api.js";

const AuthContext = createContext(null);
const STORAGE_KEY = "resolveiq.auth";

function readStoredAuth() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { user: null, token: null };
  } catch {
    return { user: null, token: null };
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth);
  const [loading, setLoading] = useState(Boolean(auth.token));

  const persistAuth = useCallback((nextAuth) => {
    setAuth(nextAuth);
    if (nextAuth.token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function refreshMe() {
      if (!auth.token) {
        setLoading(false);
        return;
      }

      try {
        const data = await apiRequest("/auth/me", { token: auth.token });
        if (active) persistAuth({ token: auth.token, user: data.user });
      } catch {
        if (active) persistAuth({ token: null, user: null });
      } finally {
        if (active) setLoading(false);
      }
    }

    refreshMe();
    return () => {
      active = false;
    };
  }, [auth.token, persistAuth]);

  const login = useCallback(
    async (email, password) => {
      const data = await apiRequest("/auth/login", { method: "POST", body: { email, password } });
      persistAuth(data);
      return data.user;
    },
    [persistAuth]
  );

  const register = useCallback(
    async (payload) => {
      const data = await apiRequest("/auth/register", { method: "POST", body: payload });
      persistAuth(data);
      return data.user;
    },
    [persistAuth]
  );

  const logout = useCallback(() => {
    persistAuth({ token: null, user: null });
  }, [persistAuth]);

  const value = useMemo(
    () => ({
      user: auth.user,
      token: auth.token,
      loading,
      login,
      register,
      logout,
      isAuthenticated: Boolean(auth.token && auth.user)
    }),
    [auth, loading, login, logout, register]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
