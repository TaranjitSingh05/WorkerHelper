import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

import Icon from '../../../components/AppIcon';

const PersonalInfoForm = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    age: '',
    gender: '',
    phoneNumber: '',
    address: '',
    occupationType: '',
    contractorName: '',
    bloodGroup: '',
    allergies: '',
    chronicDiseases: [],
    vaccinationStatus: ''
  });

  const [errors, setErrors] = useState({});
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Load language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('workerhelper-language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

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
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  const occupationOptions = [
    { value: 'construction', label: 'Construction Worker' },
    { value: 'fishery', label: 'Fishery Worker' },
    { value: 'factory', label: 'Factory Worker' },
    { value: 'agriculture', label: 'Agricultural Worker' },
    { value: 'domestic', label: 'Domestic Worker' },
    { value: 'transport', label: 'Transport Worker' },
    { value: 'retail', label: 'Retail Worker' },
    { value: 'other', label: 'Other' }
  ];

  const bloodGroupOptions = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' }
  ];

  const chronicDiseaseOptions = [
    { value: 'diabetes', label: 'Diabetes' },
    { value: 'hypertension', label: 'Hypertension' },
    { value: 'asthma', label: 'Asthma' },
    { value: 'heart_disease', label: 'Heart Disease' },
    { value: 'kidney_disease', label: 'Kidney Disease' },
    { value: 'liver_disease', label: 'Liver Disease' },
    { value: 'tuberculosis', label: 'Tuberculosis' },
    { value: 'arthritis', label: 'Arthritis' },
    { value: 'none', label: 'None' }
  ];

  const vaccinationOptions = [
    { value: 'fully_vaccinated', label: 'Fully Vaccinated' },
    { value: 'partially_vaccinated', label: 'Partially Vaccinated' },
    { value: 'not_vaccinated', label: 'Not Vaccinated' },
    { value: 'unknown', label: 'Unknown' }
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
    
    if (value?.includes('none')) {
      updatedDiseases = ['none'];
    } else {
      updatedDiseases = value?.filter(disease => disease !== 'none');
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

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const getCompletionPercentage = () => {
    const totalFields = 11; // Excluding age as it's auto-calculated
    let completedFields = 0;

    if (formData?.fullName?.trim()) completedFields++;
    if (formData?.dateOfBirth) completedFields++;
    if (formData?.gender) completedFields++;
    if (formData?.phoneNumber?.trim()) completedFields++;
    if (formData?.address?.trim()) completedFields++;
    if (formData?.occupationType) completedFields++;
    if (formData?.contractorName?.trim()) completedFields++;
    if (formData?.bloodGroup) completedFields++;
    if (formData?.allergies?.trim()) completedFields++;
    if (formData?.chronicDiseases?.length > 0) completedFields++;
    if (formData?.vaccinationStatus) completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  };

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
              label="Complete Address"
              type="text"
              placeholder="Enter your complete address"
              value={formData?.address}
              onChange={(e) => handleInputChange('address', e?.target?.value)}
              error={errors?.address}
              required
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

            <Input
              label="Allergies"
              type="text"
              placeholder="List any allergies (optional)"
              value={formData?.allergies}
              onChange={(e) => handleInputChange('allergies', e?.target?.value)}
              description="Separate multiple allergies with commas"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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