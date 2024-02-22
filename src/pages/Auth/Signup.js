import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import AutocompleteInput from "../../components/AutocompleteInput.js";
import Layout from "../../components/Layout/Layout/Layout";
import { register } from "../../features/apiCall";

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordLength, setPasswordLength] = useState(0);
  const [phoneNumberLength, setPhoneNumberLength] = useState(0);
  const [AgeError, setAgeError] = useState("");
  const [cardError, setCardError] = useState("");
  const [PasswordError, setPasswordError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [signup, setSignUp] = useState(true);
  const [values, setValues] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    licenceState: "",
    licenceNumber: "",
    cardNumberBack: "",
    email: "",
    password: "",
    age: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    suburb: "",
  });
  const [selectedOption, setSelectedOption] = useState("seller");
  const [isRegistered, setIsRegistered] = useState(false);
  const { isFetching, errMsg, error, token } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // toast options
  const ErrorToastOptions = {
    position: "bottom-center",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.id);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    if (name === "dob") {
      const formattedDate = format(new Date(value), "dd/MM/yyyy");
      setValues({ ...values, [name]: formattedDate });
    } else {
      setValues({ ...values, [name]: value });
    }
    if (name === "carNumberBack") {
      alert("hi");
      const length = value.length;
      if (length > 10) {
        setCardError("Card Number should be less than 10 ");
      }
    }
    if (name === "password") {
      const length = value.length;
      setPasswordLength(length);

      if (length < 8) {
        setPasswordError("Password must be at least 8 characters");
        setSignUp(false);
      } else {
        setPasswordError("");
        setSignUp(true);
      }
    } else if (name === "age") {
      if (value < 19) {
        setAgeError("Age should be greater than 18");
        setSignUp(false);
      } else {
        setAgeError("");
        setSignUp(true);
      }
    } else if (name === "phoneNumber") {
      const length = value.length;
      setPhoneNumberLength(length);

      if (length < 9 || length > 11) {
        setPhoneNumberError("Phone number must be between 9 and 11 digits");
        setSignUp(false);
      } else {
        setPhoneNumberError("");
        setSignUp(true);
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (token) {
      navigate("/");
    }
  }, [navigate, token, error, isFetching]);

  const handleTogglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      firstName,
      middleName,
      lastName,
      email,
      password,
      dob,
      phoneNumber,
      address,
      city,
      state,
      postal_code,
      suburb,
      licenceNumber,
      licenceState,
      cardNumberBack,
    } = values;

    // Validate password length
    register(dispatch, {
      firstName,
      middleName,
      lastName,
      email,
      password,
      dob,
      phoneNumber,
      address,
      city,
      state,
      postal_code,
      suburb,
      licenceNumber,
      licenceState,
      cardNumberBack,
    });
    setIsRegistered(true);
  };

  useEffect(() => {
    if (isRegistered && !isFetching && !error) {
      setIsRegistered(false);
      navigate("/"); // Redirect to the homepage after successful registration
    }
    if (error && !isFetching && isRegistered) {
      // toast.error(errMsg, ErrorToastOptions);
      setIsRegistered(false);
    }
  }, [isRegistered, isFetching, error, errMsg, navigate]);
  const handleAutocompleteSelect = (
    address,
    suburb,
    city,
    state,
    postalCode
  ) => {
    // Set the selected address, state,and postal code in the component state
    setValues({
      ...values,
      address: address,
      suburb: suburb,
      city: city,
      state: state,
      postal_code: postalCode,
    });
  };
  return (
    <Layout>
      <section className="Signup-container">
        <div className="form-image"></div>
        <div className="heading-section form-container">
          <h2>SIGNUP ACCOUNT</h2>
          <Form id="Signup-form" onSubmit={handleSubmit}>
            <Container>
              <Row>
                <Col>
                  {" "}
                  <InputGroup className="I-input mb-3">
                    <i className="fa fa-user " />

                    <Form.Control
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      onChange={handleChange}
                      required
                    />
                  </InputGroup>
                </Col>
              </Row>

              <Row>
                <Col>
                  <InputGroup className="I-input mb-3">
                    <Form.Control
                      type="text"
                      name="middleName"
                      placeholder="Middle Name"
                      onChange={handleChange}
                    />
                  </InputGroup>
                </Col>
                <Col>
                  <InputGroup className="I-input mb-3">
                    <Form.Control
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      onChange={handleChange}
                      required
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  {" "}
                  <InputGroup className="I-input mb-3">
                    <i className="fa fa-envelope" />

                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      onChange={handleChange}
                      required
                    />
                  </InputGroup>
                </Col>
              </Row>

              <Row>
                <Col>
                  <InputGroup className="I-input mb-3">
                    <i className="fa fa-lock" />

                    <Form.Control
                      type={passwordVisible ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      onChange={handleChange}
                      className={PasswordError ? "is-invalid" : ""}
                      required
                    />

                    <NavLink
                      className="password-eye"
                      onClick={handleTogglePasswordVisibility}
                    >
                      {passwordVisible ? (
                        <i className="fa fa-eye-slash " />
                      ) : (
                        <i className="fa-solid fa-eye" />
                      )}
                    </NavLink>
                    <div className="invalid-feedback">{PasswordError}</div>
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <InputGroup className="I-input mb-3">
                    <Form.Control
                      type="date"
                      name="dob"
                      placeholder="Date of Birth"
                      onChange={handleChange}
                      required
                    />
                  </InputGroup>
                </Col>
                <Col sm={6}>
                  {" "}
                  <InputGroup className="I-input mb-3">
                    <i className="fa fa-phone" />

                    <Form.Control
                      type="number"
                      name="phoneNumber"
                      placeholder=" Phone number"
                      onChange={handleChange}
                      className={phoneNumberError ? "is-invalid" : ""}
                      required
                    />
                    <div className="invalid-feedback">{phoneNumberError}</div>
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  {" "}
                  <InputGroup className="I-input mb-3">
                    <i className="fa fa-globe" />
                    <div className="w-100">
                      <AutocompleteInput
                        className="autocomplete-address"
                        type="text"
                        value={values.address}
                        onChange={handleChange}
                        onSelect={handleAutocompleteSelect}
                        placeholder="Search Address ..."
                        required
                      />
                    </div>
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputGroup className="I-input mb-3">
                    <i className="fa fa-map-marker" />
                    <Form.Control
                      type="text"
                      nane="state"
                      value={values.state}
                      onChange={handleChange}
                      placeholder="State ..."
                      required
                    />
                  </InputGroup>
                </Col>

                <Col>
                  <InputGroup className="I-input mb-3">
                    <i className="fa-solid fa-city" />
                    <Form.Control
                      type="text"
                      nane="city"
                      value={values.city}
                      onChange={handleChange}
                      placeholder="City/Town ..."
                      required
                    />{" "}
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  {" "}
                  <InputGroup className="I-input mb-3">
                    <i class="fa fa-bars" aria-hidden="true" />
                    <Form.Control
                      type="text"
                      nane="suburb"
                      value={values.suburb}
                      onChange={handleChange}
                      placeholder="Suburb ..."
                      required
                    />{" "}
                  </InputGroup>
                </Col>

                <Col>
                  {" "}
                  <InputGroup className="I-input mb-3">
                    <i className="fa fa-map-pin" />
                    <Form.Control
                      type="text"
                      name="postal_code"
                      value={values.postal_code}
                      onChange={handleChange}
                      placeholder="Postal code/Zip code ..."
                      required
                    />
                  </InputGroup>
                </Col>
              </Row>

              <Row>
                <Col sm={6}>
                  <InputGroup className="I-input mb-3">
                    <Form.Control
                      type="text"
                      name="licenceNumber"
                      placeholder="Licence Number"
                      onChange={handleChange}
                      required
                    />
                  </InputGroup>
                </Col>
                <Col sm={6}>
                  <InputGroup className="I-input mb-3">
                    <Form.Control
                      type="text"
                      name="licenceState"
                      placeholder="Licence State"
                      onChange={handleChange}
                      required
                    />
                  </InputGroup>
                </Col>
              </Row>

              <Row>
                <Col>
                  <InputGroup className="I-input mb-3">
                    <Form.Control
                      type="text"
                      name="cardNumberBack"
                      placeholder="Card Number Back"
                      onChange={handleChange}
                      required
                    />
                    <div className="invalid-feedback">{cardError}</div>
                  </InputGroup>
                </Col>
              </Row>

              {isFetching ? (
                <Button variant="dark" size="lg" disabled>
                  <Spinner animation="border" variant="light" />
                </Button>
              ) : (
                <button
                  className="advanced-button"
                  type="submit"
                  disabled={!signup}
                >
                  Sign Up
                </button>
              )}
            </Container>
          </Form>
          <div className="login-link mt-3">
            <p>
              Already have an account?{" "}
              <NavLink
                to="/login"
                className="text-decoration-none text-muted font-weight-bold"
              >
                Login here
              </NavLink>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Signup;
