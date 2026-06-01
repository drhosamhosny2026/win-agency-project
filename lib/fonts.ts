import localFont from "next/font/local";

export const rakik = localFont({
  src: [
    { path: "../public/fonts/Rakik-Regular.otf",   weight: "400", style: "normal" },
    { path: "../public/fonts/Rakik-Medium.otf",    weight: "500", style: "normal" },
    { path: "../public/fonts/Rakik-SemiBold.otf",  weight: "600", style: "normal" },
    { path: "../public/fonts/Rakik-Bold.otf",      weight: "700", style: "normal" },
  ],
  variable: "--font-rakik",
  display: "swap",
});
