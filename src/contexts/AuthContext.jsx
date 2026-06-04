import { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import { login as apiLogin, register as apiRegister, guestLogin as apiGuestLogin, getMe } from "../api/auth";

const AuthContext = createContext(null);
const TOKEN_KEY = "miaomath_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    const data = await getMe(token);
    if (data.success) {
      setUser(data.user);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  const doLogin = useCallback(async (username, password) => {
    const data = await apiLogin(username, password);
    if (data.success) {
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser({ id: data.user?.id || 0, username: data.username, is_guest: false });
    }
    return data;
  }, []);

  const doRegister = useCallback(async (username, password) => {
    const data = await apiRegister(username, password);
    if (data.success) {
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser({ id: data.user?.id || 0, username: data.username, is_guest: false });
    }
    return data;
  }, []);

  const doGuestLogin = useCallback(async () => {
    const data = await apiGuestLogin();
    if (data.success) {
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser({ id: -1, username: "游客", is_guest: true });
    }
    return data;
  }, []);

  const doLogout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const getToken = useCallback(() => localStorage.getItem(TOKEN_KEY), []);

  const isGuest = useMemo(() => user?.is_guest === true, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, isGuest, doLogin, doRegister, doGuestLogin, doLogout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
