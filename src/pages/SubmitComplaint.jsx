import React, { useEffect, useRef, useState } from 'react';
import Layout from '../components/Layout';
import { citizenLinks } from './CitizenDashboard';
import { useComplaints } from '../context/ComplaintContext';
import classifier from '../utils/classifier';
import { api } from '../utils/api';
import { useNavigate } from 'react-router-dom';

export default function SubmitComplaint() {
    const { addComplaint } = useComplaints();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    // Basic info
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');

    // Department selection
    const departments = classifier.departments;
    const departmentOptions = departments.includes('General')
        ? departments
        : [...departments, 'General'];
    const [department, setDepartment] = useState('General');
    const [autoDepartment, setAutoDepartment] = useState('General');
    const [isDeptManuallySet, setIsDeptManuallySet] = useState(false);
    const [isDeptLoading, setIsDeptLoading] = useState(false);
    const aiDebounceRef = useRef(null);
    const lastClassifiedTextRef = useRef('');

    // Location details
    const [street, setStreet] = useState('');
    const [area, setArea] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [isLocLoading, setIsLocLoading] = useState(false);
    const [locError, setLocError] = useState('');

    // Evidence
    const [evidence, setEvidence] = useState(null);

    // Validation state
    const [touched, setTouched] = useState({
        title: false,
        desc: false,
        pincode: false,
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEvidence(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Derived validations
    const titleValid = title.trim().length >= 5;
    const descValid = desc.trim().length >= 15;
    const pincodeValid = /^\d{6}$/.test(pincode.trim());

    const titleError = !titleValid ? 'Title must be at least 5 characters.' : '';
    const descError = !descValid ? 'Description must be at least 15 characters.' : '';
    const pincodeError = !pincodeValid ? 'Pincode must be a 6‑digit number.' : '';

    const isFormValid =
        titleValid &&
        descValid &&
        pincodeValid &&
        !!city.trim() &&
        !!state.trim();

    // Auto-detect department via backend AI (debounced)
    useEffect(() => {
        const text = desc.trim().length > 5
            ? desc.trim()
            : `${title} ${desc}`.trim();
        if (text.length < 15) {
            setAutoDepartment('General');
            setIsDeptLoading(false);
            return;
        }

        if (text === lastClassifiedTextRef.current) {
            return;
        }

        let cancelled = false;
        setIsDeptLoading(true);

        if (aiDebounceRef.current) {
            clearTimeout(aiDebounceRef.current);
        }

        aiDebounceRef.current = setTimeout(async () => {
            try {
                console.log('Calling AI with:', text);
                const response = await api.predictDepartment(text);
                console.log('AI response:', response);
                if (cancelled) return;
                const predicted = response?.department || 'General';
                lastClassifiedTextRef.current = text;
                setAutoDepartment(predicted);
                if (!isDeptManuallySet) {
                    const safeDepartment = departmentOptions.includes(predicted)
                        ? predicted
                        : 'General';
                    setDepartment(safeDepartment);
                }
            } catch (_error) {
                // If API fails, keep previous autoDept and selection
            } finally {
                if (!cancelled) {
                    setIsDeptLoading(false);
                }
            }
        }, 1800);

        return () => {
            cancelled = true;
            if (aiDebounceRef.current) {
                clearTimeout(aiDebounceRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [title, desc, isDeptManuallySet, departmentOptions]);

    const handleDeptChange = (e) => {
        const value = e.target.value;
        setDepartment(value);
        setIsDeptManuallySet(true);
    };

    const handleUseCurrentLocation = async () => {
        setLocError('');
        if (!navigator.geolocation) {
            setLocError('Geolocation is not supported in this browser.');
            return;
        }

        setIsLocLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
                    const res = await fetch(url, {
                        headers: {
                            'Accept': 'application/json',
                        },
                    });
                    const data = await res.json();
                    const addr = data.address || {};

                    const parsedAddress = {
                        street:
                            addr.road ||
                            addr.neighbourhood ||
                            '',
                        area:
                            addr.suburb ||
                            addr.neighbourhood ||
                            addr.village ||
                            addr.hamlet ||
                            '',
                        city:
                            addr.city ||
                            addr.town ||
                            addr.municipality ||
                            addr.county ||
                            '',
                        state: addr.state || '',
                        pincode: addr.postcode || '',
                        fullAddress: data.display_name || ''
                    };

                    console.log('RAW ADDRESS:', addr);
                    console.log('PARSED:', parsedAddress);

                    // Only overwrite fields when we have a non-empty new value
                    if (parsedAddress.street) {
                        setStreet((prev) => prev || parsedAddress.street);
                    }
                    if (parsedAddress.area) {
                        setArea((prev) => prev || parsedAddress.area);
                    }
                    if (parsedAddress.city) {
                        setCity((prev) => prev || parsedAddress.city);
                    }
                    if (parsedAddress.state) {
                        setState((prev) => prev || parsedAddress.state);
                    }
                    if (parsedAddress.pincode) {
                        setPincode((prev) => prev || parsedAddress.pincode);
                    }
                } catch (_error) {
                    setLocError('Unable to fetch address from your location. Please enter it manually.');
                } finally {
                    setIsLocLoading(false);
                }
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    setLocError('Location permission denied. Please enter address manually.');
                } else {
                    setLocError('Unable to access your location. Please enter address manually.');
                }
                setIsLocLoading(false);
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user.id) return;
        if (!isFormValid) return;

        const addressParts = [
            street.trim(),
            area.trim(),
            city.trim(),
            state.trim(),
            pincode.trim(),
        ].filter(Boolean);

        const combinedLocation = addressParts.join(', ');

        try {
            const created = await addComplaint({
                title,
                description: desc,
                location: combinedLocation,
                department,
                status: 'Submitted',
                userId: user.id,
                image: evidence
            });

            navigate(`/tracking/${created.id}`);
        } catch (_error) {
            // No visual changes requested; keep existing UI as-is.
        }
    };

    const inputBorderStyle = (fieldValid, fieldTouched) => {
        if (!fieldTouched) return {};
        return {
            borderColor: fieldValid ? 'var(--status-resolved)' : 'var(--status-error)',
        };
    };

    return (
        <Layout links={citizenLinks} user={user} mainStyle={{ padding: 0 }}>
            <div className="submit-container form-container" style={{ margin: '2rem auto', padding: '0 1.5rem' }}>
                <div className="header-card" style={{ backgroundColor: 'rgba(33, 102, 105, 0.04)', borderRadius: 'var(--radius-lg)', padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Submit New Complaint</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '400px' }}>Your report helps us build a better city. Please provide accurate details.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '2.5rem', boxShadow: 'var(--shadow-sm)' }}>
                    {/* User Info */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <div style={{ width: '24px', height: '1px', backgroundColor: 'var(--primary)', marginRight: '0.75rem' }}></div>
                        User Info
                    </div>

                    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div className="form-group">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={user?.name || ""}
                                readOnly
                                style={{ backgroundColor: 'var(--bg-color)', cursor: 'not-allowed' }}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={user?.email || ""}
                                readOnly
                                style={{ backgroundColor: 'var(--bg-color)', cursor: 'not-allowed' }}
                            />
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <div style={{ width: '24px', height: '1px', backgroundColor: 'var(--primary)', marginRight: '0.75rem' }}></div>
                        Basic Information
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Complaint Title</label>
                        <input
                            type="text"
                            className="form-control"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            onBlur={() => setTouched(prev => ({ ...prev, title: true }))}
                            placeholder="e.g., Pothole on Maple Street"
                            style={inputBorderStyle(titleValid, touched.title)}
                        />
                        {touched.title && !titleValid && (
                            <div style={{ color: 'var(--status-error)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{titleError}</div>
                        )}
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Detailed Description</label>
                        <textarea
                            className="form-control"
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                            onBlur={() => setTouched(prev => ({ ...prev, desc: true }))}
                            placeholder="Describe the issue clearly. Include location, severity, landmarks"
                            style={{
                                minHeight: '140px',
                                ...inputBorderStyle(descValid, touched.desc),
                            }}
                        ></textarea>
                        {touched.desc && !descValid && (
                            <div style={{ color: 'var(--status-error)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{descError}</div>
                        )}
                    </div>

                    {/* Complaint Details & Department */}
                    <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <div style={{ width: '24px', height: '1px', backgroundColor: 'var(--primary)', marginRight: '0.75rem' }}></div>
                        Complaint Details & Department
                    </div>

                    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label className="form-label">
                                Department{' '}
                                <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                                    (Auto-detected{autoDepartment ? `: ${autoDepartment}` : ''})
                                </span>
                            </label>
                            <select className="form-control" value={department} onChange={handleDeptChange}>
                                {isDeptLoading && (
                                    <option value={department} disabled>
                                        Detecting...
                                    </option>
                                )}
                                {departmentOptions.map((d) => (
                                    <option key={d} value={d}>
                                        {d}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Location Details */}
                    <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <div style={{ width: '24px', height: '1px', backgroundColor: 'var(--primary)', marginRight: '0.75rem' }}></div>
                        Location Details
                    </div>

                    <div className="grid" style={{ gridTemplateColumns: '2fr 1.5fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div className="form-group">
                            <label className="form-label">Street Address</label>
                            <input
                                type="text"
                                className="form-control"
                                value={street}
                                onChange={e => setStreet(e.target.value)}
                                placeholder="House / street"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Area / Locality</label>
                            <input
                                type="text"
                                className="form-control"
                                value={area}
                                onChange={e => setArea(e.target.value)}
                                placeholder="Area, locality, or neighbourhood"
                            />
                        </div>
                    </div>

                    <div className="container-location-row" style={{ marginBottom: '0.75rem' }}>
                        <div className="form-group">
                            <label className="form-label">City</label>
                            <input
                                type="text"
                                className="form-control"
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                placeholder="City"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">State</label>
                            <input
                                type="text"
                                className="form-control"
                                value={state}
                                onChange={e => setState(e.target.value)}
                                placeholder="State"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Pincode</label>
                            <input
                                type="text"
                                className="form-control"
                                value={pincode}
                                onChange={e => setPincode(e.target.value)}
                                onBlur={() => setTouched(prev => ({ ...prev, pincode: true }))}
                                placeholder="6-digit code"
                                style={inputBorderStyle(pincodeValid, touched.pincode)}
                            />
                            {touched.pincode && !pincodeValid && (
                                <div style={{ color: 'var(--status-error)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{pincodeError}</div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <button
                            type="button"
                            className="btn btn-outline"
                            style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', backgroundColor: 'white' }}
                            onClick={handleUseCurrentLocation}
                            disabled={isLocLoading}
                        >
                            {isLocLoading ? 'Detecting location…' : 'Use Current Location'}
                        </button>
                        {locError && (
                            <div style={{ color: 'var(--status-error)', fontSize: '0.75rem' }}>{locError}</div>
                        )}
                    </div>

                    {/* Evidence */}
                    <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <div style={{ width: '24px', height: '1px', backgroundColor: 'var(--primary)', marginRight: '0.75rem' }}></div>
                        Evidence
                    </div>

                    <div className="form-group">
                        <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block', fontWeight: 600 }}>Upload Evidence <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span></label>
                        <div style={{ border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2rem', textAlign: 'center', position: 'relative', cursor: 'pointer', backgroundColor: 'rgba(33, 102, 105, 0.02)', transition: 'all 0.2s' }}>
                            <input 
                                type="file" 
                                accept="image/jpeg, image/png, image/jpg" 
                                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%', zIndex: 10 }} 
                                onChange={handleImageChange}
                            />
                            {evidence ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                    <img src={evidence} alt="Preview" style={{ maxHeight: '160px', borderRadius: 'var(--radius)', objectFit: 'contain', boxShadow: 'var(--shadow-sm)' }} />
                                    <span style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600 }}>Click or drag to change image</span>
                                </div>
                            ) : (
                                <div>
                                    <div style={{ width: '48px', height: '48px', margin: '0 auto 1rem', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--primary)' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                    </div>
                                    <div style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.25rem' }}>Click to upload an image</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>JPG, PNG up to 5MB</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2rem', marginTop: '2rem' }}>
                        <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-ghost" style={{ fontWeight: 700 }}>CANCEL</button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ padding: '0.75rem 1.5rem', opacity: isFormValid ? 1 : 0.5, cursor: isFormValid ? 'pointer' : 'not-allowed' }}
                            disabled={!isFormValid}
                        >
                            SUBMIT COMPLAINT
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
