import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import "./LoginPage.css";


const SignInPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [sideImage, setSideImage] = useState("");
  const [photoCredit, setPhotoCredit] = useState({ name: "", link: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Using LoremFlickr: A 100% Free API for high-resolution keyword-based images
    const freeApiUrl = "https://loremflickr.com/1080/1920/supercar,hypercar,racing/all";
    setSideImage(freeApiUrl);
    setPhotoCredit({ name: "Free API: LoremFlickr", link: "https://loremflickr.com" });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Please enter a valid email";
    if (!formData.password) errs.password = "Password is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Login failed");

      setSubmitSuccess(true);
      
      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setTimeout(() => {
        setSubmitSuccess(false);
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container fluid className="vh-100 bg-light d-flex align-items-center justify-content-center p-3 p-md-5">
      <Row className="bg-white shadow-lg rounded-4 overflow-hidden w-100" style={{ maxWidth: "1200px", minHeight: "80vh" }}>
        
        {/* Left Image Side */}
        <Col md={6} className="d-none d-md-flex bg-image-side p-5 text-white flex-column justify-content-end"
          style={{ backgroundImage: `url(${sideImage})` }}>
          {!sideImage && (
             <div className="position-absolute top-50 start-50 translate-middle">
               <Spinner animation="border" variant="light" />
             </div>
          )}
          <div className="overlay-content pb-4">
            <h2 className="display-5 fw-bold mb-3">Welcome back.</h2>
            <p className="fs-5 text-white-50">Pick up right where you left off. Your team is waiting for you.</p>
            {photoCredit.name && (
              <small className="text-white-50 d-block mt-4">
                Photo by <a href={photoCredit.link} className="text-white" target="_blank" rel="noreferrer">{photoCredit.name}</a> on Unsplash
              </small>
            )}
          </div>
        </Col>

        {/* Right Form Side */}
        <Col md={6} sm={12} className="p-4 p-md-5 d-flex flex-column justify-content-center">
          <div className="mx-auto w-100" style={{ maxWidth: "400px" }}>
            
            <div className="mb-5 d-flex align-items-center gap-2">
              <div className="bg-primary text-white rounded p-2 d-inline-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-100 h-100">
                  <path d="M4 12l4 4 8-8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4 className="fw-bold m-0 text-dark">RaceXtreme Elite</h4>
            </div>

            <h2 className="fw-bold mb-2 text-dark">Sign in to your account</h2>
            <p className="text-muted mb-4">Enter your email and password to access your dashboard.</p>

            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}

            {submitSuccess && (
              <div className="alert alert-success d-flex align-items-center" role="alert">
                <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:"><use xlinkHref="#check-circle-fill"/></svg>
                <div>Successfully signed in! Redirecting...</div>
              </div>
            )}

            <Form onSubmit={handleSubmit} noValidate>
              
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small text-dark">Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                  className="bg-light border-0"
                  size="lg"
                />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <Form.Label className="fw-semibold small text-dark m-0">Password</Form.Label>
                  <a href="#forgot" className="text-decoration-none small">Forgot password?</a>
                </div>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                    className="bg-light border-0"
                    size="lg"
                  />
                  <Button variant="link" className="position-absolute end-0 top-50 translate-middle-y text-secondary text-decoration-none" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                  <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                </div>
              </Form.Group>

              <Button type="submit" variant="primary" size="lg" className="w-100 fw-bold mb-4" disabled={isSubmitting}>
                {isSubmitting ? <Spinner as="span" animation="border" size="sm" /> : "Sign In"}
              </Button>

              <div className="position-relative mb-4 text-center">
                <hr className="text-muted" />
                <span className="position-absolute top-50 start-50 translate-middle px-3 bg-white text-muted small">or sign in with</span>
              </div>

              <Row className="g-2 mb-4">
                <Col>
                  <Button variant="light" className="w-100 border social-btn text-dark fw-medium d-flex align-items-center justify-content-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google
                  </Button>
                </Col>
                <Col>
                  <Button variant="light" className="w-100 border social-btn text-dark fw-medium d-flex align-items-center justify-content-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1a1a1a">
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                    Apple
                  </Button>
                </Col>
              </Row>

              <p className="text-center text-muted m-0">
                Don't have an account? <Link to="/signup" className="text-primary text-decoration-none fw-semibold">Sign up</Link>
              </p>
            </Form>

          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SignInPage;
