import React from "react";

const Footer = () => {
    const footerStyle = {
        backgroundColor: "#3c81e1",
        color: "white",
        padding: "15px 0",
        textAlign: "center",
        fontSize: "14px",
    };

    return (
        <footer style={footerStyle} className="mt-auto">
            <div className="container">
                <p className="mb-0">
                    &copy; {new Date().getFullYear()} tuitionsebaforum.com | All rights
                    reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
