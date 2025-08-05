import React from 'react';
import { BsWhatsapp } from 'react-icons/bs';

const FloatingWhatsAppIcon = () => {
  const whatsappLink = 'whatsapp://send?phone=+8801540376020';

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(1);
              box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            }
            50% {
              transform: scale(1.1);
              box-shadow: 0 6px 12px rgba(0,0,0,0.4);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            }
          }
          .floating-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 8px;
            user-select: none;
          }
          .floating-icon {
            width: 50px;
            height: 50px;
            background-color: #25D366;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            cursor: pointer;
            color: white;
            animation: pulse 2.5s infinite ease-in-out;
            flex-shrink: 0;
            text-decoration: none;
          }
          .conversation-card {
            background: white;
            border-radius: 10px;
            box-shadow: 0 3px 8px rgba(0,0,0,0.15);
            padding: 4px 8px; /* much smaller padding */
            color: #222;
            font-weight: 600;
            cursor: pointer;
            white-space: nowrap;
            user-select: none;
            font-size: 13px;
            transition: box-shadow 0.3s ease;
            flex-shrink: 0;

            display: flex;
            align-items: center;
            height: 50px; /* match icon height */
          }
          .conversation-card:hover {
            box-shadow: 0 6px 20px rgba(0,0,0,0.25);
          }
        `}
      </style>

      <div className="floating-container">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="conversation-card"
          aria-label="Need help? Chat with us"
          title="Need help? Chat with us"
        >
          Need help? Chat with us
        </a>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="floating-icon"
          aria-label="Chat with us on WhatsApp"
          title="Chat with us on WhatsApp"
        >
          <BsWhatsapp size={28} />
        </a>
      </div>
    </>
  );
};

export default FloatingWhatsAppIcon;
