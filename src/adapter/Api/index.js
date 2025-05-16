import axios from "axios";
import moment from "moment";
import "moment-timezone";

import { getToken, getUser, getExp, removeUserSession } from "../Auth";
import { createOption } from "../Utils";

let BASE_URL;
if (process.env.REACT_APP_ENVIRONMENT.trim() === "development") {
  // BASE_URL = "https://api-dev.biowoodthailand.com/v1";
  BASE_URL = "http://47.129.207.245/:8080/v1"; // สำหรับพัฒนาในเครื่อง
  console.log("running on development");
} else if (process.env.REACT_APP_ENVIRONMENT.trim() === "production") {
  BASE_URL = "https://api.biowoodthailand.com/v1"; // สำหรับการใช้งานจริง
  console.log("running on production");
}

function returnAxiosInstance() {
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
  });

  // ✅ Add a request interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = getToken(); // ดึงใหม่ทุกครั้ง
      console.log("Token:", token);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return axiosInstance;
}


// check token
async function checkToken() {
  const user = getUser();
  const token = getToken();
  const exp = getExp();

  if (user == null || !user) {
    console.log("User not found");
    removeUserSession();
    window.location.href = "/login";
    return false;
  }

  if (token == null || !token) {
    console.log("Token not found");
    removeUserSession();
    window.location.href = "/login";
    return false;
  }

  if (exp == null || !exp) {
    console.log("Token not found");
    removeUserSession();
    window.location.href = "/login";
    return false;
  }

  if (exp && exp <= moment().tz("Asia/Bangkok").unix()) {
    console.log("Expired token", moment(exp * 1000).format());
    removeUserSession();
    window.location.href = "/login";
    return false;
  }

  // Verify token each request
  // const verify = await verifyToken(token);
  // console.log(verify);
  // if (verify.status === "success") {
  //   setUserSession(verify.access_token, verify.user);
  // } else {
  //   removeUserSession();
  //   window.location.href = "/login";
  //   return false;
  // }

  return true;
}

// Export Get and POST
export function get(url) {
  if (!checkToken()) return;
  const axios = returnAxiosInstance();
  console.log('URL: ', url);
  return axios.get(url);
}

export function post(url, requestData) {
  if (!checkToken()) return;
  console.log("POST TO:", url);
  console.log("REQUEST DATA:", requestData);
  const axios = returnAxiosInstance();
  return axios.post(url, requestData);
}


export function update(url, requestData) {
  if (!checkToken()) return;
  console.log("URL:", url);
  console.log("Request Data:", requestData);
  const axios = returnAxiosInstance();
  return axios.put(url, requestData);
}

export function remove(url) {
  if (!checkToken()) return;
  const axios = returnAxiosInstance();
  return axios.delete(url);
}

export function login(email, password) {
  const axios = returnAxiosInstance();
  return axios.post("/auth/signin", {
    email: String(email),
    password: password,
  });
}

export function forgetPassword(email) {
  console.log(email);
  return;
  // return post("/auth/forgetPassword", {
  //   email: String(email),
  // });
}

export function verifyToken(token) {
  return get(`/auth/verifyToken?access_token=${token}`);
}

export function getGoogleMapLocation() {
  if (!checkToken()) return;
  const api_key = "AIzaSyCAjf42kQ7YZ10o_zNSuJH1htD9kw5POvE";
  return post(
    `https://www.googleapis.com/geolocation/v1/geolocate?key=${api_key}`
  );
}

export function getAllContact(payload) {
  // return get(
  //   `/contact/options?page=${page}&page_size=${page_size}&tag_list=1&contact_channel_list=1&project_list=1`
  // );
  return post(`/contact/table`, payload);
}

export function getTotalContact(payload) {
  return post("/contact/table-total-row", payload);
}

export function deleteContactById(id) {
  return remove(`/contact/${id}`);
}

export const getContactOption = (options) => {
  const params = options ? createOption(options) : "";
  return get(`/contact/options` + params);
};

export function getAllEmployee() {
  return get("/employee");
}

export function getEmployeeById(id) {
  return get(`/employee/${id}`);
}

export function postEmployee(input) {
  return post("/employee", input);
}

export function updateEmployee(input, id) {
  return update(`/employee/${id}`, input);
}

export function deleteEmployee(id) {
  return remove(`/employee/${id}`);
}

export function getAllProject() {
  return get("/project");
}

export function getProjectById(id) {
  return get(`/project/${id}`);
}

export const getProjectTag = () => {
  return get("/project_tag");
};

export const getProjectOption = (options) => {
  const params = options ? createOption(options) : "";
  return get(`/project/options` + params);
};

export function postProject(input) {
  return post("/project", input);
}

export function deleteProjectById(id) {
  return remove(`/project/${id}`);
}

export function getProjectByContactId(id) {
  return get(`/project?contact_id=${id}`);
}

export function postContact(input) {
  return post("/contact", input);
}

export function updateContact(input, id) {
  return update(`/contact/${id}`, input);
}

export function updateProject(input, id) {
  console.log("Update Project Input:", input);
  return update(`/project/${id}`, input);
}

export const getContactById = (id) => {
  return get(`/contact/${id}`);
};

export function getContactTag() {
  return get(`/contact_tag`);
}

export function getAllEvent(employeeId) {
  return get("/event");
}

export const getEventById = (id) => {
  return get(`/event/${id}`);
};

export const getEventByEmployeeId = (id, begin_date, end_date) => {
  return get(
    `/event/options?event_employee_document_id=${id}&begin_date=${begin_date}&end_date=${end_date}`
  );
};

export const getEventByTeamId = (id) => {
  return get(`/event?team_id=${id}`);
};

export function postEvent(input) {
  return post("/event", input);
}

export function updateEvent(input, id) {
  return update(`/event/${id}`, input);
}

export function cancelEvent(input, id) {
  return update(`/event/${id}/event_cancel`, input);
}

export function finishEvent(input, id) {
  return update(`/event/${id}/event_finish`, input);
}
export function updateCheckInStart(event_id, lat, long) {
  return update(`/event/${event_id}/check_in_start`, {
    event_checkin_start_latitude: lat,
    event_checkin_start_longitude: long,
  });
}

export function updateCheckInDest(event_id, lat, long) {
  return update(`/event/${event_id}/check_in_dest`, {
    event_checkin_dest_latitude: lat,
    event_checkin_dest_longitude: long,
  });
}

export function getProjectActivityById(id) {
  return get(`/project_activity?project_id=${id}`);
}

export function postProjectActivity(data) {
  return post(`/project_activity`, data);
}

export function getAllLeadsource() {
  return get(`/lead_source`);
}

export function printBarcode(data) {
  return post(`localhost:5000/print`, data);
}

export const getRemarkTemplate = () => {
  return get(`/remark_template`);
};

export const getQuotation = () => {
  return get(`/quotation`);
};

export const getQuotationById = (id) => {
  return get(`/quotation/document/${id}`);
};

export const postQuotation = (status, data) => {
  return post(`/quotation/${status}`, data);
};

export const updateQuotation = (id, revisionId, data) => {
  return update(`/quotation/document/${id}?revision_id=${revisionId}`, data);
};

export const postQuotationDocument = (id, data) => {
  return post(`/quotation/${id}/accept`, data);
};

export const postQuotationRevision = (id, data) => {
  return post(`/quotation/document/${id}/revision`, data);
};

export const cancelQuotation = (id) => {
  return remove(`/quotation/${id}`);
};

export const copyQuotation = (id) => {
  return post(`/quotation/${id}/copy_document`);
};

export const getAttachment = (stage, id) => {
  return get(`/attachment/${stage}/${id}`);
};

export const postSalesOrderFromQuotation = (id) => {
  return post(`/quotation/${id}/next_so`);
};

export const getSalesOrder = () => {
  return get(`/sales_order`);
};

export const postSalesOrder = (status, data) => {
  return post(`/sales_order/${status}`, data);
};

export const cancelSalesOrder = (id) => {
  return remove(`/sales_order/${id}`);
};

export const copySalesOrder = (id) => {
  return post(`/sales_order/${id}/copy_document`);
};

export const updateSalesOrder = (status, id, data) => {
  return update(`/sales_order/${id}/${status}`, data);
};

export const getSalesOrderById = (id) => {
  return get(`/sales_order/${id}`);
};

export const getSalesInvoice = () => {
  return get(`/sales_invoice`);
};

export const getSalesInvoiceById = (id) => {
  return get(`/sales_invoice/${id}`);
};

export const postSalesInvoice = (status, data) => {
  return post(`/sales_invoice/${status}`, data);
};

export const updateSalesInvoice = (status, id, data) => {
  return update(`/sales_invoice/${id}/${status}`, data);
};

export const cancelSalesInvoice = (id) => {
  return remove(`/sales_invoice/${id}`);
};

export const copySalesInvoice = (id) => {
  return post(`/sales_invoice/${id}/copy_document`);
};

export const postReceiptFromSalesInvoice = (id) => {
  return post(`/sales_invoice/${id}/next_rt`);
};

export const getSalesInvoiceByContactId = (id) => {
  return get(`/sales_invoice/contact/${id}`);
};

export const getReceipt = () => {
  return get(`/payment_receipt`);
};

export const getReceiptById = (id) => {
  return get(`/payment_receipt/${id}`);
};

export const postReceipt = (status, data) => {
  return post(`/payment_receipt/${status}`, data);
};

export const updateReceipt = (id, data) => {
  return update(`/payment_receipt/${id}`, data);
};

export const cancelReceipt = (id) => {
  return remove(`/payment_receipt/${id}`);
};

export const copyReceipt = (id) => {
  return post(`/payment_receipt/${id}/copy_document`);
};

export const getBillingNote = () => {
  return get(`/billing_note`);
};

export const getBillingNoteById = (id) => {
  return get(`/billing_note/${id}`);
};

export const postBillingNote = (status, data) => {
  return post(`/billing_note/${status}`, data);
};

export const updateBillingNote = (status, id, data) => {
  return update(`/billing_note/${id}/${status}`, data);
};

export const cancelBillingNote = (id) => {
  return remove(`/billing_note/${id}`);
};

export const copyBillingNote = (id) => {
  return post(`/billing_note/${id}/copy_document`);
};

export const postReceiptFromBillingNote = (id) => {
  return post(`/billing_note/${id}/next_rt`);
};

export const getSalesInvoiceFromBillingNote = (contactId) => {
  return get(`/billing_note/${contactId}/sales_invoice`);
};

export const getSalesReturn = () => {
  return get(`/sales_return`);
};

export const getSalesReturnById = (id) => {
  return get(`/sales_return/${id}`);
};

export const postSalesReturn = (status, data) => {
  return post(`/sales_return/${status}`, data);
};

export const updateSalesReturn = (status, id, data) => {
  return update(`/sales_return/${id}/${status}`, data);
};

export const cancelSalesReturn = (id) => {
  return remove(`/sales_return/${id}`);
};

export const copySalesReturn = (id) => {
  return post(`/sales_return/${id}/copy_document`);
};

export const getCreditNote = () => {
  return get(`/credit_note`);
};

export const getCreditNoteById = (id) => {
  return get(`/credit_note/${id}`);
};

export const postCreditNote = (status, data) => {
  return post(`/credit_note/${status}`, data);
};

export const updateCreditNote = (status, id, data) => {
  return update(`/credit_note/${id}/${status}`, data);
};

export const cancelCreditNote = (id) => {
  return remove(`/credit_note/${id}`);
};

export const copyCreditNote = (id) => {
  return post(`/credit_note/${id}/copy_document`);
};

export const updateCreditNotePayment = (id, data) => {
  return update(`/credit_note/${id}/update_payment`, data);
};

export const getDepositInvoice = () => {
  return get(`/deposit_invoice`);
};

export const getDepositInvoiceById = (id) => {
  return get(`/deposit_invoice/${id}`);
};

export const postDepositInvoice = (status, data) => {
  return post(`/deposit_invoice/${status}`, data);
};

export const updateDepositInvoice = (status, id, data) => {
  return update(`/deposit_invoice/${id}/${status}`, data);
};

export const cancelDepositInvoice = (id) => {
  return remove(`/deposit_invoice/${id}`);
};

export const copyDepositInvoice = (id) => {
  return post(`/deposit_invoice/${id}/copy_document`);
};

export const postReceiptFromDepositInvoice = (id) => {
  return post(`/deposit_invoice/${id}/next_rt`);
};

export const applyDepositToSalesInvoice = (id, data) => {
  return update(`/deposit_invoice/${id}/apply_to_sales_invoice`, data);
};
export const getDeliveryNote = () => {
  return get(`/delivery_note`);
};

export const getDeliveryNoteById = (id) => {
  return get(`/delivery_note/${id}`);
};

export const getImportSalesOrderByContact = (contactId) => {
  return get(`/delivery_note/${contactId}/sales_order_list`);
};

export const postDeliveryNote = (status, data) => {
  return post(`/delivery_note/${status}`, data);
};

export const postDeliveryNoteWithId = (id, command, data) => {
  return post(`/delivery_note/${id}/${command}`, data);
};

export const updateDeliveryNote = (id, data) => {
  return update(`/delivery_note/${id}`, data);
};

export const cancelDeliveryNote = (id) => {
  return remove(`/delivery_note/${id}`);
};

export const copyDeliveryNote = (id) => {
  return post(`/delivery_note/${id}/copy_document`);
};

export const getPurchaseRequest = () => {
  return get(`/purchase_request`);
};

export const getPurchaseRequestById = (id) => {
  return get(`/purchase_request/${id}`);
};

export const postPurchaseRequest = (status, data) => {
  return post(`/purchase_request/${status}`, data);
};

export const updatePurchaseRequest = (status, id, data) => {
  return update(`/purchase_request/${id}/${status}`, data);
};

export const cancelPurchaseRequest = (id) => {
  return remove(`/purchase_request/${id}`);
};

export const copyPurchaseRequest = (id) => {
  return post(`/purchase_request/${id}/copy_document`);
};

export const postPurchaseOrderFromPurchaseRequest = (id) => {
  return post(`/purchase_request/${id}/next_po`);
};

export const getPurchaseOrder = () => {
  return get(`/purchase_order`);
};

export const getPurchaseOrderById = (id) => {
  return get(`/purchase_order/${id}`);
};

export const postPurchaseOrder = (status, data) => {
  return post(`/purchase_order/${status}`, data);
};

export const updatePurchaseOrder = (status, id, data) => {
  return update(`/purchase_order/${id}/${status}`, data);
};

export const cancelPurchaseOrder = (id) => {
  return remove(`/purchase_order/${id}`);
};

export const copyPurchaseOrder = (id) => {
  return post(`/purchase_order/${id}/copy_document`);
};

export const postPurchaseInvoiceFromPurchaseOrder = (id) => {
  return post(`/purchase_order/${id}/next_pi`);
};

export const getPurchaseInvoice = () => {
  return get(`/purchase_invoice`);
};

export const getPurchaseInvoiceById = (id) => {
  return get(`/purchase_invoice/${id}`);
};

export const getPurchaseInvoiceByContactId = (id) => {
  return get(`/purchase_invoice/contact/${id}`);
};

export const postPurchaseInvoice = (status, data) => {
  return post(`/purchase_invoice/${status}`, data);
};

export const updatePurchaseInvoice = (status, id, data) => {
  return update(`/purchase_invoice/${id}/${status}`, data);
};

export const cancelPurchaseInvoice = (id) => {
  return remove(`/purchase_invoice/${id}`);
};

export const copyPurchaseInvoice = (id) => {
  return post(`/purchase_invoice/${id}/copy_document`);
};

export const postPaymentMadeFromPurchaseInvoice = (id) => {
  return post(`/purchase_invoice/${id}/next_pm`);
};

export const getPaymentMade = () => {
  return get(`/payment_made`);
};

export const getPaymentMadeById = (id) => {
  return get(`/payment_made/${id}`);
};

export const postPaymentMade = (status, data) => {
  return post(`/payment_made/${status}`, data);
};

export const updatePaymentMade = (id, data) => {
  return update(`/payment_made/${id}`, data);
};

export const cancelPaymentMade = (id) => {
  return remove(`/payment_made/${id}`);
};

export const copyPaymentMade = (id) => {
  return post(`/payment_made/${id}/copy_document`);
};

export const getCombinedPayment = () => {
  return get(`/combined_payment`);
};

export const getCombinedPaymentById = (id) => {
  return get(`/combined_payment/${id}`);
};

export const postCombinedPayment = (status, data) => {
  return post(`/combined_payment/${status}`, data);
};

export const updateCombinedPayment = (status, id, data) => {
  return update(`/combined_payment/${id}/${status}`, data);
};

export const cancelCombinedPayment = (id) => {
  return remove(`/combined_payment/${id}`);
};

export const copyCombinedPayment = (id) => {
  return post(`/combined_payment/${id}/copy_document`);
};

export const getPurchaseInvoiceFromCombinedPayment = (contactId) => {
  return get(`/combined_payment/${contactId}/purchase_invoice_list`);
};

export const postPaymentMadeFromCombinedPayment = (id) => {
  return post(`/combined_payment/${id}/next_pm`);
};

export const getPurchaseReturn = () => {
  return get(`/purchase_return`);
};

export const getPurchaseReturnById = (id) => {
  return get(`/purchase_return/${id}`);
};

export const postPurchaseReturn = (status, data) => {
  return post(`/purchase_return/${status}`, data);
};

export const updatePurchaseReturn = (status, id, data) => {
  return update(`/purchase_return/${id}/${status}`, data);
};

export const cancelPurchaseReturn = (id) => {
  return remove(`/purchase_return/${id}`);
};

export const copyPurchaseReturn = (id) => {
  return post(`/purchase_return/${id}/copy_document`);
};

export const getExpenses = () => {
  return get(`/expenses`);
};

export const getExpensesById = (id) => {
  return get(`/expenses/${id}`);
};

export const postExpenses = (status, data) => {
  return post(`/expenses/${status}`, data);
};

export const updateExpenses = (status, id, data) => {
  return update(`/expenses/${id}/${status}`, data);
};

export const cancelExpenses = (id) => {
  return remove(`/expenses/${id}`);
};

export const copyExpenses = (id) => {
  return post(`/expenses/${id}/copy_document`);
};

export const postPaymentMadeFromExpenses = (id) => {
  return post(`/expenses/${id}/next_pm`);
};

export const getDebitNote = () => {
  return get(`/debit_note`);
};

export const getDebitNoteById = (id) => {
  return get(`/debit_note/${id}`);
};

export const postDebitNote = (status, data) => {
  return post(`/debit_note/${status}`, data);
};

export const updateDebitNote = (status, id, data) => {
  return update(`/debit_note/${id}/${status}`, data);
};

export const cancelDebitNote = (id) => {
  return remove(`/debit_note/${id}`);
};

export const copyDebitNote = (id) => {
  return post(`/debit_note/${id}/copy_document`);
};

export const updateDebitNotePayment = (id, data) => {
  return update(`/debit_note/${id}/update_payment`, data);
};

export const getPaymentChannel = () => {
  return get(`/payment_channel`);
};

export const getDocumentActivityLog = (id) => {
  return get(`/activity/document/${id}`);
};

export const getAllEngineer = () => {
  return get(`/engineer`);
};

export const getEngineerById = (id, revisionId) => {
  const checkRevisionId = revisionId ? `?revision_id=${revisionId}` : "";
  return get(`/engineer/${id}${checkRevisionId}`);
};

export const postEngineer = (id, data) => {
  const checkId = id ? `/${id}/revision` : "";
  return post(`/engineer${checkId}`, data);
};

export const updateEngineer = (id, status, data) => {
  return update(`/engineer/${id}/${status}`, data);
};

export const deleteEngineer = (id) => {
  return remove(`/engineer/${id}`);
};

export const getAllWarranty = () => {
  return get(`/warranty`);
};

export const getAllPerson = () => {
  return get(`/person`);
};

export const getAllAccount = () => {
  return get(`/account`);
};

export const getAccountById = (id) => {
  return get(`/account/${id}`);
};

export const postAccount = (input) => {
  return post(`/account`, input);
};

export const updateAccount = (input, id) => {
  return update(`/account/${id}`, input);
};
