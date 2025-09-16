/**
 * @fileoverview Professional Doctor Dashboard
 * @description Modern healthcare management interface for medical professionals
 * @author JeevanID Team
 * @version 2.0.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import { getUserDisplayName, isValidWorkerHealthId } from '../../utils/roles';
import { supabase } from '../../utils/supabase';

// ============================================================================
// MOCK DATA - Replace with real API calls
// ============================================================================

const mockPatients = [
  {
    id: 'WH-064321',
    name: 'Sunita Devi',
    age: 35,
    gender: 'Female',
    workplace: 'Chemical Industries Safety',
    lastVisit: 'Jan 12, 2024',
    visitType: 'Emergency Consultation',
    healthStatus: 'Critical',
    statusColor: 'text-red-600',
    statusBg: 'bg-red-50',
    avatar: 'SD'
  },
  {
    id: 'WH-001234',
    name: 'Rajesh Kumar',
    age: 32,
    gender: 'Male',
    workplace: 'Steel Manufacturing Co. Production',
    lastVisit: 'Jan 10, 2024',
    visitType: 'Regular Checkup',
    healthStatus: 'Healthy',
    statusColor: 'text-green-600',
    statusBg: 'bg-green-50',
    avatar: 'RK'
  },
  {
    id: 'WH-007890',
    name: 'Amit Singh',
    age: 29,
    gender: 'Male',
    workplace: 'Electronics Assembly Line',
    lastVisit: 'Jan 9, 2024',
    visitType: 'Annual Checkup',
    healthStatus: 'Healthy',
    statusColor: 'text-green-600',
    statusBg: 'bg-green-50',
    avatar: 'AS'
  },
  {
    id: 'WH-005678',
    name: 'Priya Sharma',
    age: 28,
    gender: 'Female',
    workplace: 'Textile Factory Ltd. Quality Control',
    lastVisit: 'Jan 8, 2024',
    visitType: 'Follow-up',
    healthStatus: 'At Risk',
    statusColor: 'text-orange-600',
    statusBg: 'bg-orange-50',
    avatar: 'PS'
  },
  {
    id: 'WH-009876',
    name: 'Mohammed Ali',
    age: 34,
    gender: 'Male',
    workplace: 'Construction Corp. Heavy Machinery',
    lastVisit: 'Jan 5, 2024',
    visitType: 'Specialist Consultation',
    healthStatus: 'Follow Up',
    statusColor: 'text-blue-600',
    statusBg: 'bg-blue-50',
    avatar: 'MA'
  }
];

const mockStats = {
  totalPatients: 1247,
  newRegistrations: 23,
  criticalCases: 8,
  todaysAppointments: 12,
  monthlyGrowth: 12,
  registrationGrowth: 8,
  criticalGrowth: 5
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const DoctorDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatients, setSelectedPatients] = useState('all');
  const [sortBy, setSortBy] = useState('last-visit');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Legacy states (kept for compatibility)
  const [workerSearchId, setWorkerSearchId] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(mockStats);
  const [recentReports, setRecentReports] = useState([]);
  const searchInputRef = useRef(null);

  // Load dashboard statistics on mount
  React.useEffect(() => {
    loadDashboardStats();
    loadRecentReports();
  }, [user]);

  const loadDashboardStats = async () => {
    try {
      const { data, error } = await supabase
        .from('doctor_dashboard_stats')
        .select('*')
        .eq('doctor_clerk_id', user.id)
        .single();

      if (error) {
        console.error('Dashboard stats error:', error);
        
        // Always set default stats if there's any error
        setDashboardStats({
          total_reports: 0,
          unique_workers: 0,
          reports_today: 0,
          reports_this_week: 0
        });
        
        if (error.code === '42P01') {
          console.warn('doctor_dashboard_stats view not found - using default values');
        }
        return;
      }

      setDashboardStats(data || {
        total_reports: 0,
        unique_workers: 0,
        reports_today: 0,
        reports_this_week: 0
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      // Set default stats on any error
      setDashboardStats({
        total_reports: 0,
        unique_workers: 0,
        reports_today: 0,
        reports_this_week: 0
      });
    }
  };

  const loadRecentReports = async () => {
    try {
      const { data, error } = await supabase
        .from('medical_reports')
        .select(`
          id,
          report_id,
          worker_health_id,
          report_title,
          report_type,
          report_date,
          created_at
        `)
        .eq('doctor_clerk_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Recent reports error:', error);
        setRecentReports([]);
        
        if (error.code === '42P01') {
          console.warn('medical_reports table not found - showing empty reports');
        }
        return;
      }

      setRecentReports(data || []);
    } catch (error) {
      console.error('Error loading recent reports:', error);
      setRecentReports([]);
    }
  };

  const handleWorkerSearch = async () => {
    if (!workerSearchId.trim()) {
      alert('Please enter a Worker Health ID');
      return;
    }

    if (!isValidWorkerHealthId(workerSearchId.trim())) {
      alert('Please enter a valid Worker Health ID (format: WH-XXXXX-XXXXX)');
      return;
    }

    setIsSearching(true);
    setSearchResults(null);

    try {
      // Search for worker in workers_data table
      const { data: workerData, error: workerError } = await supabase
        .from('workers_data')
        .select('*')
        .eq('health_id', workerSearchId.trim())
        .single();

      if (workerError) {
        console.error('Worker search error:', workerError);
        
        if (workerError.code === 'PGRST116') {
          alert(`No worker found with Health ID: ${workerSearchId.trim()}`);  
        } else if (workerError.code === '42P01') {
          alert('Database table not found. Please ensure the workers_data table has been created in your database.');
        } else {
          alert(`Database error: ${workerError.message || 'Unknown error occurred while searching for worker'}`);
        }
        return;
      }

      // Get worker's medical reports (optional, continue even if this fails)
      let reports = [];
      try {
        const { data: reportsData, error: reportsError } = await supabase
          .from('medical_reports')
          .select('*')
          .eq('worker_health_id', workerSearchId.trim())
          .order('report_date', { ascending: false });

        if (reportsError) {
          console.error('Error loading worker reports:', reportsError);
          // Don't show error to user, just log it
        } else {
          reports = reportsData || [];
        }
      } catch (reportError) {
        console.error('Medical reports table error:', reportError);
        // Continue without reports
      }

      setSearchResults({
        worker: workerData,
        reports: reports
      });

      // Navigate to worker profile
      navigate(`/doctor/worker/${workerSearchId.trim()}`);

    } catch (error) {
      console.error('Error in worker search:', error);
      alert(`Unexpected error: ${error.message}. Please check the browser console for more details.`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleWorkerSearch();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getReportTypeColor = (reportType) => {
    const colors = {
      'General Examination': 'bg-blue-100 text-blue-800',
      'Emergency Visit': 'bg-red-100 text-red-800',
      'Follow-up': 'bg-green-100 text-green-800',
      'Lab Results': 'bg-yellow-100 text-yellow-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[reportType] || colors['Other'];
  };

  const filteredPatients = mockPatients.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.workplace.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Doctor Dashboard - JeevanID</title>
        <meta name="description" content="Medical professional dashboard for managing worker health records and reports." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Professional Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                <Icon name="Heart" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">JeevanID</h1>
                <p className="text-sm text-gray-500">Pro</p>
              </div>
              <button 
                className="ml-8 text-gray-500 hover:text-gray-700"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                <Icon name="Menu" size={20} />
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
                <Icon name="Stethoscope" size={16} />
                <span>Doctor Dashboard</span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Professional Sidebar */}
          <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white shadow-sm border-r border-gray-200 min-h-screen transition-all duration-300`}>
            <nav className="p-4 space-y-2">
              {/* Dashboard Overview */}
              <button 
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'overview' ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon name="BarChart3" size={18} />
                {!sidebarCollapsed && <span>Dashboard Overview</span>}
              </button>
              
              {/* Patient Management */}
              <button 
                onClick={() => setActiveTab('patients')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'patients' ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon name="Users" size={18} />
                {!sidebarCollapsed && <span>Patient Management</span>}
                {!sidebarCollapsed && <span className="ml-auto bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs">24</span>}
              </button>
              
              {/* Health Records */}
              <button 
                onClick={() => setActiveTab('records')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'records' ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon name="FileText" size={18} />
                {!sidebarCollapsed && <span>Health Records</span>}
              </button>
              
              {/* Health Analytics */}
              <button 
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'analytics' ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon name="TrendingUp" size={18} />
                {!sidebarCollapsed && <span>Health Analytics</span>}
              </button>
              
              {/* Medical Tools */}
              <button 
                onClick={() => setActiveTab('tools')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'tools' ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon name="Wrench" size={18} />
                {!sidebarCollapsed && <span>Medical Tools</span>}
              </button>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <p className={`text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 ${sidebarCollapsed ? 'hidden' : ''}`}>
                  Administration
                </p>
                
                <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                  <Icon name="Settings" size={18} />
                  {!sidebarCollapsed && <span>Settings</span>}
                </button>
                
                <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                  <Icon name="HelpCircle" size={18} />
                  {!sidebarCollapsed && <span>Help & Support</span>}
                </button>
              </div>
            </nav>
            
            {/* Doctor Profile */}
            <div className={`absolute bottom-4 left-4 right-4 ${sidebarCollapsed ? 'hidden' : ''}`}>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {getUserDisplayName(user)?.charAt(0) || 'D'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Dr. {getUserDisplayName(user) || 'Sarah Johnson'}
                  </p>
                  <p className="text-xs text-gray-500">Healthcare Professional</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            {/* Page Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Doctor Dashboard</h2>
                  <p className="text-gray-600 mt-1">Comprehensive healthcare management for worker patients</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                    <Icon name="QrCode" size={16} />
                    <span>Scan QR Code</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-teal-500 text-white rounded-lg text-sm hover:bg-teal-600">
                    <Icon name="Plus" size={16} />
                    <span>New Appointment</span>
                  </button>
                </div>
              </div>
            </div>

            {activeTab === 'overview' && (
              <div className="p-6">
                {/* Dashboard Tabs */}
                <div className="flex items-center space-x-6 mb-6">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium">
                    <Icon name="BarChart3" size={16} />
                    <span>Overview</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('patients')}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50"
                  >
                    <Icon name="Users" size={16} />
                    <span>Patient Records</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50">
                    <Icon name="TrendingUp" size={16} />
                    <span>Analytics</span>
                  </button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                        <Icon name="Users" size={24} className="text-teal-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Patients</p>
                        <p className="text-2xl font-bold text-gray-900">{mockStats.totalPatients.toLocaleString()}</p>
                        <p className="text-sm text-green-600 flex items-center mt-1">
                          <Icon name="TrendingUp" size={14} className="mr-1" />
                          {mockStats.monthlyGrowth}% from last month
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Active patient records</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon name="UserPlus" size={24} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">New Registrations</p>
                        <p className="text-2xl font-bold text-gray-900">{mockStats.newRegistrations}</p>
                        <p className="text-sm text-green-600 flex items-center mt-1">
                          <Icon name="TrendingUp" size={14} className="mr-1" />
                          {mockStats.registrationGrowth}% from last month
                        </p>
                        <p className="text-xs text-gray-500 mt-1">This month</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <Icon name="AlertTriangle" size={24} className="text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Critical Cases</p>
                        <p className="text-2xl font-bold text-gray-900">{mockStats.criticalCases}</p>
                        <p className="text-sm text-red-600 flex items-center mt-1">
                          <Icon name="TrendingDown" size={14} className="mr-1" />
                          {mockStats.criticalGrowth}% from last month
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Requiring immediate attention</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Icon name="Calendar" size={24} className="text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                        <p className="text-2xl font-bold text-gray-900">{mockStats.todaysAppointments}</p>
                        <p className="text-sm text-gray-600 mt-1">Scheduled consultations</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Patient Management Tab */}
            {activeTab === 'patients' && (
              <div className="p-6">
                {/* Patient Records Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Recent Patients</h3>
                    <button className="text-teal-600 text-sm font-medium hover:text-teal-700 flex items-center space-x-1">
                      <span>View All</span>
                      <Icon name="ArrowRight" size={14} />
                    </button>
                  </div>
                </div>

                {/* Patient Records Section */}
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900">Patient Records</h4>
                      <p className="text-sm text-gray-500">{filteredPatients.length} of {mockPatients.length} patients</p>
                    </div>
                    
                    {/* Search and Filters */}
                    <div className="flex items-center justify-between space-x-4">
                      <div className="flex-1 relative">
                        <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search patients, ID, workplace..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <select 
                          value={selectedPatients}
                          onChange={(e) => setSelectedPatients(e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500"
                        >
                          <option value="all">All Patients</option>
                          <option value="critical">Critical</option>
                          <option value="healthy">Healthy</option>
                          <option value="at-risk">At Risk</option>
                        </select>
                        <select 
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500"
                        >
                          <option value="last-visit">Last Visit</option>
                          <option value="name">Name</option>
                          <option value="status">Health Status</option>
                        </select>
                        <button 
                          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                          className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <Icon name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Patient Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Health ID</th>
                          <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                          <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Workplace</th>
                          <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                          <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Health Status</th>
                          <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredPatients.map((patient) => (
                          <tr key={patient.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                                  <Icon name="QrCode" size={16} className="text-teal-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-900">{patient.id}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-medium text-blue-600">{patient.avatar}</span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                                  <p className="text-xs text-gray-500">{patient.age} years, {patient.gender}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-gray-900">{patient.workplace}</p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <p className="text-sm text-gray-900">{patient.lastVisit}</p>
                                <p className="text-xs text-gray-500">{patient.visitType}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${patient.statusBg} ${patient.statusColor}`}>
                                {patient.healthStatus === 'Critical' && <Icon name="AlertCircle" size={12} className="mr-1" />}
                                {patient.healthStatus === 'Healthy' && <Icon name="CheckCircle" size={12} className="mr-1" />}
                                {patient.healthStatus === 'At Risk' && <Icon name="AlertTriangle" size={12} className="mr-1" />}
                                {patient.healthStatus === 'Follow Up' && <Icon name="Clock" size={12} className="mr-1" />}
                                {patient.healthStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button 
                                  onClick={() => navigate(`/doctor/worker/${patient.id}`)}
                                  className="text-teal-600 hover:text-teal-900 p-1"
                                  title="View"
                                >
                                  <Icon name="Eye" size={16} />
                                </button>
                                <button className="text-blue-600 hover:text-blue-900 p-1" title="Edit">
                                  <Icon name="Edit" size={16} />
                                </button>
                                <button className="text-green-600 hover:text-green-900 p-1" title="Schedule">
                                  <Icon name="Calendar" size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs content placeholder */}
            {activeTab === 'records' && (
              <div className="p-6">
                <div className="text-center py-12">
                  <Icon name="FileText" size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Health Records</h3>
                  <p className="text-gray-500">Comprehensive health record management coming soon</p>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="p-6">
                <div className="text-center py-12">
                  <Icon name="TrendingUp" size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Health Analytics</h3>
                  <p className="text-gray-500">Advanced analytics and reporting coming soon</p>
                </div>
              </div>
            )}

            {activeTab === 'tools' && (
              <div className="p-6">
                <div className="text-center py-12">
                  <Icon name="Wrench" size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Medical Tools</h3>
                  <p className="text-gray-500">Diagnostic tools and utilities coming soon</p>
                </div>
              </div>
            )}

            {/* Quick Actions section for Overview tab */}
            {activeTab === 'overview' && (
              <div className="p-6 pt-0">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-3">
                        <Icon name="QrCode" size={20} className="text-teal-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">Scan QR Code</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                        <Icon name="FileText" size={20} className="text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">Generate Report</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                        <Icon name="Calendar" size={20} className="text-orange-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">Schedule Appointment</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-3">
                        <Icon name="Bell" size={20} className="text-yellow-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">Send Alerts</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default DoctorDashboard;
