import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { supabase } from '../../utils/supabase';

const WorkerDetails = () => {
  const { health_id } = useParams();
  const navigate = useNavigate();
  const [workerData, setWorkerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkerData();
  }, [health_id]);

  const fetchWorkerData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch worker data from workers_data table
      const { data, error } = await supabase
        .from('workers_data')
        .select('full_name, age, gender, occupation_type, contractor_name, blood_group, vaccination_status, created_at')
        .eq('health_id', health_id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          setError('No worker record found');
        } else {
          console.error('Error fetching worker data:', error);
          setError('Error loading worker data');
        }
        return;
      }

      setWorkerData(data);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getVaccinationStatusColor = (status) => {
    switch (status) {
      case 'Fully Vaccinated':
        return 'text-green-600 bg-green-100';
      case 'Partially Vaccinated':
        return 'text-yellow-600 bg-yellow-100';
      case 'Not Vaccinated':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading Worker Details - WorkerHelper</title>
        </Helmet>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-20 pb-16">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-2xl mx-auto">
                <div className="bg-card rounded-xl border border-border p-6 lg:p-8">
                  <div className="flex items-center justify-center space-x-2">
                    <Icon name="Loader" size={24} className="text-primary animate-spin" />
                    <span className="text-lg text-foreground">Loading worker details...</span>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Worker Not Found - WorkerHelper</title>
          <meta name="description" content="The requested worker record could not be found." />
        </Helmet>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-20 pb-16">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-2xl mx-auto">
                <div className="bg-card rounded-xl border border-border p-6 lg:p-8 text-center">
                  <div className="mb-6">
                    <Icon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-foreground mb-2">Worker Record Not Found</h1>
                    <p className="text-muted-foreground">
                      {error === 'No worker record found' 
                        ? 'The worker ID you\'re looking for doesn\'t exist in our system.'
                        : 'There was an error loading the worker information.'}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <Button
                      variant="default"
                      size="lg"
                      onClick={() => navigate('/personal-health-record')}
                      iconName="Plus"
                      iconPosition="left"
                    >
                      Create New Health Record
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => navigate('/')}
                      iconName="Home"
                      iconPosition="left"
                    >
                      Go to Homepage
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{workerData?.full_name} - Worker Details - WorkerHelper</title>
        <meta name="description" content={`View basic information for ${workerData?.full_name}, ${workerData?.occupation_type} worker.`} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-2xl mx-auto">
              
              {/* Page Header */}
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-foreground mb-2">Worker Information</h1>
                <p className="text-muted-foreground">
                  Basic details for Health ID: <span className="font-mono font-medium">{health_id}</span>
                </p>
              </div>

              {/* Worker Details Card */}
              <div className="bg-card rounded-xl border border-border p-6 lg:p-8 mb-6">
                <div className="space-y-6">
                  
                  {/* Personal Information */}
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                      <Icon name="User" size={20} className="text-primary" />
                      <span>Personal Information</span>
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-muted rounded-lg p-4">
                        <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                        <p className="text-lg font-semibold text-foreground mt-1">
                          {workerData?.full_name || 'N/A'}
                        </p>
                      </div>
                      
                      <div className="bg-muted rounded-lg p-4">
                        <label className="text-sm font-medium text-muted-foreground">Age</label>
                        <p className="text-lg font-semibold text-foreground mt-1">
                          {workerData?.age ? `${workerData.age} years` : 'N/A'}
                        </p>
                      </div>
                      
                      <div className="bg-muted rounded-lg p-4">
                        <label className="text-sm font-medium text-muted-foreground">Gender</label>
                        <p className="text-lg font-semibold text-foreground mt-1">
                          {workerData?.gender || 'N/A'}
                        </p>
                      </div>
                      
                      <div className="bg-muted rounded-lg p-4">
                        <label className="text-sm font-medium text-muted-foreground">Blood Group</label>
                        <p className="text-lg font-semibold text-foreground mt-1">
                          {workerData?.blood_group || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Work Information */}
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                      <Icon name="Briefcase" size={20} className="text-primary" />
                      <span>Work Information</span>
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-muted rounded-lg p-4">
                        <label className="text-sm font-medium text-muted-foreground">Occupation</label>
                        <p className="text-lg font-semibold text-foreground mt-1">
                          {workerData?.occupation_type || 'N/A'}
                        </p>
                      </div>
                      
                      <div className="bg-muted rounded-lg p-4">
                        <label className="text-sm font-medium text-muted-foreground">Contractor/Employer</label>
                        <p className="text-lg font-semibold text-foreground mt-1">
                          {workerData?.contractor_name || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Health Status */}
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                      <Icon name="Shield" size={20} className="text-primary" />
                      <span>Health Status</span>
                    </h2>
                    
                    <div className="bg-muted rounded-lg p-4">
                      <label className="text-sm font-medium text-muted-foreground">Vaccination Status</label>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getVaccinationStatusColor(workerData?.vaccination_status)}`}>
                          {workerData?.vaccination_status || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Record Information */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground text-center">
                      Record created on {formatDate(workerData?.created_at)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800">Limited Information Display</h3>
                    <p className="text-sm text-blue-600 mt-1">
                      This page shows only basic worker information for identification purposes. 
                      Detailed medical records and personal contact information are kept private and secure.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/')}
                  iconName="Home"
                  iconPosition="left"
                >
                  Go to Homepage
                </Button>
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => navigate('/personal-health-record')}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Create New Record
                </Button>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-card border-t border-border py-8">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} WorkerHelper. All rights reserved.</p>
              <p className="mt-2">
                Secure and private worker health information system
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default WorkerDetails;