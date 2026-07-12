import React from 'react';
export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string }>(({ className, variant, size, ...props }, ref) => <button ref={ref} className={className} {...props} />);
Button.displayName = 'Button';
