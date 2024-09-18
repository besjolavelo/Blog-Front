import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useHistory } from 'react-router-dom';
import styles from './Login.module.css'; 
import { Link } from 'react-router-dom';

const Login = () => {
  const history = useHistory();
  const { login } = useContext(AuthContext); 
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const { email, password } = credentials;

  const onInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password); 
      history.push("/posts"); 
    } catch (err) {
      setError("Failed to log in. Please check your credentials.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.logo}>
          <h1>Blogger</h1>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={onSubmit}>
          <div className={styles.formGroup}>
            <input
              type="email"
              className={styles.input}
              placeholder="Enter Your E-mail Address"
              name="email"
              value={email}
              onChange={onInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="password"
              className={styles.input}
              placeholder="Enter Your Password"
              name="password"
              value={password}
              onChange={onInputChange}
              required
            />
          </div>
          <button className={styles.button}>Log In</button>
        </form>
        <p className={styles.loginPrompt}>
          Don't have an account? <Link to="/signup" className={styles.link}>Go to Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
