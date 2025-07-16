import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import LoadingSpinner from './LoadingSpinner';
const AIThinkingIndicator = ({ isVisible = false, message = "🤖 IA réfléchit...", duration = null }) => {
    if (!isVisible)
        return null;
    return (_jsxs("div", { style: {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0, 0, 0, 0.9)',
            border: '2px solid var(--lamap-red)',
            borderRadius: '16px',
            padding: '2rem',
            zIndex: 1000,
            textAlign: 'center',
            minWidth: '280px',
            boxShadow: '0 0 20px rgba(198, 40, 40, 0.4)',
            backdropFilter: 'blur(10px)',
        }, children: [_jsx("div", { style: {
                    fontSize: '3rem',
                    marginBottom: '1rem',
                    animation: 'pulse 2s infinite'
                }, children: "\uD83E\uDD16" }), _jsx(LoadingSpinner, { size: "medium", color: "primary" }), _jsx("div", { style: {
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: 'var(--lamap-white)',
                    marginTop: '1rem',
                    marginBottom: '0.5rem',
                }, children: message }), _jsxs("div", { style: {
                    fontSize: '1.5rem',
                    color: 'var(--lamap-red)',
                    fontWeight: 'bold',
                    animation: 'thinking 1.5s infinite',
                }, children: [_jsx("span", { children: "\u2022" }), _jsx("span", { children: "\u2022" }), _jsx("span", { children: "\u2022" })] }), duration && (_jsx("div", { style: {
                    width: '100%',
                    height: '3px',
                    backgroundColor: '#333',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    marginTop: '1rem',
                }, children: _jsx("div", { style: {
                        height: '100%',
                        background: 'linear-gradient(90deg, var(--lamap-red), #a32222)',
                        borderRadius: '2px',
                        animation: `progress ${duration}ms linear`,
                        transformOrigin: 'left',
                    } }) })), _jsx("div", { style: {
                    fontSize: '0.8rem',
                    color: '#666',
                    marginTop: '1rem',
                    fontStyle: 'italic',
                }, children: "Analyse des cartes en cours..." }), _jsx("style", { jsx: true, children: `
        @keyframes pulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.7; 
            transform: scale(1.1);
          }
        }

        @keyframes thinking {
          0% { opacity: 0.3; }
          33% { opacity: 1; }
          66% { opacity: 0.3; }
          100% { opacity: 0.3; }
        }

        @keyframes progress {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }

        @keyframes thinking span:nth-child(1) {
          animation-delay: 0s;
        }
        @keyframes thinking span:nth-child(2) {
          animation-delay: 0.2s;
        }
        @keyframes thinking span:nth-child(3) {
          animation-delay: 0.4s;
        }
      ` })] }));
};
export default AIThinkingIndicator;
