// frontend/src/components/LoginFormModal/LoginForm.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import './LoginForm.css'



function LoginForm({setShowModal}) {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(() => setShowModal(false))
      .catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      }
    );
  };


  const demoUserLogin = (e) => {
		e.preventDefault();
		return dispatch(
			sessionActions.login({ credential: 'jbluebee', password: 'bigbeefs' }))
			.then(() => setShowModal(false))
			.catch(async (res) => {
				const data = await res.json();
				if (data && data.errors) setErrors(data.errors);
			});
	};



  return (
    <div>
    <form className="login-form" onSubmit={handleSubmit}>
      <h2 className="login-title">
        Welcome to Airbb!
      </h2>
      <ul>
        {errors.map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
      </ul>

      <div>
        <label className="user-login">

          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            placeholder="Username or E-mail"
            required
          />
        </label>
      </div>

      <div>
        <label className="user-password">

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </label>
      </div>

      <div>
        <button type="submit" className="login-buttons">Continue</button>
      </div>

      <div>
    <button onClick={demoUserLogin} className="login-buttons">Demo User</button>

      </div>



    </form>
      </div>
  );
}

export default LoginForm;
