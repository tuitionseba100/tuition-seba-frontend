import React from "react";

const LoadingCard = ({ show, message = "Loading..." }) => {
    if (!show) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(3px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1050,
                boxShadow: "inset 0 0 100px rgba(0,0,0,0.7)",
            }}
        >
            <div
                style={{
                    background: "linear-gradient(135deg, #4a90e2, #357ABD)",
                    padding: "2rem 3rem",
                    borderRadius: "1rem",
                    boxShadow: "0 8px 24px rgba(53, 122, 189, 0.5)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    minWidth: 220,
                    color: "#fff",
                    fontWeight: "600",
                    fontSize: "1.3rem",
                    userSelect: "none",
                }}
            >
                <div
                    style={{
                        width: 50,
                        height: 50,
                        border: "6px solid rgba(255,255,255,0.3)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                    }}
                />
                <div style={{ marginTop: 16, textAlign: "center" }}>{message}</div>

                <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}</style>
            </div>
        </div>
    );
};

export default LoadingCard;
