import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import styles from "../styles/UserRegister.module.css";

const UserRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { name, email, phone, password } = formData;

    if (!name || !email || !password) {
      alert("Name, email, and password are required");
      setLoading(false);
      return;
    }

    const getLocation = () =>
      new Promise((resolve) => {
        if (!navigator.geolocation) return resolve(null);
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => resolve(null),
          { enableHighAccuracy: true, timeout: 8000 }
        );
      });

    try {
      const position = await getLocation();
      const lat = position?.lat;
      const lng = position?.lng;

      const result = await register(name, email, phone, password, lat, lng);

      if (result.success) {
        alert("Registration successful! Please login.");
        navigate("/user/login");
      } else {
        alert(result.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.cardContainer}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <div className={styles.logoWrapper}>
          <div className={styles.logo}>SI</div>
        </div>

        {/* Header */}
        <h2 className={styles.title}>Create Account</h2>

        {/* Form */}
        <motion.form
          className={styles.form}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Name */}
          <div className={styles.inputGroup}>
            <label>Name</label>
            <input
              type="text"
              required
              className={styles.inputField}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Email */}
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              required
              className={styles.inputField}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Phone */}
          <div className={styles.inputGroup}>
            <label>Phone</label>
            <input
              type="text"
              className={styles.inputField}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          {/* Password */}
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              required
              className={styles.inputField}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {/* Submit button */}
          <button type="submit" disabled={loading} className={styles.btnPrimary}>
            {loading ? "Registering..." : "Register"}
          </button>
        </motion.form>

        {/* Footer */}
        <div className={styles.footer}>
          <p>
            Already have an account?{" "}
            <Link to="/user/login" className={styles.registerLink}>
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default UserRegister;
