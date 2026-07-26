import "./globals.css";
import AgreementDisclaimer from "./components/AgreementDisclaimer";
import ExitIntentPopup from "./components/ExitIntentPopup";

export const metadata = {
  metadataBase: new URL("https://www.finvesta.eco"),
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080d0f",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <AgreementDisclaimer />
        <ExitIntentPopup />
      </body>
    </html>
  );
}
