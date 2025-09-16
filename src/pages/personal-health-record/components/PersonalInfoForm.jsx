import React, { useState, useEffect, useRef } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import QRCode from 'qrcode.react';
import Icon from '../../../components/AppIcon';
import { useUser } from '@clerk/clerk-react';
import { useClerkAuth } from '../../../contexts/ClerkAuthContext';
import { supabase, generateConsistentWorkerHealthId } from '../../../utils/supabase';

const PersonalInfoForm = ({ onSubmit, isSubmitting }) => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { workerData, fetchWorkerData, updateWorkerProfile, createWorkerProfile } = useClerkAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    age: '',
    gender: '',
    phoneNumber: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    occupationType: '',
    contractorName: '',
    workSiteAddress: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    bloodGroup: '',
    height: '',
    weight: '',
    allergies: '',
    chronicDiseases: [],
    currentMedications: '',
    pastSurgeries: '',
    vaccinationStatus: '',
    covidVaccination: '',
    healthInsurance: '',
    insuranceProvider: '',
    policyNumber: '',
    aadhaarNumber: ''
  });

  const [errors, setErrors] = useState({});
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Load language preference and existing worker data on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('workerhelper-language') || 'en';
    setCurrentLanguage(savedLanguage);
    
    // If user is logged in and has worker data, pre-fill the form
    if (isSignedIn && workerData) {
      setFormData({
        fullName: workerData.full_name || '',
        dateOfBirth: workerData.date_of_birth || '',
        age: workerData.age?.toString() || '',
        gender: workerData.gender || '',
        phoneNumber: workerData.phone_number || '',
        address: workerData.address || '',
        occupationType: workerData.occupation_type || '',
        contractorName: workerData.contractor_name || '',
        bloodGroup: workerData.blood_group || '',
        allergies: workerData.allergies || '',
        chronicDiseases: workerData.chronic_diseases?.split(',').filter(Boolean) || [],
        vaccinationStatus: workerData.vaccination_status || ''
      });
    }
  }, [isSignedIn, workerData]);

  // Auto-calculate age when date of birth changes
  useEffect(() => {
    if (formData?.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today?.getFullYear() - birthDate?.getFullYear();
      const monthDiff = today?.getMonth() - birthDate?.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today?.getDate() < birthDate?.getDate())) {
        age--;
      }
      
      setFormData(prev => ({ ...prev, age: age?.toString() }));
    }
  }, [formData?.dateOfBirth]);

  const genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' }
  ];

  const occupationOptions = [
    { value: '', label: 'Select Occupation' },
    { value: 'Construction Worker', label: 'Construction Worker' },
    { value: 'Factory Worker', label: 'Factory Worker' },
    { value: 'Agricultural Worker', label: 'Agricultural Worker' },
    { value: 'Domestic Worker', label: 'Domestic Worker' },
    { value: 'Security Guard', label: 'Security Guard' },
    { value: 'Driver/Transport', label: 'Driver/Transport' },
    { value: 'Shop Assistant', label: 'Shop Assistant' },
    { value: 'Food Service Worker', label: 'Food Service Worker' },
    { value: 'Cleaning Staff', label: 'Cleaning Staff' },
    { value: 'Delivery Worker', label: 'Delivery Worker' },
    { value: 'Fishery Worker', label: 'Fishery Worker' },
    { value: 'Textile Worker', label: 'Textile Worker' },
    { value: 'Other', label: 'Other' }
  ];

  const bloodGroupOptions = [
    { value: '', label: 'Select Blood Group' },
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
    { value: 'Unknown', label: 'Unknown' }
  ];

  const stateOptions = [
    { value: '', label: 'Select State' },
    { value: 'Kerala', label: 'Kerala' },
    { value: 'Tamil Nadu', label: 'Tamil Nadu' },
    { value: 'Karnataka', label: 'Karnataka' },
    { value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
    { value: 'West Bengal', label: 'West Bengal' },
    { value: 'Bihar', label: 'Bihar' },
    { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
    { value: 'Maharashtra', label: 'Maharashtra' },
    { value: 'Gujarat', label: 'Gujarat' },
    { value: 'Punjab', label: 'Punjab' },
    { value: 'Other', label: 'Other' }
  ];

  const relationOptions = [
    { value: '', label: 'Select Relation' },
    { value: 'Spouse', label: 'Spouse' },
    { value: 'Father', label: 'Father' },
    { value: 'Mother', label: 'Mother' },
    { value: 'Son', label: 'Son' },
    { value: 'Daughter', label: 'Daughter' },
    { value: 'Brother', label: 'Brother' },
    { value: 'Sister', label: 'Sister' },
    { value: 'Friend', label: 'Friend' },
    { value: 'Other', label: 'Other' }
  ];

  const chronicDiseaseOptions = [
    { value: 'Diabetes', label: 'Diabetes' },
    { value: 'Hypertension', label: 'Hypertension (High BP)' },
    { value: 'Heart Disease', label: 'Heart Disease' },
    { value: 'Asthma', label: 'Asthma' },
    { value: 'Tuberculosis', label: 'Tuberculosis (TB)' },
    { value: 'Kidney Disease', label: 'Kidney Disease' },
    { value: 'Liver Disease', label: 'Liver Disease' },
    { value: 'Mental Health', label: 'Mental Health Issues' },
    { value: 'Arthritis', label: 'Arthritis' },
    { value: 'Other', label: 'Other' },
    { value: 'None', label: 'None' }
  ];

  const vaccinationOptions = [
    { value: '', label: 'Select Vaccination Status' },
    { value: 'Fully Vaccinated', label: 'Fully Vaccinated' },
    { value: 'Partially Vaccinated', label: 'Partially Vaccinated' },
    { value: 'Not Vaccinated', label: 'Not Vaccinated' },
    { value: 'Unknown', label: 'Unknown' }
  ];

  const covidVaccinationOptions = [
    { value: '', label: 'Select COVID Vaccination Status' },
    { value: 'Booster Taken', label: 'Booster Taken' },
    { value: 'Fully Vaccinated (2+ doses)', label: 'Fully Vaccinated (2+ doses)' },
    { value: 'Partially Vaccinated (1 dose)', label: 'Partially Vaccinated (1 dose)' },
    { value: 'Not Vaccinated', label: 'Not Vaccinated' },
    { value: 'Unknown', label: 'Unknown' }
  ];

  const smokingOptions = [
    { value: 'never', label: 'Never Smoked' },
    { value: 'former', label: 'Former Smoker' },
    { value: 'current-light', label: 'Current Smoker (Light - <10 cigarettes/day)' },
    { value: 'current-moderate', label: 'Current Smoker (Moderate - 10-20 cigarettes/day)' },
    { value: 'current-heavy', label: 'Current Smoker (Heavy - >20 cigarettes/day)' },
    { value: 'occasional', label: 'Occasional/Social Smoker' },
    { value: 'vaping', label: 'Vaping/E-cigarettes Only' },
    { value: 'other-tobacco', label: 'Other Tobacco Products' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  const alcoholOptions = [
    { value: 'never', label: 'Never' },
    { value: 'rarely', label: 'Rarely (Few times per year)' },
    { value: 'occasionally', label: 'Occasionally (1-3 times per month)' },
    { value: 'weekly', label: 'Weekly (1-7 drinks per week)' },
    { value: 'daily-light', label: 'Daily Light (1-2 drinks per day)' },
    { value: 'daily-moderate', label: 'Daily Moderate (3-4 drinks per day)' },
    { value: 'daily-heavy', label: 'Daily Heavy (5+ drinks per day)' },
    { value: 'binge', label: 'Binge Drinking (5+ drinks in one session)' },
    { value: 'recovering', label: 'Recovering from Alcohol Addiction' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  const exerciseOptions = [
    { value: 'sedentary', label: 'Sedentary (No regular exercise)' },
    { value: 'light', label: 'Light Activity (1-2 times per week)' },
    { value: 'moderate', label: 'Moderate Activity (3-4 times per week)' },
    { value: 'active', label: 'Active (5-6 times per week)' },
    { value: 'very-active', label: 'Very Active (Daily exercise)' },
    { value: 'athlete', label: 'Athlete/Competitive Sports' },
    { value: 'physical-job', label: 'Physical Job (Construction, Labor, etc.)' },
    { value: 'limited', label: 'Limited by Health Conditions' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  const dietOptions = [
    { value: 'omnivore', label: 'Omnivore (Eat everything)' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'pescatarian', label: 'Pescatarian (Fish but no meat)' },
    { value: 'keto', label: 'Ketogenic/Low-Carb' },
    { value: 'paleo', label: 'Paleo' },
    { value: 'mediterranean', label: 'Mediterranean' },
    { value: 'gluten-free', label: 'Gluten-Free' },
    { value: 'dairy-free', label: 'Dairy-Free' },
    { value: 'diabetic', label: 'Diabetic Diet' },
    { value: 'low-sodium', label: 'Low Sodium' },
    { value: 'heart-healthy', label: 'Heart-Healthy' },
    { value: 'religious-restrictions', label: 'Religious Dietary Restrictions' },
    { value: 'no-restrictions', label: 'No Special Diet' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleChronicDiseasesChange = (value) => {
    let updatedDiseases = [...formData?.chronicDiseases];
    
    if (value?.includes('None')) {
      updatedDiseases = ['None'];
    } else {
      updatedDiseases = value?.filter(disease => disease !== 'None');
    }
    
    setFormData(prev => ({ ...prev, chronicDiseases: updatedDiseases }));
    
    if (errors?.chronicDiseases) {
      setErrors(prev => ({ ...prev, chronicDiseases: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData?.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (!formData?.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData?.phoneNumber?.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/?.test(formData?.phoneNumber?.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    if (!formData?.address?.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData?.city?.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData?.state?.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData?.occupationType) {
      newErrors.occupationType = 'Occupation type is required';
    }

    if (!formData?.bloodGroup) {
      newErrors.bloodGroup = 'Blood group is required';
    }

    if (formData?.chronicDiseases?.length === 0) {
      newErrors.chronicDiseases = 'Please select chronic diseases or "None"';
    }

    if (!formData?.vaccinationStatus) {
      newErrors.vaccinationStatus = 'Vaccination status is required';
    }

    // Emergency contact validation
    if (!formData?.emergencyContactName?.trim()) {
      newErrors.emergencyContactName = 'Emergency contact name is required';
    }

    if (!formData?.emergencyContactPhone?.trim()) {
      newErrors.emergencyContactPhone = 'Emergency contact phone is required';
    } else if (!/^\d{10}$/?.test(formData?.emergencyContactPhone?.replace(/\D/g, ''))) {
      newErrors.emergencyContactPhone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData?.emergencyContactRelation?.trim()) {
      newErrors.emergencyContactRelation = 'Relationship to emergency contact is required';
    }

    // Email validation (if provided)
    if (formData?.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    // Double-check authentication before proceeding
    if (!isSignedIn || !user) {
      alert('You must be signed in to submit this form.');
      return;
    }
    
    if (validateForm()) {
      try {
        let healthId;
        let isUpdate = false;
        
        // For authenticated users, use consistent ID based on user ID
        if (workerData && workerData.health_id) {
          // User already has a worker record, use existing health ID
          healthId = workerData.health_id;
          isUpdate = true;
        } else {
          // Generate consistent health ID for this user
          healthId = generateConsistentWorkerHealthId(user.id);
        }
        
        console.log('Using Health ID:', healthId, isUpdate ? '(updating existing record)' : '(creating new record)');
        
        // Generate QR code URL for the worker details page
        const qrCodeUrl = `${window.location.origin}/worker/${healthId}`;
        
        // Prepare data for Supabase
        const workerDataPayload = {
          full_name: formData.fullName.trim(),
          date_of_birth: formData.dateOfBirth,
          age: parseInt(formData.age) || 0,
          gender: formData.gender,
          phone_number: formData.phoneNumber.trim(),
          email: formData.email?.trim() || null,
          address: formData.address.trim(),
          city: formData.city?.trim() || null,
          state: formData.state?.trim() || null,
          pin_code: formData.pinCode?.trim() || null,
          occupation_type: formData.occupationType,
          contractor_name: formData.contractorName?.trim() || null,
          blood_group: formData.bloodGroup,
          allergies: formData.allergies?.trim() || null,
          chronic_diseases: formData.chronicDiseases?.join(',') || null,
          smoking_status: formData.smokingStatus || null,
          alcohol_consumption: formData.alcoholConsumption || null,
          diet_type: formData.dietType || null,
          vaccination_status: formData.vaccinationStatus,
          emergency_contact_name: formData.emergencyContactName?.trim() || null,
          emergency_contact_phone: formData.emergencyContactPhone?.trim() || null,
          emergency_contact_relation: formData.emergencyContactRelation?.trim() || null,
          qr_code_data: qrCodeUrl // QR code will contain the full URL
        };
        
        console.log('Attempting to save worker data:', workerDataPayload);
        
        let data, error;
        
        // Add health_id to the payload
        const finalPayload = {
          ...workerDataPayload,
          health_id: healthId
        };
        
        // Handle authenticated user operations only
        if (isUpdate && workerData) {
          // Update existing record using Clerk context
          const result = await updateWorkerProfile(finalPayload);
          error = result.error;
          
          if (!error) {
            // Refetch the updated data
            await fetchWorkerData(user.id);
            data = [{ ...workerData, ...finalPayload }];
          }
        } else {
          // Create new record for authenticated user
          const result = await createWorkerProfile(user.id, {
            ...finalPayload,
            fullName: formData.fullName
          });
          
          data = result.data ? [result.data] : null;
          error = result.error;
        }
        
        if (error) {
          console.error('Supabase error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          
          // Provide more helpful error messages
          let errorMessage = 'Error saving health record: ';
          
          if (error.code === '401' || error.message?.includes('Invalid API key')) {
            errorMessage += 'Authentication failed. Please check Supabase configuration.';
          } else if (error.code === '42501' || error.message?.includes('permission denied')) {
            errorMessage += 'Permission denied. Please check RLS policies in Supabase.';
            errorMessage += '\n\nTo fix this:\n1. Go to Supabase Dashboard\n2. Navigate to Authentication > Policies\n3. Run the SQL commands in supabase_rls_policy.sql file';
          } else if (error.code === '23505' || error.message?.includes('duplicate')) {
            errorMessage += 'A record with this Health ID already exists. Please try again.';
          } else if (error.code === '42P01' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
            errorMessage += 'Table "workers_data" not found. Please run the SQL script workers_data_setup.sql in Supabase.';
          } else {
            errorMessage += error.message;
          }
          
          alert(errorMessage);
          return;
        }
        
        console.log('Worker data saved successfully:', data);
        
        // Refresh the user's worker data
        await fetchWorkerData(user.id);
        
        // Pass the health ID, QR code URL, and saved data to parent component
        onSubmit({
          ...formData,
          healthId: healthId,
          qrCodeUrl: qrCodeUrl,
          savedData: data?.[0] || finalPayload
        });
      } catch (error) {
        console.error('Unexpected error in form submission:', error);
        alert(`An unexpected error occurred: ${error.message}\n\nPlease check the console for more details.`);
      }
    }
  };

  const getCompletionPercentage = () => {
    const requiredFields = [
      'fullName', 'dateOfBirth', 'gender', 'phoneNumber', 'address', 'city', 'state',
      'occupationType', 'bloodGroup', 'vaccinationStatus', 'emergencyContactName', 
      'emergencyContactPhone', 'emergencyContactRelation'
    ];
    
    const optionalFields = [
      'contractorName', 'allergies', 'chronicDiseases', 'smokingStatus', 'alcoholConsumption', 'dietType'
    ];
    
    let completedRequired = 0;
    let completedOptional = 0;
    
    // Count completed required fields
    requiredFields.forEach(field => {
      if (field === 'chronicDiseases') {
        if (formData?.[field]?.length > 0) completedRequired++;
      } else if (formData?.[field]?.toString().trim()) {
        completedRequired++;
      }
    });
    
    // Count completed optional fields
    optionalFields.forEach(field => {
      if (field === 'chronicDiseases') {
        if (formData?.[field]?.length > 0) completedOptional++;
      } else if (formData?.[field]?.toString().trim()) {
        completedOptional++;
      }
    });
    
    // Weight required fields more heavily (80% of score) and optional fields 20%
    const requiredPercentage = (completedRequired / requiredFields.length) * 80;
    const optionalPercentage = (completedOptional / optionalFields.length) * 20;
    
    return Math.round(requiredPercentage + optionalPercentage);
  };

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 lg:p-8">
        <div className="flex items-center justify-center space-x-2 py-12">
          <Icon name="Loader" size={24} className="text-primary animate-spin" />
          <span className="text-lg text-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  // Show sign-in required message if user is not authenticated
  if (!isSignedIn) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 lg:p-8">
        <div className="text-center py-12">
          <div className="mb-6">
            <Icon name="Lock" size={48} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Authentication Required</h2>
            <p className="text-muted-foreground mb-6">
              You must be signed in to create or update your health record.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button
              variant="default"
              size="lg"
              onClick={() => window.location.href = '/sign-in'}
              iconName="LogIn"
              iconPosition="left"
            >
              Sign In to Continue
            </Button>
            
            <div className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <a 
                href="/sign-up" 
                className="text-primary hover:underline font-medium"
              >
                Create one here
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6 lg:p-8">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Profile Completion</span>
          <span className="text-sm font-medium text-primary">{getCompletionPercentage()}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${getCompletionPercentage()}%` }}
          />
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <Icon name="User" size={20} className="text-primary" />
            <span>Personal Information</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={formData?.fullName}
              onChange={(e) => handleInputChange('fullName', e?.target?.value)}
              error={errors?.fullName}
              required
            />

            <Input
              label="Date of Birth"
              type="date"
              value={formData?.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e?.target?.value)}
              error={errors?.dateOfBirth}
              required
            />

            <Input
              label="Age"
              type="text"
              value={formData?.age}
              disabled
              description="Automatically calculated from date of birth"
            />

            <Select
              label="Gender"
              options={genderOptions}
              value={formData?.gender}
              onChange={(value) => handleInputChange('gender', value)}
              error={errors?.gender}
              required
              placeholder="Select gender"
            />
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <Icon name="Phone" size={20} className="text-primary" />
            <span>Contact Information</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              type="tel"
              placeholder="Enter 10-digit phone number"
              value={formData?.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e?.target?.value)}
              error={errors?.phoneNumber}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email address"
              value={formData?.email}
              onChange={(e) => handleInputChange('email', e?.target?.value)}
              error={errors?.email}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Address"
              type="textarea"
              placeholder="Enter your complete address"
              value={formData?.address}
              onChange={(e) => handleInputChange('address', e?.target?.value)}
              error={errors?.address}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="City"
              type="text"
              placeholder="Enter city"
              value={formData?.city}
              onChange={(e) => handleInputChange('city', e?.target?.value)}
              error={errors?.city}
              required
            />
            
            <Input
              label="State"
              type="text"
              placeholder="Enter state"
              value={formData?.state}
              onChange={(e) => handleInputChange('state', e?.target?.value)}
              error={errors?.state}
              required
            />
            
            <Input
              label="PIN Code"
              type="text"
              placeholder="Enter PIN code"
              value={formData?.pinCode}
              onChange={(e) => handleInputChange('pinCode', e?.target?.value)}
              error={errors?.pinCode}
            />
          </div>
        </div>

        {/* Work Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <Icon name="Briefcase" size={20} className="text-primary" />
            <span>Work Information</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Occupation Type"
              options={occupationOptions}
              value={formData?.occupationType}
              onChange={(value) => handleInputChange('occupationType', value)}
              error={errors?.occupationType}
              required
              placeholder="Select your occupation"
              searchable
            />

            <Input
              label="Contractor Name"
              type="text"
              placeholder="Enter contractor/employer name (optional)"
              value={formData?.contractorName}
              onChange={(e) => handleInputChange('contractorName', e?.target?.value)}
            />
          </div>
        </div>

        {/* Health Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <Icon name="Heart" size={20} className="text-primary" />
            <span>Health Information</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Blood Group"
              options={bloodGroupOptions}
              value={formData?.bloodGroup}
              onChange={(value) => handleInputChange('bloodGroup', value)}
              error={errors?.bloodGroup}
              required
              placeholder="Select blood group"
            />

            <Select
              label="Vaccination Status"
              options={vaccinationOptions}
              value={formData?.vaccinationStatus}
              onChange={(value) => handleInputChange('vaccinationStatus', value)}
              error={errors?.vaccinationStatus}
              required
              placeholder="Select vaccination status"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Allergies"
              type="text"
              placeholder="List any allergies (optional)"
              value={formData?.allergies}
              onChange={(e) => handleInputChange('allergies', e?.target?.value)}
              description="Separate multiple allergies with commas"
            />

            <Select
              label="Chronic Diseases"
              options={chronicDiseaseOptions}
              value={formData?.chronicDiseases}
              onChange={handleChronicDiseasesChange}
              error={errors?.chronicDiseases}
              required
              multiple
              placeholder="Select chronic diseases"
              description="Select all that apply or choose 'None'"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Smoking Status"
              options={smokingOptions}
              value={formData?.smokingStatus}
              onChange={(value) => handleInputChange('smokingStatus', value)}
              placeholder="Select smoking status"
            />

            <Select
              label="Alcohol Consumption"
              options={alcoholOptions}
              value={formData?.alcoholConsumption}
              onChange={(value) => handleInputChange('alcoholConsumption', value)}
              placeholder="Select alcohol consumption"
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <Select
              label="Diet Type"
              options={dietOptions}
              value={formData?.dietType}
              onChange={(value) => handleInputChange('dietType', value)}
              placeholder="Select diet type"
            />
          </div>
        </div>

        {/* Emergency Contact Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <Icon name="UserCheck" size={20} className="text-primary" />
            <span>Emergency Contact</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Contact Name"
              type="text"
              placeholder="Emergency contact full name"
              value={formData?.emergencyContactName}
              onChange={(e) => handleInputChange('emergencyContactName', e?.target?.value)}
              error={errors?.emergencyContactName}
              required
            />
            
            <Input
              label="Contact Phone"
              type="tel"
              placeholder="Emergency contact phone"
              value={formData?.emergencyContactPhone}
              onChange={(e) => handleInputChange('emergencyContactPhone', e?.target?.value)}
              error={errors?.emergencyContactPhone}
              required
            />
            
            <Input
              label="Relationship"
              type="text"
              placeholder="Relationship to you"
              value={formData?.emergencyContactRelation}
              onChange={(e) => handleInputChange('emergencyContactRelation', e?.target?.value)}
              error={errors?.emergencyContactRelation}
              required
            />
          </div>
        </div>


        {/* Submit Button */}
        <div className="pt-6 border-t border-border">
          <Button
            type="submit"
            variant="default"
            size="lg"
            loading={isSubmitting}
            iconName="Save"
            iconPosition="left"
            fullWidth
            className="md:w-auto md:px-12"
          >
            {isSubmitting ? 'Creating Health Record...' : 'Create Health Record'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoForm;