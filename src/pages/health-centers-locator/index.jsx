import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import LocationPermissionModal from './components/LocationPermissionModal';
import ManualLocationEntry from './components/ManualLocationEntry';
import FilterControls from './components/FilterControls';
import HealthCenterMap from './components/HealthCenterMap';
import HealthCentersList from './components/HealthCentersList';
import MobileTabNavigation from './components/MobileTabNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const HealthCentersLocator = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingCenters, setIsLoadingCenters] = useState(false);
  const [activeTab, setActiveTab] = useState('map');
  const [filters, setFilters] = useState({
    facilityType: 'all',
    distance: '25',
    services: 'all'
  });

  // Mock health centers data
  const mockHealthCenters = [
    {
      id: 1,
      name: "Kerala Government General Hospital",
      type: "hospital",
      address: "Medical College Road, Thiruvananthapuram, Kerala 695011",
      lat: 8.5241,
      lng: 76.9366,
      distance: 2.3,
      phone: "+91-471-2528300",
      hours: "24/7",
      isOpen: true,
      rating: 4.2,
      services: ["Emergency", "Surgery", "Cardiology", "Pharmacy", "Laboratory"],
      languages: ["English", "Malayalam", "Hindi", "Tamil"]
    },
    {
      id: 2,
      name: "Sree Chitra Tirunal Institute",
      type: "specialty",
      address: "Sree Chitra Tirunal Nagar, Thiruvananthapuram, Kerala 695011",
      lat: 8.5292,
      lng: 76.9485,
      distance: 3.1,
      phone: "+91-471-2524266",
      hours: "8:00 AM - 6:00 PM",
      isOpen: true,
      rating: 4.8,
      services: ["Cardiology", "Neurology", "Research", "Laboratory"],
      languages: ["English", "Malayalam", "Hindi"]
    },
    {
      id: 3,
      name: "Cosmopolitan Hospital",
      type: "hospital",
      address: "Pattom Palace Road, Thiruvananthapuram, Kerala 695004",
      lat: 8.5167,
      lng: 76.9500,
      distance: 1.8,
      phone: "+91-471-2447000",
      hours: "24/7",
      isOpen: true,
      rating: 4.5,
      services: ["Emergency", "ICU", "Maternity", "Pharmacy", "X-Ray"],
      languages: ["English", "Malayalam", "Hindi", "Bengali"]
    },
    {
      id: 4,
      name: "Primary Health Centre Pattom",
      type: "clinic",
      address: "Pattom Junction, Thiruvananthapuram, Kerala 695004",
      lat: 8.5145,
      lng: 76.9512,
      distance: 1.2,
      phone: "+91-471-2442156",
      hours: "9:00 AM - 5:00 PM",
      isOpen: true,
      rating: 3.9,
      services: ["General Medicine", "Vaccination", "Basic Lab"],
      languages: ["Malayalam", "English", "Hindi"]
    },
    {
      id: 5,
      name: "KIMS Hospital",
      type: "hospital",
      address: "PB No.1, Anayara, Thiruvananthapuram, Kerala 695029",
      lat: 8.4380,
      lng: 76.9484,
      distance: 5.7,
      phone: "+91-471-3041000",
      hours: "24/7",
      isOpen: true,
      rating: 4.6,
      services: ["Emergency", "Surgery", "Oncology", "Pharmacy", "Laboratory", "ICU"],
      languages: ["English", "Malayalam", "Hindi", "Tamil", "Bengali"]
    },
    {
      id: 6,
      name: "Ayurveda Medical College Hospital",
      type: "specialty",
      address: "Karyavattom, Thiruvananthapuram, Kerala 695581",
      lat: 8.5580,
      lng: 76.8850,
      distance: 8.2,
      phone: "+91-471-2445210",
      hours: "8:00 AM - 4:00 PM",
      isOpen: false,
      rating: 4.1,
      services: ["Ayurveda", "Panchakarma", "Herbal Medicine"],
      languages: ["Malayalam", "English", "Hindi"]
    }
  ];

  const [healthCenters, setHealthCenters] = useState([]);

  // Load language preference on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('JeevanID_language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  // Check for existing location permission
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions?.query({ name: 'geolocation' })?.then((result) => {
        if (result?.state === 'granted') {
          getCurrentLocation();
        } else if (result?.state === 'prompt') {
          setShowLocationModal(true);
        } else {
          setShowLocationModal(true);
        }
      })?.catch(() => {
        setShowLocationModal(true);
      });
    } else {
      setShowLocationModal(true);
    }
  }, []);

  // Filter health centers based on current filters
  useEffect(() => {
    let filtered = [...mockHealthCenters];

    // Filter by facility type
    if (filters?.facilityType !== 'all') {
      filtered = filtered?.filter(center => center?.type === filters?.facilityType);
    }

    // Filter by distance
    const maxDistance = parseInt(filters?.distance);
    filtered = filtered?.filter(center => center?.distance <= maxDistance);

    // Filter by services
    if (filters?.services !== 'all') {
      filtered = filtered?.filter(center => {
        switch (filters?.services) {
          case 'emergency':
            return center?.services?.some(service => 
              service?.toLowerCase()?.includes('emergency') || center?.hours === '24/7'
            );
          case 'pharmacy':
            return center?.services?.some(service => 
              service?.toLowerCase()?.includes('pharmacy')
            );
          case 'lab':
            return center?.services?.some(service => 
              service?.toLowerCase()?.includes('lab')
            );
          case 'xray':
            return center?.services?.some(service => 
              service?.toLowerCase()?.includes('x-ray') || 
              service?.toLowerCase()?.includes('imaging')
            );
          case 'multilingual':
            return center?.languages && center?.languages?.length > 2;
          default:
            return true;
        }
      });
    }

    // Sort by distance
    filtered?.sort((a, b) => a?.distance - b?.distance);

    setHealthCenters(filtered);
  }, [filters]);

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        const location = {
          lat: position?.coords?.latitude,
          lng: position?.coords?.longitude,
          address: "Current Location"
        };
        setUserLocation(location);
        setIsLoadingLocation(false);
        setShowLocationModal(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setIsLoadingLocation(false);
        setShowManualEntry(true);
        setShowLocationModal(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const handleAllowLocation = () => {
    getCurrentLocation();
  };

  const handleManualEntry = () => {
    setShowLocationModal(false);
    setShowManualEntry(true);
  };

  const handleLocationSubmit = (location) => {
    setUserLocation(location);
    setShowManualEntry(false);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      facilityType: 'all',
      distance: '25',
      services: 'all'
    });
  };

  const handleCenterSelect = (center) => {
    setSelectedCenter(center);
  };

  const handleRetryLocation = () => {
    setShowLocationModal(true);
  };

  return (
    <>
      <Helmet>
        <title>Health Centers Locator - JeevanID</title>
        <meta name="description" content="Find nearby hospitals and healthcare facilities with interactive mapping and location-based services for migrant workers in Kerala." />
        <meta name="keywords" content="health centers, hospitals, clinics, healthcare, Kerala, migrant workers, location, map" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-15">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-primary to-secondary text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Find Nearby Health Centers
                </h1>
                <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
                  Locate hospitals, clinics, and healthcare facilities near you with interactive mapping and detailed facility information.
                </p>
              </div>
            </div>
          </div>

          {/* Location Status */}
          {!userLocation && !isLoadingLocation && (
            <div className="bg-warning bg-opacity-10 border-l-4 border-warning p-4 mx-4 mt-6 rounded-r-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Icon name="AlertTriangle" size={20} className="text-warning mr-3" />
                  <div>
                    <p className="font-medium text-foreground">Location Access Required</p>
                    <p className="text-sm text-muted-foreground">
                      Enable location access to find nearby health centers
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRetryLocation}
                  iconName="MapPin"
                  iconPosition="left"
                >
                  Enable Location
                </Button>
              </div>
            </div>
          )}

          {isLoadingLocation && (
            <div className="bg-primary bg-opacity-10 border-l-4 border-primary p-4 mx-4 mt-6 rounded-r-lg">
              <div className="flex items-center">
                <div className="animate-spin mr-3">
                  <Icon name="Loader2" size={20} className="text-primary" />
                </div>
                <p className="text-foreground">Getting your location...</p>
              </div>
            </div>
          )}

          {/* Filter Controls */}
          {userLocation && (
            <>
              {/* Desktop Filters */}
              <div className="hidden md:block">
                <FilterControls
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
              </div>

              {/* Mobile Tab Navigation */}
              <div className="md:hidden">
                <MobileTabNavigation
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
                {activeTab === 'list' && (
                  <FilterControls
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                    isMobile={true}
                  />
                )}
              </div>
            </>
          )}

          {/* Main Content */}
          {userLocation && (
            <div className="max-w-7xl mx-auto p-4">
              {/* Desktop Layout */}
              <div className="hidden md:grid md:grid-cols-2 gap-6 h-[600px]">
                <HealthCenterMap
                  userLocation={userLocation}
                  healthCenters={healthCenters}
                  selectedCenter={selectedCenter}
                  onCenterSelect={handleCenterSelect}
                  className="h-full"
                />
                <HealthCentersList
                  healthCenters={healthCenters}
                  userLocation={userLocation}
                  selectedCenter={selectedCenter}
                  onCenterSelect={handleCenterSelect}
                  isLoading={isLoadingCenters}
                  className="h-full overflow-hidden"
                />
              </div>

              {/* Mobile Layout */}
              <div className="md:hidden h-[calc(100vh-200px)]">
                {activeTab === 'map' ? (
                  <HealthCenterMap
                    userLocation={userLocation}
                    healthCenters={healthCenters}
                    selectedCenter={selectedCenter}
                    onCenterSelect={handleCenterSelect}
                    className="h-full"
                  />
                ) : (
                  <HealthCentersList
                    healthCenters={healthCenters}
                    userLocation={userLocation}
                    selectedCenter={selectedCenter}
                    onCenterSelect={handleCenterSelect}
                    isLoading={isLoadingCenters}
                    className="h-full overflow-hidden"
                  />
                )}
              </div>
            </div>
          )}

          {/* Emergency Contact Section */}
          <div className="bg-error bg-opacity-5 border-t border-error border-opacity-20 py-8 mt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <Icon name="Phone" size={32} className="text-error mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Emergency Medical Services
                </h3>
                <p className="text-muted-foreground mb-4">
                  For immediate medical emergencies, call the emergency helpline
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <Button 
                    variant="destructive" 
                    size="lg"
                    iconName="Phone"
                    iconPosition="left"
                    onClick={() => window.open('tel:108', '_self')}
                  >
                    Call 108 - Ambulance
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    iconName="Phone"
                    iconPosition="left"
                    onClick={() => window.open('tel:102', '_self')}
                  >
                    Call 102 - Medical Helpline
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Modals */}
        <LocationPermissionModal
          isOpen={showLocationModal}
          onClose={() => setShowLocationModal(false)}
          onAllowLocation={handleAllowLocation}
          onManualEntry={handleManualEntry}
        />

        <ManualLocationEntry
          isOpen={showManualEntry}
          onClose={() => setShowManualEntry(false)}
          onLocationSubmit={handleLocationSubmit}
        />
      </div>
    </>
  );
};

export default HealthCentersLocator;