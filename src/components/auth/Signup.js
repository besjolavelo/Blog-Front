// Signup.js
import React, { useState } from "react";
import axios from 'axios';
import { useHistory, Link } from "react-router-dom";
import styles from './Signup.module.css'; 

const Signup = () => {
  const history = useHistory();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    dateOfBirth: "",
    bio: "",
    location: "",
    profilePicture: null 
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { username, email, password, dateOfBirth, bio, location, profilePicture } = user;

  const onInputChange = (e) => {
    if (e.target.name === 'profilePicture') {
      setUser({ ...user, profilePicture: e.target.files[0] }); 
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const formData = new FormData();  
    formData.append('username', username);
    formData.append('email', email);
    formData.append('passwordHash', password);
    formData.append('dateOfBirth', dateOfBirth);
    formData.append('bio', bio);
    formData.append('location', location);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);  
    }

    try {
      await axios.post("http://localhost:5000/api/users/register", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

   
      setSuccessMessage("Signup successful! Please check your email for a verification code.");
      setTimeout(() => {
        history.push("/verify"); 
      }, 3000);
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to sign up. Please check your input.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.logo}>
          <h1>Blogger</h1>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {successMessage && <div className={styles.success}>{successMessage}</div>}
        
        <form onSubmit={onSubmit}>
          <div className={styles.formGroup}>
            <input
              type="text"
              className={styles.input}
              placeholder="Enter Your Username"
              name="username"
              value={username}
              onChange={onInputChange}
              required
            />
          </div>
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
          <div className={styles.formGroup}>
            <input
              type="date"
              className={styles.input}
              placeholder="Enter Your Date of Birth"
              name="dateOfBirth"
              value={dateOfBirth}
              onChange={onInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="text"
              className={styles.input}
              placeholder="Enter Your Location"
              name="location"
              value={location}
              onChange={onInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <textarea
              className={styles.textarea}
              placeholder="Enter Your Bio"
              name="bio"
              value={bio}
              onChange={onInputChange}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="file"
              className={styles.input}
              name="profilePicture"
              accept="image/*"
              onChange={onInputChange} 
            />
          </div>
          <button className={styles.button}>Sign Up</button>
        </form>
        
        <p className={styles.loginPrompt}>
          Already have an account? <Link to="/login" className={styles.link}>Go to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
