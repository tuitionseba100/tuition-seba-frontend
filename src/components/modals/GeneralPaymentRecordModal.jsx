import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Spinner, Table } from 'react-bootstrap';

const GeneralPaymentRecordModal = ({ show, onHide, editingId, initialData, onSave, onDelete }) => {
    const [paymentData, setPaymentData] = useState({
        tuitionCode: '',
        tuitionId: '',
        paymentReceivedDate: '',
        paymentReceivedDate2: '',
        paymentReceivedDate3: '',
        paymentReceivedDate4: '',
        duePayDate: '',
        tutorName: '',
        tutorNumber: '',
        paymentNumber: '',
        paymentNumber2: '',
        paymentNumber3: '',
        paymentNumber4: '',
        paymentType: '',
        paymentType2: '',
        paymentType3: '',
        paymentType4: '',
        receivedTk: '',
        receivedTk2: '',
        receivedTk3: '',
        receivedTk4: '',
        totalReceivedTk: '',
        duePayment: '',
        paymentStatus: '',
        tuitionSalary: '',
        totalPaymentTk: '',
        discount: '',
        comment: '',
        comment1: '',
        comment2: '',
        comment3: '',
    });
    const [serverData, setServerData] = useState(null);
    const [visibleInstallments, setVisibleInstallments] = useState(2);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [changedFields, setChangedFields] = useState([]);
    const [autoCalc, setAutoCalc] = useState(true);
    const [autoCalcFinance, setAutoCalcFinance] = useState(true);

    useEffect(() => {
        if (show) {
            if (editingId && initialData) {
                // Normalize initialData: replace nulls/undefineds with empty strings
                const normalizedData = { ...initialData };
                Object.keys(normalizedData).forEach(key => {
                    if (normalizedData[key] === null || normalizedData[key] === undefined) {
                        normalizedData[key] = '';
                    }
                });
                setPaymentData(normalizedData);
                setServerData(normalizedData);

                // Determine how many installments to show based on data
                let count = 2;
                if (initialData.receivedTk4 || initialData.paymentReceivedDate4 || initialData.paymentNumber4) count = 4;
                else if (initialData.receivedTk3 || initialData.paymentReceivedDate3 || initialData.paymentNumber3) count = 3;
                setVisibleInstallments(count);
                const isTotalMissing = !initialData.totalPaymentTk || parseFloat(initialData.totalPaymentTk) === 0;
                setAutoCalc(isTotalMissing); // Checked if total is missing, else user preference
                setAutoCalcFinance(true); // Always checked by default
            } else {
                const defaultValues = {
                    tuitionCode: '',
                    tuitionId: '',
                    paymentReceivedDate: '',
                    paymentReceivedDate2: '',
                    paymentReceivedDate3: '',
                    paymentReceivedDate4: '',
                    duePayDate: '',
                    tutorName: '',
                    tutorNumber: '',
                    paymentNumber: '',
                    paymentNumber2: '',
                    paymentNumber3: '',
                    paymentNumber4: '',
                    paymentType: '',
                    paymentType2: '',
                    paymentType3: '',
                    paymentType4: '',
                    receivedTk: '',
                    receivedTk2: '',
                    receivedTk3: '',
                    receivedTk4: '',
                    totalReceivedTk: '',
                    duePayment: '',
                    paymentStatus: '',
                    tuitionSalary: '',
                    totalPaymentTk: '',
                    discount: '',
                    comment: '',
                    comment1: '',
                    comment2: '',
                    comment3: '',
                };
                setPaymentData(defaultValues);
                setServerData(null);
                setVisibleInstallments(2);
                setAutoCalc(true); // Default to checked for new records
                setAutoCalcFinance(true); // Default to checked for new records
            }
        } else {
            // Reset everything when modal is hidden
            const defaultValues = {
                tuitionCode: '',
                tuitionId: '',
                paymentReceivedDate: '',
                paymentReceivedDate2: '',
                paymentReceivedDate3: '',
                paymentReceivedDate4: '',
                duePayDate: '',
                tutorName: '',
                tutorNumber: '',
                paymentNumber: '',
                paymentNumber2: '',
                paymentNumber3: '',
                paymentNumber4: '',
                paymentType: '',
                paymentType2: '',
                paymentType3: '',
                paymentType4: '',
                receivedTk: '',
                receivedTk2: '',
                receivedTk3: '',
                receivedTk4: '',
                totalReceivedTk: '',
                duePayment: '',
                paymentStatus: '',
                tuitionSalary: '',
                totalPaymentTk: '',
                discount: '',
                comment: '',
                comment1: '',
                comment2: '',
                comment3: '',
            };
            setPaymentData(defaultValues);
            setServerData(null);
            setVisibleInstallments(2);
            setIsSaving(false);
            setIsDeleting(false);
            setShowConfirmModal(false);
            setChangedFields([]);
            setAutoCalc(true);
            setAutoCalcFinance(true);
        }
    }, [show, editingId, initialData]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setPaymentData(prev => {
            const newData = { ...prev, [id]: value };

            const isNumeric = (val) => val !== null && val !== undefined && val !== '' && !isNaN(parseFloat(val)) && isFinite(val);
            const getNum = (val) => (isNumeric(val) ? parseFloat(val) : 0);

            // 1. Auto-calculate Total Payment TK only if Tuition Salary changes and autoCalc is enabled
            if (id === 'tuitionSalary') {
                if (autoCalc && isNumeric(value)) {
                    const salary = parseFloat(value);
                    newData.totalPaymentTk = salary > 0 ? parseFloat((salary * 0.6).toFixed(2)).toString() : '0';
                }
            }

            // 2. Recalculate sums if any financial field changed and autoCalcFinance is enabled (including sync back from due/rec)
            const financialIds = ['tuitionSalary', 'totalPaymentTk', 'receivedTk', 'receivedTk2', 'receivedTk3', 'receivedTk4', 'discount', 'duePayment', 'totalReceivedTk'];
            if (autoCalcFinance && financialIds.includes(id)) {
                const r1v = id === 'receivedTk' ? value : prev.receivedTk;
                const r2v = id === 'receivedTk2' ? value : prev.receivedTk2;
                const r3v = id === 'receivedTk3' ? value : prev.receivedTk3;
                const r4v = id === 'receivedTk4' ? value : prev.receivedTk4;

                const r1 = getNum(r1v);
                const r2 = getNum(r2v);
                const r3 = getNum(r3v);
                const r4 = getNum(r4v);
                const instSum = parseFloat((r1 + r2 + r3 + r4).toFixed(2));
                newData.totalReceivedTk = instSum.toString();

                const discV = id === 'discount' ? value : prev.discount;
                const discVal = getNum(discV);

                if (id === 'duePayment') {
                    // User is manually adjusting due - update total payment instead of due
                    const dueVal = getNum(value);
                    newData.totalPaymentTk = parseFloat((instSum + discVal + dueVal).toFixed(2)).toString();
                } else {
                    // General case (installment/disc/total changed): recalculate due
                    const totalV = id === 'totalPaymentTk' ? value : newData.totalPaymentTk;
                    if (totalV === '' || isNumeric(totalV)) {
                        const totalVal = getNum(totalV);
                        const calculatedDue = parseFloat((totalVal - (instSum + discVal)).toFixed(2));
                        newData.duePayment = calculatedDue.toString();
                    }
                }
            }

            // 3. Reset all financial fields if totalPaymentTk is cleared (Ensures it's not overwritten by logic above)
            if (id === 'totalPaymentTk' && (value === '' || parseFloat(value) === 0)) {
                newData.receivedTk = '';
                newData.receivedTk2 = '';
                newData.receivedTk3 = '';
                newData.receivedTk4 = '';
                newData.totalReceivedTk = '0';
                newData.duePayment = '0';
                newData.discount = '';
            }

            return newData;
        });
    };

    const handleCalculateTotal = () => {
        const isNumeric = (val) => val !== null && val !== undefined && val !== '' && !isNaN(parseFloat(val)) && isFinite(val);
        const getNum = (val) => (isNumeric(val) ? parseFloat(val) : 0);

        setPaymentData(prev => {
            const r1 = getNum(prev.receivedTk);
            const r2 = getNum(prev.receivedTk2);
            const r3 = getNum(prev.receivedTk3);
            const r4 = getNum(prev.receivedTk4);
            const disc = getNum(prev.discount);
            const due = getNum(prev.duePayment);

            let totalRec = parseFloat((r1 + r2 + r3 + r4).toFixed(2));
            let calculatedTotal = parseFloat((totalRec + disc + due).toFixed(2));
            let finalDue = due;

            // Fallback: If everything is 0 but salary is present, use the 60% rule
            if (calculatedTotal === 0 && isNumeric(prev.tuitionSalary) && autoCalc) {
                const salary = parseFloat(prev.tuitionSalary);
                calculatedTotal = parseFloat((salary * 0.6).toFixed(2));
                finalDue = parseFloat((calculatedTotal - (totalRec + disc)).toFixed(2));
            }

            return {
                ...prev,
                totalPaymentTk: calculatedTotal.toString(),
                totalReceivedTk: totalRec.toString(),
                duePayment: finalDue.toString()
            };
        });
    };

    const formatDate = (isoString) => {
        if (!isoString) return 'N/A';
        const localString = isoString.endsWith('Z') ? isoString.slice(0, -1) : isoString;
        const dt = new Date(localString);
        if (isNaN(dt)) return isoString;
        return dt.toLocaleString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    const getFieldLabel = (key) => {
        const labels = {
            tuitionCode: 'Tuition Code',
            tuitionSalary: 'Salary',
            totalPaymentTk: 'Total Payment',
            discount: 'Discount',
            duePayment: 'Due Payment',
            receivedTk: '1st Installment',
            receivedTk2: '2nd Installment',
            receivedTk3: '3rd Installment',
            receivedTk4: '4th Installment',
            paymentType: '1st Method',
            paymentType2: '2nd Method',
            paymentType3: '3rd Method',
            paymentType4: '4th Method',
            paymentNumber: '1st Phone',
            paymentNumber2: '2nd Phone',
            paymentNumber3: '3rd Phone',
            paymentNumber4: '4th Phone',
            paymentReceivedDate: '1st Date',
            paymentReceivedDate2: '2nd Date',
            paymentReceivedDate3: '3rd Date',
            paymentReceivedDate4: '4th Date',
            duePayDate: 'Due Date',
            comment: 'Note',
            comment1: 'Note 1',
            comment2: 'Note 2',
            comment3: 'Note 3',
        };
        return labels[key] || key;
    };

    const handleLocalSave = async () => {
        if (editingId && serverData) {
            const changes = [];
            Object.keys(paymentData).forEach(key => {
                let oldVal = serverData[key] === null || serverData[key] === undefined ? '' : serverData[key];
                let newVal = paymentData[key] === null || paymentData[key] === undefined ? '' : paymentData[key];

                // Normalize dates for comparison
                const isDateField = key.toLowerCase().includes('date') || key === 'duePayDate';

                if (isDateField) {
                    const dOld = oldVal ? new Date(oldVal).getTime() : 0;
                    const dNew = newVal ? new Date(newVal).getTime() : 0;

                    // Only compare if they actually represent different times
                    if (Math.abs(dOld - dNew) > 1000) { // 1 second threshold
                        changes.push({
                            field: getFieldLabel(key),
                            oldValue: oldVal ? formatDate(oldVal) : 'N/A',
                            newValue: newVal ? formatDate(newVal) : 'N/A'
                        });
                    }
                } else if (String(oldVal) !== String(newVal)) {
                    changes.push({
                        field: getFieldLabel(key),
                        oldValue: oldVal || 'N/A',
                        newValue: newVal || 'N/A'
                    });
                }
            });

            if (changes.length > 0) {
                setChangedFields(changes);
                setShowConfirmModal(true);
                return;
            }
        }

        // If no changes or creating new, proceed directly
        saveToBackend();
    };

    const saveToBackend = async () => {
        setShowConfirmModal(false);
        setIsSaving(true);
        try {
            await onSave(paymentData);
        } finally {
            setIsSaving(false);
        }
    };

    const handleLocalDelete = async () => {
        setIsDeleting(true);
        try {
            await onDelete(editingId);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDateChange = (id, value) => {
        const dateVal = value ? new Date(new Date(value).getTime() - new Date(value).getTimezoneOffset() * 60000).toISOString() : '';
        setPaymentData(prev => ({ ...prev, [id]: dateVal }));
    };

    const renderOldValue = (id) => {
        if (!editingId || !serverData) return null;
        let oldVal = serverData[id] === null || serverData[id] === undefined ? '' : serverData[id];
        let newVal = paymentData[id] === null || paymentData[id] === undefined ? '' : paymentData[id];

        if (String(oldVal) !== String(newVal)) {
            return (
                <div className="text-danger small mt-1 strike-through" style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                    Was: {oldVal || '0'}
                </div>
            );
        }
        return null;
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            dialogClassName="modal-95w"
            centered
            backdrop="static"
            contentClassName="shadow-lg border-0 rounded-3"
        >
            <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #004299 100%)', color: 'white' }}>
                <Modal.Title className="fw-bold">{editingId ? "✏️ Edit Payment Record" : "➕ Create Payment Record"}</Modal.Title>
            </Modal.Header>

            <Modal.Body className="bg-light p-4">
                <Form>
                    {/* Section: Basic Information */}
                    <div className="bg-white p-3 rounded shadow-sm mb-4 border-start border-primary border-4">
                        <h5 className="text-primary mb-3 fw-bold border-bottom pb-2">📋 Basic Information</h5>
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="tuitionId">
                                    <Form.Label className="fw-bold">Tuition Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={paymentData.tuitionId}
                                        onChange={handleChange}
                                        placeholder="Enter Tuition Code"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="tutorName">
                                    <Form.Label className="fw-bold">Tutor Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={paymentData.tutorName}
                                        onChange={handleChange}
                                        placeholder="Enter Tutor Name"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="tutorNumber">
                                    <Form.Label className="fw-bold">Tutor Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={paymentData.tutorNumber}
                                        onChange={handleChange}
                                        placeholder="Enter Tutor Phone"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="tuitionSalary">
                                    <Form.Label className="fw-bold">Tuition Salary</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={paymentData.tuitionSalary}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                    />
                                    {renderOldValue('tuitionSalary')}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="totalPaymentTk">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <Form.Label className="fw-bold mb-0">Total Payment TK</Form.Label>
                                        <Form.Check
                                            type="switch"
                                            id="autoCalcSwitch"
                                            label="Auto Calc (60%)"
                                            className="small text-muted fw-bold"
                                            checked={autoCalc}
                                            onChange={(e) => setAutoCalc(e.target.checked)}
                                        />
                                    </div>
                                    <Form.Control
                                        type="number"
                                        value={paymentData.totalPaymentTk}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                    />
                                    {(!paymentData.totalPaymentTk || parseFloat(paymentData.totalPaymentTk) === 0) && (
                                        <div className="mt-2 p-2 border border-danger rounded bg-danger bg-opacity-10">
                                            <div className="text-danger small fw-bold mb-1">
                                                ⚠️ no total payment tk is present
                                            </div>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                className="w-100 fw-bold"
                                                onClick={handleCalculateTotal}
                                            >
                                                🔄 Calculate Total (Install + Disc + Due)
                                            </Button>
                                        </div>
                                    )}
                                    {renderOldValue('totalPaymentTk')}
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>

                    {/* Section: Financial Details */}
                    <div className="bg-white p-3 rounded shadow-sm mb-4 border-start border-success border-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="text-success mb-0 fw-bold border-bottom pb-2 flex-grow-1">💰 Financial Details</h5>
                            <Form.Check
                                type="switch"
                                id="autoCalcFinanceSwitch"
                                label="Auto Calc Financials"
                                className="small text-muted fw-bold ms-3"
                                checked={autoCalcFinance}
                                onChange={(e) => setAutoCalcFinance(e.target.checked)}
                            />
                        </div>
                        {(!paymentData.totalPaymentTk || parseFloat(paymentData.totalPaymentTk) === 0) && (
                            <div className="alert alert-warning py-2 small fw-bold mb-3 border-warning border-2">
                                ⚠️ লেনদেনের তথ্য পূরণ করতে প্রথমে **Total Payment TK** দিন অথবা ক্যালকুলেট করুন।
                            </div>
                        )}
                        <div className="table-responsive mb-3">
                            <table className="table table-sm table-borderless align-middle">
                                <thead className="text-muted small">
                                    <tr>
                                        <th style={{ width: '10%' }}>Inst.</th>
                                        <th style={{ width: '20%' }}>Amount (TK)</th>
                                        <th style={{ width: '25%' }}>Method</th>
                                        <th style={{ width: '20%' }}>Phone/Num</th>
                                        <th style={{ width: '25%' }}>Received Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-bottom">
                                        <td className="fw-bold">1st</td>
                                        <td>
                                            <Form.Control
                                                type="text"
                                                id="receivedTk"
                                                value={paymentData.receivedTk}
                                                onChange={handleChange}
                                                placeholder="0.00"
                                                disabled={!paymentData.totalPaymentTk || parseFloat(paymentData.totalPaymentTk) === 0}
                                            />
                                            {renderOldValue('receivedTk')}
                                        </td>
                                        <td>
                                            <Form.Select
                                                id="paymentType"
                                                value={paymentData.paymentType}
                                                onChange={handleChange}
                                            >
                                                <option value="">Method</option>
                                                <option value="bkash">Bkash</option>
                                                <option value="nagad">Nagad</option>
                                                <option value="rocket">Rocket</option>
                                                <option value="cash">Cash</option>
                                                <option value="bank">Bank</option>
                                            </Form.Select>
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="text"
                                                id="paymentNumber"
                                                value={paymentData.paymentNumber}
                                                onChange={handleChange}
                                                placeholder="Phone"
                                            />
                                            {renderOldValue('paymentNumber')}
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="datetime-local"
                                                value={paymentData.paymentReceivedDate ? paymentData.paymentReceivedDate.slice(0, 16) : ''}
                                                onChange={(e) => handleDateChange('paymentReceivedDate', e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="border-bottom">
                                        <td className="fw-bold text-muted">2nd</td>
                                        <td>
                                            <Form.Control
                                                type="text"
                                                id="receivedTk2"
                                                value={paymentData.receivedTk2}
                                                onChange={handleChange}
                                                placeholder="0.00"
                                                disabled={!paymentData.totalPaymentTk || parseFloat(paymentData.totalPaymentTk) === 0}
                                            />
                                            {renderOldValue('receivedTk2')}
                                        </td>
                                        <td>
                                            <Form.Select
                                                id="paymentType2"
                                                value={paymentData.paymentType2}
                                                onChange={handleChange}
                                            >
                                                <option value="">Method</option>
                                                <option value="bkash">Bkash</option>
                                                <option value="nagad">Nagad</option>
                                                <option value="rocket">Rocket</option>
                                                <option value="cash">Cash</option>
                                                <option value="bank">Bank</option>
                                            </Form.Select>
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="text"
                                                id="paymentNumber2"
                                                value={paymentData.paymentNumber2}
                                                onChange={handleChange}
                                                placeholder="Phone"
                                            />
                                            {renderOldValue('paymentNumber2')}
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="datetime-local"
                                                value={paymentData.paymentReceivedDate2 ? paymentData.paymentReceivedDate2.slice(0, 16) : ''}
                                                onChange={(e) => handleDateChange('paymentReceivedDate2', e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                    {visibleInstallments >= 3 && (
                                        <tr className="border-bottom">
                                            <td className="fw-bold text-muted">3rd</td>
                                            <td>
                                                <Form.Control
                                                    type="text"
                                                    id="receivedTk3"
                                                    value={paymentData.receivedTk3}
                                                    onChange={handleChange}
                                                    placeholder="0.00"
                                                    disabled={!paymentData.totalPaymentTk || parseFloat(paymentData.totalPaymentTk) === 0}
                                                />
                                                {renderOldValue('receivedTk3')}
                                            </td>
                                            <td>
                                                <Form.Select
                                                    id="paymentType3"
                                                    value={paymentData.paymentType3}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Method</option>
                                                    <option value="bkash">Bkash</option>
                                                    <option value="nagad">Nagad</option>
                                                    <option value="rocket">Rocket</option>
                                                    <option value="cash">Cash</option>
                                                    <option value="bank">Bank</option>
                                                </Form.Select>
                                            </td>
                                            <td>
                                                <Form.Control
                                                    type="text"
                                                    id="paymentNumber3"
                                                    value={paymentData.paymentNumber3}
                                                    onChange={handleChange}
                                                    placeholder="Phone"
                                                />
                                                {renderOldValue('paymentNumber3')}
                                            </td>
                                            <td>
                                                <Form.Control
                                                    type="datetime-local"
                                                    value={paymentData.paymentReceivedDate3 ? paymentData.paymentReceivedDate3.slice(0, 16) : ''}
                                                    onChange={(e) => handleDateChange('paymentReceivedDate3', e.target.value)}
                                                />
                                            </td>
                                        </tr>
                                    )}
                                    {visibleInstallments >= 4 && (
                                        <tr className="border-bottom">
                                            <td className="fw-bold text-muted">4th</td>
                                            <td>
                                                <Form.Control
                                                    type="text"
                                                    id="receivedTk4"
                                                    value={paymentData.receivedTk4}
                                                    onChange={handleChange}
                                                    placeholder="0.00"
                                                    disabled={!paymentData.totalPaymentTk || parseFloat(paymentData.totalPaymentTk) === 0}
                                                />
                                                {renderOldValue('receivedTk4')}
                                            </td>
                                            <td>
                                                <Form.Select
                                                    id="paymentType4"
                                                    value={paymentData.paymentType4}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Method</option>
                                                    <option value="bkash">Bkash</option>
                                                    <option value="nagad">Nagad</option>
                                                    <option value="rocket">Rocket</option>
                                                    <option value="cash">Cash</option>
                                                    <option value="bank">Bank</option>
                                                </Form.Select>
                                            </td>
                                            <td>
                                                <Form.Control
                                                    type="text"
                                                    id="paymentNumber4"
                                                    value={paymentData.paymentNumber4}
                                                    onChange={handleChange}
                                                    placeholder="Phone"
                                                />
                                                {renderOldValue('paymentNumber4')}
                                            </td>
                                            <td>
                                                <Form.Control
                                                    type="datetime-local"
                                                    value={paymentData.paymentReceivedDate4 ? paymentData.paymentReceivedDate4.slice(0, 16) : ''}
                                                    onChange={(e) => handleDateChange('paymentReceivedDate4', e.target.value)}
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            {visibleInstallments < 4 && (
                                <div className="text-center mt-2">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => setVisibleInstallments(prev => prev + 1)}
                                        className="rounded-pill px-4 fw-bold shadow-sm"
                                        style={{ letterSpacing: '0.5px' }}
                                        disabled={isSaving || isDeleting || !paymentData.totalPaymentTk || parseFloat(paymentData.totalPaymentTk) === 0}
                                    >
                                        ➕ Add {visibleInstallments === 2 ? '3rd' : '4th'} New Payment
                                    </Button>
                                </div>
                            )}
                        </div>

                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="discount">
                                    <Form.Label className="fw-bold">Discount</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={paymentData.discount}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        disabled={!paymentData.totalPaymentTk || parseFloat(paymentData.totalPaymentTk) === 0}
                                    />
                                    {renderOldValue('discount')}
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3 p-2 rounded border border-warning bg-warning bg-opacity-10 shadow-sm" controlId="duePayment">
                                    <Form.Label className="fw-bold text-warning mb-1">⚠️ Due Payment</Form.Label>
                                    <Form.Control
                                        type="text"
                                        className="fw-bold border-warning text-dark"
                                        style={{ backgroundColor: '#fff9e6' }}
                                        value={paymentData.duePayment}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        required
                                        disabled={!paymentData.totalPaymentTk || parseFloat(paymentData.totalPaymentTk) === 0}
                                    />
                                    {renderOldValue('duePayment')}
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3 p-2 rounded border border-success bg-success bg-opacity-10 shadow-sm" controlId="totalReceivedTk">
                                    <Form.Label className="fw-bold text-success mb-1">✅ Total Received</Form.Label>
                                    <Form.Control
                                        type="text"
                                        className="fw-bold border-success text-success"
                                        value={paymentData.totalReceivedTk}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        required
                                        disabled={!paymentData.totalPaymentTk || parseFloat(paymentData.totalPaymentTk) === 0}
                                    />
                                    {renderOldValue('totalReceivedTk')}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3" controlId="transactionId">
                                    <Form.Label className="fw-bold">Transaction ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={paymentData.transactionId}
                                        onChange={handleChange}
                                        placeholder="Optional"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>

                    {/* Section: Status & Dates */}
                    <div className="bg-white p-3 rounded shadow-sm mb-4 border-start border-warning border-4">
                        <h5 className="text-warning mb-3 fw-bold border-bottom pb-2">📅 Status & Deadlines</h5>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="paymentStatus">
                                    <Form.Label className="fw-bold">Status</Form.Label>
                                    <Form.Select
                                        value={paymentData.paymentStatus}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select</option>
                                        <option value="pending payment">Pending Payment</option>
                                        <option value="pending due">Pending Due</option>
                                        <option value="fully paid">Fully Paid</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="duePayDate">
                                    <Form.Label className="fw-bold">Due Pay Date</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        value={paymentData.duePayDate ? paymentData.duePayDate.slice(0, 16) : ''}
                                        onChange={(e) => handleDateChange('duePayDate', e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>

                    {/* Section: Comments */}
                    <div className="bg-white p-3 rounded shadow-sm mb-4 border-start border-info border-4">
                        <h5 className="text-info mb-3 fw-bold border-bottom pb-2">💬 Comments & Notes</h5>
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3" controlId="comment">
                                    <Form.Label className="fw-bold">General Comment</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={paymentData.comment}
                                        onChange={handleChange}
                                        placeholder="Main comment..."
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="comment1">
                                    <Form.Label className="fw-bold">Comment 1</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={paymentData.comment1}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="comment2">
                                    <Form.Label className="fw-bold">Comment 2</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={paymentData.comment2}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="comment3">
                                    <Form.Label className="fw-bold">Comment 3</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={paymentData.comment3}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </Modal.Body>
            {/* Full-Page Loading Overlay */}
            <Modal
                show={isSaving || isDeleting}
                centered
                backdrop="static"
                keyboard={false}
                contentClassName="border-0 rounded-4 overflow-hidden"
                style={{ zIndex: 2000 }}
            >
                <div style={{
                    borderTop: '5px solid #0d6efd',
                    boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.6), 0 18px 36px -18px rgba(0, 0, 0, 0.7)' // Premium deep shadow
                }}>
                    <Modal.Body className="text-center p-5">
                        <Spinner
                            animation="border"
                            variant="primary"
                            className="mb-4"
                            style={{ width: '4rem', height: '4rem', borderWidth: '0.35rem' }}
                        />
                        <h4 className="fw-bold text-primary mb-2">
                            {isSaving ? 'Saving Record...' : 'Deleting Record...'}
                        </h4>
                        <p className="text-muted fw-medium mb-0">
                            Processing your request. Please do not close this window.
                        </p>
                    </Modal.Body>
                </div>
            </Modal>

            {/* Update Confirmation Modal */}
            <Modal
                show={showConfirmModal}
                onHide={() => setShowConfirmModal(false)}
                centered
                size="lg"
                contentClassName="shadow-lg border-0 rounded-4"
            >
                <Modal.Header className="bg-warning text-dark border-0 rounded-top-4">
                    <Modal.Title className="fw-bold">⚠️ Confirm Changes</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <p className="text-muted mb-4">You have modified the following information. Please review carefully before confirming.</p>
                    <div className="table-responsive rounded shadow-sm border">
                        <Table hover className="mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="px-3">Field Name</th>
                                    <th>Previous Data</th>
                                    <th>Updated Data</th>
                                </tr>
                            </thead>
                            <tbody>
                                {changedFields.map((change, idx) => (
                                    <tr key={idx}>
                                        <td className="fw-bold text-muted px-3">{change.field}</td>
                                        <td className="text-danger strike-through">{change.oldValue}</td>
                                        <td className="text-success fw-bold">
                                            <span className="me-2">➡️</span>
                                            {change.newValue}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Modal.Body>
                <Modal.Footer className="bg-light border-0 rounded-bottom-4 p-3">
                    <Button variant="outline-secondary" className="px-4" onClick={() => setShowConfirmModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" className="px-5 fw-bold shadow-sm" onClick={saveToBackend}>
                        Confirm & Save
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal.Footer className="bg-light d-flex justify-content-between">
                <Button variant="outline-danger" className="px-4" onClick={onHide} disabled={isSaving || isDeleting}>
                    ❌ Close
                </Button>
                <Button
                    variant="primary"
                    className="px-5 shadow-sm d-flex align-items-center gap-2 fw-bold"
                    onClick={handleLocalSave}
                    disabled={isSaving || isDeleting}
                >
                    {isSaving ? <Spinner animation="border" size="sm" /> : (editingId ? '🔄' : '✅')}
                    {isSaving ? 'Saving...' : (editingId ? "Update Record" : "Save Record")}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default React.memo(GeneralPaymentRecordModal);
