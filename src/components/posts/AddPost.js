import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const AddPost = () => {
  const history = useHistory();
  const [post, setPost] = useState({
    title: '',
    content: '',
    image: null, 
  });
  const [error, setError] = useState('');

  const { title, content, image } = post;

  const onInputChange = (e) => {
    if (e.target.name === 'image') {
      setPost({ ...post, image: e.target.files[0] });
    } else {
      setPost({ ...post, [e.target.name]: e.target.value });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formData = new FormData();
    formData.append('title', post.title);
    formData.append('content', post.content);
    if (post.image) {
      formData.append('image', post.image);
    }

    try {
      const token = localStorage.getItem('token');

     
      await axios.post('http://localhost:5000/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
          Authorization: `Bearer ${token}`,
        },
      });

      history.push('/posts'); 
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to add post.');
      }
      console.error('Error adding post:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="container">
      <div className="w-75 mx-auto shadow p-5">
        <h2 className="text-center mb-4">Add A Post</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Post Title"
              name="title"
              value={title}
              onChange={onInputChange}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              className="form-control form-control-lg"
              placeholder="Enter Post Content"
              name="content"
              value={content}
              onChange={onInputChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="file"
              className="form-control-file"
              name="image"
              accept="image/*"
              onChange={onInputChange}
            />
          </div>
          <button className="btn btn-primary btn-block">Add Post</button>
        </form>
      </div>
    </div>
  );
};

export default AddPost;
