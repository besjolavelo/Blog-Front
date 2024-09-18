import React, { useState } from "react";
import axios from 'axios';
import { useHistory } from "react-router-dom";

const AddUser = () => {
  let history = useHistory();
  const [user, setUser] = useState({
    username: "",
    email: "",
    passwordHash: "",
    dateOfBirth: "",
    bio: "",
    location: ""
  });

  const [error, setError] = useState(""); 
  const [showPassword, setShowPassword] = useState(false); 
  const [isLoading, setIsLoading] = useState(false); 

  const { username, email, passwordHash, dateOfBirth, bio, location } = user;

  const onInputChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

 
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const onSubmit = async e => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    setIsLoading(true); // Set loading state to true
    try {
      await axios.post("http://localhost:5000/api/users/register", user);
      history.push("/");
    } catch (error) {
      setIsLoading(false); // Reset loading state
      // Check for specific error response from backend
      if (error.response && error.response.status === 409) {
        setError("User with this email or username already exists.");
      } else if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("User with this email or username already exists.");
      }
      console.error("Error adding user:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="container">
      <div className="w-75 mx-auto shadow p-5">
        <h2 className="text-center mb-4">Add A User</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Your Username"
              name="username"
              value={username}
              onChange={onInputChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="Enter Your E-mail Address"
              name="email"
              value={email}
              onChange={onInputChange}
              required
            />
          </div>
          <div className="form-group">
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control form-control-lg"
                placeholder="Enter Your Password"
                name="passwordHash"
                value={passwordHash}
                onChange={onInputChange}
                required
              />
              <div className="input-group-append">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>
          <div className="form-group">
            <input
              type="date"
              className="form-control form-control-lg"
              name="dateOfBirth"
              value={dateOfBirth}
              onChange={onInputChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Your Location"
              name="location"
              value={location}
              onChange={onInputChange}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              className="form-control form-control-lg"
              placeholder="Enter Your Bio"
              name="bio"
              value={bio}
              onChange={onInputChange}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isLoading} 
          >
            {isLoading ? "Adding User..." : "Add User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
