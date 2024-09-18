import React, { useState } from 'react';
import axios from 'axios';
import styles from './Verify.module.css'; 
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';

const VerifyEmail = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await axios.post('http://localhost:5000/api/users/verify-email', { email, code });
      setMessage(response.data.message);
      history.push('/login');
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Verification failed. Please try again.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.logo}>
          <h1>Verify Your Email</h1>
        </div>

        {message && <div className={styles.message}>{message}</div>}
        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <input
              type="email"
              className={styles.input}
              placeholder="Enter Your Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="text"
              className={styles.input}
              placeholder="Enter Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.button}>Confirm</button>
        </form>
        <p className={styles.loginPrompt}>
          Already verified? <Link to="/login" className={styles.link}>Go to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
