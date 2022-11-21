import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";

import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";

import DisplayAllSpots from "./components/AllSpots";
import SingleSpot from "./components/SingleSpot";
import UpdateSpotForm from "./components/UpdateSpotForm";
import CreateASpotForm from "./components/CreateASpotForm";
import './index.css'



function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
    <Navigation isLoaded={isLoaded} />

   {isLoaded && (

     <Switch>
        <Route exact path='/spots/:spotId/edit'>
            <UpdateSpotForm />
        </Route>
        <Route path='/spots/create'>
            <CreateASpotForm />
          </Route>
        <Route path='/spots/:spotId'>
            <SingleSpot />
        </Route>
        <Route exact path='/'>
            <DisplayAllSpots/>
        </Route>
    </Switch>

    )}

    <footer className = "footer">
      <div className = "footer-data">
        'Airbb' by Jonathan Bigbee
      </div>
    </footer>

    </>

  );
}


export default App;
