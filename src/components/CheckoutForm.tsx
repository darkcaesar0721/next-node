import {
    PaymentElement,
    LinkAuthenticationElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js'
import React, { useState } from 'react'
import { useCheckoutContext } from '@/contexts/checkout';
import { Box, Button, CircularProgress } from '@mui/material';
import purchaseApi from '@/lib/api/purchaseApi';
import { bytesToGigabytes } from './StepOne';
import { sendPurchaseEmail } from '@/lib/email/sendPurchaseEmail';


export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);

    const {
        email,
        selectedPackage,
        selectedDestination,
        startDate,
        endDate,
        setEmail,
        activeStep,
        setActiveStep,
        isLoading,
        setIsLoading,
        setPurchaseResponse,
    } = useCheckoutContext();


    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const handlePurchase: () => Promise<void> = async () => {

        // if (!selectedDestination || !selectedPackage || !startDate || !endDate) {

        const dataLimitInGB = bytesToGigabytes(selectedPackage?.dataLimitInBytes ? selectedPackage?.dataLimitInBytes : 0)
        const data = await purchaseApi.postPurchase(
            JSON.stringify({
                // email: email,
                destination: selectedDestination?.destination,
                startTime: startDate?.unix(),
                endTime: endDate?.unix(),
                dataLimitInGB,

            })
        );

        await sendPurchaseEmail({
            dataLimitInGB,
            startDate: startDate?.format('MMMM-DD-YYYY'),
            endDate: endDate?.format('MMMM-DD-YYYY'),
            qrCodeImage: `data:image/png;base64,${data?.profile?.activationCode}`,
            iccid: data?.profile?.iccid,
            subject: `Your eSIM purchase confirmation`,
            email,
        })

        if (data) {
            setMessage("Thank you for your purchase. Confirmation e-mail sent");
            setPurchaseResponse(data);
        }
        // }
        setActiveStep(activeStep + 1);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsLoading(true);

        const { error, } = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: `${window.location.origin}`,

            },
        });

        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (error && (error.type === "card_error" || error.type === "validation_error")) {
            setMessage(error?.message ?? null);
        } else {
            if (!error) {
                await handlePurchase();
            } else {
                setMessage("An unexpected error occured.");
            }
        }

        setIsLoading(false);
    }

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" />
            <LinkAuthenticationElement id="link-authentication-element"
                // Access the email value like so:
                onChange={(event) => {
                    setEmail(event.value.email);
                }}
            //
            // Prefill the email field like so:
            // options={{defaultValues: {email: 'foo@bar.com'}}}
            />

            {/* <button >
                <span id="button-text">
                    {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
                </span>
            </button> */}
            {/* Show any error or success messages */}
            {message && <div id="payment-message">{message}</div>}

            <React.Fragment>
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
                            disabled={isLoading || !stripe || !elements} id="submit"
                            variant="contained"
                            type='submit'
                            // onClick={handleNext}
                            sx={{ mt: 3, ml: 1 }}
                        >
                            Buy Now
                        </Button>
                    )}
                </Box>
            </React.Fragment>
        </form>
    )
}

