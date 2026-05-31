"use client";

import CookieConsent from "react-cookie-consent";

export default function CookieConsentBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept all cookies"
      declineButtonText="Decline"
      enableDeclineButton
      cookieName="gdpr_consent"
      style={{ background: "#2B373B" }}
      buttonStyle={{ background: "#4CAF50", color: "white", fontWeight: "bold" }}
      declineButtonStyle={{ background: "#f44336", color: "white" }}
      expires={365}
      onAccept={() => {
        // Optional: enable tracking scripts, Google Analytics, etc.
        console.log("Cookies accepted");
      }}
      onDecline={() => {
        console.log("Cookies declined");
      }}
    >
      This website uses cookies to enhance your experience. 
      By continuing to visit this site you agree to our use of cookies.
    </CookieConsent>
  );
}
