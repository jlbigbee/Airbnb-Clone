import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal'
import './Navigation.css';
// import Logo from '../Logo/Airbb-logo.svg';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <ProfileButton user={sessionUser} />
    );
  } else {
    sessionLinks = (
      <>
        <LoginFormModal />
        <NavLink to="/login">Log In</NavLink>
        <NavLink to="/signup">Sign Up</NavLink>
      </>
    );
  }

  return (
    <>
    <ul className='nav-ul'>
      <li className='nav-box'>

        <ul>
          <div>
            {/* <NavLink exact to="/"><img src={Logo} alt="logo"/></NavLink> */}
            <ProfileButton/>
          </div>
          <div>
        <LoginFormModal/>
        <NavLink to="/signup">Sign Up</NavLink>
          </div>
            {isLoaded && sessionLinks}

        </ul>
      </li>
    </ul>
    </>
  );
}

export default Navigation;
