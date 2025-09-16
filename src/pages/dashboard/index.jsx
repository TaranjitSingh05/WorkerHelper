import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import QRCode from 'qrcode.react';
import { useUser, SignOutButton } from '@clerk/clerk-react';
import { useClerkAuth } from '../../contexts/ClerkAuthContext';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import UserAvatar from '../../components/ui/UserAvatar';
import Icon from '../../components/AppIcon';

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const { workerData, loading } = useClerkAuth();
  const qrRef = useRef(null);
  const [showFullQR, setShowFullQR] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getVaccinationStatusColor = (status) => {
    switch (status) {
      case 'Fully Vaccinated':
        return 'text-green-700 bg-green-100 border-green-200';
      case 'Partially Vaccinated':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'Not Vaccinated':
        return 'text-red-700 bg-red-100 border-red-200';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const downloadQRCode = () => {
    const canvas = qrRef?.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${workerData.health_id}-qr-code.png`;
      link.href = url;
      link.click();
    }
  };

  const shareQRCode = async () => {
    if (navigator.share && workerData?.qr_code_data) {
      try {
        await navigator.share({
          title: 'My Worker Health Record',
          text: `Health Record for ${workerData.full_name} - Worker ID: ${workerData.health_id}`,
          url: workerData.qr_code_data
        });
      } catch (error) {
        // Fallback to clipboard
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(workerData.qr_code_data);
          alert('QR code link copied to clipboard!');
        }
      }
    } else if (navigator.clipboard && workerData?.qr_code_data) {
      await navigator.clipboard.writeText(workerData.qr_code_data);
      alert('QR code link copied to clipboard!');
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader" size={32} className="text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    navigate('/auth');
    return null;
  }

  if (!workerData) {
    return (
      <>
        <Helmet>
          <title>Link Health Record - JeevanID</title>
        </Helmet>
        
        <div className="min-h-screen bg-background">
          <Header />
          
          <main className="pt-20 pb-16">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-2xl mx-auto text-center">
                <div className="w-20 h-20 bg-warning rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon name="AlertTriangle" size={32} color="white" />
                </div>
                
                <h1 className="text-3xl font-bold text-foreground mb-4">No Health Record Found</h1>
                <p className="text-muted-foreground mb-8">
                  Your account is not linked to a health record yet. You can either create a new one or link an existing record.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => navigate('/personal-health-record')}
                    variant="default"
                    size="lg"
                    iconName="Plus"
                    iconPosition="left"
                  >
                    Create Health Record
                  </Button>
                  
                  <Button
                    onClick={() => navigate('/auth?tab=signup')}
                    variant="outline"
                    size="lg"
                    iconName="Link"
                    iconPosition="left"
                  >
                    Link Existing Record
                  </Button>
                </div>
                
                <SignOutButton>
                  <button className="mt-8 text-sm text-muted-foreground hover:text-foreground">
                    Sign out
                  </button>
                </SignOutButton>
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
        <title>{workerData.full_name} - Dashboard - JeevanID</title>
        <meta name="description" content={`Personal health dashboard for ${workerData.full_name}`} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-7xl mx-auto">
                
                {/* Modern Welcome Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 mb-8 text-white">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-6">
                      <UserAvatar 
                        user={user} 
                        workerData={workerData} 
                        size="xl" 
                        showBorder={true}
                        className="shadow-xl ring-4 ring-white/20"
                      />
                      <div>
                        <h1 className="text-4xl font-bold mb-2">
                          Welcome back, {workerData.full_name.split(' ')[0]}
                        </h1>
                        <div className="flex items-center space-x-4 text-white/90">
                          <div className="flex items-center space-x-2">
                            <Icon name="IdCard" size={16} />
                            <span className="font-mono text-sm">{workerData.health_id}</span>
                          </div>
                          {user?.emailAddresses?.[0]?.emailAddress && (
                            <div className="flex items-center space-x-2">
                              <Icon name="Mail" size={16} />
                              <span className="text-sm">{user.emailAddresses[0].emailAddress}</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-3 flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-sm text-white/90">Profile Active</span>
                        </div>
                      </div>
                    </div>
                  
                    <div className="mt-6 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                      <Button
                        onClick={() => navigate('/personal-health-record')}
                        variant="secondary"
                        size="md"
                        iconName="Edit"
                        iconPosition="left"
                        className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                      >
                        Update Profile
                      </Button>
                      <SignOutButton>
                        <Button
                          variant="outline"
                          size="md"
                          iconName="LogOut"
                          iconPosition="left"
                          className="border-white/30 text-white hover:bg-white/20"
                        >
                          Sign Out
                        </Button>
                      </SignOutButton>
                    </div>
                  </div>
                </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Icon name="Activity" size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Health Status</p>
                      <p className="text-2xl font-bold text-gray-900">Active</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Icon name="Calendar" size={24} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Member Since</p>
                      <p className="text-2xl font-bold text-gray-900">{formatDate(workerData.created_at).split(',')[1] || '2025'}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Icon name="Shield" size={24} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Security</p>
                      <p className="text-2xl font-bold text-gray-900">Protected</p>
                    </div>
                  </div>
                </div>
              </div>


              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Personal Information Card */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Icon name="User" size={20} className="text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Personal Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Basic Details */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                        <p className="text-lg font-semibold text-foreground">{workerData.full_name}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                        <p className="text-foreground">{formatDate(workerData.date_of_birth)}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Age</label>
                        <p className="text-foreground">{workerData.age ? `${workerData.age} years` : 'Not calculated'}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Gender</label>
                        <p className="text-foreground">{workerData.gender || 'Not specified'}</p>
                      </div>
                    </div>

                    {/* Contact & Location */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                        <p className="text-foreground">{workerData.phone_number || 'Not provided'}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Address</label>
                        <p className="text-foreground text-sm leading-relaxed">
                          {workerData.address || 'Not provided'}
                        </p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Blood Group</label>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                          {workerData.blood_group || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* QR Code Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Icon name="QrCode" size={20} className="text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Your QR Code</h2>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 mb-6">
                      <div 
                        ref={qrRef} 
                        className="inline-block p-6 bg-white rounded-2xl shadow-sm cursor-pointer transition-transform hover:scale-105"
                        onClick={() => setShowFullQR(true)}
                      >
                        <QRCode
                          value={workerData.qr_code_data || workerData.health_id}
                          size={showFullQR ? 200 : 140}
                          level="M"
                          includeMargin={true}
                        />
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-6">
                      Show this QR code to healthcare providers for instant access to your health information
                    </p>
                    
                    <div className="space-y-3">
                      <Button
                        onClick={downloadQRCode}
                        variant="default"
                        size="md"
                        iconName="Download"
                        iconPosition="left"
                        fullWidth
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Download QR Code
                      </Button>
                      <Button
                        onClick={shareQRCode}
                        variant="outline"
                        size="md"
                        iconName="Share"
                        iconPosition="left"
                        fullWidth
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Share QR Code
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Information Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                
                {/* Work Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Icon name="Briefcase" size={20} className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Work Information</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Occupation Type</label>
                      <p className="text-lg font-semibold text-foreground">
                        {workerData.occupation_type || 'Not specified'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Contractor/Employer</label>
                      <p className="text-foreground">
                        {workerData.contractor_name || 'Not specified'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Record Created</label>
                      <p className="text-foreground">{formatDate(workerData.created_at)}</p>
                    </div>
                  </div>
                </div>

                {/* Health Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                      <Icon name="Heart" size={20} className="text-red-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Health Information</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Vaccination Status</label>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getVaccinationStatusColor(workerData.vaccination_status)}`}>
                          {workerData.vaccination_status || 'Unknown'}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Allergies</label>
                      <p className="text-foreground text-sm">
                        {workerData.allergies || 'None reported'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Chronic Diseases</label>
                      <p className="text-foreground text-sm">
                        {workerData.chronic_diseases || 'None reported'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-8">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Icon name="Zap" size={20} className="text-yellow-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">Quick Actions</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="group">
                    <Button
                      onClick={() => navigate('/personal-health-record')}
                      variant="outline"
                      size="lg"
                      iconName="Edit"
                      iconPosition="left"
                      fullWidth
                      className="h-16 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group-hover:shadow-md"
                    >
                      <div className="text-center">
                        <div className="font-medium">Update Info</div>
                        <div className="text-xs text-gray-500 mt-1">Edit your profile</div>
                      </div>
                    </Button>
                  </div>
                  
                  <div className="group">
                    <Button
                      onClick={() => navigate('/predictive-risk-assessment')}
                      variant="outline"
                      size="lg"
                      iconName="Shield"
                      iconPosition="left"
                      fullWidth
                      className="h-16 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group-hover:shadow-md"
                    >
                      <div className="text-center">
                        <div className="font-medium">Risk Assessment</div>
                        <div className="text-xs text-gray-500 mt-1">Check health risks</div>
                      </div>
                    </Button>
                  </div>
                  
                  <div className="group">
                    <Button
                      onClick={() => navigate('/health-centers-locator')}
                      variant="outline"
                      size="lg"
                      iconName="MapPin"
                      iconPosition="left"
                      fullWidth
                      className="h-16 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 group-hover:shadow-md"
                    >
                      <div className="text-center">
                        <div className="font-medium">Find Centers</div>
                        <div className="text-xs text-gray-500 mt-1">Locate hospitals</div>
                      </div>
                    </Button>
                  </div>
                  
                  <div className="group">
                    <Button
                      onClick={() => window.print()}
                      variant="outline"
                      size="lg"
                      iconName="Printer"
                      iconPosition="left"
                      fullWidth
                      className="h-16 border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 group-hover:shadow-md"
                    >
                      <div className="text-center">
                        <div className="font-medium">Print Record</div>
                        <div className="text-xs text-gray-500 mt-1">Download PDF</div>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-8 mt-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Icon name="Shield" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-blue-900 mb-4">Your Data is Secure & Protected</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-blue-800">Personal information is encrypted and securely stored</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-blue-800">QR codes show only essential identification details</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-blue-800">Medical records accessible only through secure authentication</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-blue-800">Complete control to update or delete your information</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default WorkerDashboard;