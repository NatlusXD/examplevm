import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};
    tempErrors.username = inputs.username ? "" : "Username is required.";
    tempErrors.email = inputs.email ? (/^\S+@\S+\.\S+$/.test(inputs.email) ? "" : "Email is not valid.") : "Email is required.";
    tempErrors.password =
        inputs.password.length > 8 &&
        /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(inputs.password)
            ? ""
            : "Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, and one number.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // use this instead
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await axios.post("/auth/register", inputs);
        navigate("/login");
      } catch (error) {
        setErrors(prevErrors => ({...prevErrors, submit: error.response.data}));
      }
    }
  };

  return (
      <div className="auth">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <input
                type="text"
                placeholder="username"
                name="username"
                value={inputs.username}
                onChange={handleChange}
            />
            {errors.username && <p>{errors.username}</p>}
          </div>
          <div>
            <input
                type="email"
                placeholder="email"
                name="email"
                value={inputs.email}
                onChange={handleChange}
            />
            {errors.email && <p>{errors.email}</p>}
          </div>
          <div>
            <input
                type="password"
                placeholder="password"
                name="password"
                value={inputs.password}
                onChange={handleChange}
            />
            {errors.password && <p>{errors.password}</p>}
          </div>
          <button type="submit">Register</button>
          {errors.submit && <p>{errors.submit}</p>}
        </form>
        <span>
        Do you have an account? <Link to="/login">Login</Link>
      </span>
      </div>
  );
};

export default Register;
