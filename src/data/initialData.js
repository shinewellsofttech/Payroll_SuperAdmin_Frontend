/**
 * Essential Modules & Login Permissions for the Payroll Software
 */
export const CORE_MODULES = [
  { key: "attendance", label: "Attendance Module", desc: "Monthly attendance, daily punch, biometrics & OT" },
  { key: "payroll", label: "Payroll & Salary", desc: "Salary calculation engine, PF (12%), ESI, payslips" },
  { key: "reports", label: "Statutory Reports", desc: "PF Challan, Forms 11/12/9, Wages register, Form 13" },
  { key: "labourCodes", label: "Labour Codes 2026", desc: "Rajasthan 16 statutory registers & appointment letter" },
  { key: "accounting", label: "Accounting Module", desc: "Ledgers, day book, cash/bank vouchers & balance sheet" },
];

export const LOGIN_PERMISSIONS = [
  { key: "allowEmployeeLogin", label: "Employee Login (ESS)", desc: "Employees can log in to view attendance & download payslips" },
  { key: "allowCustomerLogin", label: "Customer / Firm Login", desc: "Consultant's client firms get login to view their own firm's data", consultantOnly: true },
];

export const AMC_CYCLES = ["Monthly", "Quarterly", "Half-Yearly", "Annual"];

/**
 * Initial Demonstration Clients with AMC & Accounting
 */
export const INITIAL_CLIENTS = [
  {
    id: "c-1",
    name: "Lotus Dairy Products P Ltd",
    clientType: "SingleFirm", // 'SingleFirm' | 'Consultant'
    contactPerson: "Rajendra Sharma",
    phone: "9829012345",
    email: "hr@lotusdairy.com",
    pan: "AAACL8492F",
    city: "Jaipur",
    domain: "lotusdairy.payrollcloud.in",
    dbName: "Payroll_Lotus_DB",
    startDate: "2026-01-01",
    expiryDate: "2026-12-31",
    allowedFirms: 1, // Single firm is always 1
    amcAmount: 35000,
    amcCycle: "Annual",
    modules: {
      attendance: true,
      payroll: true,
      reports: true,
      labourCodes: true,
      accounting: true, // Accounting module enabled
    },
    allowEmployeeLogin: true,
    allowCustomerLogin: false, // Single firm doesn't need customer login
  },
  {
    id: "c-2",
    name: "Apex HR & Labour Consultants",
    clientType: "Consultant",
    contactPerson: "Adv. Manish Agrawal",
    phone: "9828554433",
    email: "manish@apexhr.in",
    pan: "AABCA5544K",
    city: "Jaipur",
    domain: "apex.payrollcloud.in",
    dbName: "Payroll_Apex_MultiTenant",
    startDate: "2026-04-01",
    expiryDate: "2027-03-31",
    allowedFirms: 15, // Consultant can manage 15 firms
    amcAmount: 12000,
    amcCycle: "Quarterly", // Quarterly AMC
    modules: {
      attendance: true,
      payroll: true,
      reports: true,
      labourCodes: true,
      accounting: false, // Accounting not taken
    },
    allowEmployeeLogin: true,
    allowCustomerLogin: true, // Consultant gives customer login to their firms
  },
  {
    id: "c-3",
    name: "Sunrise Textiles Ltd",
    clientType: "SingleFirm",
    contactPerson: "Kailash Choudhary",
    phone: "9829144556",
    email: "admin@sunrisetextiles.com",
    pan: "AALCS7788P",
    city: "Bhilwara",
    domain: "sunrisetextiles.payrollcloud.in",
    dbName: "Payroll_Sunrise_DB",
    startDate: "2026-06-15",
    expiryDate: "2027-06-14",
    allowedFirms: 1,
    amcAmount: 1500,
    amcCycle: "Monthly", // Monthly AMC
    modules: {
      attendance: true,
      payroll: false, // Only attendance taken
      reports: false,
      labourCodes: false,
      accounting: false,
    },
    allowEmployeeLogin: true,
    allowCustomerLogin: false,
  },
  {
    id: "c-4",
    name: "Shramik Compliance Advisors",
    clientType: "Consultant",
    contactPerson: "Sunil Verma",
    phone: "9414099887",
    email: "sunil@shramik.com",
    pan: "ABKPS1234M",
    city: "Jodhpur",
    domain: "shramik.payrollcloud.in",
    dbName: "Payroll_Shramik_DB",
    startDate: "2025-12-05",
    expiryDate: "2026-12-05",
    allowedFirms: 8,
    amcAmount: 20000,
    amcCycle: "Half-Yearly", // Half-Yearly AMC
    modules: {
      attendance: true,
      payroll: true,
      reports: true,
      labourCodes: true,
      accounting: true, // Accounting module enabled
    },
    allowEmployeeLogin: false,
    allowCustomerLogin: true,
  }
];
