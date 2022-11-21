import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { updateASpot, getSpotByID } from '../../store/spots';
import './UpdateSpotForm.css';


function UpdateSpotForm () {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();

    const currentSpot = useSelector(state => state.spots.singleSpot)

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')

    const [validationErrors, setValidationErrors] = useState([])


    useEffect(() => {
        dispatch(getSpotByID(spotId));
      }, [dispatch]);

    const submitHandler = async (e) => {
        e.preventDefault();


        const errors = [];

        if (!address.length) errors.push('Address cannot be empty')
        if (!city.length) errors.push('City cannot be empty')
        if (!state.length) errors.push('State cannot be empty')
        if (!country.length) errors.push('Country cannot be empty')
        if (!lat) errors.push('Latitude cannot be empty')
        if (!lng) errors.push('Longitude cannot be empty')
        if (!name.length) errors.push('Name cannot be empty')
        if (!description.length) errors.push('Description cannot be empty')
        if (!price) errors.push('Price cannot be empty')

        setValidationErrors(errors);

        if (!errors.length) {
            const updatedData = {
                address,
                city,
                state,
                country,
                lat,
                lng,
                name,
                description,
                price,
            }
            const updatedSpot = await dispatch(updateASpot(spotId, updatedData));
            if (updatedSpot) {
                alert("Spot successfully updated!");

            }
        }
    }


    return (
        <div className="update-spot-form-container">
            <form onSubmit={submitHandler} className="edit-form">
            <h1 className="edit-spot-title">Edit Spot Details</h1>
                {validationErrors.length > 0 &&
                    validationErrors.map((error) =>
                        <li key={error}>{error}</li>
                    )}
                <input
                    type="text"
                    onChange={e => {
                        setValidationErrors([]);
                        setAddress(e.target.value)
                    }}
                    value={address}
                    placeholder="Address" />
                <input
                    type="text"
                    onChange={e => {
                        setValidationErrors([]);
                        setCity(e.target.value)
                    }}
                    value={city}
                    placeholder="City" />
                <input
                    type="text"
                    onChange={e => {
                        setValidationErrors([]);
                        setState(e.target.value)
                    }}
                    value={state}
                    placeholder="State" />
                <input
                    type="text"
                    onChange={e => {
                        setValidationErrors([]);
                        setCountry(e.target.value)
                    }}
                    value={country}
                    placeholder="Country" />
                <input
                    type="number"
                    onChange={e => {
                        setValidationErrors([]);
                        setLat(e.target.value)
                    }}
                    value={lat}
                    step="0.00001"
                    placeholder="Latitude"
                />
                <input
                    type="number"
                    onChange={e => {
                        setValidationErrors([]);
                        setLng(e.target.value)
                    }}
                    value={lng}
                    placeholder="Longitude"
                />
                <input
                    type="text"
                    onChange={e => {
                        setValidationErrors([]);
                        setName(e.target.value)
                    }}
                    value={name}
                    placeholder="Spot Name" />
                <input
                    type="text"
                    onChange={e => {
                        setValidationErrors([]);
                        setDescription(e.target.value)
                    }}
                    value={description}
                    placeholder="Description" />
                <input
                    type="number"
                    onChange={e => {
                        setValidationErrors([]);
                        setPrice(e.target.value)
                    }}
                    value={price}
                    step="0.01"
                    placeholder="Price"
                />
                <button
                    disabled={!!validationErrors.length}
                    className="update-submit-button">
                    Submit
                </button>
            </form>
        </div>
    )
}



export default UpdateSpotForm;
