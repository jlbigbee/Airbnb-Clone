import { csrfFetch } from './csrf';

// TYPES
const LOAD_ALL_SPOTS = 'spots/LOAD_ALL_SPOTS';
const LOAD_SPOT = 'spots/LOAD_SPOT';
const CREATE_SPOT = 'spots/CREATE_SPOT';
const UPDATE_SPOT = 'spots/EDIT_SPOT'
const REMOVE_SPOT = 'spots/REMOVE_SPOT';


// ACTION CREATORS

const loadALLSpots = (allSpots) => {
  return {
    type: LOAD_ALL_SPOTS,
    payload: allSpots
  };
};

const loadSpot = (spot) => {
  return {
    type: LOAD_SPOT,
    payload: spot
  };
};

const createSpot = (newSpot) => {
  return {
    type: CREATE_SPOT,
    payload: newSpot
  }
}

const updateSpot = (updatedSpot) => {
  return {
    type: UPDATE_SPOT,
    payload: updatedSpot
  };
};

const removeSpot = (removedSpot) => {
  return {
    type: REMOVE_SPOT,
    payload: removedSpot
  }
}


// THUNKS

export const getAllSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots');

  if (response.ok) {
    const allSpots = await response.json();
    console.log(allSpots);
    dispatch(loadALLSpots(allSpots));
    return allSpots;
  }
}

export const getSpotByID = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`)

  if (response.ok) {
    const spot = await response.json();
    console.log(spot)
    dispatch(loadSpot(spot));
    return spot;
  }
}

export const createASpot = (newSpot) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newSpot)
  });

  if (response.ok) {
    const newSpot = await response.json();
    dispatch(createSpot(newSpot));
    return newSpot;


  };

}


export const updateASpot = (spotId, updatedData) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData)
  })

  if (response.ok) {
    const updatedSpot = await response.json();
    dispatch(updateSpot(updatedSpot));
    return updatedSpot;
  }
}

export const removeASpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    const message = await response.json();
    dispatch(removeSpot(spotId));
    return message;
  }
}


// REDUCER

const initialState = {
  allSpots: {},
  singleSpot: {}
}

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {

    case LOAD_ALL_SPOTS:
      const newState = { ...state, allSpots: { ...state.allSpots } };
      action.payload.Spots.forEach(spot => {
        newState.allSpots[spot.id] = spot
      });
      return newState;

    case LOAD_SPOT:
      const aSpotState = { ...state, allSpots: { ...state.allSpots}, singleSpot: { ...state.singleSpot }}
      aSpotState.singleSpot = action.payload
      return aSpotState;

    case CREATE_SPOT:
        const createdSpotState = { ...state, allSpots: { ...state.allSpots }, singleSpot: { ...state.singleSpot } }
        createdSpotState.allSpots[action.payload.id] = action.payload;
        createdSpotState.singleSpot = action.payload;
        return createdSpotState;

    case REMOVE_SPOT:
          const removalState = { ...state, allSpots: { ...state.allSpots }, singleSpot: { ...state.singleSpot } }
          delete removalState.allSpots[action.payload]
          return removalState


    default:
      return state
  }
}


export default spotsReducer;
