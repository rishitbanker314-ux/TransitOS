import React from 'react';
export const Checkbox = React.forwardRef<HTMLButtonElement, any>(({ checked, onCheckedChange, ...props }, ref) => <button ref={ref} onClick={() => onCheckedChange?.(!checked)} {...props} />);
Checkbox.displayName = 'Checkbox';
