import React, { useRef } from 'react';
import QRCode from 'qrcode.react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const HealthRecordSuccess = ({ workerData, onCreateNew }) => {
  const qrRef = useRef(null);

  const downloadQRCode = () => {
    const canvas = qrRef?.current?.querySelector('canvas');
    const url = canvas?.toDataURL();
    const link = document.createElement('a');
    link.download = `worker-health-qr-${workerData?.healthId || workerData?.workerId}.png`;
    link.href = url;
    link?.click();
  };

  const shareHealthRecord = async () => {
    const healthId = workerData?.healthId || workerData?.workerId;
    const shareData = {
      title: 'WorkerHelper Health Record',
      text: `Health Record for ${workerData?.fullName} - Worker Health ID: ${healthId}`,
      url: `${window.location?.origin}/health-record/${healthId}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard?.writeText(shareData?.url);
      alert('Health record link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Check" size={32} color="white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Health Record Created Successfully!
        </h2>
        <p className="text-muted-foreground">
          Your digital health profile has been created and is ready to use.
        </p>
      </div>
      {/* Worker ID Card */}
      <div className="bg-card rounded-xl border border-border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Worker Health ID</h3>
            <p className="text-sm text-muted-foreground">Keep this ID safe for healthcare access</p>
          </div>
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="IdCard" size={24} color="white" />
          </div>
        </div>
        
        <div className="bg-muted rounded-lg p-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-primary mb-1">
              {workerData?.healthId || workerData?.workerId}
            </div>
            <div className="text-sm text-muted-foreground">
              {workerData?.fullName}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Age:</span>
            <span className="ml-2 font-medium">{workerData?.age} years</span>
          </div>
          <div>
            <span className="text-muted-foreground">Blood Group:</span>
            <span className="ml-2 font-medium">{workerData?.bloodGroup}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Occupation:</span>
            <span className="ml-2 font-medium capitalize">{workerData?.occupationType?.replace('_', ' ')}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Phone:</span>
            <span className="ml-2 font-medium">{workerData?.phoneNumber}</span>
          </div>
        </div>
      </div>
      {/* QR Code Section */}
      <div className="bg-card rounded-xl border border-border p-6 mb-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Your Health Record QR Code
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Healthcare providers can scan this code to access your health information
          </p>
          
          <div ref={qrRef} className="inline-block p-4 bg-white rounded-lg border border-border mb-6">
            <QRCode
              value={workerData?.healthId || workerData?.workerId || 'NO-ID'}
              size={200}
              level="M"
              includeMargin={true}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={downloadQRCode}
              iconName="Download"
              iconPosition="left"
            >
              Download QR Code
            </Button>
            <Button
              variant="outline"
              onClick={shareHealthRecord}
              iconName="Share"
              iconPosition="left"
            >
              Share Health Record
            </Button>
          </div>
        </div>
      </div>
      {/* Important Information */}
      <div className="bg-warning/10 border border-warning/20 rounded-xl p-6 mb-6">
        <div className="flex items-start space-x-3">
          <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
          <div>
            <h4 className="font-semibold text-foreground mb-2">Important Information</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Keep your Worker Health ID safe and accessible</li>
              <li>• Show the QR code to healthcare providers for quick access</li>
              <li>• Update your health information regularly</li>
              <li>• Contact support if you lose access to your health record</li>
            </ul>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="default"
          onClick={() => window.print()}
          iconName="Printer"
          iconPosition="left"
        >
          Print Health Record
        </Button>
        <Button
          variant="outline"
          onClick={onCreateNew}
          iconName="Plus"
          iconPosition="left"
        >
          Create Another Record
        </Button>
      </div>
    </div>
  );
};

export default HealthRecordSuccess;