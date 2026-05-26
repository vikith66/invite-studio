import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className = '', hover = false }: GlassCardProps) {
  return (
    <div
      className={`
        relative backdrop-blur-md bg-white/70 border border-white/60 rounded-3xl
        shadow-[0_8px_32px_rgba(0,0,0,0.06)]
        ${hover ? 'transition-all duration-300 hover:bg-white/80 hover:shadow-[0_12px_48px_rgba(199,184,234,0.15)] hover:scale-105 hover:-translate-y-1' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
