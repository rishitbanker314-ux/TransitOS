import React from 'react';
export const Dialog = ({ children, open, onOpenChange }: any) => <div>{children}</div>;
export const DialogContent = ({ children, className }: any) => <div className={className}>{children}</div>;
export const DialogHeader = ({ children, className }: any) => <div className={className}>{children}</div>;
export const DialogTitle = ({ children, className }: any) => <div className={className}>{children}</div>;
export const DialogDescription = ({ children, className }: any) => <div className={className}>{children}</div>;
export const DialogFooter = ({ children, className }: any) => <div className={className}>{children}</div>;
