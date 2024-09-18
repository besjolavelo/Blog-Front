import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import styles from './User.module.css'; // Import the CSS module

const User = () => {
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setLoading(true); // Start loading
      axios.get(`http://localhost:5000/api/users/profile/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } // Include token in the request
      })
        .then((response) => {
          setUser(response.data);
          setPosts(response.data.posts || []); // Assuming posts are part of the response
          setLoading(false); // Stop loading after data is fetched
        })
        .catch((error) => {
          console.error('Error fetching the user:', error);
          setError('Failed to load user data.');
          setLoading(false); // Stop loading on error
        });
    } else {
      setError('User ID is missing.');
      setLoading(false); // Stop loading if no user ID
    }
  }, [id]);

  return (
    <div className={styles.container}>
      <Link className={styles.backButton} to="/">
        Back to Profiles
      </Link>
      
      {error && <div className={styles.error}>{error}</div>}

      {/* Loading state */}
      {loading ? (
        <div className={styles.loading}>Loading...</div> // Show loading message or spinner
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default User;
