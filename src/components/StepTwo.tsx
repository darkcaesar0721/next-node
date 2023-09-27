import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import * as React from 'react';
import CheckoutForm from './CheckoutForm';
import { useCheckoutContext } from '@/contexts/checkout';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function StepTwo() {
  const [options, setOptions] = React.useState({
    clientSecret: "",
  });
  const [isFetchingClientSecret, setIsFetchingClientSecret] = useState(false)

  const {
    selectedPackage,
  } = useCheckoutContext();

  React.useEffect(() => {
    setIsFetchingClientSecret(true)
    fetch("/api/create-payment-intent", {
      method: "POST",
      body: JSON.stringify(
        {
          amount: selectedPackage?.priceInCents,
        }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setOptions({
          ...options,
          clientSecret: data.clientSecret,
        });
      }).finally(() => {
        setIsFetchingClientSecret(false)
      });

  }, []);


  return (
    <React.Fragment>
     
      {isFetchingClientSecret && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <CircularProgress />
        </div>
      )}
      {
        options.clientSecret && (
          <Elements stripe={stripePromise} options={options}>
            {/* <form onSubmit={handleSubmit}>
          <PaymentElement options={{ layout: "tabs" }} />
          <button>Submit</button>
        </form> */}
            <CheckoutForm />
          </Elements>
        )}
      <Grid container spacing={2}></Grid>
    </React.Fragment>
  );
}
