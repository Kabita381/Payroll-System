import api from "./axios";

const BASE_URL = "/payrolls";

// Force token into headers for the process call
export const processEmployeePayroll = (data) => {
    const token = localStorage.getItem("token");
    return api.post(`${BASE_URL}/process`, data, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res => res.data);
};

export const getPayrolls = () => api.get(BASE_URL);
export const getEmployeeHistory = (empId) => api.get(`${BASE_URL}/employee/${empId}/history`);
export const voidPayrollRecord = (id) => api.put(`${BASE_URL}/${id}/void`);
export const emailPayslip = (id) => api.post(`${BASE_URL}/${id}/send-email`);