import React from 'react';
export const Select = ({ children, onValueChange, value, ...props }: any) => <div {...props}>{children}</div>;
export const SelectTrigger = React.forwardRef<HTMLButtonElement, any>(({ children, ...props }, ref) => <button ref={ref} {...props}>{children}</button>);
export const SelectValue = ({ placeholder, ...props }: any) => <span {...props}>{placeholder}</span>;
export const SelectContent = ({ children, ...props }: any) => <div {...props}>{children}</div>;
export const SelectItem = React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => <div ref={ref} {...props}>{children}</div>);
