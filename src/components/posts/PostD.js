import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import styles from './PostD.module.css';

const PostD = () => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios.get(`http://localhost:5000/api/posts/${id}`)
        .then((response) => {
          setPost(response.data);
          setComments(response.data.comments || []);
          const userId = localStorage.getItem('userId');
          setLiked(response.data.likes.includes(userId));
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

  const handleBack = () => {
    history.goBack();
  };

  const handleAddComment = () => {
    const token = localStorage.getItem('token');
    if (newComment.trim() && token) {
      axios.post('http://localhost:5000/api/comments', {
        content: newComment,
        post: id,
        author: localStorage.getItem('userId')
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        setComments(prevComments => [...prevComments, response.data.comment]);
        setNewComment('');
      })
      .catch(error => {
        console.error('Error adding comment:', error);
        if (error.response && error.response.status === 401) {
          setError('You are not authorized to comment. Please log in.');
        } else {
          setError('Failed to add comment.');
        }
      });
    } else if (!token) {
      setError('You are not logged in. Please log in to comment.');
    }
  };

  const handleLike = () => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.post(`http://localhost:5000/api/posts/${id}/like`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        setPost(response.data.post);
        setLiked(true);
      })
      .catch(error => {
        console.error('Error liking post:', error);
        setError('Failed to like post.');
      });
    } else {
      setError('You are not logged in. Please log in to like the post.');
    }
  };

  const handleUnlike = () => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.post(`http://localhost:5000/api/posts/${id}/unlike`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        setPost(response.data.post);
        setLiked(false);
      })
      .catch(error => {
        console.error('Error unliking post:', error);
        setError('Failed to unlike post.');
      });
    } else {
      setError('You are not logged in. Please log in to unlike the post.');
    }
  };

  if (loading) {
    return <div className={styles.container}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={handleBack}>
        Back to Posts
      </button>
      
      {error && <div className={styles.error}>{error}</div>}
      {post ? (
        <div className={styles.postDetails}>
          <div className={styles.postHeader}>
            <div className={styles.profileContainer}>
              <img 
                src={post.author?.profilePicture ? `http://localhost:5000/uploads/${post.author.profilePicture}` : 'https://via.placeholder.com/150'} 
                alt="Author" 
                className={styles.authorPhoto} 
                onError={(e) => e.target.src = 'https://via.placeholder.com/150'} 
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
            onError={(e) => e.target.src = 'https://via.placeholder.com/500'} 
          />

          <div className={styles.postInfo}>
            <p className={styles.postTitle}>{post.title || 'N/A'}</p>
            <div className={styles.postInfo2}> 
              <p className={styles.postContent}>{post.content || 'N/A'}</p>
              <div>
                <i
                  className={`fas fa-star ${liked ? styles.liked : styles.unliked}`}
                  onClick={liked ? handleUnlike : handleLike}
                ></i>
                <span className={styles.likeCount}>{post.likes.length} Likes</span>
              </div>
            </div>
          </div>

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

export default PostD;
