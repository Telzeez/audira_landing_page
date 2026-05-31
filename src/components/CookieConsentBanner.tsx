"use client";

import CookieConsent from "react-cookie-consent";

export default function CookieConsentBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept All"
      declineButtonText="Decline"
      enableDeclineButton
      cookieName="gdpr_consent"
      expires={365}
      containerClasses="cookie-consent-container"
      buttonClasses="cookie-accept-btn"
      declineButtonClasses="cookie-decline-btn"
      contentClasses="cookie-content"
      style={{
        background: "rgba(7, 7, 7, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(226, 122, 63, 0.25)",
        boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.5), 0 0 20px rgba(226, 122, 63, 0.1)",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px 24px",
        gap: "24px",
        flexWrap: "wrap",
        fontFamily: "var(--font-inter)",
        fontSize: "0.9rem",
        color: "var(--text-primary)",
        zIndex: 9999,
      }}
      buttonStyle={{
        background: "linear-gradient(135deg, #e27a3f 0%, #c1622f 100%)",
        color: "#ffffff",
        fontFamily: "var(--font-outfit)",
        fontWeight: "600",
        fontSize: "0.8rem",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        padding: "8px 24px",
        borderRadius: "50px",
        border: "none",
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: "0 2px 8px rgba(226, 122, 63, 0.3)",
      }}
      declineButtonStyle={{
        background: "transparent",
        color: "var(--text-secondary)",
        fontFamily: "var(--font-outfit)",
        fontWeight: "500",
        fontSize: "0.8rem",
        textTransform: "uppercase",
        padding: "8px 20px",
        borderRadius: "50px",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
      onAccept={() => {
        console.log("Cookies accepted");
        // Optionally enable Google Analytics, etc.
      }}
      onDecline={() => {
        console.log("Cookies declined");
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--accent-color)" }}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
        This website uses cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
      </span>
    </CookieConsent>
  );
}