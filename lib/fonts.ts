export const GOOGLE_FONTS = [
  "Inter",
  "Josefin Sans",
  "Lato",
  "Luckiest Guy",
  "Merriweather",
  "Montserrat",
  "Nunito",
  "Open Sans",
  "Playfair Display",
  "Poppins",
  "Quicksand",
  "Raleway",
  "Roboto",
  "Source Sans Pro",
  "Ubuntu",
  "Work Sans",
] as const;

export type GoogleFont = (typeof GOOGLE_FONTS)[number];

export const FONT_WEIGHTS = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;
