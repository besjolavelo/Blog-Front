import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import classes from './Home.module.css';

const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const base64Payload = token.split('.')[1];
      if (!base64Payload) throw new Error('Invalid token format');
      
      const decodedPayload = atob(base64Payload);
      const payload = JSON.parse(decodedPayload);
      
      console.log("Decoded Payload:", payload); 
      return payload.id; 
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }
  return null;
};

const Home = () => {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const usersPerPage = 3;
  const loggedInUserId = getUserIdFromToken();
  const history = useHistory();

  useEffect(() => {
    if (loggedInUserId) {
      loadUsers();
    } else {
      console.warn("User is not logged in.");
    }
  }, [loggedInUserId]);

  const loadUsers = async () => {
    try {
      const result = await axios.get("http://localhost:5000/api/users/users");
     
      const filteredUsers = result.data.filter(user => user._id !== loggedInUserId);
      setUsers(filteredUsers.reverse());
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/profile/${id}`);
      loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + usersPerPage >= users.length ? 0 : prevIndex + usersPerPage
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - usersPerPage < 0 ? users.length - usersPerPage : prevIndex - usersPerPage
    );
  };

  const handleProfileClick = (userId) => {
    if (userId === loggedInUserId) {
      console.log("Redirecting to 'My Profile'"); // Log redirection action
      history.push('/my-profile');
    } else {
      console.log(`Redirecting to /users/profile/${userId}`); // Log other profile redirection
      history.push(`/users/profile/${userId}`);
    }
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.header}>People You May Know</h1>
      <div className={classes.carouselContainer}>
        <button className={classes.prevButton} onClick={prevSlide}>
          &#8249;
        </button>
        <div className={classes.cardContainer}>
          {users
            .slice(currentIndex, currentIndex + usersPerPage)
            .map((user) => (
              <div className={classes.card} key={user._id}>
                <div className={classes.cardHeader}>
                  <img
                   
                    src={user.profilePicture ? `http://localhost:5000/uploads/${user.profilePicture}` : 'https://via.placeholder.com/150'}
                    alt={`${user.username}'s Profile`}
                    className={classes.profilePicture}
                  />
                  <div className={classes.userInfo}>
                    <Link
                      to={`/users/profile/${user._id}`}
                      className={classes.cardTitle}
                      onClick={() => handleProfileClick(user._id)}
                    >
                      {user.username}
                    </Link>
                    <h3 className={classes.cardSubtitle}>{user.location}</h3>
                  </div>
                </div>
                <p className={classes.cardText}>{user.email}</p>
                <button
                  className={classes.buttonDanger}
                  onClick={() => deleteUser(user._id)}
                >
                  Not Interested
                </button>
              </div>
            ))}
        </div>
        <button className={classes.nextButton} onClick={nextSlide}>
          &#8250;
        </button>
      </div>
    </div>
  );
};

export default Home;
