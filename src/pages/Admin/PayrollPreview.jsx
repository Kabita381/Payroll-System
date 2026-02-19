import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { processEmployeePayroll } from "../../api/payrollApi";
import api from "../../api/axios";

const PayrollPreview = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Extract data and the ID passed from PayrollManagement.jsx
    const data = state?.previewData;
    const selectedPaymentMethodId = state?.selectedPaymentMethodId;

    useEffect(() => {
        if (!data) {
            console.error("No preview data found. Redirecting...");
            navigate("/admin/payroll");
        }
    }, [data, navigate]);

    if (!data) return null;

    const redirectToEsewa = (paymentData) => {
        const form = document.createElement('form');
        form.setAttribute('method', 'POST');
        form.setAttribute('action', paymentData.esewa_url);

        const fields = {
            "amount": paymentData.amount,
            "tax_amount": "0",
            "total_amount": paymentData.total_amount,
            "transaction_uuid": paymentData.transaction_uuid,
            "product_code": paymentData.product_code,
            "product_service_charge": "0",
            "product_delivery_charge": "0",
            "success_url": "http://localhost:8080/api/esewa/success", // Backend Stage 2 handler
            "failure_url": `http://localhost:5173/admin/payroll?status=failed`,
            "signed_field_names": "total_amount,transaction_uuid,product_code",
            "signature": paymentData.signature,
            "customer_id": paymentData.customer_id 
        };

        for (const key in fields) {
            const input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', key);
            input.setAttribute('value', fields[key]);
            form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
    };

  const handleConfirm = async () => {
    if (isProcessing) return;
    
    try {
        setIsProcessing(true);

        /**
         * STAGE 1: Process payroll (Create PENDING_PAYMENT record)
         * The backend now automatically cleans up previous PENDING records for this 
         * specific period before creating the new one.
         */
        const savedPayroll = await processEmployeePayroll({
            empId: data.employee?.empId,
            festivalBonus: data.festivalBonus ?? 0, 
            bonuses: data.otherBonuses ?? 0, 
            citContribution: data.citContribution ?? 0,
            paymentMethodId: selectedPaymentMethodId 
        });

        // Resolve ID from response
        const actualId = savedPayroll?.payrollId || savedPayroll?.id || savedPayroll?.data?.payrollId;

        if (!actualId) {
            console.error("Payload received from server:", savedPayroll);
            throw new Error("Server processed payroll but did not return a valid ID.");
        }

        console.log("Stage 1 Complete. Initiating eSewa for Payroll ID:", actualId);

        /**
         * STAGE 2: Fetch eSewa signed parameters using the fresh ID
         */
        const response = await api.get(`/esewa/initiate/${actualId}`);
        
        // Redirect to External Gateway
        redirectToEsewa(response.data);

    } catch (err) {
        const errorMessage = err.response?.data?.message || err.message;
        alert("Transaction Error: " + errorMessage);
        setIsProcessing(false);
    }
};

    const formatCurrency = (val) => (val ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 });

    return (
        <div className="payroll-preview-wrapper" style={{ padding: '40px 20px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <div className="premium-preview-card" style={{ maxWidth: '700px', margin: 'auto', background: '#fff', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.12)', overflow: 'hidden' }}>
                
                <div className="preview-header" style={{ padding: '30px', background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)', color: '#fff', textAlign: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '24px', letterSpacing: '1px' }}>Final Payroll Review</h2>
                    <div style={{ marginTop: '10px', padding: '8px 15px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', display: 'inline-block' }}>
                        <span style={{ fontWeight: '600' }}>{data.employee?.firstName} {data.employee?.lastName}</span>
                        <span style={{ margin: '0 10px', opacity: 0.5 }}>|</span>
                        <span>Period: {data.payPeriodStart} to {data.payPeriodEnd}</span>
                    </div>
                </div>
                
                <div className="preview-body" style={{ padding: '30px' }}>
                    <div className="section" style={{ marginBottom: '25px' }}>
                        <h4 style={{ color: '#27ae60', textTransform: 'uppercase', fontSize: '13px', borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '15px' }}>Earnings (+)</h4>
                        <div style={rowStyle}>
                            <span>Basic Salary</span>
                            <span>Rs. {formatCurrency(data.basicSalary)}</span>
                        </div>
                        <div style={rowStyle}>
                            <span>Standard Allowances (HRA/Dearness)</span>
                            <span>Rs. {formatCurrency(data.totalAllowances)}</span>
                        </div>
                        <div style={{ ...rowStyle, color: '#27ae60', fontWeight: '600' }}>
                            <span>Festival Bonus</span>
                            <span>+ Rs. {formatCurrency(data.festivalBonus)}</span> 
                        </div>
                        <div style={{ ...rowStyle, color: '#27ae60', fontWeight: '600' }}>
                            <span>Other Performance Bonus</span>
                            <span>+ Rs. {formatCurrency(data.otherBonuses)}</span> 
                        </div>

                        <div style={{ ...rowStyle, borderTop: '2px solid #eee', marginTop: '10px', paddingTop: '10px', fontWeight: '800' }}>
                            <span>TOTAL GROSS SALARY</span>
                            <span>Rs. {formatCurrency(data.grossSalary)}</span>
                        </div>
                    </div>

                    <div style={{ marginBottom: '25px', padding: '15px', border: '1px solid #e0e0e0', borderRadius: '12px', backgroundColor: '#fcfcfc', display: 'flex', alignItems: 'center', gap: '10px' }}>
                         <div style={{width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3498db'}}></div>
                         <span style={{ fontSize: '14px', color: '#555' }}>
                            Disbursement: <strong>{data.paymentMethod?.methodName || 'eSewa Digital Wallet'}</strong>
                         </span>
                    </div>

                    <div className="section" style={{ marginBottom: '25px' }}>
                        <h4 style={{ color: '#e74c3c', textTransform: 'uppercase', fontSize: '13px', borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '15px' }}>Taxation & Deductions (-)</h4>
                        <div style={rowStyle}>
                            <span>SSF (11%)</span>
                            <span style={{ color: '#e74c3c' }}>- Rs. {formatCurrency(data.ssfContribution)}</span>
                        </div>
                        <div style={rowStyle}>
                            <span>CIT Contribution</span>
                            <span style={{ color: '#e74c3c' }}>- Rs. {formatCurrency(data.citContribution)}</span>
                        </div>
                        <div style={{ ...rowStyle, borderTop: '1px dashed #eee', paddingTop: '10px', marginTop: '5px' }}>
                            <span style={{ fontWeight: '600' }}>Total Income Tax (Monthly TDS)</span>
                            <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>- Rs. {formatCurrency(data.totalTax)}</span>
                        </div>
                    </div>

                    <div className="total-box" style={{ background: '#2c3e50', padding: '25px', borderRadius: '12px', textAlign: 'center', color: '#fff' }}>
                        <span style={{ fontSize: '12px', opacity: 0.7, textTransform: 'uppercase' }}>Net Pay to Bank Account</span>
                        <h1 style={{ margin: '10px 0 0', fontSize: '36px', fontWeight: '800' }}>
                            <span style={{ fontSize: '18px', verticalAlign: 'middle', marginRight: '5px' }}>Rs.</span>
                            {formatCurrency(data.netSalary)}
                        </h1>
                    </div>

                    <div className="footer-actions" style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
                        <button 
                            disabled={isProcessing} 
                            onClick={() => navigate("/admin/payroll")} 
                            style={btnSecondary}
                        >
                            Cancel & Edit
                        </button>
                        <button 
                            disabled={isProcessing} 
                            onClick={handleConfirm} 
                            style={isProcessing ? {...btnPrimary, opacity: 0.7, cursor: 'not-allowed'} : btnPrimary}
                        >
                            {isProcessing ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    Redirecting to eSewa...
                                </span>
                            ) : "Confirm & Disburse"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const rowStyle = { display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '15px', color: '#444' };
const btnPrimary = { flex: 2, padding: '15px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' };
const btnSecondary = { flex: 1, padding: '15px', background: '#fff', color: '#7f8c8d', border: '1px solid #dcdde1', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' };

export default PayrollPreview;