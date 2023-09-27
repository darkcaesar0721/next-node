export interface Package {
  label: string;
  destination: string;
  dataLimitInBytes: number;
  priceInCents: number;
  id: string;
}
export interface PackageResponse {
  packages: Package[];
}
