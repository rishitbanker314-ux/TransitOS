import React from 'react';
export const Badge = ({ className, variant, ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: string }) => <div className={className} {...props} />;
