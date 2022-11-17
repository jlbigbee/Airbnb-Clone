import { useEffect } from 'react';
import { useParams, NavLink, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import './SingleSpot.css'

import { getSpotByID } from '../../store/spots';

const SingleSpot = () => {
    const dispatch = useDispatch();
    const { spotId } = useParams();

    useEffect(() => {
        dispatch( getSpotByID (spotId));
      }, [dispatch, spotId]);

    const spot = useSelector(state => state.spots.singleSpot);
    const sessionUser = useSelector(state => state.session.user)

    useEffect(() => {
        console.log(spot)
    },[])

    return (

    <div className= 'main'>

            <div className="outer-container">

                <div className="spot-name">
                    <h2>{spot.name}</h2>
                </div>

                <div className="stars-reviews-location">
                    {spot.avgStarRating
                        ?
                        <p>🟊 {spot.avgStarRating}
                            <span className="superhost">&nbsp; Superhost&nbsp;</span> · &nbsp;&nbsp;<span
                                className="city">{spot.city}, </span>
                            <span className="state">{spot.state}, </span>
                            <span className="country">{spot.country}</span>
                        </p>
                        :
                        <p>
                            <span
                                className="city">{spot.city},{spot.state},{spot.country}</span>
                            <span className="state">{spot.state},</span>
                            <span className="country">{spot.country}</span>
                        </p>
                    }
                </div>

                <div className="singlespot-images">
                    <div className="singlespot-image-container">
                        <img className="singlespot-large-image" src={spot.previewImage} />
                    </div>
                </div>

                <div className="under-image-details">
                    {sessionUser && spot.ownerId === sessionUser.id
                        ?
                        <div className="spot-owner">
                            <h2>You are the owner of this spot</h2>

                        </div>
                        :
                        <div className="spot-owner">
                            <h2>Entire home hosted by {spot.Owner?.firstName}</h2>
                        </div>
                    }
                    <div className="spot-price-container">
                        <h2 className="spot-price">${spot.price}<span> night</span></h2>
                    </div>

                </div>
                <div className="description">
                    <p>{spot.description}</p>
                </div>


            </div>


    </div>

    )
}

export default SingleSpot
