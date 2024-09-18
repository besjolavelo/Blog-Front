
import React, { useContext } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { token, logout } = useContext(AuthContext);
  const history = useHistory();
  const isLoggedIn = !!token;

  const handleLogout = () => {
    logout();
    history.push("/login");
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="p">
          <p>Blogger</p>
        </div>

        <div className="navbar-menu">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" exact to="/posts" activeClassName="active">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" exact to="/" activeClassName="active">
                Connect
              </NavLink>
            </li>

            {isLoggedIn && (
              <li className="nav-item">
                <NavLink className="nav-link" exact to="/my-profile" activeClassName="active">My Profile</NavLink>
              </li>
            )}
          </ul>
          {isLoggedIn ? (
            <button className="btn btn-logout" onClick={handleLogout}>Log out</button>
          ) : (
            <Link className="btn btn-login" to="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
