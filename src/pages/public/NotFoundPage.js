import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div
      style={{ fontFamily: "'Noto Sans Bengali', sans-serif", overflow: "hidden" }}
    >
      {/* Header */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          background:
            "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          zIndex: 1000,
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#00838f",
            fontWeight: "900",
            fontSize: "1.8rem",
            letterSpacing: "0.1em",
            userSelect: "none",
          }}
          aria-label="Tuition Seba Forum"
        >
          Tuition Seba Forum
        </h1>
      </header>

      {/* Main content wrapper */}
      <div
        className="d-flex justify-content-center align-items-center vh-100 px-3"
        style={{
          background: "linear-gradient(135deg, #e0f7fa, #b2ebf2)",
          paddingTop: "5.5rem", // to prevent overlap with fixed header
          minHeight: "100vh",
        }}
      >
        {/* Floating icon */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            right: "10%",
            fontSize: "6rem",
            color: "#00acc1",
            opacity: 0.15,
            animation: "floatUpDown 4s ease-in-out infinite",
            userSelect: "none",
            pointerEvents: "none",
          }}
          aria-hidden="true"
        >
          &#128542; {/* Sad Face Emoji */}
        </div>

        <div
          className="text-center p-5 rounded-5 shadow-lg"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(15px)",
            maxWidth: "480px",
            width: "100%",
            animation: "fadeInUp 0.8s ease forwards",
            boxShadow:
              "0 8px 32px 0 rgba(0, 172, 193, 0.25), 0 0 10px rgba(0, 172, 193, 0.15)",
            border: "2px solid #00acc1",
          }}
        >
          <h1
            className="display-1 fw-bold text-info mb-3"
            style={{
              userSelect: "none",
              fontWeight: "900",
              letterSpacing: "0.15em",
              fontSize: "6rem",
              lineHeight: "1",
            }}
            aria-label="পেজ পাওয়া যায়নি"
          >
            ৪০৪
          </h1>

          <h2
            className="mb-4 text-dark"
            style={{ fontWeight: "700", fontSize: "1.8rem" }}
          >
            দুঃখিত! পেজটি পাওয়া যায়নি
          </h2>

          <p
            style={{
              color: "#555",
              fontSize: "1.1rem",
              marginBottom: "2rem",
              fontWeight: "500",
            }}
          >
            আপনি হয়তো ভুল ঠিকানায় এসেছেন বা পেজটি সরানো হয়েছে।
          </p>

          <Link
            to="/"
            className="btn btn-info btn-lg rounded-pill px-5 shadow"
            style={{
              fontWeight: "700",
              letterSpacing: "0.05em",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#00838f";
              e.currentTarget.style.boxShadow =
                "0 6px 12px rgba(0, 131, 143, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "";
              e.currentTarget.style.boxShadow = "";
            }}
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>

      </div>

      <style>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes floatUpDown {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
