import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { 
    FaCamera, FaTrash, FaIdCard, FaCheckCircle, FaExternalLinkAlt, 
    FaFileAlt, FaGraduationCap, FaAward, FaInfoCircle, FaTimes,
    FaUndo, FaRedo, FaSyncAlt, FaImages
} from 'react-icons/fa';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { axiosWithFallback as axios } from '../../services/fetchWithFallback';
import locationsBd from '../../data/DivisonWiseLocation.json';
import { compressImageUnderMaxKB } from '../../utilities/imageCompressor';

const fieldConfig = [
    // Personal Info
    { name: 'name', label: 'Name', col: 6, group: 'Personal Info' },
    { name: 'gender', label: 'Gender', col: 6, group: 'Personal Info', type: 'select', options: ['male', 'female'] },
    { name: 'phone', label: 'Phone', col: 6, group: 'Personal Info' },
    { name: 'alternativePhone', label: 'Alternative Phone', col: 6, group: 'Personal Info' },
    { name: 'whatsapp', label: 'WhatsApp', col: 6, group: 'Personal Info' },
    { name: 'email', label: 'Email', col: 6, group: 'Personal Info' },
    { name: 'facebookLink', label: 'Facebook Link', col: 6, group: 'Personal Info' },
    { name: 'familyPhone', label: 'Family Phone', col: 6, group: 'Personal Info' },
    { name: 'friendPhone', label: 'Friend Phone', col: 6, group: 'Personal Info' },
    { name: 'city', label: 'City', col: 6, group: 'Personal Info' },
    { name: 'currentArea', label: 'Current Area', col: 6, group: 'Personal Info' },
    { name: 'fullAddress', label: 'Full Address', col: 6, group: 'Personal Info' },
    { name: 'division', label: 'Division', col: 6, group: 'Personal Info' },
    { name: 'district', label: 'District', col: 6, group: 'Personal Info' },
    { name: 'thana', label: 'Thana', col: 6, group: 'Personal Info' },

    // Academic Info
    { name: 'academicYear', label: 'Academic Year', type: 'select', options: ['1st', '2nd', '3rd', '4th', '5th/masters', 'completed'], col: 6, group: 'Academic Info' },
    { name: 'medium', label: 'Medium', col: 6, group: 'Academic Info' },
    { name: 'mastersDept', label: 'Masters Dept', col: 6, group: 'Academic Info' },
    { name: 'mastersUniversity', label: 'Masters University', col: 6, group: 'Academic Info' },
    { name: 'honorsDept', label: 'Honors Dept', col: 6, group: 'Academic Info' },
    { name: 'honorsUniversity', label: 'Honors University', col: 6, group: 'Academic Info' },
    { name: 'college', label: 'HSC College', col: 6, group: 'Academic Info' },
    { name: 'hscGroup', label: 'HSC Group', type: 'select', options: ['Science', 'Arts', 'Commerce', 'Vocational'], col: 6, group: 'Academic Info' },
    { name: 'hscResult', label: 'HSC Result', col: 6, group: 'Academic Info' },
    { name: 'school', label: 'SSC School', col: 6, group: 'Academic Info' },
    { name: 'sscGroup', label: 'SSC Group', type: 'select', options: ['Science', 'Arts', 'Commerce', 'Vocational'], col: 6, group: 'Academic Info' },
    { name: 'sscResult', label: 'SSC Result', col: 6, group: 'Academic Info' },
    { name: 'isResultShow', label: 'Show SSC & HSC Result?', col: 12, group: 'Academic Info', type: 'checkbox' },

    // Teaching Profile
    { name: 'experience', label: 'Experience', col: 6, group: 'Teaching Profile' },
    { name: 'favoriteSubject', label: 'Favorite Subject', col: 6, group: 'Teaching Profile' },
    { name: 'expectedTuitionAreas', label: 'Expected Tuition Areas', col: 6, group: 'Teaching Profile' },
    { name: 'commentFromTeacher', label: 'Comment From Teacher', col: 6, group: 'Teaching Profile' },

    // Subscription & Payment Details
    { name: 'premiumCode', label: 'Premium Code', col: 6, group: 'Subscription & Payment Details' },
    { name: 'password', label: 'Password', col: 6, group: 'Subscription & Payment Details' },
    { name: 'status', label: 'Subscription Status', type: 'select', col: 6, options: ['pending', 'under review', 'pending payment', 'Must Advance', 'After Confirmation', 'After Salary', '30% Advance', 'rejected', 'Free - Must Advance', 'verified', 'suspended', 'Not interested', 'Premium', 'Elite'], group: 'Subscription & Payment Details' },
    { name: 'uniCode', label: 'Uni Code', type: 'select', col: 6, options: ['CMC', 'CUET', 'CU Science', 'CU Arts', 'CU Commerce', 'CVASU', 'Private Science', 'Private Commerce', 'Private Arts', 'National Science', 'National Arts', 'National Commerce', 'Arabic', 'NC English', 'BC English', 'Special'], group: 'Subscription & Payment Details' },
    { name: 'transactionId', label: 'Transaction ID', col: 6, group: 'Subscription & Payment Details' },
    { name: 'paymentType', label: 'Payment Method', col: 6, group: 'Subscription & Payment Details' },
    { name: 'amount', label: 'Amount Paid', col: 6, group: 'Subscription & Payment Details' },
    { name: 'paymentDate', label: 'Payment Date', type: 'date', col: 6, group: 'Subscription & Payment Details' },
    { name: 'isBiodataShow', label: 'Show Biodata?', col: 6, group: 'Subscription & Payment Details', type: 'checkbox' },
    { name: 'isInfoVerified', label: 'Info Verified?', col: 6, group: 'Subscription & Payment Details', type: 'checkbox' },

    // Notes & Feedback
    { name: 'comment', label: 'Comment from agent', col: 6, group: 'Notes & Feedback' },
    { name: 'rating', label: 'Rating', col: 6, group: 'Notes & Feedback', type: 'star-rating' },

    // Referral Info
    { name: 'referPersonPhone', label: 'Refer Person Phone', col: 6, group: 'Referral Info' },
    { name: 'referStatus', label: 'Refer Status', type: 'select', col: 6, options: ['pending', 'in review', 'canceled', 'spam', 'paid'], group: 'Referral Info' },
    { name: 'referComment', label: 'Refer Comment', col: 6, group: 'Referral Info' },
];

const cityOptions = [
    { value: 'chittagong', label: 'Chittagong' },
    { value: 'dhaka', label: 'Dhaka' },
];

const areaOptions = {
    chittagong: [
        "2 Number Gate", "Agrabad", "Agrbad CDA", "Ak Khan", "Akbarshah", "Alongkar", "Aman bazar", "Ambagan", "Andorkillah", "Aturar Depo", "Baddarhat", "Baklia accese road", "Baluchara", "Bandartila", "Baroquerter", "Barek Building", "Baizid", "Bahir Signal", "Boropol", "Cement Crossing", "Chawkbazar", "Chandgao", "Chowmohoni", "City Gate", "Commerce college road", "Cornelhut", "CRB", "Cuna Factory road", "Customs", "CU Campus",
        "Dampara", "Dewanbazar", "Dewanhat", "Didar Market", "Eidgah kacha rasta", "Firingibazar", "Firozsah", "Foyezlake", "Freeport", "Gec", "Halishohor", "Hathazari", "Jamalkhan", "Jubilee Road", "Kajir dewri", "Kalurghat", "Kalamia Bazar", "Kapasgola", "Kaptai Rastar Matha", "Katgor", "Khaja Road", "Khulsi", "Kodomtoli", "Kotoali", "Lalkhan Bazar", "Love lane", "Majirghat", "Miler Matha", "Muradpur", "Nalapara", "Nandan kanon",
        "New Market", "Nimtola", "Noton Bridge", "Noyabazar", "Oxyzen", "Panchlaish", "Patharghata", "Pahartali", "Patenga", "Polytechnic More", "Rahattarpol", "Sadharghat", "Sagorika", "Saltgola Crossing", "Shershah", "Solokbohor", "Soloshohor", "Stillmil Bazar", "Tiger Pass", "Vatiyari", "Wasa", "West Madarbari"
    ].map(a => ({ value: a, label: a })),
    dhaka: [
        "Coming Soon"
    ].map(a => ({ value: a, label: a }))
};

const initialData = {
    ...fieldConfig.reduce((acc, field) => {
        acc[field.name] = field.type === 'checkbox' ? false : (field.type === 'star-rating' ? 0 : '');
        return acc;
    }, {}),
    photo: '',
    nidPhoto: '',
    nidFront: '',
    nidBack: '',
    sscMarksheet: '',
    hscMarksheet: '',
    universityIdCard: '',
    otherDoc1: '',
    otherDoc2: '',
    otherDoc3: ''
};

const TeacherCreateEditModal = ({ show, onHide, teacher, onSuccess }) => {
    const [formData, setFormData] = useState(initialData);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);

    // City & Area
    const [selectedCity, setSelectedCity] = useState('');
    const [areaList, setAreaList] = useState([]);

    // Division, District, Thana
    const [selectedDivision, setSelectedDivision] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [districtList, setDistrictList] = useState([]);
    const [thanaList, setThanaList] = useState([]);

    // Document States
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [photoSizeKB, setPhotoSizeKB] = useState(null);
    const [pendingPhotoFile, setPendingPhotoFile] = useState(null);
    const [pendingPhotoPreview, setPendingPhotoPreview] = useState(null);

    const [uploadingNidFront, setUploadingNidFront] = useState(false);
    const [nidFrontSizeKB, setNidFrontSizeKB] = useState(null);
    const [pendingNidFrontFile, setPendingNidFrontFile] = useState(null);
    const [pendingNidFrontPreview, setPendingNidFrontPreview] = useState(null);

    const [uploadingNidBack, setUploadingNidBack] = useState(false);
    const [nidBackSizeKB, setNidBackSizeKB] = useState(null);
    const [pendingNidBackFile, setPendingNidBackFile] = useState(null);
    const [pendingNidBackPreview, setPendingNidBackPreview] = useState(null);

    const [uploadingSsc, setUploadingSsc] = useState(false);
    const [sscSizeKB, setSscSizeKB] = useState(null);
    const [pendingSscFile, setPendingSscFile] = useState(null);
    const [pendingSscPreview, setPendingSscPreview] = useState(null);

    const [uploadingHsc, setUploadingHsc] = useState(false);
    const [hscSizeKB, setHscSizeKB] = useState(null);
    const [pendingHscFile, setPendingHscFile] = useState(null);
    const [pendingHscPreview, setPendingHscPreview] = useState(null);

    const [uploadingUniId, setUploadingUniId] = useState(false);
    const [uniIdSizeKB, setUniIdSizeKB] = useState(null);
    const [pendingUniIdFile, setPendingUniIdFile] = useState(null);
    const [pendingUniIdPreview, setPendingUniIdPreview] = useState(null);

    const [uploadingOther1, setUploadingOther1] = useState(false);
    const [other1SizeKB, setOther1SizeKB] = useState(null);
    const [pendingOther1File, setPendingOther1File] = useState(null);
    const [pendingOther1Preview, setPendingOther1Preview] = useState(null);

    const [uploadingOther2, setUploadingOther2] = useState(false);
    const [other2SizeKB, setOther2SizeKB] = useState(null);
    const [pendingOther2File, setPendingOther2File] = useState(null);
    const [pendingOther2Preview, setPendingOther2Preview] = useState(null);

    const [uploadingOther3, setUploadingOther3] = useState(false);
    const [other3SizeKB, setOther3SizeKB] = useState(null);
    const [pendingOther3File, setPendingOther3File] = useState(null);
    const [pendingOther3Preview, setPendingOther3Preview] = useState(null);

    // Lightbox & SMS State
    const [enlargedImage, setEnlargedImage] = useState(null);
    const [imageRotation, setImageRotation] = useState(0);
    const [showSmsModal, setShowSmsModal] = useState(false);
    const [smsMessage, setSmsMessage] = useState('');
    const [smsRecipient, setSmsRecipient] = useState('');

    useEffect(() => {
        setImageRotation(0);
    }, [enlargedImage]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && enlargedImage) {
                setEnlargedImage(null);
                setImageRotation(0);
            }
        };
        if (enlargedImage) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [enlargedImage]);

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!show) {
            resetMediaPendingStates();
            return;
        }

        if (teacher) {
            const formatted = { ...teacher };
            if (formatted.paymentDate) {
                try {
                    formatted.paymentDate = new Date(formatted.paymentDate).toISOString().split('T')[0];
                } catch {
                    formatted.paymentDate = '';
                }
            }
            setFormData({ ...initialData, ...formatted });
            setEditingId(teacher._id);

            // Populate Division / District / Thana
            if (teacher.division) {
                setSelectedDivision(teacher.division);
                const distList = locationsBd.find(d => d.Division === teacher.division)?.Districts || [];
                const formattedDistList = distList.map(d => ({ value: d.District, label: d.District, thanas: d.Thanas }));
                setDistrictList(formattedDistList);

                if (teacher.district) {
                    setSelectedDistrict(teacher.district);
                    const thanas = formattedDistList.find(d => d.value === teacher.district)?.thanas || [];
                    setThanaList(thanas.map(t => ({ value: t, label: t })));
                } else {
                    setSelectedDistrict('');
                    setThanaList([]);
                }
            } else {
                setSelectedDivision('');
                setSelectedDistrict('');
                setDistrictList([]);
                setThanaList([]);
            }

            // City & Area
            if (teacher.city) {
                setSelectedCity(teacher.city);
                setAreaList(areaOptions[teacher.city] || []);
            } else {
                setSelectedCity('');
                setAreaList([]);
            }
        } else {
            setFormData(initialData);
            setEditingId(null);
            setSelectedDivision('');
            setSelectedDistrict('');
            setDistrictList([]);
            setThanaList([]);
            setSelectedCity('');
            setAreaList([]);
        }
    }, [show, teacher]);

    const resetMediaPendingStates = () => {
        if (pendingPhotoPreview) URL.revokeObjectURL(pendingPhotoPreview);
        if (pendingNidFrontPreview) URL.revokeObjectURL(pendingNidFrontPreview);
        if (pendingNidBackPreview) URL.revokeObjectURL(pendingNidBackPreview);
        if (pendingSscPreview) URL.revokeObjectURL(pendingSscPreview);
        if (pendingHscPreview) URL.revokeObjectURL(pendingHscPreview);
        if (pendingUniIdPreview) URL.revokeObjectURL(pendingUniIdPreview);
        if (pendingOther1Preview) URL.revokeObjectURL(pendingOther1Preview);
        if (pendingOther2Preview) URL.revokeObjectURL(pendingOther2Preview);
        if (pendingOther3Preview) URL.revokeObjectURL(pendingOther3Preview);

        setPendingPhotoFile(null);
        setPendingPhotoPreview(null);
        setPendingNidFrontFile(null);
        setPendingNidFrontPreview(null);
        setPendingNidBackFile(null);
        setPendingNidBackPreview(null);
        setPendingSscFile(null);
        setPendingSscPreview(null);
        setPendingHscFile(null);
        setPendingHscPreview(null);
        setPendingUniIdFile(null);
        setPendingUniIdPreview(null);
        setPendingOther1File(null);
        setPendingOther1Preview(null);
        setPendingOther2File(null);
        setPendingOther2Preview(null);
        setPendingOther3File(null);
        setPendingOther3Preview(null);

        setPhotoSizeKB(null);
        setNidFrontSizeKB(null);
        setNidBackSizeKB(null);
        setSscSizeKB(null);
        setHscSizeKB(null);
        setUniIdSizeKB(null);
        setOther1SizeKB(null);
        setOther2SizeKB(null);
        setOther3SizeKB(null);
    };

    const uploadMediaWithFallback = async (file, endpointPath) => {
        const PRIMARY_URL = `https://tuition-seba-backend-1.onrender.com/api/upload/${endpointPath}`;
        const FALLBACK_URL = `https://tuition-seba-backend-production-da93.up.railway.app/api/upload/${endpointPath}`;

        const uploadData = new FormData();
        uploadData.append('photo', file);

        let resultData = null;

        try {
            const response = await fetch(PRIMARY_URL, {
                method: 'POST',
                headers: { Authorization: token },
                body: uploadData
            });

            if (response.ok) {
                resultData = await response.json();
            } else if ([502, 503, 504].includes(response.status)) {
                throw new Error(`Primary server returned status ${response.status}`);
            } else {
                const errJson = await response.json().catch(() => ({}));
                throw new Error(errJson.message || `Upload failed with status ${response.status}`);
            }
        } catch (primaryErr) {
            console.warn(`Primary Render upload failed for ${endpointPath}, trying Railway...`, primaryErr);
            const fallbackData = new FormData();
            fallbackData.append('photo', file);

            const fallbackResponse = await fetch(FALLBACK_URL, {
                method: 'POST',
                headers: { Authorization: token },
                body: fallbackData
            });

            if (!fallbackResponse.ok) {
                const errJson = await fallbackResponse.json().catch(() => ({}));
                throw new Error(errJson.message || `Fallback upload failed with status ${fallbackResponse.status}`);
            }
            resultData = await fallbackResponse.json();
        }

        if (resultData && resultData.url) {
            return resultData;
        }
        throw new Error('No URL returned from upload server');
    };

    // Generic upload handler helper
    const handleGenericUpload = async (e, setSizeKB, setPendingFile, setPendingPreview, label) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const { file: compressedFile, sizeKB } = await compressImageUnderMaxKB(file, 95);
            setSizeKB(sizeKB);
            const previewUrl = URL.createObjectURL(compressedFile);
            setPendingFile(compressedFile);
            setPendingPreview(previewUrl);
            toast.info(`${label} selected (${sizeKB} KB). Click "Save" below to upload.`);
        } catch (err) {
            console.error(`${label} processing error:`, err);
            toast.error(err.message || `Failed to process ${label}`);
        } finally {
            if (e.target) e.target.value = '';
        }
    };

    const uploadPendingFiles = async (targetData) => {
        if (pendingPhotoFile) {
            setUploadingPhoto(true);
            const res = await uploadMediaWithFallback(pendingPhotoFile, 'teacher-photo');
            targetData.photo = res.url;
        }
        if (pendingNidFrontFile) {
            setUploadingNidFront(true);
            const res = await uploadMediaWithFallback(pendingNidFrontFile, 'teacher-nid');
            targetData.nidPhoto = res.url;
            targetData.nidFront = res.url;
        } else if (targetData.nidFront || targetData.nidPhoto) {
            const existing = targetData.nidFront || targetData.nidPhoto;
            targetData.nidPhoto = existing;
            targetData.nidFront = existing;
        }
        if (pendingNidBackFile) {
            setUploadingNidBack(true);
            const res = await uploadMediaWithFallback(pendingNidBackFile, 'teacher-nid-back');
            targetData.nidBack = res.url;
        }
        if (pendingSscFile) {
            setUploadingSsc(true);
            const res = await uploadMediaWithFallback(pendingSscFile, 'teacher-ssc');
            targetData.sscMarksheet = res.url;
        }
        if (pendingHscFile) {
            setUploadingHsc(true);
            const res = await uploadMediaWithFallback(pendingHscFile, 'teacher-hsc');
            targetData.hscMarksheet = res.url;
        }
        if (pendingUniIdFile) {
            setUploadingUniId(true);
            const res = await uploadMediaWithFallback(pendingUniIdFile, 'teacher-uni-id');
            targetData.universityIdCard = res.url;
        }
        if (pendingOther1File) {
            setUploadingOther1(true);
            const res = await uploadMediaWithFallback(pendingOther1File, 'teacher-other-1');
            targetData.otherDoc1 = res.url;
        }
        if (pendingOther2File) {
            setUploadingOther2(true);
            const res = await uploadMediaWithFallback(pendingOther2File, 'teacher-other-2');
            targetData.otherDoc2 = res.url;
        }
        if (pendingOther3File) {
            setUploadingOther3(true);
            const res = await uploadMediaWithFallback(pendingOther3File, 'teacher-other-3');
            targetData.otherDoc3 = res.url;
        }
    };

    const handleSaveRecord = async () => {
        const amount = formData.amount;
        const paymentDate = formData.paymentDate;

        const hasAmount = amount !== undefined && amount !== null && String(amount).trim() !== '';
        const hasPaymentDate = paymentDate !== undefined && paymentDate !== null && String(paymentDate).trim() !== '';

        if (hasAmount && !hasPaymentDate) {
            toast.warning("পেমেন্ট অ্যামাউন্ট দেওয়া হয়েছে, দয়া করে পেমেন্টের তারিখটি সিলেক্ট করুন।");
            return;
        }
        if (hasPaymentDate && !hasAmount) {
            toast.warning("পেমেন্টের তারিখ দেওয়া হয়েছে, দয়া করে পেমেন্ট অ্যামাউন্টটি লিখুন।");
            return;
        }
        if (hasAmount) {
            const amountStr = String(amount).trim();
            if (!/^\d+(\.\d+)?$/.test(amountStr)) {
                toast.warning("Amount paid - only numbers allowed.");
                return;
            }
        }

        const updatingData = {
            ...formData,
            status: formData.status ? formData.status : "pending"
        };
        const username = localStorage.getItem('username');

        // Trigger SMS verification modal if status is verified/Must Advance/etc.
        const smsTriggerStatuses = ['verified', 'Must Advance', 'After Confirmation', 'After Salary', '30% Advance', 'Free - Must Advance', 'Premium', 'Elite'];
        if (smsTriggerStatuses.includes(updatingData.status) && editingId && !formData.isSmsSent) {
            const premCode = formData.premiumCode || '';
            const recipient = formData.phone || '';
            const msg = `Dear teacher, your profile has been verified. Code: ${premCode} (keep it secret). You can now apply for tuitions. -Tuition Seba Forum`;
            setSmsRecipient(recipient);
            setSmsMessage(msg);
            setShowSmsModal(true);
            return;
        }

        try {
            setSaving(true);
            await uploadPendingFiles(updatingData);

            let savedTeacher = null;
            if (editingId) {
                const updatedData = { ...updatingData, updatedBy: username };
                const res = await axios.put(
                    `https://tuition-seba-backend-1.onrender.com/api/regTeacher/edit/${editingId}`,
                    updatedData,
                    { headers: { Authorization: token } }
                );
                savedTeacher = res.data?.data || updatedData;
                toast.success("Teacher record updated successfully!");
            } else {
                const newData = { ...updatingData, createdBy: username };
                const res = await axios.post('https://tuition-seba-backend-1.onrender.com/api/regTeacher/add', newData);
                savedTeacher = res.data?.data || newData;
                toast.success("Teacher record created successfully!");
            }

            resetMediaPendingStates();
            onHide();
            if (onSuccess) onSuccess(savedTeacher);
        } catch (err) {
            console.error('Error saving Teacher record:', err);
            toast.error(err.message || "Error saving Teacher record.");
        } finally {
            setSaving(false);
            setUploadingPhoto(false);
            setUploadingNidFront(false);
            setUploadingNidBack(false);
            setUploadingSsc(false);
            setUploadingHsc(false);
            setUploadingUniId(false);
            setUploadingOther1(false);
            setUploadingOther2(false);
            setUploadingOther3(false);
        }
    };

    const handleSendVerificationSmsAndSave = async () => {
        const username = localStorage.getItem('username');
        const code = formData.premiumCode || '';

        if (code && !smsMessage.includes(code)) {
            toast.warning(`Validation failed: The premium code (${code}) must be present in the SMS message body.`);
            return;
        }

        try {
            setSaving(true);
            const updatedData = {
                ...formData,
                status: formData.status || 'pending',
                isSmsSent: true,
                updatedBy: username
            };
            await uploadPendingFiles(updatedData);

            await axios.put(
                `https://tuition-seba-backend-1.onrender.com/api/regTeacher/edit/${editingId}`,
                updatedData,
                { headers: { Authorization: token } }
            );

            // Send SMS
            const smsRes = await axios.post(
                `https://tuition-seba-backend-1.onrender.com/api/sms/send-single`,
                {
                    phone: smsRecipient,
                    message: smsMessage,
                    premiumCode: formData.premiumCode,
                    category: 'Verification'
                },
                {
                    headers: {
                        Authorization: token,
                        'x-user-name': username
                    }
                }
            );

            if (smsRes.data && !smsRes.data.success) {
                toast.warning(`Teacher updated, but SMS failed: ${smsRes.data.statusMessage || 'Unknown error'}`);
            } else {
                toast.success("Teacher record updated and Verification SMS sent successfully!");
            }

            resetMediaPendingStates();
            setShowSmsModal(false);
            onHide();
            if (onSuccess) onSuccess(updatedData);
        } catch (err) {
            console.error('Error in send SMS & save:', err);
            toast.error(`Error: ${err.response?.data?.message || err.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleSaveWithoutSms = async () => {
        const username = localStorage.getItem('username');
        try {
            setSaving(true);
            const updatedData = {
                ...formData,
                status: formData.status || 'pending',
                isSmsSent: false,
                updatedBy: username
            };
            await uploadPendingFiles(updatedData);

            await axios.put(
                `https://tuition-seba-backend-1.onrender.com/api/regTeacher/edit/${editingId}`,
                updatedData,
                { headers: { Authorization: token } }
            );

            toast.success("Teacher record updated successfully (SMS bypassed)!");
            resetMediaPendingStates();
            setShowSmsModal(false);
            onHide();
            if (onSuccess) onSuccess(updatedData);
        } catch (err) {
            console.error('Error saving without SMS:', err);
            toast.error("Error occurred while saving.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <style>{`
                /* Dark overlay between stacked modals */
                .modal-backdrop.teacher-edit-stacked-backdrop {
                    z-index: 1060 !important;
                    background-color: rgba(15, 23, 42, 0.78) !important;
                    backdrop-filter: blur(5px) !important;
                    opacity: 1 !important;
                }

                /* Ensure Teacher Edit Modal sits above backdrop */
                .modal.teacher-edit-stacked-modal {
                    z-index: 1065 !important;
                }

                /* Distinct deep shadow, border and rounded corners */
                .teacher-edit-stacked-content {
                    border-radius: 18px !important;
                    border: 1px solid rgba(255, 255, 255, 0.25) !important;
                    box-shadow: 0 25px 70px -10px rgba(0, 0, 0, 0.65), 
                                0 10px 30px -5px rgba(0, 0, 0, 0.35), 
                                0 0 0 1px rgba(0, 0, 0, 0.15) !important;
                    overflow: hidden !important;
                    background-color: #ffffff !important;
                }

                .teacher-edit-stacked-dialog {
                    max-width: 92vw !important;
                    margin: 1.5rem auto !important;
                }

                @media (min-width: 1200px) {
                    .teacher-edit-stacked-dialog {
                        max-width: 1140px !important;
                    }
                }

                /* Verification SMS nested modal stacked above */
                .modal-backdrop.teacher-sms-stacked-backdrop {
                    z-index: 1070 !important;
                    background-color: rgba(15, 23, 42, 0.85) !important;
                    backdrop-filter: blur(5px) !important;
                    opacity: 1 !important;
                }

                .modal.teacher-sms-stacked-modal {
                    z-index: 1075 !important;
                }
            `}</style>

            <Modal 
                show={show} 
                onHide={onHide} 
                size="xl" 
                centered 
                scrollable
                className="teacher-edit-stacked-modal"
                backdropClassName="teacher-edit-stacked-backdrop"
                contentClassName="teacher-edit-stacked-content"
                dialogClassName="teacher-edit-stacked-dialog"
            >
                <Modal.Header 
                    closeButton 
                    closeVariant="white"
                    className="border-0 py-3 px-4 shadow-sm"
                    style={{ background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)' }}
                >
                    <Modal.Title className="fw-bold d-flex align-items-center gap-2 text-white fs-5">
                        <FaIdCard />
                        <span>{editingId ? "Edit Teacher Profile" : "Create Teacher Profile"}</span>
                        {formData.premiumCode && (
                            <span className="badge bg-white text-primary ms-2 shadow-sm" style={{ fontSize: '0.82rem', letterSpacing: '0.5px' }}>
                                {formData.premiumCode}
                            </span>
                        )}
                        {formData.name && (
                            <span className="text-white-50 fs-6 ms-1">
                                • {formData.name}
                            </span>
                        )}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {/* Document Uploads Section */}
                    <div className="mb-4">
                        <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2">
                            <FaIdCard /> Teacher Photos & Documents (Auto-compressed &lt; 100 KB)
                        </h6>

                        {/* Row 1: Profile Photo, NID Front, NID Back */}
                        <Row className="g-3 mb-3">
                            {/* Profile Photo */}
                            <Col xs={12} sm={6} md={4}>
                                <div className="p-3 rounded border bg-light shadow-sm h-100 d-flex flex-column">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <div style={{ position: 'relative', flexShrink: 0 }}>
                                            {(pendingPhotoPreview || formData.photo) ? (
                                                <img
                                                    src={pendingPhotoPreview || formData.photo}
                                                    alt="Teacher Profile"
                                                    style={{
                                                        width: '75px',
                                                        height: '80px',
                                                        borderRadius: '6px',
                                                        objectFit: 'cover',
                                                        backgroundColor: '#f1f3f5',
                                                        border: pendingPhotoFile ? '2px solid #ffc107' : '2px solid #0d6efd',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => setEnlargedImage({ url: pendingPhotoPreview || formData.photo, title: `${formData.name || 'Teacher'} - Profile Photo` })}
                                                />
                                            ) : (
                                                <div style={{ width: '75px', height: '80px', borderRadius: '6px', backgroundColor: '#dee2e6', color: '#6c757d', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '2px dashed #adb5bd' }}>
                                                    <FaCamera />
                                                    <span style={{ fontSize: '0.55rem' }} className="mt-1">No Photo</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow-1 overflow-hidden">
                                            <h6 className="fw-bold mb-0 text-truncate" style={{ fontSize: '0.85rem' }}>Profile Photo</h6>
                                            <small className="text-muted d-block mb-1" style={{ fontSize: '0.72rem' }}>
                                                Max 100 KB {photoSizeKB && <span className="badge bg-success ms-1">{photoSizeKB} KB</span>}
                                            </small>
                                            <div className="d-flex flex-wrap gap-1 align-items-center">
                                                <label className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 mb-0 py-1 px-2" style={{ cursor: 'pointer', fontSize: '0.72rem' }}>
                                                    <FaCamera size={10} />
                                                    {(pendingPhotoPreview || formData.photo) ? 'Change' : 'Select'}
                                                    <input type="file" accept="image/*" onChange={(e) => handleGenericUpload(e, setPhotoSizeKB, setPendingPhotoFile, setPendingPhotoPreview, 'Photo')} style={{ display: 'none' }} disabled={saving} />
                                                </label>
                                                {(pendingPhotoPreview || formData.photo) && (
                                                    <Button variant="outline-danger" size="sm" onClick={() => { setPendingPhotoFile(null); setPendingPhotoPreview(null); setFormData(p => ({ ...p, photo: '' })); setPhotoSizeKB(null); }} disabled={saving} style={{ fontSize: '0.72rem' }}>
                                                        <FaTrash size={10} />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>

                            {/* NID Front */}
                            <Col xs={12} sm={6} md={4}>
                                <div className="p-3 rounded border bg-light shadow-sm h-100 d-flex flex-column">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <div style={{ position: 'relative', flexShrink: 0 }}>
                                            {(pendingNidFrontPreview || formData.nidFront || formData.nidPhoto) ? (
                                                <img
                                                    src={pendingNidFrontPreview || formData.nidFront || formData.nidPhoto}
                                                    alt="NID Front"
                                                    style={{ width: '80px', height: '60px', borderRadius: '6px', objectFit: 'cover', cursor: 'pointer' }}
                                                    onClick={() => setEnlargedImage({ url: pendingNidFrontPreview || formData.nidFront || formData.nidPhoto, title: 'NID Front' })}
                                                />
                                            ) : (
                                                <div style={{ width: '80px', height: '60px', borderRadius: '6px', backgroundColor: '#dee2e6', color: '#6c757d', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', border: '2px dashed #adb5bd' }}>
                                                    <FaIdCard />
                                                    <span style={{ fontSize: '0.55rem' }}>No NID (F)</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow-1 overflow-hidden">
                                            <h6 className="fw-bold mb-0 text-truncate" style={{ fontSize: '0.85rem' }}>NID (Front)</h6>
                                            <small className="text-muted d-block mb-1" style={{ fontSize: '0.72rem' }}>
                                                Max 100 KB {nidFrontSizeKB && <span className="badge bg-success ms-1">{nidFrontSizeKB} KB</span>}
                                            </small>
                                            <div className="d-flex flex-wrap gap-1 align-items-center">
                                                <label className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 mb-0 py-1 px-2" style={{ cursor: 'pointer', fontSize: '0.72rem' }}>
                                                    <FaIdCard size={10} />
                                                    {(pendingNidFrontPreview || formData.nidFront || formData.nidPhoto) ? 'Change' : 'Select'}
                                                    <input type="file" accept="image/*" onChange={(e) => handleGenericUpload(e, setNidFrontSizeKB, setPendingNidFrontFile, setPendingNidFrontPreview, 'NID Front')} style={{ display: 'none' }} disabled={saving} />
                                                </label>
                                                {(pendingNidFrontPreview || formData.nidFront || formData.nidPhoto) && (
                                                    <Button variant="outline-danger" size="sm" onClick={() => { setPendingNidFrontFile(null); setPendingNidFrontPreview(null); setFormData(p => ({ ...p, nidFront: '', nidPhoto: '' })); setNidFrontSizeKB(null); }} disabled={saving} style={{ fontSize: '0.72rem' }}>
                                                        <FaTrash size={10} />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>

                            {/* NID Back */}
                            <Col xs={12} sm={6} md={4}>
                                <div className="p-3 rounded border bg-light shadow-sm h-100 d-flex flex-column">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <div style={{ position: 'relative', flexShrink: 0 }}>
                                            {(pendingNidBackPreview || formData.nidBack) ? (
                                                <img
                                                    src={pendingNidBackPreview || formData.nidBack}
                                                    alt="NID Back"
                                                    style={{ width: '80px', height: '60px', borderRadius: '6px', objectFit: 'cover', cursor: 'pointer' }}
                                                    onClick={() => setEnlargedImage({ url: pendingNidBackPreview || formData.nidBack, title: 'NID Back' })}
                                                />
                                            ) : (
                                                <div style={{ width: '80px', height: '60px', borderRadius: '6px', backgroundColor: '#dee2e6', color: '#6c757d', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', border: '2px dashed #adb5bd' }}>
                                                    <FaIdCard />
                                                    <span style={{ fontSize: '0.55rem' }}>No NID (B)</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow-1 overflow-hidden">
                                            <h6 className="fw-bold mb-0 text-truncate" style={{ fontSize: '0.85rem' }}>NID (Back)</h6>
                                            <small className="text-muted d-block mb-1" style={{ fontSize: '0.72rem' }}>
                                                Max 100 KB {nidBackSizeKB && <span className="badge bg-success ms-1">{nidBackSizeKB} KB</span>}
                                            </small>
                                            <div className="d-flex flex-wrap gap-1 align-items-center">
                                                <label className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 mb-0 py-1 px-2" style={{ cursor: 'pointer', fontSize: '0.72rem' }}>
                                                    <FaIdCard size={10} />
                                                    {(pendingNidBackPreview || formData.nidBack) ? 'Change' : 'Select'}
                                                    <input type="file" accept="image/*" onChange={(e) => handleGenericUpload(e, setNidBackSizeKB, setPendingNidBackFile, setPendingNidBackPreview, 'NID Back')} style={{ display: 'none' }} disabled={saving} />
                                                </label>
                                                {(pendingNidBackPreview || formData.nidBack) && (
                                                    <Button variant="outline-danger" size="sm" onClick={() => { setPendingNidBackFile(null); setPendingNidBackPreview(null); setFormData(p => ({ ...p, nidBack: '' })); setNidBackSizeKB(null); }} disabled={saving} style={{ fontSize: '0.72rem' }}>
                                                        <FaTrash size={10} />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        {/* Row 2: SSC Marksheet, HSC Marksheet, University ID */}
                        <Row className="g-3 mb-3">
                            {/* SSC Marksheet */}
                            <Col xs={12} sm={6} md={4}>
                                <div className="p-3 rounded border bg-light shadow-sm h-100 d-flex flex-column">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <div style={{ position: 'relative', flexShrink: 0 }}>
                                            {(pendingSscPreview || formData.sscMarksheet) ? (
                                                <img src={pendingSscPreview || formData.sscMarksheet} alt="SSC" style={{ width: '80px', height: '60px', borderRadius: '6px', objectFit: 'cover', cursor: 'pointer' }} onClick={() => setEnlargedImage({ url: pendingSscPreview || formData.sscMarksheet, title: 'SSC Marksheet' })} />
                                            ) : (
                                                <div style={{ width: '80px', height: '60px', borderRadius: '6px', backgroundColor: '#dee2e6', color: '#6c757d', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', border: '2px dashed #adb5bd' }}>
                                                    <FaFileAlt />
                                                    <span style={{ fontSize: '0.55rem' }}>No SSC</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow-1 overflow-hidden">
                                            <h6 className="fw-bold mb-0 text-truncate" style={{ fontSize: '0.85rem' }}>SSC Marksheet</h6>
                                            <small className="text-muted d-block mb-1" style={{ fontSize: '0.72rem' }}>
                                                Max 100 KB {sscSizeKB && <span className="badge bg-success ms-1">{sscSizeKB} KB</span>}
                                            </small>
                                            <div className="d-flex flex-wrap gap-1 align-items-center">
                                                <label className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 mb-0 py-1 px-2" style={{ cursor: 'pointer', fontSize: '0.72rem' }}>
                                                    <FaFileAlt size={10} />
                                                    {(pendingSscPreview || formData.sscMarksheet) ? 'Change' : 'Select'}
                                                    <input type="file" accept="image/*" onChange={(e) => handleGenericUpload(e, setSscSizeKB, setPendingSscFile, setPendingSscPreview, 'SSC Marksheet')} style={{ display: 'none' }} disabled={saving} />
                                                </label>
                                                {(pendingSscPreview || formData.sscMarksheet) && (
                                                    <Button variant="outline-danger" size="sm" onClick={() => { setPendingSscFile(null); setPendingSscPreview(null); setFormData(p => ({ ...p, sscMarksheet: '' })); setSscSizeKB(null); }} disabled={saving} style={{ fontSize: '0.72rem' }}>
                                                        <FaTrash size={10} />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>

                            {/* HSC Marksheet */}
                            <Col xs={12} sm={6} md={4}>
                                <div className="p-3 rounded border bg-light shadow-sm h-100 d-flex flex-column">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <div style={{ position: 'relative', flexShrink: 0 }}>
                                            {(pendingHscPreview || formData.hscMarksheet) ? (
                                                <img src={pendingHscPreview || formData.hscMarksheet} alt="HSC" style={{ width: '80px', height: '60px', borderRadius: '6px', objectFit: 'cover', cursor: 'pointer' }} onClick={() => setEnlargedImage({ url: pendingHscPreview || formData.hscMarksheet, title: 'HSC Marksheet' })} />
                                            ) : (
                                                <div style={{ width: '80px', height: '60px', borderRadius: '6px', backgroundColor: '#dee2e6', color: '#6c757d', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', border: '2px dashed #adb5bd' }}>
                                                    <FaFileAlt />
                                                    <span style={{ fontSize: '0.55rem' }}>No HSC</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow-1 overflow-hidden">
                                            <h6 className="fw-bold mb-0 text-truncate" style={{ fontSize: '0.85rem' }}>HSC Marksheet</h6>
                                            <small className="text-muted d-block mb-1" style={{ fontSize: '0.72rem' }}>
                                                Max 100 KB {hscSizeKB && <span className="badge bg-success ms-1">{hscSizeKB} KB</span>}
                                            </small>
                                            <div className="d-flex flex-wrap gap-1 align-items-center">
                                                <label className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 mb-0 py-1 px-2" style={{ cursor: 'pointer', fontSize: '0.72rem' }}>
                                                    <FaFileAlt size={10} />
                                                    {(pendingHscPreview || formData.hscMarksheet) ? 'Change' : 'Select'}
                                                    <input type="file" accept="image/*" onChange={(e) => handleGenericUpload(e, setHscSizeKB, setPendingHscFile, setPendingHscPreview, 'HSC Marksheet')} style={{ display: 'none' }} disabled={saving} />
                                                </label>
                                                {(pendingHscPreview || formData.hscMarksheet) && (
                                                    <Button variant="outline-danger" size="sm" onClick={() => { setPendingHscFile(null); setPendingHscPreview(null); setFormData(p => ({ ...p, hscMarksheet: '' })); setHscSizeKB(null); }} disabled={saving} style={{ fontSize: '0.72rem' }}>
                                                        <FaTrash size={10} />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>

                            {/* University ID */}
                            <Col xs={12} sm={6} md={4}>
                                <div className="p-3 rounded border bg-light shadow-sm h-100 d-flex flex-column">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <div style={{ position: 'relative', flexShrink: 0 }}>
                                            {(pendingUniIdPreview || formData.universityIdCard) ? (
                                                <img src={pendingUniIdPreview || formData.universityIdCard} alt="Uni ID" style={{ width: '80px', height: '60px', borderRadius: '6px', objectFit: 'cover', cursor: 'pointer' }} onClick={() => setEnlargedImage({ url: pendingUniIdPreview || formData.universityIdCard, title: 'University ID' })} />
                                            ) : (
                                                <div style={{ width: '80px', height: '60px', borderRadius: '6px', backgroundColor: '#dee2e6', color: '#6c757d', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', border: '2px dashed #adb5bd' }}>
                                                    <FaGraduationCap />
                                                    <span style={{ fontSize: '0.55rem' }}>No Uni ID</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow-1 overflow-hidden">
                                            <h6 className="fw-bold mb-0 text-truncate" style={{ fontSize: '0.85rem' }}>University ID Card</h6>
                                            <small className="text-muted d-block mb-1" style={{ fontSize: '0.72rem' }}>
                                                Max 100 KB {uniIdSizeKB && <span className="badge bg-success ms-1">{uniIdSizeKB} KB</span>}
                                            </small>
                                            <div className="d-flex flex-wrap gap-1 align-items-center">
                                                <label className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 mb-0 py-1 px-2" style={{ cursor: 'pointer', fontSize: '0.72rem' }}>
                                                    <FaGraduationCap size={10} />
                                                    {(pendingUniIdPreview || formData.universityIdCard) ? 'Change' : 'Select'}
                                                    <input type="file" accept="image/*" onChange={(e) => handleGenericUpload(e, setUniIdSizeKB, setPendingUniIdFile, setPendingUniIdPreview, 'Uni ID')} style={{ display: 'none' }} disabled={saving} />
                                                </label>
                                                {(pendingUniIdPreview || formData.universityIdCard) && (
                                                    <Button variant="outline-danger" size="sm" onClick={() => { setPendingUniIdFile(null); setPendingUniIdPreview(null); setFormData(p => ({ ...p, universityIdCard: '' })); setUniIdSizeKB(null); }} disabled={saving} style={{ fontSize: '0.72rem' }}>
                                                        <FaTrash size={10} />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        {/* Row 3: Other Certificates 1, 2, 3 */}
                        <Row className="g-3 mb-3">
                            {[1, 2, 3].map(num => {
                                const propName = `otherDoc${num}`;
                                const pendingFile = num === 1 ? pendingOther1File : num === 2 ? pendingOther2File : pendingOther3File;
                                const pendingPreview = num === 1 ? pendingOther1Preview : num === 2 ? pendingOther2Preview : pendingOther3Preview;
                                const sizeKB = num === 1 ? other1SizeKB : num === 2 ? other2SizeKB : other3SizeKB;
                                const setSize = num === 1 ? setOther1SizeKB : num === 2 ? setOther2SizeKB : setOther3SizeKB;
                                const setPendingFile = num === 1 ? setPendingOther1File : num === 2 ? setPendingOther2File : setPendingOther3File;
                                const setPendingPrev = num === 1 ? setPendingOther1Preview : num === 2 ? setPendingOther2Preview : setPendingOther3Preview;

                                return (
                                    <Col xs={12} sm={6} md={4} key={num}>
                                        <div className="p-3 rounded border bg-light shadow-sm h-100 d-flex flex-column">
                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                <div style={{ position: 'relative', flexShrink: 0 }}>
                                                    {(pendingPreview || formData[propName]) ? (
                                                        <img src={pendingPreview || formData[propName]} alt={`Cert ${num}`} style={{ width: '80px', height: '60px', borderRadius: '6px', objectFit: 'cover', cursor: 'pointer' }} onClick={() => setEnlargedImage({ url: pendingPreview || formData[propName], title: `Other Certificate ${num}` })} />
                                                    ) : (
                                                        <div style={{ width: '80px', height: '60px', borderRadius: '6px', backgroundColor: '#dee2e6', color: '#6c757d', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', border: '2px dashed #adb5bd' }}>
                                                            <FaAward />
                                                            <span style={{ fontSize: '0.55rem' }}>No Cert {num}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-grow-1 overflow-hidden">
                                                    <h6 className="fw-bold mb-0 text-truncate" style={{ fontSize: '0.85rem' }}>Other Certificate {num}</h6>
                                                    <small className="text-muted d-block mb-1" style={{ fontSize: '0.72rem' }}>
                                                        Max 100 KB {sizeKB && <span className="badge bg-success ms-1">{sizeKB} KB</span>}
                                                    </small>
                                                    <div className="d-flex flex-wrap gap-1 align-items-center">
                                                        <label className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 mb-0 py-1 px-2" style={{ cursor: 'pointer', fontSize: '0.72rem' }}>
                                                            <FaAward size={10} />
                                                            {(pendingPreview || formData[propName]) ? 'Change' : 'Select'}
                                                            <input type="file" accept="image/*" onChange={(e) => handleGenericUpload(e, setSize, setPendingFile, setPendingPrev, `Cert ${num}`)} style={{ display: 'none' }} disabled={saving} />
                                                        </label>
                                                        {(pendingPreview || formData[propName]) && (
                                                            <Button variant="outline-danger" size="sm" onClick={() => { setPendingFile(null); setPendingPrev(null); setFormData(p => ({ ...p, [propName]: '' })); setSize(null); }} disabled={saving} style={{ fontSize: '0.72rem' }}>
                                                                <FaTrash size={10} />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                );
                            })}
                        </Row>
                    </div>

                    {/* Form Fields Section */}
                    <Form>
                        {Object.entries(
                            fieldConfig.reduce((groups, field) => {
                                if (!groups[field.group]) groups[field.group] = [];
                                groups[field.group].push(field);
                                return groups;
                            }, {})
                        ).map(([groupName, fields]) => (
                            <div key={groupName} className="mb-4">
                                <h5 className="fw-bold mb-3 text-primary border-bottom pb-1">{groupName}</h5>
                                <Row>
                                    {fields.map((field, idx) => (
                                        <Col md={field.col || 6} key={idx}>
                                            <Form.Group controlId={field.name} className="mb-3">
                                                {field.type !== 'checkbox' && <Form.Label className="fw-bold">{field.label}</Form.Label>}

                                                {field.name === "division" ? (
                                                    <Select
                                                        options={locationsBd.map(d => ({ value: d.Division, label: d.Division }))}
                                                        value={selectedDivision ? { value: selectedDivision, label: selectedDivision } : null}
                                                        onChange={(selected) => {
                                                            const div = selected?.value || "";
                                                            setSelectedDivision(div);
                                                            setFormData({ ...formData, division: div, district: "", thana: "" });
                                                            const distList = locationsBd.find(d => d.Division === div)?.Districts || [];
                                                            setDistrictList(distList.map(d => ({ value: d.District, label: d.District, thanas: d.Thanas })));
                                                            setThanaList([]);
                                                            setSelectedDistrict('');
                                                        }}
                                                        placeholder="Select Division"
                                                        isClearable
                                                    />
                                                ) : field.name === "district" ? (
                                                    <Select
                                                        options={districtList}
                                                        value={selectedDistrict ? { value: selectedDistrict, label: selectedDistrict } : null}
                                                        onChange={(selected) => {
                                                            const dist = selected?.value || "";
                                                            setSelectedDistrict(dist);
                                                            setFormData({ ...formData, district: dist, thana: "" });
                                                            const thanas = districtList.find(d => d.value === dist)?.thanas || [];
                                                            setThanaList(thanas.map(t => ({ value: t, label: t })));
                                                        }}
                                                        placeholder="Select District"
                                                        isClearable
                                                        isDisabled={!selectedDivision}
                                                    />
                                                ) : field.name === "thana" ? (
                                                    <Select
                                                        options={thanaList}
                                                        value={thanaList.find(t => t.value === formData.thana) || null}
                                                        onChange={(selected) => setFormData({ ...formData, thana: selected?.value || "" })}
                                                        placeholder="Select Thana"
                                                        isClearable
                                                        isDisabled={!selectedDistrict}
                                                    />
                                                ) : field.name === "city" ? (
                                                    <Select
                                                        options={cityOptions}
                                                        value={cityOptions.find(opt => opt.value === formData.city) || null}
                                                        onChange={(selected) => {
                                                            const cityVal = selected?.value || "";
                                                            setSelectedCity(cityVal);
                                                            setFormData({ ...formData, city: cityVal, currentArea: "" });
                                                            setAreaList(areaOptions[cityVal] || []);
                                                        }}
                                                        placeholder="Select City"
                                                        isClearable
                                                        isSearchable
                                                    />
                                                ) : field.name === "currentArea" ? (
                                                    <Select
                                                        options={areaList}
                                                        value={areaList.find(opt => opt.value === formData.currentArea) || null}
                                                        onChange={(selected) => setFormData({ ...formData, currentArea: selected?.value || "" })}
                                                        placeholder="Select Area"
                                                        isClearable
                                                        isSearchable
                                                        isDisabled={!formData.city}
                                                    />
                                                ) : field.type === "checkbox" ? (
                                                    <div className="d-flex align-items-center" style={{ paddingTop: '6px' }}>
                                                        <Form.Check
                                                            type="switch"
                                                            id={field.name}
                                                            checked={!!formData[field.name]}
                                                            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.checked })}
                                                            label={
                                                                <>
                                                                    <span className="fw-bold">{field.label}</span>
                                                                    <small className="ms-2 text-muted">{formData[field.name] ? 'Yes' : 'No'}</small>
                                                                </>
                                                            }
                                                        />
                                                    </div>
                                                ) : field.type === "select" ? (
                                                    <Form.Control
                                                        as="select"
                                                        value={formData[field.name] || ""}
                                                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                                        required
                                                    >
                                                        <option value="">Select {field.label}</option>
                                                        {field.options.map((opt, i) => (
                                                            <option key={i} value={opt}>{opt}</option>
                                                        ))}
                                                    </Form.Control>
                                                ) : field.type === "star-rating" ? (
                                                    <div className="star-rating">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <span
                                                                key={star}
                                                                onClick={() => setFormData({ ...formData, [field.name]: star })}
                                                                style={{
                                                                    cursor: 'pointer',
                                                                    color: formData[field.name] >= star ? '#ffc107' : '#ddd',
                                                                    fontSize: '24px',
                                                                    marginRight: '4px'
                                                                }}
                                                            >
                                                                ★
                                                            </span>
                                                        ))}
                                                        <span style={{ marginLeft: '8px', fontSize: '14px', color: '#666' }}>
                                                            {formData[field.name] || '0'} star{formData[field.name] !== 1 ? 's' : ''}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <Form.Control
                                                        type={field.type || "text"}
                                                        value={formData[field.name] || ""}
                                                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                                        required
                                                    />
                                                )}
                                            </Form.Group>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        ))}
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide} disabled={saving}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveRecord} disabled={saving}>
                        {saving ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                {uploadingPhoto || uploadingNidFront || uploadingNidBack || uploadingSsc || uploadingHsc || uploadingUniId || uploadingOther1 || uploadingOther2 || uploadingOther3 ? 'Uploading images...' : 'Saving...'}
                            </>
                        ) : (
                            editingId ? 'Update Teacher' : 'Save Teacher'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Verification SMS Modal */}
            <Modal 
                show={showSmsModal} 
                onHide={() => setShowSmsModal(false)} 
                contentClassName="border border-3 border-success rounded-3 shadow-lg" 
                centered
                className="teacher-sms-stacked-modal"
                backdropClassName="teacher-sms-stacked-backdrop"
            >
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold text-success">Send Verification SMS</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="alert alert-info py-2 fw-bold mb-3">
                        Sending SMS to: {formData.phone || 'N/A'}
                    </div>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Recipient Phone</Form.Label>
                        <Form.Control
                            type="text"
                            value={smsRecipient}
                            onChange={(e) => setSmsRecipient(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Message Body</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={6}
                            value={smsMessage}
                            onChange={(e) => setSmsMessage(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSmsModal(false)} disabled={saving}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveWithoutSms} disabled={saving}>
                        {saving ? <><Spinner animation="border" size="sm" className="me-2" />Saving...</> : 'Save Without SMS'}
                    </Button>
                    <Button variant="success" onClick={handleSendVerificationSmsAndSave} disabled={saving}>
                        {saving ? <><Spinner animation="border" size="sm" className="me-2" />Sending...</> : 'Send SMS & Save'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Fullscreen Image Lightbox with Rotate & Controls */}
            {enlargedImage && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(10, 15, 29, 0.96)',
                        backdropFilter: 'blur(8px)',
                        zIndex: 99999,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px'
                    }}
                    onClick={() => {
                        setEnlargedImage(null);
                        setImageRotation(0);
                    }}
                >
                    {/* Top Bar */}
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '12px',
                            padding: '10px 16px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#fff',
                            zIndex: 100000
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="d-flex align-items-center gap-2">
                            <FaImages className="text-info fs-5" />
                            <span className="fw-bold fs-6 text-white text-truncate" style={{ maxWidth: '40vw' }}>
                                {enlargedImage.title || 'Document Preview'}
                            </span>
                        </div>

                        {/* Action buttons (Rotate, Open Original, Close) */}
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                            {/* Rotate Controls */}
                            <div className="btn-group" role="group" aria-label="Rotate controls">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
                                    style={{ fontSize: '0.8rem', backgroundColor: 'rgba(255,255,255,0.08)' }}
                                    onClick={() => setImageRotation((prev) => (prev - 90) % 360)}
                                    title="Rotate Left 90° (Counter-Clockwise)"
                                >
                                    <FaUndo size={11} /> Rotate Left
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
                                    style={{ fontSize: '0.8rem', backgroundColor: 'rgba(255,255,255,0.08)' }}
                                    onClick={() => setImageRotation((prev) => (prev + 90) % 360)}
                                    title="Rotate Right 90° (Clockwise)"
                                >
                                    <FaRedo size={11} /> Rotate Right
                                </button>
                                {imageRotation !== 0 && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-warning d-flex align-items-center gap-1 text-dark fw-semibold"
                                        style={{ fontSize: '0.8rem' }}
                                        onClick={() => setImageRotation(0)}
                                        title="Reset rotation to 0°"
                                    >
                                        <FaSyncAlt size={10} /> Reset ({imageRotation > 0 ? `+${imageRotation}` : imageRotation}°)
                                    </button>
                                )}
                            </div>

                            <a
                                href={enlargedImage.url}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
                                style={{ fontSize: '0.8rem' }}
                                title="Open original image in new tab"
                            >
                                <FaExternalLinkAlt size={11} /> New Tab
                            </a>

                            <button
                                type="button"
                                className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                                style={{ width: '34px', height: '34px', fontSize: '15px' }}
                                onClick={() => {
                                    setEnlargedImage(null);
                                    setImageRotation(0);
                                }}
                                title="Close preview (Esc)"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    </div>

                    {/* Image Canvas */}
                    <div
                        style={{
                            flex: 1,
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            padding: '16px'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={enlargedImage.url}
                            alt={enlargedImage.title || 'Document Preview'}
                            style={{
                                maxWidth: (Math.abs(imageRotation) / 90) % 2 === 1 ? '75vh' : '90vw',
                                maxHeight: (Math.abs(imageRotation) / 90) % 2 === 1 ? '85vw' : '78vh',
                                width: 'auto',
                                height: 'auto',
                                objectFit: 'contain',
                                borderRadius: '8px',
                                boxShadow: '0 16px 48px rgba(0,0,0,0.85)',
                                transform: `rotate(${imageRotation}deg)`,
                                transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        />
                    </div>

                    {/* Footer helper */}
                    <div
                        className="text-white-50 small d-flex align-items-center gap-2"
                        style={{ fontSize: '0.78rem' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span>Rotation: <strong className="text-info">{imageRotation}°</strong></span>
                        <span>•</span>
                        <span>Click outside or press <kbd className="bg-secondary text-white px-1 rounded">Esc</kbd> to return to modal</span>
                    </div>
                </div>
            )}
        </>
    );
};

export default TeacherCreateEditModal;
