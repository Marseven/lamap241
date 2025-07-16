import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
const LoadingSpinner = ({ size = 'medium', color = 'primary', text = null, fullScreen = false, showLogo = false }) => {
    const getSizeClasses = () => {
        switch (size) {
            case 'small':
                return { width: '20px', height: '20px', borderWidth: '2px' };
            case 'medium':
                return { width: '40px', height: '40px', borderWidth: '3px' };
            case 'large':
                return { width: '60px', height: '60px', borderWidth: '4px' };
            default:
                return { width: '40px', height: '40px', borderWidth: '3px' };
        }
    };
    const getColor = () => {
        switch (color) {
            case 'primary':
                return 'var(--lamap-red)';
            case 'white':
                return 'var(--lamap-white)';
            case 'secondary':
                return '#888';
            default:
                return 'var(--lamap-red)';
        }
    };
    const sizeStyles = getSizeClasses();
    const spinnerColor = getColor();
    const spinnerStyle = {
        ...sizeStyles,
        border: `${sizeStyles.borderWidth} solid transparent`,
        borderTop: `${sizeStyles.borderWidth} solid ${spinnerColor}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        display: 'inline-block',
        boxShadow: `0 0 10px rgba(198, 40, 40, 0.3)`,
    };
    const textStyle = {
        color: spinnerColor,
        fontSize: size === 'small' ? '0.8rem' : '1rem',
        fontWeight: 'bold',
        marginTop: '1rem',
        textAlign: 'center',
    };
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        ...(fullScreen && {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 9999,
        }),
    };
    return (_jsxs("div", { style: containerStyle, children: [showLogo && (_jsx("div", { style: { marginBottom: '1rem' }, children: _jsx("img", { src: "/logo.png", alt: "La Map 241", style: {
                        width: '80px',
                        height: 'auto',
                        opacity: 0.8,
                    } }) })), _jsx("div", { style: spinnerStyle }), text && (_jsx("div", { style: textStyle, children: text })), _jsx("style", { jsx: true, children: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      ` })] }));
};
export default LoadingSpinner;
