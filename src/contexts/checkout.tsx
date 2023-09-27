import { Destination } from '@/models/destination'
import { Package } from '@/models/package'
import dayjs from 'dayjs'
import { createContext, useContext, useState, useMemo } from 'react'

export type CheckoutContextType = {
    activeStep: number
    setActiveStep: (step: number) => void
    isLoading: boolean
    setIsLoading: (isLoading: boolean) => void
    selectedDestination: Destination | null
    setSelectedDestination: (destination: Destination | null) => void
    startDate: dayjs.Dayjs | null
    setStartDate: (startDate: dayjs.Dayjs | null) => void
    endDate: dayjs.Dayjs | null
    setEndDate: (endDate: dayjs.Dayjs | null) => void
    selectedPackage: Package | null
    setSelectedPackage: (selectedPackage: Package | null) => void
    isDeviceCompatible: boolean
    setIsDeviceCompatible: (isDeviceCompatible: boolean) => void,
    email: string,
    setEmail: (email: string) => void,
    purchaseResponse: {
        purchase: any,
        profile: any,
    } | null,
    setPurchaseResponse: (purchaseResponse: {
        purchase: any,
        profile: any,
    } | null) => void,

}

export const CheckoutContext = createContext<CheckoutContextType>({
    activeStep: 0,
    setActiveStep: () => { },
    isLoading: false,
    setIsLoading: () => { },
    selectedDestination: null,
    setSelectedDestination: () => { },
    startDate: null,
    setStartDate: () => { },
    endDate: null,
    setEndDate: () => { },
    selectedPackage: null,
    setSelectedPackage: () => { },
    isDeviceCompatible: false,
    setIsDeviceCompatible: () => { },
    email: '',
    setEmail: () => { },
    purchaseResponse: null,
    setPurchaseResponse: () => { },
})



export const CheckoutProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeStep, setActiveStep] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null)
    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null)
    const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null)
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
    const [isDeviceCompatible, setIsDeviceCompatible] = useState(false)
    const [email, setEmail] = useState<string>('' as string);


    const [purchaseResponse, setPurchaseResponse] = useState<{
        purchase: any,
        profile: any,
    } | null>(null);

    const checkoutContextValue = useMemo(() => ({
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
        email,
        setEmail,
        purchaseResponse,
        setPurchaseResponse,
    }), [activeStep, email, isLoading, selectedDestination, startDate, endDate, selectedPackage, isDeviceCompatible, purchaseResponse]);

    return (
        <CheckoutContext.Provider value={checkoutContextValue}>
            {children}
        </CheckoutContext.Provider>
    )
}

export const useCheckoutContext = () => useContext(CheckoutContext)
