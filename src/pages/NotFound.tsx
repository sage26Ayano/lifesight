import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import "../styles/layout.css";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "var(--color-bg-secondary)"
    }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{
          marginBottom: "16px",
          fontSize: "48px",
          fontWeight: "700",
          color: "var(--color-text)"
        }}>404</h1>
        <p style={{
          marginBottom: "16px",
          fontSize: "20px",
          color: "var(--color-text-muted)"
        }}>Oops! Page not found</p>
        <Link 
          to="/" 
          style={{
            color: "var(--color-primary)",
            textDecoration: "underline",
            fontSize: "16px"
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
          onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
