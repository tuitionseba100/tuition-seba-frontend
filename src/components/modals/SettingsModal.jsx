import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { FiTrash2, FiPlus, FiX, FiCheckCircle } from 'react-icons/fi';
import locationData from '../../data/locations.json';

const SettingsModal = ({ show, onClose }) => {
    const [userName, setUserName] = useState('');
    const [phone, setPhone] = useState('');
    const [premiumCode, setPremiumCode] = useState('');
    const [areas, setAreas] = useState(['']);
    const [saving, setSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [hasExistingData, setHasExistingData] = useState(false);

    useEffect(() => {
        if (show) {
            const saved = localStorage.getItem('@user_settings');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    setUserName(parsed.userName || '');
                    setPhone(parsed.phone || '');
                    setPremiumCode(parsed.premiumCode || '');
                    setAreas(parsed.areas && parsed.areas.length > 0 ? parsed.areas : ['']);
                    if (parsed.userName || parsed.phone) {
                        setHasExistingData(true);
                    }
                } catch (e) {
                    console.error('Error parsing settings', e);
                }
            } else {
                setUserName('');
                setPhone('');
                setPremiumCode('');
                setAreas(['']);
                setHasExistingData(false);
            }
            setErrorMessage('');
        }
    }, [show]);

    if (!show) return null;

    const areaOptions = locationData.areaOptions.chittagong.map(area => ({
        value: area,
        label: area
    }));

    const handleSave = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        const validAreas = areas.map(a => a.trim()).filter(a => a !== '');
        const hasAnyData = userName.trim() || phone.trim() || premiumCode.trim() || validAreas.length > 0;

        // If everything is empty, clear settings entirely
        if (!hasAnyData) {
            localStorage.removeItem('@user_settings');
            window.dispatchEvent(new Event('userSettingsUpdated'));
            toast.success('সেটিংস মুছে ফেলা হয়েছে!');
            setHasExistingData(false);
            onClose();
            return;
        }

        if (!userName.trim()) {
            setErrorMessage('অনুগ্রহ করে আপনার নাম দিন।');
            return;
        }

        setSaving(true);

        // If phone or premium code is provided, validate them
        if (phone.trim() || premiumCode.trim()) {
            if (!phone.trim() || !premiumCode.trim()) {
                setErrorMessage('ফোন নম্বর এবং প্রিমিয়াম কোড উভয়ই প্রয়োজন।');
                setSaving(false);
                return;
            }

            try {
                const response = await fetch(
                    'https://tuition-seba-backend-1.onrender.com/api/regTeacher/check-apply-possible',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            premiumCode: premiumCode.trim(),
                            phone: phone.trim(),
                        }),
                    }
                );
                const data = await response.json();

                if (!response.ok) {
                    setErrorMessage(data.message || 'Verification failed');
                    setSaving(false);
                    return;
                }
            } catch (error) {
                setErrorMessage('সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না।');
                setSaving(false);
                return;
            }
        }

        const settingsData = {
            userName: userName.trim(),
            areas: validAreas,
            phone: phone.trim(),
            premiumCode: premiumCode.trim()
        };

        localStorage.setItem('@user_settings', JSON.stringify(settingsData));
        window.dispatchEvent(new Event('userSettingsUpdated'));
        
        toast.success('প্রোফাইল সেটিংস সফলভাবে সংরক্ষণ করা হয়েছে!');
        setSaving(false);
        onClose();
    };

    const addArea = () => {
        setAreas([...areas, '']);
    };

    const updateArea = (val, index) => {
        const updated = [...areas];
        updated[index] = val;
        setAreas(updated);
    };

    const removeArea = (index) => {
        if (areas.length > 1) {
            setAreas(areas.filter((_, idx) => idx !== index));
        } else {
            setAreas(['']);
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1100,
                padding: 16,
            }}
            onClick={onClose}
        >
            <div
                className="bg-white"
                style={{
                    width: '100%',
                    maxWidth: 550,
                    maxHeight: '90vh',
                    border: '2px solid #3c81e1',
                    borderRadius: 16,
                    boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    position: 'relative',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    style={{
                        padding: '16px 20px',
                        background: 'linear-gradient(135deg, #004085 0%, #0066cc 100%)',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '4px solid #004085',
                    }}
                >
                    <h5 className="m-0 fw-bold">প্রোফাইল সেটিংস</h5>
                    <button
                        onClick={onClose}
                        style={{
                            border: 'none',
                            background: 'transparent',
                            color: 'white',
                            fontSize: 22,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <FiX />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSave} style={{ overflowY: 'auto', flex: 1, padding: 24 }}>
                    <div className="mb-3">
                        <label className="form-label fw-bold text-secondary">আপনার নাম *</label>
                        <input
                            type="text"
                            className="form-control py-2"
                            placeholder="আপনার নাম লিখুন"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            style={{ borderRadius: 8 }}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold text-secondary">
                            ফোন নম্বর (যেটি দিয়ে রেজিস্ট্রেশন করেছেন)
                        </label>
                        <input
                            type="text"
                            className="form-control py-2"
                            placeholder="যেমন: 017XXXXXXXX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            style={{ borderRadius: 8 }}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold text-secondary">
                            প্রিমিয়াম কোড (যদি থাকে)
                        </label>
                        <input
                            type="text"
                            className="form-control py-2"
                            placeholder="আপনার প্রিমিয়াম কোড"
                            value={premiumCode}
                            onChange={(e) => setPremiumCode(e.target.value)}
                            style={{ borderRadius: 8 }}
                        />
                    </div>

                    {errorMessage && (
                        <div className="alert alert-danger py-2 px-3 mb-3 small" role="alert">
                            {errorMessage}
                        </div>
                    )}

                    <hr className="my-4" />

                    <div className="mb-3">
                        <label className="form-label fw-bold text-secondary d-block mb-2">
                            কোন কোন এরিয়াতে টিউশন পেতে চান?
                        </label>
                        {areas.map((area, index) => (
                            <div key={index} className="d-flex align-items-center mb-2 gap-2">
                                <div style={{ flex: 1 }}>
                                    <Select
                                        options={areaOptions}
                                        value={area ? { value: area, label: area } : null}
                                        onChange={(opt) => updateArea(opt ? opt.value : '', index)}
                                        placeholder={`সিলেক্ট করুন এরিয়া ${index + 1}`}
                                        isClearable
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                borderRadius: 8,
                                                padding: '2px 0',
                                                borderColor: area ? '#0066cc30' : '#E2E8F0',
                                            })
                                        }}
                                    />
                                </div>
                                {(areas.length > 1 || area !== '') && (
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={() => removeArea(index)}
                                        style={{
                                            borderRadius: 8,
                                            padding: '8px 12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <FiTrash2 />
                                    </button>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            className="btn btn-sm btn-light border mt-2 text-primary d-flex align-items-center gap-1 py-2 px-3"
                            onClick={addArea}
                            style={{ borderRadius: 8, fontWeight: 600 }}
                        >
                            <FiPlus /> আরো এরিয়া যোগ করুন
                        </button>
                    </div>

                    {/* Footer / Action buttons */}
                    <div className="mt-4 pt-3 border-top d-flex gap-2 justify-content-end">
                        <button
                            type="button"
                            className="btn btn-outline-secondary px-4 py-2"
                            onClick={onClose}
                            style={{ borderRadius: 8 }}
                        >
                            বাতিল
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary px-4 py-2 d-flex align-items-center gap-2"
                            disabled={saving}
                            style={{
                                borderRadius: 8,
                                background: 'linear-gradient(135deg, #004085 0%, #0066cc 100%)',
                                border: 'none',
                            }}
                        >
                            {saving ? (
                                <>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    সংরক্ষণ করা হচ্ছে...
                                </>
                            ) : (
                                <>
                                    <FiCheckCircle />
                                    {hasExistingData ? 'সেটিংস আপডেট করুন' : 'সেটিংস সেভ করুন'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsModal;
