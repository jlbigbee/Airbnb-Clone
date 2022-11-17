import { csrfFetch } from './csrf';

// TYPES
const LOAD_ALL_SPOTS = 'spots/LOAD_ALL_SPOTS';
const LOAD_SPOT = 'spots/LOAD_SPOT';

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

    default:
      return state
  }
}


export default spotsReducer;
