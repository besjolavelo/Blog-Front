import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import styles from './Posts.module.css';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComments, setNewComments] = useState({});
  const [likes, setLikes] = useState({});
  const history = useHistory();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const token = localStorage.getItem("token")
      const result = await axios.get('http://localhost:5000/api/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userId = localStorage.getItem('userId');

      setPosts(result.data.reverse());
      setLoading(false);

      const likesState = result.data.reduce((acc, post) => {
        acc[post._id] = post.likes.includes(userId); 
        return acc;
      }, {});
      setLikes(likesState); 
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts.');
      setLoading(false);
    }
  };

  const handleViewAuthor = (authorId) => {
    history.push(`/profileP/${authorId}`);
  };

  const handleAddComment = async (postId) => {
    const newComment = newComments[postId]?.trim();
    if (newComment) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:5000/api/comments', {
          content: newComment,
          post: postId,
          author: localStorage.getItem('userId')
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? { ...post, comments: [...post.comments, response.data.comment] }
              : post
          )
        );
        setNewComments((prevComments) => ({ ...prevComments, [postId]: '' }));
      } catch (error) {
        console.error('Error adding comment:', error);
        setError('Failed to add comment.');
      }
    }
  };

  const handleCommentChange = (e, postId) => {
    setNewComments({ ...newComments, [postId]: e.target.value });
  };

  
  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId'); 
      if (!token) {
        alert('User not logged in.');
        return;
      }

      await axios.post(`http://localhost:5000/api/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

    
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, likes: [...post.likes, userId] } 
            : post
        )
      );
      setLikes((prevLikes) => ({ ...prevLikes, [postId]: true })); 
    } catch (error) {
      console.error('Error liking post:', error);
      setError('Failed to like post.');
    }
  };

  
  const handleUnlike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId'); 
      if (!token) {
        alert('User not logged in.');
        return;
      }

      
      await axios.post(`http://localhost:5000/api/posts/${postId}/unlike`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

     
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, likes: post.likes.filter((id) => id !== userId) } 
            : post
        )
      );
      setLikes((prevLikes) => ({ ...prevLikes, [postId]: false })); 
    } catch (error) {
      console.error('Error unliking post:', error);
      setError('Failed to unlike post.');
    }
  };

  if (loading) {
    return <div className={styles.container}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      {error && <div className={styles.error}>{error}</div>}
      {posts.map((post) => {
        const imageUrl = post.image ? `http://localhost:5000/uploads/${post.image}` : 'https://via.placeholder.com/400';
        const profilePhotoUrl = post.author?.profilePicture
          ? `http://localhost:5000/uploads/${post.author.profilePicture}`
          : 'https://via.placeholder.com/150';

        return (
          <div key={post._id} className={styles.postCard}>
            <div className={styles.postHeader}>
              <div className={styles.profileContainer}>
                <img
                  src={profilePhotoUrl}
                  alt={post.author?.username || 'Unknown'}
                  className={styles.profilePhoto}
                  onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                />
                <span
                  className={styles.authorName}
                  onClick={() => handleViewAuthor(post.author?._id)}
                >
                  {post.author?.username || 'Unknown'}
                </span>
              </div>
            </div>

            <div className={styles.postImageContainer}>
              <img
                src={imageUrl}
                className={styles.postImage}
              />
            </div>

            <div className={styles.postDetails}>
              <h2 className={styles.postTitle}>{post.title}</h2>
              <div className={styles.post}>
                <div className={styles.postDetail}>
                  <p className={styles.postContent}>{post.content}</p>
                  <div className={styles.likeSection}>
                    <i
                      className={`fas fa-star ${likes[post._id] ? styles.liked : styles.unliked}`}
                      onClick={() => likes[post._id] ? handleUnlike(post._id) : handleLike(post._id)}
                    ></i>
                    <span className={styles.likeCount}>{post.likes.length} Likes</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.commentSection}>
              <h3>Comments:</h3>
              <div className={styles.commentsList}>
                {post.comments && post.comments.length > 0 ? (
                  post.comments.map((comment) => (
                    <div key={comment._id} className={styles.commentItem}>
                      <p className={styles.commentAuthor}>{comment.author?.username || 'Unknown'}:</p>
                      <p className={styles.commentContent}>{comment.content}</p>
                    </div>
                  ))
                ) : (
                  <p>No comments yet.</p>
                )}
              </div>
              <div className={styles.addCommentSection}>
                <textarea
                  value={newComments[post._id] || ''}
                  onChange={(e) => handleCommentChange(e, post._id)}
                  placeholder="Add a comment..."
                  className={styles.commentInput}
                />
                <button
                  className={styles.addCommentButton}
                  onClick={() => handleAddComment(post._id)}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Posts;
