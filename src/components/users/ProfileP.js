import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import axios from "axios";
import styles from './ProfileP.module.css'; // Import the CSS module

const ProfileP = () => {
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/users/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
        setPosts(response.data.posts || []); // Assuming the posts are part of the response
      } catch (error) {
        console.error('Error fetching the user:', error);
        setError('Failed to load user data.');
      }
    };

    if (id) {
      fetchUserProfile();
    } else {
      setError('User ID is missing.');
    }
  }, [id]);

  const handleBack = () => {
    history.goBack();
  };

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={handleBack}>
        Back to Home
      </button>

      {error && <div className={styles.error}>{error}</div>}
      {user && (
        <div className={styles.profile}>
          <img
            src={user.profilePicture ? `http://localhost:5000/uploads/${user.profilePicture}` : 'https://via.placeholder.com/150'}
            alt="Profile"
            className={styles.profilePicture}
          />
          <div className={styles.userInfo}>
            <ul className={styles.userDetails}>
              <li className={styles.userItem}>{user.username || "N/A"}</li>
              <li className={styles.userItem}>{user.email || "N/A"}</li>
              <li className={styles.userItem}>{user.bio || "N/A"}</li>
              <li className={styles.userItem}>{user.location || "N/A"}</li>
            </ul>
          </div>
        </div>
      )}

      <div className={styles.postsSection}>
        <h2 className={styles.postsHeading}>{user.username}'s Posts</h2>
        <hr className={styles.divider} />
        <div className={styles.postGrid}>
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

                <Link className={styles.viewPostButton} to={`/postD/${post._id}`}>
                  View Post
                </Link>
              </div>
            ))
          ) : (
            <p className={styles.noPosts}>No posts available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileP;
