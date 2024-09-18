import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import styles from './MyProfile.module.css'; 

const MyProfile = () => {
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    location: '',
    profilePicture: null  
  });
  const [loading, setLoading] = useState(true); 
  const history = useHistory(); 

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true); 
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError("User not logged in.");
          return;
        }

        const response = await axios.get('http://localhost:5000/api/users/my-profile', {
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

        const postsResponse = await axios.get(`http://localhost:5000/api/posts/user/${response.data._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPosts(postsResponse.data);
      } catch (error) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false); 
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target?.files?.[0] || null;
    setFormData(prevState => ({
      ...prevState,
      profilePicture: file 
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

      const response = await axios.put('http://localhost:5000/api/users/my-profile', profileData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setUser(response.data.user);
      setIsEditing(false);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile.");
    }
  };

  const handleAddPostClick = () => {
    history.push('/add-post');
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("User not logged in.");
        return;
      }

      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete post.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("User not logged in.");
        return;
      }

      await axios.delete('http://localhost:5000/api/users/my-profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      localStorage.removeItem('token');
      alert('Account deleted successfully.');
      history.push('/login');
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete account.");
    }
  };

  return (
    <div className={styles.container}>
      <Link className={styles.backButton} to="/posts">
        Back to Home
      </Link>

      {error && <div className={styles.error}>{error}</div>}

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <div className={styles.profile}>
          {isEditing ? (
            <div className={styles.profileEditForm}>
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
              <button onClick={() => setIsEditing(false)} className={styles.cancelButton}>Cancel</button>
            </div>
          ) : (
            <>
              <img
                src={user.profilePicture ? `http://localhost:5000/uploads/${user.profilePicture}` : 'https://via.placeholder.com/150'}
                alt="Profile"
                className={styles.profilePicture}
              />
              <div className={styles.userInfo}>
                <ul className={styles.userDetails}>
                  <li className={styles.userItem}><strong>Username:</strong> {user.username || "N/A"}</li>
                  <li className={styles.userItem}><strong>Email:</strong> {user.email || "N/A"}</li>
                  <li className={styles.userItem}><strong>Bio:</strong> {user.bio || "N/A"}</li>
                  <li className={styles.userItem}><strong>Location:</strong> {user.location || "N/A"}</li>
                </ul>
                <Link to="#" onClick={() => setIsEditing(true)} className={styles.editButton}>
                  Edit Profile
                </Link>
                <button onClick={handleDeleteAccount} className={styles.deleteAccountButton}>
                  Delete Account
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <div className={styles.postsSection}>
        <h2 className={styles.postsHeading}>Your Posts</h2>
        <hr className={styles.divider} />
        <div className={styles.postGrid}>
          
          <div className={styles.addPostCard}>
            <button onClick={handleAddPostClick} className={styles.addPostButton}>
              <span className={styles.plusIcon}>+</span>
            </button>
            <div className={styles.addPostText}>Add Post</div>
          </div>
          
          {posts.length > 0 ? (
            posts.map(post => (
              <div key={post._id} className={styles.postContainer}>
                <div className={styles.imageContainer}>
                  <img
                    src={post.image ? `http://localhost:5000/uploads/${post.image}` : 'https://via.placeholder.com/300'}
                    alt={post.title}
                    className={styles.postImage}
                  />
                  <div className={styles.postContentContainer}>
                    <h3 className={styles.postTitle}>{post.title || 'N/A'}</h3>
                    <p className={styles.postContent}>{post.content || 'N/A'}</p>
                  </div>
                </div>
                <div className={styles.postActions}>
                  <Link className={styles.viewPostButton} to={`/postD/${post._id}`}>
                    View Post
                  </Link>
                  <button 
                    className={styles.deletePostButton} 
                    onClick={() => handleDeletePost(post._id)}
                  >
                    Delete Post
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noPosts}>No posts available.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
