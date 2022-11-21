import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllReviews, removeAReview } from '../../store/reviews';
import CreateAReviewForm from '../CreateAReviewForm';
import './Reviews.css'

const AllReviews = ({ spotId }) => {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);

  useEffect(() => {
    dispatch(getAllReviews(spotId))
  }, [dispatch, spotId])

  const allReviewsObject = useSelector((state => state.reviews.spot));
  const allReviewsValues = Object.values(allReviewsObject);

  let userAlreadyReviewed
  if (sessionUser) {
    userAlreadyReviewed = allReviewsValues.find(review => sessionUser.id === review.userId)
  }

  const currentSpot = useSelector(state => state.spots.singleSpot);

  let createReviewForm
  if (sessionUser && !userAlreadyReviewed && currentSpot.ownerId !== sessionUser.id) {
    createReviewForm = (
      <div>
        <CreateAReviewForm spotId={currentSpot.id} />
      </div>
    )
  }

  console.log('allreviews', allReviewsValues)

  const removeButton = (userId, reviewId) => {
    if (sessionUser?.id !== userId) {
      return null
    } else {
      return (
        <button className="review-remove-button" onClick={() => {
          dispatch(removeAReview(reviewId))
        }}>
          DELETE YOUR REVIEW!
        </button>
      )
    }
  }


  return (
    <div className="reviews-main-container">
      <div className= "spot-star-review-intro">
        {currentSpot.avgStarRating}/5🟊 · {currentSpot.numReviews} {currentSpot.numReviews === 1 ? 'review' : 'reviews'}
      </div>

      <div className="review-container">

        {allReviewsValues.map(review => (

          <div className= "review-list">

            <div className="user-rating">
            <strong>Airbb</strong> user rates this listing {review.stars}/5 🟊
            </div>

            <div className='review-description'>
              "{review.review}"
            </div>

            <div className="review-remove-button-container">
            {removeButton(review.userId, review.id)}
            </div>

          </div>
        ))}
      </div>

      <div className="create-review-form">
        {createReviewForm}
      </div>
    </div>
  )

}


export default AllReviews;
