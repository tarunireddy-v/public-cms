import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRules = {
  minLength: /.{6,}/,
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /\d/,
  special: /[^A-Za-z0-9]/,
};

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const errors = useMemo(() => {
    const nameError = name.trim().length < 2 ? 'Name must be at least 2 characters.' : '';
    const emailError = email && !emailRegex.test(email) ? 'Enter a valid email address.' : '';

    const passwordChecks = {
      minLength: passwordRules.minLength.test(password),
      uppercase: passwordRules.uppercase.test(password),
      lowercase: passwordRules.lowercase.test(password),
      number: passwordRules.number.test(password),
      special: passwordRules.special.test(password),
    };

    const passwordError =
      password.length > 0 && !Object.values(passwordChecks).every(Boolean)
        ? 'Password does not meet all requirements.'
        : '';

    const confirmPasswordError =
      confirmPassword.length > 0 && confirmPassword !== password
        ? 'Confirm password must match password.'
        : '';

    return { nameError, emailError, passwordError, confirmPasswordError, passwordChecks };
  }, [name, email, password, confirmPassword]);

  const isValid =
    name.trim().length >= 2 &&
    emailRegex.test(email) &&
    Object.values(errors.passwordChecks).every(Boolean) &&
    confirmPassword === password &&
    !submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    if (!isValid) return;

    try {
      setSubmitting(true);
      await api.register({
        name: name.trim(),
        email: email.trim(),
        password,
        role: 'Citizen',
      });
      setSubmitSuccess('Signup successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 800);
    } catch (error) {
      setSubmitError(error.message || 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color)', padding: '2rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '520px', padding: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Create Account</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Sign up as a citizen to submit and track complaints.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
            {errors.nameError && <small style={{ color: 'var(--status-error)', marginTop: '0.35rem' }}>{errors.nameError}</small>}
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
            {errors.emailError && <small style={{ color: 'var(--status-error)', marginTop: '0.35rem' }}>{errors.emailError}</small>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
            />
            <small style={{ color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Minimum 6 chars, with uppercase, lowercase, number, and special character.
            </small>
            {errors.passwordError && <small style={{ color: 'var(--status-error)', marginTop: '0.35rem' }}>{errors.passwordError}</small>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
            />
            {errors.confirmPasswordError && (
              <small style={{ color: 'var(--status-error)', marginTop: '0.35rem' }}>
                {errors.confirmPasswordError}
              </small>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', opacity: isValid ? 1 : 0.6, cursor: isValid ? 'pointer' : 'not-allowed' }}
            disabled={!isValid}
          >
            {submitting ? 'Creating account...' : 'Sign Up'}
          </button>

          {submitError && <p style={{ marginTop: '0.75rem', color: 'var(--status-error)' }}>{submitError}</p>}
          {submitSuccess && <p style={{ marginTop: '0.75rem', color: 'var(--status-resolved)' }}>{submitSuccess}</p>}
        </form>

        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
