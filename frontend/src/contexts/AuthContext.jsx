import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI, userAuth } from "../services/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    const userToken = localStorage.getItem("userToken");

    if (adminToken) setUser({ token: adminToken, role: "admin" });
    else if (userToken) setUser({ token: userToken, role: "user" });

    setLoading(false);
  }, []);

  const adminLogin = async (email, password) => {
    try {
      const { data } = await authAPI.login(email, password);
      localStorage.setItem("adminToken", data.token);
      setUser({ token: data.token, role: "admin" });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || "Admin login failed",
      };
    }
  };

  const register = async (name, email, phone, password, lat, lng) => {
    try {
      const payload = {
        name,
        email,
        phone,
        password,
        location: {
          type: "Point",
          coordinates: lat && lng ? [lng, lat] : [],
        },
      };

      console.log("Payload being sent:", payload);

      // FIX: Pass individual parameters instead of the entire payload object
      const response = await userAuth.register(
        payload.name,
        payload.email, 
        payload.phone,
        payload.password,
        payload.location
      );
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Registration Error:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.msg || error.response?.data?.error || "Registration failed",
      };
    }
  };

  const userLogin = async (email, password) => {
    try {
      const { data } = await userAuth.login(email, password);
      localStorage.setItem("userToken", data.token);
      setUser({ token: data.token, role: "user" });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || "User login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        adminLogin,
        userLogin,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
        role: user?.role || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};