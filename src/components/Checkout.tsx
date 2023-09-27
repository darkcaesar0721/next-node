import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import StepOne from './StepOne';
import StepThree from './StepThree';
import StepTwo from './StepTwo';
import CircularProgress from '@mui/material/CircularProgress';
import { Destination } from '@/models/destination';
import { Package } from '@/models/package';
import dayjs from 'dayjs';
import { useCheckoutContext } from '@/contexts/checkout';

const steps = ['Pick a plan', 'Payment details', 'Install eSIM'];

export const Checkout = () => {
  const { activeStep,
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
    setIsDeviceCompatible, } = useCheckoutContext();


  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return <StepOne />;
      case 1:
        return <StepTwo />;
      case 2:
        return <StepThree />;
      default:
        throw new Error('Unknown step');
    }
  }



  return (
    <React.Fragment>
      <CssBaseline />
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {getStepContent(activeStep)}
        </Paper>
      </Container>
    </React.Fragment>
  );
};
