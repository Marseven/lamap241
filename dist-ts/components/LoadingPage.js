import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import LoadingSpinner from './LoadingSpinner';
const LoadingPage = ({ title = "Chargement...", subtitle = null, showProgress = false, progress = 0, showLogo = true }) => {
    const progressStyle = {
        width: '200px',
        height: '4px',
        backgroundColor: '#333',
        borderRadius: '2px',
        overflow: 'hidden',
        marginTop: '1rem',
    };
    const progressBarStyle = {
        height: '100%',
        background: 'linear-gradient(90deg, var(--lamap-red), #a32222)',
        borderRadius: '2px',
        transition: 'width 0.3s ease',
        width: `${progress}%`,
        boxShadow: '0 0 10px rgba(198, 40, 40, 0.5)',
    };
    return (_jsx("div", { className: "mobile-container neon-theme", children: _jsxs("div", { style: {
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '2rem',
            }, children: [showLogo && (_jsxs("div", { style: { marginBottom: '2rem' }, children: [_jsx("img", { src: "/logo.png", alt: "La Map 241", style: {
                                width: '120px',
                                height: 'auto',
                                opacity: 0.9,
                            } }), _jsx("div", { style: {
                                fontSize: '1.2rem',
                                color: 'var(--lamap-red)',
                                fontWeight: 'bold',
                                marginTop: '0.5rem',
                            }, children: "La Map 241" })] })), _jsx(LoadingSpinner, { size: "large", color: "primary" }), _jsx("div", { style: {
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: 'var(--lamap-white)',
                        marginTop: '2rem',
                    }, children: title }), subtitle && (_jsx("div", { style: {
                        fontSize: '0.9rem',
                        color: '#888',
                        marginTop: '0.5rem',
                        fontStyle: 'italic',
                    }, children: subtitle })), showProgress && (_jsxs("div", { style: { marginTop: '2rem' }, children: [_jsx("div", { style: progressStyle, children: _jsx("div", { style: progressBarStyle }) }), _jsxs("div", { style: {
                                fontSize: '0.8rem',
                                color: '#888',
                                marginTop: '0.5rem',
                            }, children: [Math.round(progress), "%"] })] })), _jsx("div", { style: {
                        fontSize: '0.8rem',
                        color: '#666',
                        marginTop: '3rem',
                        fontStyle: 'italic',
                    }, children: "\uD83C\uDFAE Pr\u00E9parez-vous pour une partie \u00E9pique !" })] }) }));
};
export default LoadingPage;
