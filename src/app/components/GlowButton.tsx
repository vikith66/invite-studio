import { ReactNode } from 'react';
import { Link } from 'react-router';

interface GlowButtonProps {
  children: ReactNode;
  to?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit';
}

export function GlowButton({
  children,
  to,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
}: GlowButtonProps) {
  const baseStyles = 'rounded-full font-medium transition-all duration-300 flex items-center justify-center font-heading';

  const sizeStyles = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-7 py-3.5 text-base',
    lg: 'px-9 py-4 text-lg',
  };

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-[#C7B8EA] to-[#A7D7F0]
      hover:from-[#B8A8DA] hover:to-[#97C7E0]
      shadow-[0_4px_20px_rgba(199,184,234,0.3)]
      hover:shadow-[0_6px_30px_rgba(199,184,234,0.4)]
      text-white
    `,
    secondary: `
      bg-gradient-to-r from-[#FFB5A7] to-[#FFB8D1]
      hover:from-[#FFA597] hover:to-[#FFA8C1]
      shadow-[0_4px_20px_rgba(255,181,167,0.3)]
      hover:shadow-[0_6px_30px_rgba(255,181,167,0.4)]
      text-white
    `,
    ghost: `
      bg-white/50 backdrop-blur-sm border border-gray-200
      hover:bg-white/80
      text-gray-700
    `,
  };

  const classes = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
