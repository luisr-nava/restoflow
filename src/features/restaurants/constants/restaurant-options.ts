type RestaurantOption = {
  value: string;
  label: string;
};

export const CREATE_RESTAURANT_CURRENCY_OPTIONS: RestaurantOption[] = [
  { value: "ARS", label: "Peso Argentino (ARS)" },
  { value: "USD", label: "Dólar Estadounidense (USD)" },
];

export const CREATE_RESTAURANT_TIMEZONE_OPTIONS: RestaurantOption[] = [
  { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires" },
  { value: "America/Santiago", label: "Santiago" },
  { value: "America/Montevideo", label: "Montevideo" },
];

export const RESTAURANT_SETTINGS_CURRENCY_OPTIONS: RestaurantOption[] = [
  { value: "ARS", label: "ARS" },
  { value: "USD", label: "USD" },
];

export const RESTAURANT_SETTINGS_TIMEZONE_OPTIONS: RestaurantOption[] = [
  { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires" },
  { value: "America/Santiago", label: "Santiago" },
  { value: "America/Montevideo", label: "Montevideo" },
];
