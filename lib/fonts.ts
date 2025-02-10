export const GOOGLE_FONTS = [
  "Inter",
  "Open Sans",
  "Roboto",
  "Lato",
  "Montserrat",
  "Poppins",
  "Raleway",
  "Source Sans Pro",
  "Ubuntu",
  "Playfair Display",
  "Merriweather",
  "Nunito",
  "Quicksand",
  "Josefin Sans",
  "Work Sans",
] as const;

export type GoogleFont = (typeof GOOGLE_FONTS)[number];

export const FONT_WEIGHTS = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;
