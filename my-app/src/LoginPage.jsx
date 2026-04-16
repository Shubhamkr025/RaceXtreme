import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Spinner, ProgressBar } from "react-bootstrap";
import "./LoginPage.css";
const UNSPLASH_KEY = "ZqEpSKIOhSNjCGeJLyY-UWVhX4p9sRw-dlU4e1cfzmQ";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", username: "", phone: "",
    password: "", confirmPassword: "", dateOfBirth: "", address: "", company: ""
  });
  
  const [sideImage, setSideImage] = useState("");
  const [photoCredit, setPhotoCredit] = useState({ name: "", link: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
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

  const validateStep = (step) => {
    const errs = {};
    if (step === 1) {
      if (!formData.firstName.trim()) errs.firstName = "First name is required";
      if (!formData.lastName.trim()) errs.lastName = "Last name is required";
      if (!formData.email.trim()) errs.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Invalid email";
      if (!formData.username.trim()) errs.username = "Username required";
      if (!formData.phone.trim()) errs.phone = "Phone required";
    } else {
      if (!formData.password) errs.password = "Password required";
      else if (formData.password.length < 8) errs.password = "Min 8 chars";
      if (formData.password !== formData.confirmPassword) errs.confirmPassword = "Must match";
      if (!formData.dateOfBirth) errs.dateOfBirth = "Required";
      if (!formData.address.trim()) errs.address = "Required";
      if (!formData.company.trim()) errs.company = "Required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => { if (validateStep(1)) setCurrentStep(2); };
  const handleBack = () => setCurrentStep(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(2)) return;
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Registration failed");

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

  const getStrength = () => {
    const p = formData.password;
    if (!p) return { level: 0, color: "bg-light" };
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[!@#$%^&*]/.test(p)) s++;
    if (s <= 1) return { level: 25, color: "danger" };
    if (s <= 2) return { level: 50, color: "warning" };
    if (s <= 3) return { level: 75, color: "info" };
    return { level: 100, color: "success" };
  };

  const strength = getStrength();

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
            <h2 className="display-5 fw-bold mb-3">Start building<br />something great.</h2>
            <p className="fs-5 text-white-50">Join thousands of creators, teams and businesses who trust us every day.</p>
            {photoCredit.name && (
              <small className="text-white-50 d-block mt-4">
                Photo by <a href={photoCredit.link} className="text-white" target="_blank" rel="noreferrer">{photoCredit.name}</a> on Unsplash
              </small>
            )}
          </div>
        </Col>

        {/* Right Form Side */}
        <Col md={6} sm={12} className="p-4 p-md-5 d-flex flex-column h-100 overflow-auto">
          <div className="mx-auto w-100 mb-auto" style={{ maxWidth: "450px" }}>
            
            <div className="mb-4 d-flex align-items-center gap-2">
              <div className="bg-primary text-white rounded p-2 d-inline-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-100 h-100">
                  <path d="M4 12l4 4 8-8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4 className="fw-bold m-0 text-dark">RaceXtreme Elite</h4>
            </div>

            <h2 className="fw-bold mb-1 text-dark">Create your account</h2>
            <p className="text-muted mb-4">
              {currentStep === 1 ? "Fill in your personal details." : "Set up your password & more."}
            </p>

            {/* Quick Step Nav */}
            <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
              <div className="d-flex align-items-center gap-2">
                <span className={`step-indicator ${currentStep >= 1 ? "bg-primary text-white" : "bg-light text-muted"}`}>1</span>
                <span className={`small fw-semibold ${currentStep >= 1 ? "text-dark" : "text-muted"}`}>Personal</span>
              </div>
              <div className="flex-grow-1 mx-3" style={{ height: "2px", backgroundColor: currentStep >= 2 ? "#0d6efd" : "#e9ecef" }} />
              <div className="d-flex align-items-center gap-2">
                <span className={`step-indicator ${currentStep >= 2 ? "bg-primary text-white" : "bg-light text-muted"}`}>2</span>
                <span className={`small fw-semibold ${currentStep >= 2 ? "text-dark" : "text-muted"}`}>Security</span>
              </div>
            </div>

            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}

            {submitSuccess && (
              <div className="alert alert-success d-flex align-items-center" role="alert">
                <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:"><use xlinkHref="#check-circle-fill"/></svg>
                <div>Account created! Welcome to the Elite Club.</div>
              </div>
            )}

            <Form onSubmit={handleSubmit} noValidate>
              
              {currentStep === 1 && (
                <div className="step-1-fields">
                  <Row className="g-3 mb-3">
                    <Col sm={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold small text-dark">First Name</Form.Label>
                        <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleChange} isInvalid={!!errors.firstName} className="bg-light border-0" />
                        <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold small text-dark">Last Name</Form.Label>
                        <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleChange} isInvalid={!!errors.lastName} className="bg-light border-0" />
                        <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small text-dark">Email</Form.Label>
                    <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} isInvalid={!!errors.email} className="bg-light border-0" />
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                  </Form.Group>

                  <Row className="g-3 mb-4">
                    <Col sm={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold small text-dark">Username</Form.Label>
                        <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} isInvalid={!!errors.username} className="bg-light border-0" />
                        <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold small text-dark">Phone</Form.Label>
                        <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} isInvalid={!!errors.phone} className="bg-light border-0" />
                        <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button type="button" variant="primary" size="lg" className="w-100 fw-bold mb-4" onClick={handleNext}>
                    Continue
                  </Button>
                </div>
              )}

              {currentStep === 2 && (
                <div className="step-2-fields">
                  
                  <Row className="g-3 mb-3">
                    <Col sm={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold small text-dark">Password</Form.Label>
                        <div className="position-relative">
                          <Form.Control type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} isInvalid={!!errors.password} className="bg-light border-0" />
                          <Button variant="link" className="position-absolute end-0 top-50 translate-middle-y text-secondary text-decoration-none p-1 border-0" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? "Hide" : "Show"}
                          </Button>
                        </div>
                        {formData.password && (
                           <ProgressBar variant={strength.color} now={strength.level} className="mt-2 text-danger" style={{height: 4}} />
                        )}
                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    <Col sm={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold small text-dark">Confirm Password</Form.Label>
                        <div className="position-relative">
                          <Form.Control type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} isInvalid={!!errors.confirmPassword} className="bg-light border-0" />
                          <Button variant="link" className="position-absolute end-0 top-50 translate-middle-y text-secondary text-decoration-none p-1 border-0" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? "Hide" : "Show"}
                          </Button>
                        </div>
                        <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="g-3 mb-4">
                    <Col sm={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold small text-dark">Date of Birth</Form.Label>
                        <Form.Control type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} isInvalid={!!errors.dateOfBirth} className="bg-light border-0" />
                        <Form.Control.Feedback type="invalid">{errors.dateOfBirth}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold small text-dark">Company</Form.Label>
                        <Form.Control type="text" name="company" value={formData.company} onChange={handleChange} isInvalid={!!errors.company} className="bg-light border-0" />
                        <Form.Control.Feedback type="invalid">{errors.company}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold small text-dark">Address</Form.Label>
                    <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} isInvalid={!!errors.address} className="bg-light border-0" />
                    <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                  </Form.Group>

                  <Row className="g-2 mb-4">
                    <Col sm={4}>
                      <Button type="button" variant="light" size="lg" className="w-100 fw-bold border text-muted" onClick={handleBack}>
                        Back
                      </Button>
                    </Col>
                    <Col sm={8}>
                      <Button type="submit" variant="primary" size="lg" className="w-100 fw-bold" disabled={isSubmitting}>
                        {isSubmitting ? <Spinner as="span" animation="border" size="sm" /> : "Create Account"}
                      </Button>
                    </Col>
                  </Row>
                </div>
              )}

              <p className="text-center text-muted m-0">
                Already have an account? <Link to="/" className="text-primary text-decoration-none fw-semibold">Sign in</Link>
              </p>
            </Form>

          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
