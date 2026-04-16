import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import "./LoginPage.css";
import "./SignInPage.css";

/* ─── which panel is visible ─── */
const PANEL = { LOGIN: "login", FORGOT: "forgot", RESET: "reset" };

/* ─── small password-strength helper ─── */
const getStrength = (p) => {
  if (!p) return { level: 0, label: "", color: "" };
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[!@#$%^&*]/.test(p)) s++;
  if (s <= 1) return { level: 25, label: "Weak",   color: "#ef4444" };
  if (s <= 2) return { level: 50, label: "Fair",   color: "#f59e0b" };
  if (s <= 3) return { level: 75, label: "Good",   color: "#3b82f6" };
  return          { level: 100, label: "Strong", color: "#22c55e" };
};

const SignInPage = () => {
  const navigate = useNavigate();

  /* ── side image ── */
  const [sideImage, setSideImage] = useState("");
  const [photoCredit, setPhotoCredit] = useState({ name: "", link: "" });
  useEffect(() => {
    setSideImage("https://loremflickr.com/1080/1920/supercar,hypercar,racing/all");
    setPhotoCredit({ name: "Free API: LoremFlickr", link: "https://loremflickr.com" });
  }, []);

  /* ── panel state ── */
  const [panel, setPanel]           = useState(PANEL.LOGIN);
  const [prevPanel, setPrevPanel]   = useState(null);
  const [animating, setAnimating]   = useState(false);

  /* ── login form ── */
  const [loginData, setLoginData]         = useState({ email: "", password: "" });
  const [loginErrors, setLoginErrors]     = useState({});
  const [showPassword, setShowPassword]   = useState(false);
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [loginError, setLoginError]       = useState("");

  /* ── forgot form ── */
  const [forgotEmail, setForgotEmail]   = useState("");
  const [forgotError, setForgotError]   = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  /* ── reset form ── */
  const [resetToken, setResetToken]         = useState("");
  const [resetPass, setResetPass]           = useState("");
  const [resetConfirm, setResetConfirm]     = useState("");
  const [showResetPass, setShowResetPass]   = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [resetError, setResetError]         = useState("");
  const [resetSuccess, setResetSuccess]     = useState("");
  const [isResetLoading, setIsResetLoading] = useState(false);

  /* ─────────────────────── helpers ─────────────────────── */
  const goTo = (target) => {
    if (animating || target === panel) return;
    setPrevPanel(panel);
    setAnimating(true);
    setPanel(target);
    setTimeout(() => setAnimating(false), 420);
  };

  /* sign-in */
  const validateLogin = () => {
    const e = {};
    if (!loginData.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) e.email = "Invalid email";
    if (!loginData.password) e.password = "Password is required";
    setLoginErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignIn = async (ev) => {
    ev.preventDefault();
    if (!validateLogin()) return;
    setIsSubmitting(true);
    setLoginError("");
    try {
      const res  = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Login failed");
      setSubmitSuccess(true);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setTimeout(() => { setSubmitSuccess(false); navigate("/dashboard"); }, 1000);
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* forgot password */
  const handleForgot = async (ev) => {
    ev.preventDefault();
    if (!forgotEmail.trim()) { setForgotError("Please enter your email address."); return; }
    setIsForgotLoading(true);
    setForgotError("");
    setForgotSuccess("");
    try {
      const res  = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Request failed");
      setForgotSuccess("Reset token sent! Moving you to the reset form…");
      // Dev mode: token is returned in response — auto-populate it
      if (data.token) setResetToken(data.token);
      setTimeout(() => { setForgotSuccess(""); goTo(PANEL.RESET); }, 1800);
    } catch (err) {
      setForgotError(err.message);
    } finally {
      setIsForgotLoading(false);
    }
  };

  /* reset password */
  const handleReset = async (ev) => {
    ev.preventDefault();
    if (!resetToken.trim()) { setResetError("Reset token is required."); return; }
    if (resetPass.length < 8) { setResetError("Password must be at least 8 characters."); return; }
    if (resetPass !== resetConfirm) { setResetError("Passwords do not match."); return; }
    setIsResetLoading(true);
    setResetError("");
    setResetSuccess("");
    try {
      const res  = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, password: resetPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Reset failed");
      setResetSuccess("Password reset! Returning to sign in…");
      setTimeout(() => {
        setResetSuccess("");
        setResetToken(""); setResetPass(""); setResetConfirm("");
        goTo(PANEL.LOGIN);
      }, 2000);
    } catch (err) {
      setResetError(err.message);
    } finally {
      setIsResetLoading(false);
    }
  };

  /* ──────────────── render ──────────────── */
  const strength = getStrength(resetPass);

  return (
    <Container fluid className="vh-100 bg-light d-flex align-items-center justify-content-center p-3 p-md-5">
      <Row
        className="bg-white shadow-lg rounded-4 overflow-hidden w-100"
        style={{ maxWidth: "1200px", minHeight: "80vh" }}
      >
        {/* ── Left image ── */}
        <Col
          md={6}
          className="d-none d-md-flex bg-image-side p-5 text-white flex-column justify-content-end"
          style={{ backgroundImage: `url(${sideImage})` }}
        >
          {!sideImage && (
            <div className="position-absolute top-50 start-50 translate-middle">
              <Spinner animation="border" variant="light" />
            </div>
          )}
          <div className="overlay-content pb-4">
            <h2 className="display-5 fw-bold mb-3">
              {panel === PANEL.LOGIN  && <>Welcome<br />back.</>}
              {panel === PANEL.FORGOT && <>Forgot<br />your password?</>}
              {panel === PANEL.RESET  && <>Reset<br />your password.</>}
            </h2>
            <p className="fs-5 text-white-50">
              {panel === PANEL.LOGIN  && "Pick up right where you left off. Your team is waiting for you."}
              {panel === PANEL.FORGOT && "No worries — we'll help you get back in seconds."}
              {panel === PANEL.RESET  && "Choose a strong new password to secure your account."}
            </p>
            {photoCredit.name && (
              <small className="text-white-50 d-block mt-4">
                Photo by{" "}
                <a href={photoCredit.link} className="text-white" target="_blank" rel="noreferrer">
                  {photoCredit.name}
                </a>
              </small>
            )}
          </div>
        </Col>

        {/* ── Right panel ── */}
        <Col md={6} sm={12} className="p-4 p-md-5 d-flex flex-column justify-content-center position-relative overflow-hidden">
          <div className="signin-panels-wrapper">

            {/* ════════════ SIGN-IN PANEL ════════════ */}
            <div className={`signin-panel ${panel === PANEL.LOGIN ? "panel-active" : prevPanel === PANEL.LOGIN ? "panel-exit-left" : "panel-hidden-right"}`}>
              <div className="mx-auto w-100" style={{ maxWidth: "400px" }}>

                <div className="mb-5 d-flex align-items-center gap-2">
                  <div className="brand-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-100 h-100">
                      <path d="M4 12l4 4 8-8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h4 className="fw-bold m-0 text-dark">RaceXtreme Elite</h4>
                </div>

                <h2 className="fw-bold mb-2 text-dark">Sign in to your account</h2>
                <p className="text-muted mb-4">Enter your email and password to access your dashboard.</p>

                {loginError    && <div className="auth-alert auth-alert--error">{loginError}</div>}
                {submitSuccess && <div className="auth-alert auth-alert--success">Successfully signed in! Redirecting…</div>}

                <Form onSubmit={handleSignIn} noValidate>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small text-dark">Email Address</Form.Label>
                    <Form.Control
                      type="email" name="email" placeholder="name@company.com"
                      value={loginData.email}
                      onChange={e => { setLoginData(p => ({ ...p, email: e.target.value })); setLoginErrors(p => ({ ...p, email: "" })); }}
                      isInvalid={!!loginErrors.email}
                      className="bg-light border-0" size="lg"
                    />
                    <Form.Control.Feedback type="invalid">{loginErrors.email}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <Form.Label className="fw-semibold small text-dark m-0">Password</Form.Label>
                      <button type="button" className="forgot-link" onClick={() => goTo(PANEL.FORGOT)}>
                        Forgot password?
                      </button>
                    </div>
                    <div className="position-relative">
                      <Form.Control
                        type={showPassword ? "text" : "password"} name="password"
                        placeholder="Enter password"
                        value={loginData.password}
                        onChange={e => { setLoginData(p => ({ ...p, password: e.target.value })); setLoginErrors(p => ({ ...p, password: "" })); }}
                        isInvalid={!!loginErrors.password}
                        className="bg-light border-0" size="lg"
                      />
                      <Button variant="link" className="position-absolute end-0 top-50 translate-middle-y text-secondary text-decoration-none"
                        onClick={() => setShowPassword(v => !v)}>
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                      <Form.Control.Feedback type="invalid">{loginErrors.password}</Form.Control.Feedback>
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
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-primary text-decoration-none fw-semibold">Sign up</Link>
                  </p>
                </Form>
              </div>
            </div>

            {/* ════════════ FORGOT PASSWORD PANEL ════════════ */}
            <div className={`signin-panel ${panel === PANEL.FORGOT ? "panel-active" : prevPanel === PANEL.FORGOT ? "panel-exit-left" : "panel-hidden-right"}`}>
              <div className="mx-auto w-100" style={{ maxWidth: "400px" }}>

                <button className="back-arrow-btn mb-4" onClick={() => goTo(PANEL.LOGIN)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 5l-7 7 7 7"/>
                  </svg>
                  Back to sign in
                </button>

                {/* Icon */}
                <div className="auth-icon-circle mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>

                <h2 className="fw-bold mb-2 text-dark">Forgot password?</h2>
                <p className="text-muted mb-4">
                  Enter the email you registered with and we'll send you a reset token.
                </p>

                {forgotError   && <div className="auth-alert auth-alert--error">{forgotError}</div>}
                {forgotSuccess && <div className="auth-alert auth-alert--success">{forgotSuccess}</div>}

                <Form onSubmit={handleForgot} noValidate>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold small text-dark">Email Address</Form.Label>
                    <Form.Control
                      type="email" placeholder="name@company.com"
                      value={forgotEmail}
                      onChange={e => { setForgotEmail(e.target.value); setForgotError(""); }}
                      className="bg-light border-0" size="lg"
                    />
                  </Form.Group>

                  <Button type="submit" variant="primary" size="lg" className="w-100 fw-bold mb-3" disabled={isForgotLoading}>
                    {isForgotLoading
                      ? <><Spinner as="span" animation="border" size="sm" className="me-2" />Sending…</>
                      : "Send Reset Token"}
                  </Button>

                  <p className="text-center text-muted small m-0">
                    Already have a token?{" "}
                    <button type="button" className="forgot-link" onClick={() => goTo(PANEL.RESET)}>
                      Enter it here
                    </button>
                  </p>
                </Form>
              </div>
            </div>

            {/* ════════════ RESET PASSWORD PANEL ════════════ */}
            <div className={`signin-panel ${panel === PANEL.RESET ? "panel-active" : prevPanel === PANEL.RESET ? "panel-exit-left" : "panel-hidden-right"}`}>
              <div className="mx-auto w-100" style={{ maxWidth: "400px" }}>

                <button className="back-arrow-btn mb-4" onClick={() => goTo(PANEL.FORGOT)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 5l-7 7 7 7"/>
                  </svg>
                  Back
                </button>

                {/* Icon */}
                <div className="auth-icon-circle auth-icon-circle--green mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>

                <h2 className="fw-bold mb-2 text-dark">Reset your password</h2>
                <p className="text-muted mb-4">
                  Paste your reset token below and choose a strong new password.
                </p>

                {resetError   && <div className="auth-alert auth-alert--error">{resetError}</div>}
                {resetSuccess && <div className="auth-alert auth-alert--success">{resetSuccess}</div>}

                <Form onSubmit={handleReset} noValidate>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small text-dark">Reset Token</Form.Label>
                    <Form.Control
                      type="text" placeholder="Paste your reset token"
                      value={resetToken}
                      onChange={e => { setResetToken(e.target.value); setResetError(""); }}
                      className="bg-light border-0 font-monospace small"
                      size="lg"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small text-dark">New Password</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showResetPass ? "text" : "password"} placeholder="Min 8 characters"
                        value={resetPass}
                        onChange={e => { setResetPass(e.target.value); setResetError(""); }}
                        className="bg-light border-0" size="lg"
                      />
                      <Button variant="link" className="position-absolute end-0 top-50 translate-middle-y text-secondary text-decoration-none"
                        onClick={() => setShowResetPass(v => !v)}>
                        {showResetPass ? "Hide" : "Show"}
                      </Button>
                    </div>
                    {resetPass && (
                      <div className="mt-2">
                        <div className="strength-bar-track">
                          <div className="strength-bar-fill" style={{ width: `${strength.level}%`, background: strength.color }} />
                        </div>
                        <span className="strength-label" style={{ color: strength.color }}>{strength.label}</span>
                      </div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold small text-dark">Confirm New Password</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showConfirmPass ? "text" : "password"} placeholder="Repeat password"
                        value={resetConfirm}
                        onChange={e => { setResetConfirm(e.target.value); setResetError(""); }}
                        className="bg-light border-0" size="lg"
                      />
                      <Button variant="link" className="position-absolute end-0 top-50 translate-middle-y text-secondary text-decoration-none"
                        onClick={() => setShowConfirmPass(v => !v)}>
                        {showConfirmPass ? "Hide" : "Show"}
                      </Button>
                    </div>
                    {resetConfirm && resetPass && (
                      <small className={`mt-1 d-block ${resetPass === resetConfirm ? "text-success" : "text-danger"}`}>
                        {resetPass === resetConfirm ? "✓ Passwords match" : "✗ Passwords do not match"}
                      </small>
                    )}
                  </Form.Group>

                  <Button type="submit" variant="primary" size="lg" className="w-100 fw-bold mb-3" disabled={isResetLoading}>
                    {isResetLoading
                      ? <><Spinner as="span" animation="border" size="sm" className="me-2" />Resetting…</>
                      : "Reset Password"}
                  </Button>

                  <p className="text-center text-muted small m-0">
                    Remembered your password?{" "}
                    <button type="button" className="forgot-link" onClick={() => goTo(PANEL.LOGIN)}>
                      Sign in
                    </button>
                  </p>
                </Form>
              </div>
            </div>

          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SignInPage;
