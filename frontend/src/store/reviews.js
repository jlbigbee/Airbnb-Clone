import { csrfFetch } from "./csrf";


// TYPES
const READ_REVIEWS = 'reviews/READ_REVIEWS';
const CREATE_REVIEW = 'reviews/CREATE_REVIEW';
const REMOVE_REVIEW = 'reviews/REMOVE_REVIEW';

// ACTION CREATORS

const readReviews = (allReviews) => {
  return {
    type: READ_REVIEWS,
    payload: allReviews
  }
}

const createReview = (newReview) => {
  return {
    type: CREATE_REVIEW,
    payload: newReview
  }
}

const removeReview = (deadReview) => {
  return {
    type: REMOVE_REVIEW,
    payload: deadReview
  }
}

// THUNKS

export const getAllReviews = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`)

  if (response.ok) {
    const allReviews = await response.json();

    dispatch(readReviews(allReviews));
    return allReviews;
  }
}

export const createAReview = (spotId, newReview) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newReview)
  });

  if (response.ok) {
    const createdReview = await response.json();
    dispatch(createReview(createdReview));
    return createdReview;
  }
}

export const removeAReview = (removalId) => async dispatch => {
  const response = await csrfFetch(`/api/reviews/${removalId}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    dispatch(removeReview(removalId))
  }
}

// REDUCER

const initialState = {
  spot: {},
  user: {}
}

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case READ_REVIEWS:
      const reviewsState = { ...state, spot: {}, user: {} }
      action.payload.Reviews.forEach((review) => {
        reviewsState.spot[review.id] = review
      });
      return reviewsState;
    case CREATE_REVIEW:
      const createdReviewState = { ...state, spot: { ...state.spot }, user: { ...state.user } };
      createdReviewState.spot[action.payload.id] = action.payload;
      return createdReviewState;
    case REMOVE_REVIEW:
        const removalState = { ...state, spot: { ...state.spot }, user: { ...state.user } }
        delete removalState.spot[action.payload];
        return removalState;
    default:
      return state;
  }
}

export default reviewsReducer;
