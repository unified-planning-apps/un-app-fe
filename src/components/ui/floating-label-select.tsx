import * as React from 'react';

import { cn } from '@/lib/utils';
import { Select, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface FloatingSelectProps extends React.ComponentPropsWithoutRef<typeof Select> {
  label: string;
  placeholder?: string;
  id: string;
  className?: string;
}

const FloatingLabelSelect = React.forwardRef<
  React.ElementRef<typeof SelectTrigger>,
  FloatingSelectProps>(({ id, label, placeholder, className, children, ...props }, ref) => {
    return (
      <div className='relative'>
        <Select {...props}>
          <SelectTrigger
            ref={ref}
            id={id}
            className={cn('peer h-12 pt-4', className)}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {children}
          </SelectContent>
        </Select>
        <Label
          htmlFor={id}
          className={cn(
            "absolute left-2 top-2 z-10 origin-left -translate-y-4 scale-75 transform bg-background px-2 text-sm text-gray-500 duration-300",
            "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100",
            "peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2",
            "cursor-pointer"
          )}
        >
          {label}
        </Label>
      </div>
    )
  });

  FloatingLabelSelect.displayName = 'FloatingLabelSelect';

  export { FloatingLabelSelect };