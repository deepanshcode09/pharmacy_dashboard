import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { usePharmacy, Customer } from '@/contexts/PharmacyContext';
import '../styles/Customers.css';
import { Plus, Edit2, Trash2, Search, Phone, Mail, MapPin } from 'lucide-react';

const Customers: React.FC = () => {
  const pharmacy = usePharmacy();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Customer, 'id'>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    totalPurchases: 0,
    lastPurchaseDate: new Date().toISOString().split('T')[0],
  });

  const filteredCustomers = useMemo(() => {
    return pharmacy.customers.filter((cust) => {
      const matchesSearch =
        cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cust.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cust.phone.includes(searchTerm);
      return matchesSearch;
    });
  }, [pharmacy.customers, searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      pharmacy.updateCustomer(editingId, formData);
      setEditingId(null);
    } else {
      pharmacy.addCustomer(formData);
    }
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      totalPurchases: 0,
      lastPurchaseDate: new Date().toISOString().split('T')[0],
    });
    setShowForm(false);
  };

  const handleEdit = (customer: Customer) => {
    setFormData(customer);
    setEditingId(customer.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      pharmacy.deleteCustomer(id);
    }
  };

  return (
    <DashboardLayout>
      <div className="customers-page">
        <div className="page-header">
          <h1>Customer Management</h1>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={18} /> Add Customer
          </button>
        </div>

        <div className="search-section">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search customers by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editingId ? 'Edit Customer' : 'Add New Customer'}</h2>
              <form onSubmit={handleSubmit} className="customer-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingId ? 'Update' : 'Add'} Customer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="customers-grid">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <div key={customer.id} className="customer-card">
                <div className="card-header">
                  <h3>{customer.name}</h3>
                  <div className="card-actions">
                    <button className="btn-icon edit" onClick={() => handleEdit(customer)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="btn-icon delete" onClick={() => handleDelete(customer.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="card-body">
                  <div className="info-item">
                    <Mail size={16} />
                    <span>{customer.email}</span>
                  </div>
                  <div className="info-item">
                    <Phone size={16} />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="info-item">
                    <MapPin size={16} />
                    <span>{customer.city}, {customer.state}</span>
                  </div>
                </div>

                <div className="card-footer">
                  <div className="stat">
                    <span className="label">Total Purchases</span>
                    <span className="value">{customer.totalPurchases}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Last Purchase</span>
                    <span className="value">{new Date(customer.lastPurchaseDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No customers found</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Customers;
