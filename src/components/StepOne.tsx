import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  TextFieldProps,
  CircularProgress,
} from "@mui/material";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import Grid from "@mui/material/Grid";
import * as React from "react";
import { destinations, packages } from "@/data";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import {
  DatePicker,
  LocalizationProvider,
  DateField,
  DateCalendar,
} from "@mui/x-date-pickers";
import mccMncList from "mcc-mnc-list";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import packageApi from "@/lib/api/packageApi";
import destinationApi from "@/lib/api/destinationApi";
import { Package, PackageResponse } from "@/models/package";
import { Destination, DestinationResponse } from "@/models/destination";
import dayjs from "dayjs";
import { useCheckoutContext } from "@/contexts/checkout";

function selectedOption(numberOfDays: number, gb: number): boolean {
  if (numberOfDays <= 3 && gb === 1) return true;
  if (numberOfDays > 3 && numberOfDays <= 5 && gb === 2) return true;
  if (numberOfDays > 5 && numberOfDays <= 9 && gb === 3) return true;
  if (numberOfDays > 9 && numberOfDays <= 12 && gb === 5) return true;
  if (numberOfDays > 12 && gb === 8) return true;
  return false;
}

export function bytesToGigabytes(bytes: number): number {
  return bytes / 1024 ** 3;
}

function centsToDollars(cents: number): number {
  return cents / 100;
}

interface StepOneProps {}

export default function StepOne() {
  const {
    isLoading,
    activeStep,
    setActiveStep,
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
  } = useCheckoutContext();

  const steps = ['Top-up eSIM', 'Payment details', 'Confirm Top Up'];

  const [apiIccid, setApiIccid] = React.useState("");
  const [apiPackages, setApiPackages] = React.useState<Package[]>([]);
  const [apiDestinations, setApiDestinations] = React.useState<
    Destination[] | null
  >(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [recommendedPackage, setRecommendedPackage] =
    React.useState<Package | null>(null);

  const currentDate = dayjs();

  interface CustomDatePickerProps {
    label: string;
    value: dayjs.Dayjs | null;
    onChange: (date: dayjs.Dayjs | null) => void;
    disabled?: boolean;
    minDate?: dayjs.Dayjs;
  }

  function CustomDatePicker({
    label,
    value,
    onChange,
    disabled,
    minDate,
  }: CustomDatePickerProps) {
    const [open, setOpen] = React.useState(false);

    const handleDateChange = (date: dayjs.Dayjs | null) => {
      onChange(date);
      setOpen(false);
    };

    return (
      <div style={{ position: "relative" }}>
        <DateField
          label={label}
          value={value}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          disabled={disabled}
          style={{ width: "100%" }}
        />
        {open && (
          <div
            style={{
              position: "absolute",
              bottom: "100%", // Position the calendar above the input
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1000,
              backgroundColor: "white",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <DateCalendar
              value={value}
              onChange={handleDateChange}
              minDate={minDate}
            />
          </div>
        )}
      </div>
    );
  }

  const fetchPackages = async (
    destination: string | null,
    startDate: dayjs.Dayjs,
    endDate: dayjs.Dayjs
  ) => {
    setIsLoading(true);
    if (!destination) {
      console.error("Destination is not selected!");
      return;
    }

    const params = {
      destination,
      startTime: Math.round(startDate?.unix() || 0),
      endTime: Math.round(endDate?.unix() || 0),
      limit: 5,
    };

    const response: PackageResponse = await packageApi.getAll(params);
    console.log("API Response:", response);
    setApiPackages(response.packages);
    setIsLoading(false);
    const numberOfDays = endDate.diff(startDate, "day");
    const recommended = response.packages.find((pkg) =>
      selectedOption(numberOfDays, bytesToGigabytes(pkg.dataLimitInBytes))
    );
    setRecommendedPackage(recommended ?? null);
    setSelectedPackage(recommended ?? null);
  };

  const [isFetchingDestinations, setisFetchingDestinations] =
    React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchDestinations = async () => {
      setisFetchingDestinations(true);
      try {
        const response: DestinationResponse = await destinationApi.getAll({});
        setApiDestinations(response.destinations);
      } catch (error) {
        console.error("Error receiving destinationApi:", error);
        setMessage("Not getting destinations");
        setTimeout(() => setMessage(null), 3000);
      } finally {
        setisFetchingDestinations(false);
      }
    };

    fetchDestinations();
  }, []);

  React.useEffect(() => {
    if (selectedDestination && startDate && endDate) {
      fetchPackages(selectedDestination.destination, startDate, endDate);
    }
  }, [selectedDestination, startDate, endDate]);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setApiIccid(e.target.value);
    const mobileCountryCode = e.target.value.slice(2, 5);
    const result = mccMncList.find({ mnc: mobileCountryCode });
    setSelectedDestination({
      name: result.countryName,
      destination: result.countryCode,
    });
  };

  return (
    <React.Fragment>
      {isFetchingDestinations ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <React.Fragment>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    id="outlined-basic"
                    label="Enter ICCD Number"
                    variant="Enter ICCD Number"
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    id="free-solo-demo"
                    freeSolo
                    options={
                      apiDestinations && Array.isArray(apiDestinations)
                        ? apiDestinations
                        : destinations.map((item) => ({
                            name: item.label,
                            destination: "unknown",
                          }))
                    }
                    getOptionLabel={(option: string | Destination) =>
                      typeof option === "string" ? option : option.name
                    }
                    onOpen={() => setIsOpen(true)}
                    onClose={() => setIsOpen(false)}
                    value={selectedDestination}
                    onChange={(
                      event,
                      newValue: string | Destination | null
                    ) => {
                      if (typeof newValue === "string") {
                        setSelectedDestination({
                          name: newValue,
                          destination: "unknown",
                        });
                      } else {
                        setSelectedDestination(newValue);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Destination"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              <InputAdornment
                                position="end"
                                onClick={() => setIsOpen((prev) => !prev)}
                              >
                                {isOpen ? (
                                  <ArrowDropUpIcon />
                                ) : (
                                  <ArrowDropDownIcon />
                                )}
                              </InputAdornment>
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid
                  container
                  item
                  xs={12}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      maxWidth: "536px",
                      padding: "0px",
                    }}
                  >
                    <div style={{ flex: "1" }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <CustomDatePicker
                          label="Start Date"
                          value={startDate}
                          onChange={(date: dayjs.Dayjs | null) =>
                            setStartDate(date)
                          }
                          disabled={!selectedDestination}
                          minDate={currentDate}
                        />
                      </LocalizationProvider>
                    </div>
                    <Box sx={{ textAlign: "center", px: "8px" }}>
                      - {/* CustomDatePicker */}
                    </Box>
                    <div style={{ flex: "1" }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <CustomDatePicker
                          label="Finish Date"
                          value={endDate}
                          onChange={(date: dayjs.Dayjs | null) =>
                            setEndDate(date)
                          }
                          disabled={!selectedDestination}
                          minDate={currentDate}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Package Size
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Package Size"
                      value={selectedPackage ? selectedPackage.id : ""}
                      onChange={(event) => {
                        const selectedPkg = apiPackages.find(
                          (pkg) => pkg.id === event.target.value
                        );
                        setSelectedPackage(selectedPkg || null);
                      }}
                    >
                      {apiPackages.length
                        ? apiPackages.map((item, index) => (
                            <MenuItem key={index} value={item.id}>
                              {Math.round(
                                bytesToGigabytes(item.dataLimitInBytes)
                              )}{" "}
                              GB - $
                              {(centsToDollars(item.priceInCents) + 6).toFixed(
                                2
                              )}
                            </MenuItem>
                          ))
                        : packages.map((item, index) => (
                            <MenuItem key={index} value={index}>
                              {item.label}
                            </MenuItem>
                          ))}
                    </Select>
                  </FormControl>
                  <Grid item xs={12}>
                    {recommendedPackage && (
                      <Typography
                        variant="body2"
                        align="left"
                        style={{ marginTop: "14px", marginLeft: "20px" }}
                      >
                        {`The recommended package for your trip is ${parseFloat(
                          bytesToGigabytes(
                            recommendedPackage.dataLimitInBytes
                          ).toFixed(2)
                        )} GB`}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isDeviceCompatible}
                            onChange={(event) =>
                              setIsDeviceCompatible(event.target.checked)
                            }
                          />
                        }
                        label={
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.875rem" }}
                          >
                            My device is both unlocked and equipped with eSIM
                            capabilities.
                          </Typography>
                        }
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </div>
          <React.Fragment>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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
                  disabled={
                    !selectedDestination ||
                    !selectedPackage ||
                    !startDate ||
                    !endDate ||
                    !isDeviceCompatible
                  }
                  sx={{ mt: 3, ml: 1 }}
                >
                  {activeStep === steps.length - 1 ? "Place order" : "Next"}
                </Button>
              )}
            </Box>
          </React.Fragment>
        </React.Fragment>
      )}
      {message && <div id="payment-message">{message}</div>}
    </React.Fragment>
  );
}
