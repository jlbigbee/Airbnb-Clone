import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { getAllSpots } from '../../store/spots';
import './AllSpots.css'

const AllSpots = () => {
  const dispatch = useDispatch();

  const allSpots = useSelector(state => Object.values(state.spots.allSpots));

  useEffect(() => {
    dispatch(getAllSpots())

  }, [dispatch]);

  return (
    <div className = 'main-container'>
    <div className = 'spots-container'>
      <div className = 'spot-card'>
      {allSpots.map(spot =>
             <NavLink to={`/spots/${spot.id}`} className="spot-card-contents">
             <div className="image-container">
                 <img className="allspots-image" src={spot.previewImage} />
             </div>
             <div className="spot-card-details">
                 <div className="spot-card-details-text">
                     <p className="city-state">{spot.city}, {spot.state}</p>
                     <p className="allspots-country">{spot.country}</p>
                     <p className="price">${spot.price}<span> night</span></p>
                 </div>
                 <div className="avg-rating">
                        <p>🟊 {Number(spot.avgRating).toFixed(2)}</p>
                 </div>
             </div>
         </NavLink>
        )}
        </div>
    </div>
    </div>
  )
}

export default AllSpots;
