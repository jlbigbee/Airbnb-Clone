import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from "react-router-dom";
import * as sessionActions from '../../store/session';
import { Modal } from '../../context/Modal';
import LoginForm from '../LoginFormModal/LoginForm';
import SignupFormPage from '../SignupFormPage';
import './Navigation.css'

function ProfileButton({ user }) {

  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const sessionUser = useSelector(state => state.session.user);


  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };


  const closeMenu = () => {
    setShowMenu(false);
  };

  useEffect(() => {
    if (!showMenu) return;
    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    alert('Successfully Logged Out')
  };

  let sessionLinks;
  if (!sessionUser) {

    sessionLinks = (

      <div className="dropdown-menu">
        <div className="login">
          <button className="login-button" onClick={(e) => {
            e.stopPropagation();
            setShowModal(true)
            closeMenu()
          }}>Log In</button>
        </div>

        <div className="signup">
          <button className="signup-button" onClick={(e) => {
            e.stopPropagation();
            setShowSignUpModal(true)
            closeMenu()
          }}>
            Sign Up
          </button>
        </div>
        <NavLink to='/spots/create'>Create your own listing!</NavLink>
      </div>
    );
  } else {
    sessionLinks = (
      <div className="dropdown-menu">
        <div className="profile-dropdown-text">Hello: {sessionUser.firstName}</div>
        <div className="profile-dropdown-text">Account: {user.email}</div>
        <div>
          <button className="logout-button" onClick={logout}>Log Out</button>
        </div>
        <NavLink to='/spots/create'>Create your own listing!</NavLink>
      </div>
    )
  }

  return (
    <div>
      <button onClick={openMenu} className='profile-button'>
        <i id="hamburger" className="fa fa-bars"></i>
        <i id="icon" className="fa-regular fa-circle-user fa-2x"></i>
      </button>

      {showModal && (
        <Modal onClose ={() => setShowModal(false)}>
          <LoginForm setShowModal={setShowModal} />
        </Modal>
      )}

      {showSignUpModal && (
        <Modal onClose={() => setShowSignUpModal(false)}>
          <SignupFormPage setShowSignUpModal={setShowSignUpModal} />
        </Modal>
      )}

      {showMenu && sessionLinks}
    </div>
  );
}

export default ProfileButton;
