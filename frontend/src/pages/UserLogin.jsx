import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import styles from "../styles/UserLogin.module.css";

const UserLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { userLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await userLogin(formData.email, formData.password);
      if (result.success) {
        navigate("/");
      } else {
        alert(result.error || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("An error occurred. Please try again later.");
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
        <h2 className={styles.title}>Login to Your Account</h2>
        <p className={styles.subtitle}>
          Welcome back! Please enter your credentials.
        </p>

        {/* Form */}
        <motion.form
          className={styles.form}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              required
              className={styles.inputField}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              className={styles.inputField}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.btnPrimary}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </motion.form>

        {/* Footer */}
        <div className={styles.footer}>
          <p>
            Don't have an account?{" "}
            <Link to="/user/register" className={styles.registerLink}>
              Register here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default UserLogin;
