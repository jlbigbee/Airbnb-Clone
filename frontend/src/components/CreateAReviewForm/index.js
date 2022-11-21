import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import './CreateAReviewForm.css'
import { createAReview } from '../../store/reviews';

const CreateAReviewForm = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [review, setReview] = useState("")
  const [stars, setStars] = useState("")
  const [validationErrors, setValidationErrors] = useState([])
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const errors = [];

    if (!review.length) errors.push('Review cannot be empty')
    if (!stars) errors.push('Select a rating between 1 through 5!')
    if (stars < 0 || stars > 5) errors.push('Select a rating between 1 through 5!')

    setValidationErrors(errors)
  }, [review, stars]);

  const submitHandler = async e => {
    e.preventDefault();

    setHasSubmitted(true);

    const reviewInfo = {
      review,
      stars
    };

    if (!validationErrors.length) {
      let createdReview = await dispatch(createAReview(spotId, reviewInfo));
      if (createdReview) history.push(`/spots/${spotId}`);

      setReview('');
      setStars(0);
      setValidationErrors([]);
      setHasSubmitted(false);
    }
  }

  return (
    <div>
      <form className="submit-a-review-container"onSubmit={submitHandler}>
        <h2>Submit a Review</h2>

        <div >
          <input className= "star-entry-box"
            type='number'
            placeholder='Rating'
            value={stars}
            min="1"
            max="5"
            onChange={e => setStars(e.target.value)}
          />

          <textarea className="review-entry-box"
            placeholder='Begin your review here...'
            value={review}
            onChange={e => setReview(e.target.value)}
          />

        </div>

        {hasSubmitted && validationErrors.length > 0 && (
          <div>
            To submit a review, please handle the following errors:
            <ul>
              {validationErrors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <button className ="submit-review-button" type='submit'>Submit your review!</button>
        </div>
      </form>
    </div>
  )
}

export default CreateAReviewForm;
