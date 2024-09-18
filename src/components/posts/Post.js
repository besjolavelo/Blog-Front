import React, { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import styles from './Post.module.css';

const Post = () => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); 
  const history = useHistory();

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios.get(`http://localhost:5000/api/posts/${id}`)
        .then((response) => {
          setPost(response.data);
          setComments(response.data.comments || []); 
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching the post:', error);
          setError('Failed to load post data.');
          setLoading(false);
        });
    } else {
      setError('Post ID is missing.');
      setLoading(false);
    }
  }, [id]);

  const handleViewAuthor = () => {
    if (post && post.author) {
      const authorId = post.author._id;
      history.push(`/users/profile/${authorId}`);
    } else {
      alert('Author information is missing.');
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      axios.post(`http://localhost:5000/api/comments`, {
        content: newComment,
        post: id,
        author: localStorage.getItem('userId') 
      })
      .then(response => {
   
        setComments(prevComments => [...prevComments, response.data.comment]);
        setNewComment('');
      })
      .catch(error => {
        console.error('Error adding comment:', error);
        setError('Failed to add comment.');
      });
    }
  };

  if (loading) {
    return <div className={styles.container}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <Link className={styles.backButton} to="/posts">
        Back to Posts
      </Link>
      
      {error && <div className={styles.error}>{error}</div>}
      {post ? (
        <div className={styles.postDetails}>
          <div className={styles.postHeader}>
            <div className={styles.profileContainer}>
              <img 
                src={post.author.profilePhoto ? `http://localhost:5000/uploads/${post.author.profilePhoto}` : 'https://via.placeholder.com/150'} 
                alt="Author" 
                className={styles.authorPhoto} 
              />
              <span className={styles.authorName}>
                {post.author.username || 'Unknown'}
              </span>
            </div>
          </div>
          <img 
            src={post.image ? `http://localhost:5000/uploads/${post.image}` : 'https://via.placeholder.com/500'} 
            alt="Post" 
            className={styles.postImage} 
          />
          <p className={styles.postTitle}>{post.title || 'N/A'}</p>
          <hr className={styles.separator} />
          <p className={styles.postContent}>{post.content || 'N/A'}</p>
          <button className={styles.viewAuthorButton} onClick={handleViewAuthor}>
            View Author Profile
          </button>

          <div className={styles.commentSection}>
            <h3>Comments:</h3>
            <div className={styles.commentsList}>
              {comments.length > 0 ? (
                comments.map(comment => (
                  <div key={comment._id} className={styles.commentItem}>
                    <p className={styles.commentAuthor}>{comment.author.username || 'Unknown'}:</p>
                    <p className={styles.commentContent}>{comment.content}</p>
                  </div>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className={styles.commentInput}
            />
            <button className={styles.addCommentButton} onClick={handleAddComment}>
              Add Comment
            </button>
          </div>
        </div>
      ) : (
        !error && <div>No post data available.</div>
      )}
    </div>
  );
};

export default Post;
