import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  brandName: string;
  category: string;
  manufacturer: string;
  price: number;
  quantity: number;
  expiryDate: string;
  batchNumber: string;
  description: string;
  warnings: string;
  indications: string;
  dosage: string;
  supplier: string;
  lastRestocked: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  totalPurchases: number;
  lastPurchaseDate: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  medicines: string[];
  lastSupplyDate: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  date: string;
  items: InvoiceItem[];
  subtotal: number;
  gst: number;
  discount: number;
  total: number;
  status: 'draft' | 'completed' | 'cancelled';
}

export interface InvoiceItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  price: number;
  total: number;
}

interface PharmacyContextType {
  // Medicines
  medicines: Medicine[];
  addMedicine: (medicine: Omit<Medicine, 'id'>) => void;
  updateMedicine: (id: string, medicine: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;
  getMedicineById: (id: string) => Medicine | undefined;

  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  getCustomerById: (id: string) => Customer | undefined;

  // Suppliers
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  getSupplierById: (id: string) => Supplier | undefined;

  // Invoices
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getInvoiceById: (id: string) => Invoice | undefined;

  // Analytics
  getTotalMedicines: () => number;
  getLowStockMedicines: () => Medicine[];
  getExpiredMedicines: () => Medicine[];
  getNearExpiryMedicines: () => Medicine[];
  getTotalCustomers: () => number;
  getTotalSuppliers: () => number;
  getTotalSales: () => number;
  getMonthlyRevenue: () => number;
  getMonthlySalesData: () => { month: string; sales: number; revenue: number }[];
}

const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

const STORAGE_KEY = 'pharmacy_data';
const INVOICE_COUNTER_KEY = 'pharmacy_invoice_counter';

const getInitialData = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { medicines: [], customers: [], suppliers: [], invoices: [] };
    }
  }

  // Sample data for initial load
  return {
    medicines: [
      {
        id: 'med_1',
        name: 'Aspirin 500mg',
        genericName: 'Acetylsalicylic Acid',
        brandName: 'Aspirin',
        category: 'Pain Relief',
        manufacturer: 'Bayer',
        price: 50,
        quantity: 150,
        expiryDate: '2025-12-31',
        batchNumber: 'BATCH001',
        description: 'Effective pain reliever and fever reducer',
        warnings: 'Do not use if allergic to aspirin',
        indications: 'Pain, fever, inflammation',
        dosage: '500mg tablets',
        supplier: 'Bayer Pharma',
        lastRestocked: '2024-08-01',
      },
      {
        id: 'med_2',
        name: 'Paracetamol 650mg',
        genericName: 'Paracetamol',
        brandName: 'Crocin',
        category: 'Pain Relief',
        manufacturer: 'GSK',
        price: 45,
        quantity: 80,
        expiryDate: '2025-10-15',
        batchNumber: 'BATCH002',
        description: 'Fever and pain management',
        warnings: 'May cause liver damage if overdosed',
        indications: 'Fever, mild to moderate pain',
        dosage: '650mg tablets',
        supplier: 'GSK India',
        lastRestocked: '2024-07-15',
      },
    ],
    customers: [
      {
        id: 'cust_1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        pincode: '10001',
        totalPurchases: 5,
        lastPurchaseDate: '2024-08-01',
      },
    ],
    suppliers: [
      {
        id: 'supp_1',
        name: 'Bayer Pharma',
        email: 'contact@bayer.com',
        phone: '1234567890',
        address: '456 Industrial Ave',
        city: 'Mumbai',
        state: 'MH',
        pincode: '400001',
        medicines: ['med_1'],
        lastSupplyDate: '2024-08-01',
      },
    ],
    invoices: [],
  };
};

export const PharmacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState(getInitialData());

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addMedicine = (medicine: Omit<Medicine, 'id'>) => {
    const newMedicine: Medicine = {
      ...medicine,
      id: `med_${Date.now()}`,
    };
    setData((prev: any) => ({ ...prev, medicines: [...prev.medicines, newMedicine] }));
  };

  const updateMedicine = (id: string, updates: Partial<Medicine>) => {
    setData((prev: any) => ({
      ...prev,
      medicines: prev.medicines.map((m: Medicine) => (m.id === id ? { ...m, ...updates } : m)),
    }));
  };

  const deleteMedicine = (id: string) => {
    setData((prev: any) => ({
      ...prev,
      medicines: prev.medicines.filter((m: Medicine) => m.id !== id),
    }));
  };

  const getMedicineById = (id: string) => data.medicines.find((m: Medicine) => m.id === id);

  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: `cust_${Date.now()}`,
    };
    setData((prev: any) => ({ ...prev, customers: [...prev.customers, newCustomer] }));
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setData((prev: any) => ({
      ...prev,
      customers: prev.customers.map((c: Customer) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  };

  const deleteCustomer = (id: string) => {
    setData((prev: any) => ({
      ...prev,
      customers: prev.customers.filter((c: Customer) => c.id !== id),
    }));
  };

  const getCustomerById = (id: string) => data.customers.find((c: Customer) => c.id === id);

  const addSupplier = (supplier: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = {
      ...supplier,
      id: `supp_${Date.now()}`,
    };
    setData((prev: any) => ({ ...prev, suppliers: [...prev.suppliers, newSupplier] }));
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    setData((prev: any) => ({
      ...prev,
      suppliers: prev.suppliers.map((s: Supplier) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  };

  const deleteSupplier = (id: string) => {
    setData((prev: any) => ({
      ...prev,
      suppliers: prev.suppliers.filter((s: Supplier) => s.id !== id),
    }));
  };

  const getSupplierById = (id: string) => data.suppliers.find((s: Supplier) => s.id === id);

  const addInvoice = (invoice: Omit<Invoice, 'id'>) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: `inv_${Date.now()}`,
    };
    setData((prev: any) => ({ ...prev, invoices: [...prev.invoices, newInvoice] }));
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setData((prev: any) => ({
      ...prev,
      invoices: prev.invoices.map((i: Invoice) => (i.id === id ? { ...i, ...updates } : i)),
    }));
  };

  const deleteInvoice = (id: string) => {
    setData((prev: any) => ({
      ...prev,
      invoices: prev.invoices.filter((i: Invoice) => i.id !== id),
    }));
  };

  const getInvoiceById = (id: string) => data.invoices.find((i: Invoice) => i.id === id);

  const getTotalMedicines = () => data.medicines.length;

  const getLowStockMedicines = () => data.medicines.filter((m: Medicine) => m.quantity < 50);

  const getExpiredMedicines = () => {
    const today = new Date();
    return data.medicines.filter((m: Medicine) => new Date(m.expiryDate) < today);
  };

  const getNearExpiryMedicines = () => {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    return data.medicines.filter(
      (m: Medicine) => new Date(m.expiryDate) > today && new Date(m.expiryDate) <= thirtyDaysFromNow
    );
  };

  const getTotalCustomers = () => data.customers.length;

  const getTotalSuppliers = () => data.suppliers.length;

  const getTotalSales = () => data.invoices.filter((i: Invoice) => i.status === 'completed').length;

  const getMonthlyRevenue = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return data.invoices
      .filter((i: Invoice) => {
        const invoiceDate = new Date(i.date);
        return invoiceDate.getMonth() === currentMonth && invoiceDate.getFullYear() === currentYear && i.status === 'completed';
      })
      .reduce((sum: number, i: Invoice) => sum + i.total, 0);
  };

  const getMonthlySalesData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data_array = months.map((month, index) => {
      const monthInvoices = data.invoices.filter((i: Invoice) => {
        const invoiceDate = new Date(i.date);
        return invoiceDate.getMonth() === index && i.status === 'completed';
      });

      return {
        month,
        sales: monthInvoices.length,
        revenue: monthInvoices.reduce((sum: number, i: Invoice) => sum + i.total, 0),
      };
    });

    return data_array;
  };

  return (
    <PharmacyContext.Provider
      value={{
        medicines: data.medicines,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        getMedicineById,
        customers: data.customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        getCustomerById,
        suppliers: data.suppliers,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        getSupplierById,
        invoices: data.invoices,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        getInvoiceById,
        getTotalMedicines,
        getLowStockMedicines,
        getExpiredMedicines,
        getNearExpiryMedicines,
        getTotalCustomers,
        getTotalSuppliers,
        getTotalSales,
        getMonthlyRevenue,
        getMonthlySalesData,
      }}
    >
      {children}
    </PharmacyContext.Provider>
  );
};

export const usePharmacy = () => {
  const context = useContext(PharmacyContext);
  if (!context) {
    throw new Error('usePharmacy must be used within PharmacyProvider');
  }
  return context;
};
