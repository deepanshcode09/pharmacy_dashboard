import React, { useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { usePharmacy } from '@/contexts/PharmacyContext';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/Dashboard.css';
import { TrendingUp, AlertCircle, Package, Users, Truck, DollarSign } from 'lucide-react';

const Dashboard: React.FC = () => {
  const pharmacy = usePharmacy();

  const stats = useMemo(() => ({
    totalMedicines: pharmacy.getTotalMedicines(),
    lowStockMedicines: pharmacy.getLowStockMedicines().length,
    expiredMedicines: pharmacy.getExpiredMedicines().length,
    nearExpiryMedicines: pharmacy.getNearExpiryMedicines().length,
    totalCustomers: pharmacy.getTotalCustomers(),
    totalSuppliers: pharmacy.getTotalSuppliers(),
    totalSales: pharmacy.getTotalSales(),
    monthlyRevenue: pharmacy.getMonthlyRevenue(),
  }), [pharmacy]);

  const monthlySalesData = pharmacy.getMonthlySalesData();

  const categoryData = useMemo(() => {
    const categories: { [key: string]: number } = {};
    pharmacy.medicines.forEach((med) => {
      categories[med.category] = (categories[med.category] || 0) + med.quantity;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [pharmacy.medicines]);

  const COLORS = ['#0D7377', '#FF6B6B', '#2ECC71', '#F39C12', '#5DADE2'];

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        <div className="dashboard-header-section">
          <h1>Dashboard</h1>
          <p>Welcome back! Here's your pharmacy overview.</p>
        </div>

        {/* Analytics Cards */}
        <div className="analytics-grid">
          <div className="analytics-card">
            <div className="card-icon medicines">
              <Package size={24} />
            </div>
            <div className="card-content">
              <p className="card-label">Total Medicines</p>
              <h3 className="card-value">{stats.totalMedicines}</h3>
            </div>
          </div>

          <div className="analytics-card">
            <div className="card-icon low-stock">
              <AlertCircle size={24} />
            </div>
            <div className="card-content">
              <p className="card-label">Low Stock</p>
              <h3 className="card-value">{stats.lowStockMedicines}</h3>
            </div>
          </div>

          <div className="analytics-card">
            <div className="card-icon expired">
              <AlertCircle size={24} />
            </div>
            <div className="card-content">
              <p className="card-label">Expired</p>
              <h3 className="card-value">{stats.expiredMedicines}</h3>
            </div>
          </div>

          <div className="analytics-card">
            <div className="card-icon near-expiry">
              <TrendingUp size={24} />
            </div>
            <div className="card-content">
              <p className="card-label">Near Expiry</p>
              <h3 className="card-value">{stats.nearExpiryMedicines}</h3>
            </div>
          </div>

          <div className="analytics-card">
            <div className="card-icon customers">
              <Users size={24} />
            </div>
            <div className="card-content">
              <p className="card-label">Total Customers</p>
              <h3 className="card-value">{stats.totalCustomers}</h3>
            </div>
          </div>

          <div className="analytics-card">
            <div className="card-icon suppliers">
              <Truck size={24} />
            </div>
            <div className="card-content">
              <p className="card-label">Total Suppliers</p>
              <h3 className="card-value">{stats.totalSuppliers}</h3>
            </div>
          </div>

          <div className="analytics-card">
            <div className="card-icon sales">
              <DollarSign size={24} />
            </div>
            <div className="card-content">
              <p className="card-label">Total Sales</p>
              <h3 className="card-value">{stats.totalSales}</h3>
            </div>
          </div>

          <div className="analytics-card">
            <div className="card-icon revenue">
              <TrendingUp size={24} />
            </div>
            <div className="card-content">
              <p className="card-label">Monthly Revenue</p>
              <h3 className="card-value">₹{stats.monthlyRevenue.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-container">
            <h2>Monthly Sales & Revenue</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#0D7377" name="Sales" />
                <Bar dataKey="revenue" fill="#2ECC71" name="Revenue (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h2>Medicine Categories</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h2>Revenue Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#0D7377" strokeWidth={2} name="Revenue (₹)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
