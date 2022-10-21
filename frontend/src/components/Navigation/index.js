import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
// import LoginFormModal from '../LoginFormModal'
import './Navigation.css';
import logo from '../images/Airbb-logo.png';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <>
    <div className='nav-ul'>
      <div className='nav-box'>



            <NavLink exact to="/">
              <img src={logo} alt="logo" className='logo'/>
            </NavLink>



          <div className= 'nav-menu'>
              {isLoaded &&
            <ProfileButton user={sessionUser}/>}
          </div>



      </div>
    </div>
    </>
  );
}

export default Navigation;
