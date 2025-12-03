
import React from 'react';
import { LucideProps } from 'lucide-react';

interface GlowingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    Icon?: React.ComponentType<LucideProps>;
    className?: string;
    variant?: 'primary' | 'secondary';
}

const GlowingButton: React.FC<GlowingButtonProps> = ({ children, Icon, className = '', variant = 'primary', ...props }) => {
    const baseClasses = `w-full flex items-center justify-center gap-3 text-lg py-4 px-6 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 font-orbitron`;

    const primaryClasses = `
        bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white
        hover:opacity-90 active:scale-95
        focus:ring-[var(--primary)]/50
        glowing-button-pulse
    `;
    
    const secondaryClasses = `
        bg-black/30 border-2 border-[var(--accent)] text-[var(--accent)]
        hover:bg-[var(--accent)]/10 active:scale-95
        focus:ring-[var(--accent)]/30
    `;

    const variantClasses = variant === 'primary' ? primaryClasses : secondaryClasses;

    return (
        <button
            className={`${baseClasses} ${variantClasses} ${className}`}
            {...props}
        >
            {Icon && <Icon size={24} />}
            <span>{children}</span>
        </button>
    );
};

export default GlowingButton;