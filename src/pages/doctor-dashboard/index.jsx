import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import { getUserDisplayName, isValidWorkerHealthId } from '../../utils/roles';
import { supabase } from '../../utils/supabase';

const DoctorDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [workerSearchId, setWorkerSearchId] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);
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

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading dashboard stats:', error);
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
        console.error('Error loading recent reports:', error);
        return;
      }

      setRecentReports(data || []);
    } catch (error) {
      console.error('Error loading recent reports:', error);
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
        if (workerError.code === 'PGRST116') {
          alert(`No worker found with Health ID: ${workerSearchId.trim()}`);
        } else {
          console.error('Error searching for worker:', workerError);
          alert('Error searching for worker. Please try again.');
        }
        return;
      }

      // Get worker's medical reports
      const { data: reports, error: reportsError } = await supabase
        .from('medical_reports')
        .select('*')
        .eq('worker_health_id', workerSearchId.trim())
        .order('report_date', { ascending: false });

      if (reportsError) {
        console.error('Error loading worker reports:', reportsError);
        // Continue even if reports fail to load
      }

      setSearchResults({
        worker: workerData,
        reports: reports || []
      });

      // Navigate to worker profile
      navigate(`/doctor/worker/${workerSearchId.trim()}`);

    } catch (error) {
      console.error('Error in worker search:', error);
      alert('An error occurred while searching. Please try again.');
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

  return (
    <>
      <Helmet>
        <title>Doctor Dashboard - WorkerHelper</title>
        <meta name="description" content="Medical professional dashboard for managing worker health records and reports." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-7xl mx-auto">
              
              {/* Welcome Header */}
              <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-8 mb-8 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <Icon name="Stethoscope" size={32} className="text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold mb-2">
                        Welcome, {getUserDisplayName(user)}
                      </h1>
                      <p className="text-white/90">
                        Medical Professional Dashboard
                      </p>
                      <div className="mt-2 flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-white/90">Online</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Icon name="FileText" size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Total Reports</p>
                      <p className="text-2xl font-bold text-foreground">{dashboardStats?.total_reports || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Icon name="Users" size={24} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Workers Treated</p>
                      <p className="text-2xl font-bold text-foreground">{dashboardStats?.unique_workers || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Icon name="Calendar" size={24} className="text-orange-600" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Today's Reports</p>
                      <p className="text-2xl font-bold text-foreground">{dashboardStats?.reports_today || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Icon name="TrendingUp" size={24} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">This Week</p>
                      <p className="text-2xl font-bold text-foreground">{dashboardStats?.reports_this_week || 0}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Worker Search Section */}
                <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Icon name="Search" size={20} className="text-blue-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground">Find Worker</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex space-x-3">
                      <div className="flex-1">
                        <Input
                          ref={searchInputRef}
                          label="Worker Health ID"
                          type="text"
                          placeholder="Enter Worker Health ID (e.g., WH-ABC123-DEF456)"
                          value={workerSearchId}
                          onChange={(e) => setWorkerSearchId(e.target.value.toUpperCase())}
                          onKeyPress={handleKeyPress}
                          disabled={isSearching}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          onClick={handleWorkerSearch}
                          disabled={isSearching || !workerSearchId.trim()}
                          loading={isSearching}
                          iconName={isSearching ? "Loader" : "Search"}
                          iconPosition="left"
                          size="lg"
                        >
                          {isSearching ? 'Searching...' : 'Search'}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Icon name="Info" size={16} className="text-blue-500 mt-0.5" />
                        <div className="text-sm text-muted-foreground">
                          <p className="mb-1"><strong>How to find workers:</strong></p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Enter the worker's Health ID (format: WH-XXXXX-XXXXX)</li>
                            <li>You can find this ID on their QR code or health record</li>
                            <li>Search will show their complete medical history</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Reports Section */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Icon name="Clock" size={20} className="text-green-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground">Recent Reports</h2>
                  </div>

                  <div className="space-y-3">
                    {recentReports.length > 0 ? (
                      recentReports.map((report) => (
                        <div
                          key={report.id}
                          className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors cursor-pointer"
                          onClick={() => navigate(`/doctor/worker/${report.worker_health_id}`)}
                        >
                          <div className="flex-1">
                            <p className="font-medium text-foreground text-sm truncate">
                              {report.report_title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {report.worker_health_id}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getReportTypeColor(report.report_type)}`}>
                              {report.report_type}
                            </span>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(report.created_at)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No reports yet</p>
                        <p className="text-sm text-muted-foreground">Start by searching for a worker</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 bg-card rounded-xl border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center space-x-2">
                  <Icon name="Zap" size={20} className="text-primary" />
                  <span>Quick Actions</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => searchInputRef.current?.focus()}
                    iconName="Search"
                    iconPosition="left"
                    fullWidth
                  >
                    Search Worker
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate('/doctor/reports')}
                    iconName="FileText"
                    iconPosition="left"
                    fullWidth
                  >
                    View All Reports
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate('/dashboard')}
                    iconName="Home"
                    iconPosition="left"
                    fullWidth
                  >
                    Main Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default DoctorDashboard;