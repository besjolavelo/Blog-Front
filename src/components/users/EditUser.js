import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styles from './EditUser.module.css';

const EditUser = () => {
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    location: '',
    profilePicture: null
  });
  const [error, setError] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError("User not logged in.");
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUser(response.data);
        setFormData({
          username: response.data.username || '',
          email: response.data.email || '',
          bio: response.data.bio || '',
          location: response.data.location || '',
          profilePicture: null
        });
      } catch (error) {
        setError("Failed to load user data.");
      }
    };

    fetchUserData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      profilePicture: e.target.files[0]
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("User not logged in.");
        return;
      }

      const profileData = new FormData();
      profileData.append('username', formData.username);
      profileData.append('email', formData.email);
      profileData.append('bio', formData.bio);
      profileData.append('location', formData.location);
      if (formData.profilePicture) {
        profileData.append('profilePicture', formData.profilePicture);
      }

      const response = await axios.put(`http://localhost:5000/api/users/${id}`, profileData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Profile updated successfully!');
    } catch (error) {
      setError("Failed to update profile.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Edit User Profile</h2>
      {error && <div className={styles.error}>{error}</div>}
      <label>
        Username:
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Bio:
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Location:
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Profile Picture:
        <input
          type="file"
          name="profilePicture"
          accept="image/*"
          onChange={handleFileChange}
        />
      </label>
      <button onClick={handleSave} className={styles.saveButton}>Save</button>
    </div>
  );
};

export default EditUser;
