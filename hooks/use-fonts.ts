"use client";

import { GOOGLE_FONTS } from "@/lib/fonts";
import { useEffect, useState } from "react";

export function useFonts() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    // Check if fonts are loaded using document.fonts API
    Promise.all(
      GOOGLE_FONTS.map((font) =>
        document.fonts.load(`1em ${font}`).then(() => {
          document.fonts.load(`bold 1em ${font}`);
          document.fonts.load(`italic 1em ${font}`);
          document.fonts.load(`bold italic 1em ${font}`);
        })
      )
    ).then(() => {
      setFontsLoaded(true);
    });
  }, []);

  return { fontsLoaded };
}
