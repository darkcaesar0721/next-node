import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Box, Button, CircularProgress } from '@mui/material';
import { useCheckoutContext } from '@/contexts/checkout';

export default function PaymentForm() {


  const {
    email,
    setEmail,
    activeStep,
    setActiveStep,
    isLoading,
    setIsLoading,
    selectedDestination,
    setSelectedDestination,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedPackage,
    setSelectedPackage,
    isDeviceCompatible,
    setIsDeviceCompatible, 
    purchaseResponse,
    setPurchaseResponse,
    
  
  } = useCheckoutContext();
  const [qrCodeImage, setQrCodeImage] = React.useState<string | null>(null);
  // const qrCodeImage = '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';

  React.useEffect(() => {
    if (purchaseResponse) {
      const qrCode = purchaseResponse?.profile?.activationCode;
      if (qrCode) {
        setQrCodeImage(qrCode);
      }
    }
  }, [purchaseResponse]);

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom style={{ fontSize: '18px', fontWeight: 'bold' }}>
        Thank you for your purchase. Confirmation e-mail sent
      </Typography>

      <Typography variant="h6" gutterBottom style={{ fontSize: '16px', fontWeight: 'normal' }}>
        Scan the eSIM QR code for activation
      </Typography>

      <img src={`data:image/png;base64, ${qrCodeImage}`} alt="QR Code" />

      {/* <React.Fragment>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
              Back
            </Button>
          )}
          {isLoading ? (
            <CircularProgress size={30} sx={{ mt: 3, ml: 1 }} />
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{ mt: 3, ml: 1 }}
            >
              Place order
            </Button>
          )}
        </Box>
      </React.Fragment> */}
    </React.Fragment>
  );
}
