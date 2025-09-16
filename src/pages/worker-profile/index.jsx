import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
// import Select from '../../components/ui/Select'; // Using native select instead
import TextArea from "../../components/ui/TextArea";
import Icon from '../../components/AppIcon';
import { getUserDisplayName, isValidWorkerHealthId } from '../../utils/roles';
import { supabase } from '../../utils/supabase';

const WorkerProfile = () => {
  const { workerId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  const [worker, setWorker] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddReport, setShowAddReport] = useState(false);
  const [submittingReport, setSubmittingReport] = useState(false);

  // Form state for new report
  const [newReport, setNewReport] = useState({
    reportTitle: '',
    reportType: '',
    reportDescription: '',
    diagnosis: '',
    treatment: '',
    notes: '',
    followUpRequired: false,
    followUpDate: ''
  });

  const reportTypes = [
    'General Examination',
    'Emergency Visit',
    'Follow-up',
    'Lab Results',
    'Injury Assessment',
    'Occupational Health Check',
    'Mental Health Assessment',
    'Other'
  ];

  useEffect(() => {
    if (workerId && isValidWorkerHealthId(workerId)) {
      loadWorkerData();
      loadWorkerReports();
    } else {
      alert('Invalid Worker Health ID');
      navigate('/doctor/dashboard');
    }
  }, [workerId, user]);

  const loadWorkerData = async () => {
    try {
      console.log('Loading worker data for ID:', workerId);
      
      const { data, error } = await supabase
        .from('workers_data')
        .select('*')
        .eq('health_id', workerId)
        .single();

      console.log('Worker data response:', { data, error });

      if (error) {
        console.error('Worker search error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        if (error.code === 'PGRST116') {
          alert(`No worker found with Health ID: ${workerId}`);
          navigate('/doctor/dashboard');
        } else if (error.code === '42P01') {
          alert('Database table not found. Please ensure the workers_data table has been created.');
          navigate('/doctor/dashboard');
        } else {
          console.error('Error loading worker data:', error);
          alert(`Database error: ${error.message}. Please check the console for details.`);
        }
        return;
      }

      if (!data) {
        alert(`No data returned for worker with Health ID: ${workerId}`);
        navigate('/doctor/dashboard');
        return;
      }

      console.log('Worker data loaded successfully:', data);
      setWorker(data);
    } catch (error) {
      console.error('Unexpected error loading worker data:', error);
      alert(`Unexpected error: ${error.message}. Please check the console for details.`);
    }
  };

  const loadWorkerReports = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('medical_reports')
        .select('*')
        .eq('worker_health_id', workerId)
        .order('report_date', { ascending: false });

      if (error) {
        console.error('Error loading worker reports:', error);
      } else {
        setReports(data || []);
      }
    } catch (error) {
      console.error('Error loading worker reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setNewReport(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    
    if (!newReport.reportTitle.trim() || !newReport.reportType || !newReport.reportDescription.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmittingReport(true);

    try {
      const reportData = {
        worker_health_id: workerId,
        doctor_clerk_id: user.id,
        report_id: `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        report_title: newReport.reportTitle.trim(),
        report_type: newReport.reportType,
        report_description: newReport.reportDescription.trim(),
        diagnosis: newReport.diagnosis.trim() || null,
        treatment: newReport.treatment.trim() || null,
        notes: newReport.notes.trim() || null,
        follow_up_required: newReport.followUpRequired,
        follow_up_date: newReport.followUpRequired && newReport.followUpDate ? new Date(newReport.followUpDate).toISOString() : null,
        report_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('medical_reports')
        .insert([reportData]);

      if (error) {
        console.error('Error submitting report:', error);
        alert('Error submitting report. Please try again.');
        return;
      }

      // Reset form
      setNewReport({
        reportTitle: '',
        reportType: '',
        reportDescription: '',
        diagnosis: '',
        treatment: '',
        notes: '',
        followUpRequired: false,
        followUpDate: ''
      });

      setShowAddReport(false);
      alert('Medical report submitted successfully!');
      
      // Reload reports
      await loadWorkerReports();

    } catch (error) {
      console.error('Error submitting report:', error);
      alert('An error occurred while submitting the report.');
    } finally {
      setSubmittingReport(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateInput = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  const getReportTypeColor = (reportType) => {
    const colors = {
      'General Examination': 'bg-blue-100 text-blue-800 border-blue-200',
      'Emergency Visit': 'bg-red-100 text-red-800 border-red-200',
      'Follow-up': 'bg-green-100 text-green-800 border-green-200',
      'Lab Results': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Injury Assessment': 'bg-orange-100 text-orange-800 border-orange-200',
      'Occupational Health Check': 'bg-purple-100 text-purple-800 border-purple-200',
      'Mental Health Assessment': 'bg-pink-100 text-pink-800 border-pink-200',
      'Other': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[reportType] || colors['Other'];
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'N/A';
    try {
      const today = new Date();
      const birth = new Date(birthDate);
      const age = Math.floor((today - birth) / (365.25 * 24 * 60 * 60 * 1000));
      return age;
    } catch (error) {
      return 'N/A';
    }
  };

  // Helper function to get worker name from different possible column names
  const getWorkerName = (workerData) => {
    if (!workerData) return 'Unknown Worker';
    return workerData.name || workerData.full_name || workerData.worker_name || `Worker ${workerData.health_id}` || 'Unknown Worker';
  };

  // Helper function to safely get field value
  const getFieldValue = (workerData, fieldName, defaultValue = 'N/A') => {
    if (!workerData) return defaultValue;
    return workerData[fieldName] || defaultValue;
  };

  if (loading && !worker) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center py-16">
              <Icon name="Loader" size={48} className="text-primary mx-auto mb-4 animate-spin" />
              <p className="text-muted-foreground">Loading worker profile...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center py-16">
              <Icon name="AlertCircle" size={48} className="text-destructive mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">Worker Not Found</h1>
              <p className="text-muted-foreground mb-8">No worker found with Health ID: {workerId}</p>
              <Button onClick={() => navigate('/doctor/dashboard')} iconName="ArrowLeft" iconPosition="left">
                Back to Dashboard
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Worker Profile - {getWorkerName(worker)} - WorkerHelper</title>
        <meta name="description" content={`Medical profile for worker ${getWorkerName(worker)} (${workerId})`} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-7xl mx-auto">
              
              {/* Back Navigation */}
              <div className="mb-6">
                <Button
                  variant="outline"
                  onClick={() => navigate('/doctor/dashboard')}
                  iconName="ArrowLeft"
                  iconPosition="left"
                >
                  Back to Dashboard
                </Button>
              </div>

              {/* Worker Info Header */}
              <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-8 mb-8 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                      <Icon name="User" size={40} className="text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{getWorkerName(worker)}</h1>
                      <div className="space-y-1">
                        <p className="text-white/90 flex items-center space-x-2">
                          <Icon name="BadgeCheck" size={16} />
                          <span>Health ID: {getFieldValue(worker, 'health_id', workerId)}</span>
                        </p>
                        <p className="text-white/90 flex items-center space-x-2">
                          <Icon name="Calendar" size={16} />
                          <span>Age: {calculateAge(getFieldValue(worker, 'birth_date', null))} years</span>
                        </p>
                        {getFieldValue(worker, 'phone', null) && (
                          <p className="text-white/90 flex items-center space-x-2">
                            <Icon name="Phone" size={16} />
                            <span>{getFieldValue(worker, 'phone')}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <Button
                      onClick={() => setShowAddReport(true)}
                      size="lg"
                      iconName="Plus"
                      iconPosition="left"
                      className="bg-white text-blue-600 hover:bg-white/90"
                    >
                      Add New Report
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Worker Details */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Icon name="User" size={20} className="text-blue-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground">Worker Details</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <p className="text-foreground font-medium">{getWorkerName(worker)}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Health ID</label>
                      <p className="text-foreground font-mono">{getFieldValue(worker, 'health_id', workerId)}</p>
                    </div>
                    
                    {getFieldValue(worker, 'birth_date', null) && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                        <p className="text-foreground">{new Date(getFieldValue(worker, 'birth_date')).toLocaleDateString()}</p>
                      </div>
                    )}
                    
                    {getFieldValue(worker, 'gender', null) && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Gender</label>
                        <p className="text-foreground">{getFieldValue(worker, 'gender')}</p>
                      </div>
                    )}
                    
                    {getFieldValue(worker, 'phone', null) && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Phone</label>
                        <p className="text-foreground">{getFieldValue(worker, 'phone')}</p>
                      </div>
                    )}
                    
                    {getFieldValue(worker, 'address', null) && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Address</label>
                        <p className="text-foreground">{getFieldValue(worker, 'address')}</p>
                      </div>
                    )}
                    
                    {getFieldValue(worker, 'emergency_contact', null) && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Emergency Contact</label>
                        <p className="text-foreground">{getFieldValue(worker, 'emergency_contact')}</p>
                      </div>
                    )}
                    
                    {getFieldValue(worker, 'blood_type', null) && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Blood Type</label>
                        <p className="text-foreground">{getFieldValue(worker, 'blood_type')}</p>
                      </div>
                    )}
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Known Allergies</label>
                      <p className="text-foreground">{getFieldValue(worker, 'allergies', 'None reported')}</p>
                    </div>
                    
                    {/* Show available fields for debugging */}
                    <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Available Data Fields</label>
                      <p className="text-xs text-muted-foreground mt-1">
                        {worker ? Object.keys(worker).filter(key => worker[key] !== null && worker[key] !== undefined && worker[key] !== '').join(', ') : 'No data'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Medical Reports */}
                <div className="lg:col-span-2">
                  <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                          <Icon name="FileText" size={20} className="text-green-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-foreground">
                          Medical Reports ({reports.length})
                        </h2>
                      </div>
                    </div>

                    {loading ? (
                      <div className="text-center py-8">
                        <Icon name="Loader" size={32} className="text-primary mx-auto mb-4 animate-spin" />
                        <p className="text-muted-foreground">Loading reports...</p>
                      </div>
                    ) : reports.length > 0 ? (
                      <div className="space-y-4">
                        {reports.map((report) => (
                          <div
                            key={report.id}
                            className="bg-muted/50 rounded-lg p-4 border border-muted"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="font-semibold text-foreground mb-1">
                                  {report.report_title}
                                </h3>
                                <div className="flex items-center space-x-3">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getReportTypeColor(report.report_type)}`}>
                                    {report.report_type}
                                  </span>
                                  <p className="text-sm text-muted-foreground">
                                    {formatDate(report.report_date)}
                                  </p>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                ID: {report.report_id}
                              </p>
                            </div>

                            <div className="space-y-2">
                              <div>
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</label>
                                <p className="text-sm text-foreground">{report.report_description}</p>
                              </div>
                              
                              {report.diagnosis && (
                                <div>
                                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Diagnosis</label>
                                  <p className="text-sm text-foreground">{report.diagnosis}</p>
                                </div>
                              )}
                              
                              {report.treatment && (
                                <div>
                                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Treatment</label>
                                  <p className="text-sm text-foreground">{report.treatment}</p>
                                </div>
                              )}
                              
                              {report.notes && (
                                <div>
                                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Notes</label>
                                  <p className="text-sm text-foreground">{report.notes}</p>
                                </div>
                              )}
                              
                              {report.follow_up_required && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                                  <div className="flex items-center space-x-2">
                                    <Icon name="Calendar" size={14} className="text-yellow-600" />
                                    <span className="text-sm font-medium text-yellow-800">Follow-up Required</span>
                                  </div>
                                  {report.follow_up_date && (
                                    <p className="text-sm text-yellow-700 mt-1">
                                      Scheduled: {formatDate(report.follow_up_date)}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-2">No medical reports found</p>
                        <p className="text-sm text-muted-foreground">Add the first medical report for this worker</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Add Report Modal */}
        {showAddReport && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl border border-border p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Add New Medical Report</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddReport(false)}
                  iconName="X"
                  disabled={submittingReport}
                />
              </div>

              <form onSubmit={handleSubmitReport} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Report Title *"
                    type="text"
                    placeholder="Brief title for this report"
                    value={newReport.reportTitle}
                    onChange={(e) => handleInputChange('reportTitle', e.target.value)}
                    disabled={submittingReport}
                    required
                  />
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-foreground">
                      Report Type *
                    </label>
                    <select
                      value={newReport.reportType}
                      onChange={(e) => handleInputChange('reportType', e.target.value)}
                      disabled={submittingReport}
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select report type</option>
                      {reportTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <TextArea
                  label="Report Description *"
                  placeholder="Detailed description of the examination, symptoms, findings..."
                  value={newReport.reportDescription}
                  onChange={(e) => handleInputChange('reportDescription', e.target.value)}
                  disabled={submittingReport}
                  rows={4}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextArea
                    label="Diagnosis"
                    placeholder="Medical diagnosis if applicable"
                    value={newReport.diagnosis}
                    onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                    disabled={submittingReport}
                    rows={3}
                  />
                  
                  <TextArea
                    label="Treatment"
                    placeholder="Treatment provided or recommended"
                    value={newReport.treatment}
                    onChange={(e) => handleInputChange('treatment', e.target.value)}
                    disabled={submittingReport}
                    rows={3}
                  />
                </div>

                <TextArea
                  label="Additional Notes"
                  placeholder="Any additional notes or observations"
                  value={newReport.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  disabled={submittingReport}
                  rows={2}
                />

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="followUp"
                    checked={newReport.followUpRequired}
                    onChange={(e) => handleInputChange('followUpRequired', e.target.checked)}
                    disabled={submittingReport}
                    className="rounded border-border"
                  />
                  <label htmlFor="followUp" className="text-sm font-medium text-foreground">
                    Follow-up required
                  </label>
                </div>

                {newReport.followUpRequired && (
                  <Input
                    label="Follow-up Date"
                    type="date"
                    value={formatDateInput(newReport.followUpDate)}
                    onChange={(e) => handleInputChange('followUpDate', e.target.value)}
                    disabled={submittingReport}
                  />
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddReport(false)}
                    disabled={submittingReport}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={submittingReport}
                    disabled={submittingReport || !newReport.reportTitle.trim() || !newReport.reportType || !newReport.reportDescription.trim()}
                  >
                    {submittingReport ? 'Submitting...' : 'Submit Report'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WorkerProfile;