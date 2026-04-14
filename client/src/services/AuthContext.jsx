// Provides user + token to the whole app so any component can check if logged in

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(null);

  // On first load, restore session from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser  = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Called after a successful login
  function loginUser(tokenVal, userData) {
    localStorage.setItem("token", tokenVal);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(tokenVal);
    setUser(userData);
  }

  // Called on logout
  function logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — any component can do: const { user } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
