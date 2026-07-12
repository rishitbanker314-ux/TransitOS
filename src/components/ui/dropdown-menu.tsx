import React from 'react';
export const DropdownMenu = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, any>(({ children, ...props }, ref) => <button ref={ref} {...props}>{children}</button>);
export const DropdownMenuContent = ({ children, ...props }: any) => <div {...props}>{children}</div>;
export const DropdownMenuItem = ({ children, ...props }: any) => <div {...props}>{children}</div>;
export const DropdownMenuCheckboxItem = ({ children, checked, onCheckedChange, ...props }: any) => <div onClick={() => onCheckedChange?.(!checked)} {...props}>{children}</div>;
export const DropdownMenuLabel = ({ children, ...props }: any) => <div {...props}>{children}</div>;
export const DropdownMenuSeparator = () => <hr />;
