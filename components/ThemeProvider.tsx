
import React, { useLayoutEffect } from 'react';
import { useApp } from '../context/AppContext';
import { themes } from '../styles/themes';

const GlobalStyles = () => (
    <style>{`
        body {
            background-color: var(--bg-dark);
            color: #e0e0e0;
            font-family: 'Roboto', sans-serif;
        }

        .animated-gradient-bg {
            background: linear-gradient(-45deg, var(--gradient-start), var(--gradient-mid), var(--gradient-accent1), var(--gradient-accent2));
            background-size: 400% 400%;
            animation: gradient 15s ease infinite;
        }

        @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        .font-orbitron {
            font-family: 'Orbitron', sans-serif;
        }

        @keyframes glowing-pulse {
            0% { box-shadow: 0 0 5px var(--glow-1); }
            50% { box-shadow: 0 0 20px var(--glow-1), 0 0 10px var(--glow-2); }
            100% { box-shadow: 0 0 5px var(--glow-1); }
        }

        .glowing-button-pulse {
            animation: glowing-pulse 2.5s infinite ease-in-out;
            border: 1px solid var(--primary);
        }
        
        .glowing-card-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px var(--glow-1);
            border-color: var(--primary);
        }
    `}</style>
);


const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { settings } = useApp();

    useLayoutEffect(() => {
        const themeName = settings.theme || 'DefaultDragon';
        const selectedTheme = themes.find(t => t.name === themeName) || themes[0];
        
        const root = document.documentElement;
        for (const [key, value] of Object.entries(selectedTheme.colors)) {
            root.style.setProperty(key, value);
        }

    }, [settings.theme]);

    return (
        <>
            <GlobalStyles />
            {children}
        </>
    );
};

export default ThemeProvider;