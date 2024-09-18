import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';

const EditPost = () => {
  const { id } = useParams();
  const history = useHistory();
  const [post, setPost] = useState({
    title: '',
    content: '',
    image: '', 
  });

  const { title, content } = post;


  const [imageFile, setImageFile] = useState(null);


  const loadPost = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/posts/${id}`);
      setPost(response.data);
    } catch (error) {
      console.error('Failed to load post:', error);
    }
  };

  useEffect(() => {
    loadPost();
  }, [id]);


  const onInputChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const onImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };


  const onSubmit = async (e) => {
    e.preventDefault();

  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      await axios.put(`http://localhost:5000/api/posts/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      history.push('/post');
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <div className="container">
      <div className="w-75 mx-auto shadow p-5">
        <h2 className="text-center mb-4">Edit Post</h2>
        <form onSubmit={onSubmit} encType="multipart/form-data">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Post Title"
              name="title"
              value={title}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group">
            <textarea
              className="form-control"
              placeholder="Enter Post Content"
              name="content"
              value={content}
              onChange={onInputChange}
            />
          </div>

      
          <div className="form-group">
            <label>Upload Image</label>
            <input
              type="file"
              className="form-control"
              name="image"
              onChange={onImageChange}
            />
          </div>

          {post.image && (
            <div className="form-group">
              <label>Current Image:</label>
              <img
                src={`http://localhost:5000/uploads/${post.image}`}
                alt="Post"
                style={{ width: '150px', height: 'auto' }}
              />
            </div>
          )}

          <button className="btn btn-warning btn-block">Update Post</button>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
