import React from 'react';
import { BsWhatsapp } from 'react-icons/bs';
import { motion } from 'framer-motion';

const FloatingWhatsAppIcon = () => {
  const whatsappLink = 'whatsapp://send?phone=+8801633920928';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        userSelect: 'none',
      }}
    >
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Need help? Chat with us"
        title="Need help? Chat with us"
        style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          padding: '2px 6px',
          color: '#222',
          fontWeight: 700, // bolder font
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          fontSize: '11px',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          transition: 'box-shadow 0.3s ease',
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.25)')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)')
        }
      >
        Need help? Chat with us
      </a>

      <motion.a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        title="Chat with us on WhatsApp"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          width: '38px',
          height: '38px',
          backgroundColor: '#25D366',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          color: 'white',
          flexShrink: 0,
        }}
      >
        <BsWhatsapp size={20} />
      </motion.a>
    </div>
  );
};

export default FloatingWhatsAppIcon;
