import React from "react";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import Home from "./components/pages/Home";
import About from "./components/pages/About";
import Contact from "./components/pages/Contact";
import Navbar from "./components/layout/Navbar";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import NotFound from "./components/pages/NotFound";
import AddUser from "./components/users/AddUser";
import EditUser from "./components/users/EditUser";
import User from "./components/users/User";
import Posts from "./components/pages/Posts";
import Post from "./components/posts/Post";
import EditPost from "./components/posts/EditPost";
import AddPost from "./components/posts/AddPost";
import MyProfile from './components/pages/MyProfile';
import PostD from './components/posts/PostD'
import ProfileP from './components/users/ProfileP'
import { AuthProvider } from "./context/AuthContext";
import Verify from "./components/auth/Verify";
import PrivateRoute from "./components/PrivateRoute";
function App() {
  return (
    <AuthProvider>
    <Router>
      <div className="App">
            <Navbar />
            <Switch>
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/login" component={Login} />
              <PrivateRoute exact path="/" component={Home} />
              <Route exact path="/verify" component={Verify} />
              <PrivateRoute exact path="/about" component={About} />
              <PrivateRoute exact path="/contact" component={Contact} />
              <PrivateRoute exact path="/users/add" component={AddUser} />
              <PrivateRoute exact path="/users/edit/:id" component={EditUser} />
              <PrivateRoute exact path="/users/profile/:id" component={User} />
              <PrivateRoute exact path="/posts" component={Posts} />
              <PrivateRoute path="/my-profile" component={MyProfile} />
              <PrivateRoute exact path="/posts/edit/:id" component={EditPost} />
              <PrivateRoute exact path="/posts/:id" component={Post} />
              <PrivateRoute path="/add-post" component={AddPost} />
              <PrivateRoute exact path="/postD/:id" component={PostD} />
              <PrivateRoute exact path="/profileP/:id" component={ProfileP} />

              <Route component={NotFound} />
            </Switch>
          
        
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
