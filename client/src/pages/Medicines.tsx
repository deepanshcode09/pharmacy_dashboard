import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { usePharmacy, Medicine } from '@/contexts/PharmacyContext';
import '../styles/Medicines.css';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';

const Medicines: React.FC = () => {
  const pharmacy = usePharmacy();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Medicine, 'id'>>({
    name: '',
    genericName: '',
    brandName: '',
    category: '',
    manufacturer: '',
    price: 0,
    quantity: 0,
    expiryDate: '',
    batchNumber: '',
    description: '',
    warnings: '',
    indications: '',
    dosage: '',
    supplier: '',
    lastRestocked: new Date().toISOString().split('T')[0],
  });

  const filteredMedicines = useMemo(() => {
    return pharmacy.medicines.filter((med) => {
      const matchesSearch =
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.brandName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || med.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [pharmacy.medicines, searchTerm, categoryFilter]);

  const categories = useMemo(() => {
    const cats = new Set(pharmacy.medicines.map((m) => m.category));
    return Array.from(cats);
  }, [pharmacy.medicines]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      pharmacy.updateMedicine(editingId, formData);
      setEditingId(null);
    } else {
      pharmacy.addMedicine(formData);
    }
    setFormData({
      name: '',
      genericName: '',
      brandName: '',
      category: '',
      manufacturer: '',
      price: 0,
      quantity: 0,
      expiryDate: '',
      batchNumber: '',
      description: '',
      warnings: '',
      indications: '',
      dosage: '',
      supplier: '',
      lastRestocked: new Date().toISOString().split('T')[0],
    });
    setShowForm(false);
  };

  const handleEdit = (medicine: Medicine) => {
    setFormData(medicine);
    setEditingId(medicine.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this medicine?')) {
      pharmacy.deleteMedicine(id);
    }
  };

  return (
    <DashboardLayout>
      <div className="medicines-page">
        <div className="page-header">
          <h1>Medicine Management</h1>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={18} /> Add Medicine
          </button>
        </div>

        <div className="filters-section">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-box">
            <Filter size={18} />
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editingId ? 'Edit Medicine' : 'Add New Medicine'}</h2>
              <form onSubmit={handleSubmit} className="medicine-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Medicine Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Generic Name *</label>
                    <input
                      type="text"
                      value={formData.genericName}
                      onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Brand Name</label>
                    <input
                      type="text"
                      value={formData.brandName}
                      onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Manufacturer</label>
                    <input
                      type="text"
                      value={formData.manufacturer}
                      onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Price (₹) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Quantity *</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Expiry Date *</label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Batch Number</label>
                    <input
                      type="text"
                      value={formData.batchNumber}
                      onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Dosage</label>
                    <input
                      type="text"
                      value={formData.dosage}
                      onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label>Warnings</label>
                  <textarea
                    value={formData.warnings}
                    onChange={(e) => setFormData({ ...formData, warnings: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="form-group">
                  <label>Indications</label>
                  <textarea
                    value={formData.indications}
                    onChange={(e) => setFormData({ ...formData, indications: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingId ? 'Update' : 'Add'} Medicine
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="medicines-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Generic Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Expiry Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicines.length > 0 ? (
                filteredMedicines.map((medicine) => (
                  <tr key={medicine.id}>
                    <td>{medicine.name}</td>
                    <td>{medicine.genericName}</td>
                    <td>{medicine.category}</td>
                    <td>₹{medicine.price}</td>
                    <td>
                      <span className={`quantity-badge ${medicine.quantity < 50 ? 'low' : ''}`}>
                        {medicine.quantity}
                      </span>
                    </td>
                    <td>{new Date(medicine.expiryDate).toLocaleDateString()}</td>
                    <td className="actions">
                      <button className="btn-icon edit" onClick={() => handleEdit(medicine)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon delete" onClick={() => handleDelete(medicine.id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="empty-state">
                    No medicines found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Medicines;
