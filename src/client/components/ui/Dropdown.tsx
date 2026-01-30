import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/helpers';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  className?: string;
  menuClassName?: string;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = memo(({
  trigger,
  children,
  align = 'right',
  className,
  menuClassName,
  onOpenChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;

    const top = rect.bottom + scrollY + 8; // 8px gap
    const width = rect.width;
    let left = rect.left + scrollX;

    // Adjust alignment
    if (align === 'right') {
      // For right align, we want the right edge of dropdown to align with right edge of trigger
      // So we calculate left position based on trigger's right edge
      left = rect.right + scrollX;
    } else if (align === 'center') {
      // Center align - will be adjusted after menu width is known
      left = rect.left + scrollX + (width / 2);
    }
    // 'left' alignment keeps left edge aligned (default)

    setPosition({ top, left, width });
  }, [align]);

  const handleToggle = useCallback(() => {
    if (disabled) return;
    setIsOpen((prev) => {
      const newValue = !prev;
      onOpenChange?.(newValue);
      return newValue;
    });
  }, [disabled, onOpenChange]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    onOpenChange?.(false);
  }, [onOpenChange]);

  // Update position when opening
  useEffect(() => {
    if (isOpen) {
      updatePosition();
      // Update on scroll/resize
      const handleUpdate = () => updatePosition();
      window.addEventListener('scroll', handleUpdate, true);
      window.addEventListener('resize', handleUpdate);
      return () => {
        window.removeEventListener('scroll', handleUpdate, true);
        window.removeEventListener('resize', handleUpdate);
      };
    }
  }, [isOpen, updatePosition]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        handleClose();
      }
    };

    // Use capture phase for better performance
    document.addEventListener('mousedown', handleClickOutside, { capture: true, passive: true });
    // Also close on escape key
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, { capture: true });
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleClose]);

  const menuContent = isOpen ? (
    <div
      ref={menuRef}
      className={cn(
        'fixed z-[9999] bg-jazz-900/98 backdrop-blur-xl rounded-lg sm:rounded-xl py-1 border border-gold-900/30',
        'shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,194,51,0.12)_inset] hover:shadow-[0_16px_48px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,194,51,0.18)_inset] hover:border-gold-800/40 transition-all duration-300',
        'animate-fade-in',
        menuClassName
      )}
      style={{
        top: `${position.top}px`,
        ...(align === 'right' 
          ? { right: `${window.innerWidth - position.left}px`, left: 'auto' }
          : align === 'center'
          ? { left: `${position.left}px`, transform: 'translateX(-50%)' }
          : { left: `${position.left}px` }
        ),
        minWidth: align === 'right' ? 'auto' : `${position.width}px`,
      }}
      role="menu"
      aria-label="Dropdown menu"
    >
      {children}
    </div>
  ) : null;

  return (
    <>
      <div
        ref={triggerRef}
        className={cn('relative inline-block', className)}
        onClick={handleToggle}
      >
        {trigger}
      </div>
      {typeof document !== 'undefined' && createPortal(menuContent, document.body)}
    </>
  );
});

Dropdown.displayName = 'Dropdown';

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  as?: 'button' | 'link';
  to?: string;
  disabled?: boolean;
}

export const DropdownItem: React.FC<DropdownItemProps> = memo(({
  children,
  onClick,
  className,
  as = 'button',
  to,
  disabled = false,
}) => {
  const baseStyles = 'block w-full text-left px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base text-gray-200 hover:bg-gradient-to-r hover:from-gold-900/40 hover:to-musical-900/40 hover:text-gold-200 hover:shadow-[0_4px_12px_rgba(255,194,51,0.15)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-inset rounded-lg mx-1 min-h-[44px] sm:min-h-[48px] flex items-center group leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed';

  if (as === 'link' && to) {
    return (
      <Link
        to={to}
        onClick={onClick}
        className={cn(baseStyles, className)}
        role="menuitem"
      >
        <span className="group-hover:drop-shadow-[0_0_6px_rgba(255,194,51,0.4)] transition-all duration-300">
          {children}
        </span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(baseStyles, className)}
      role="menuitem"
    >
      <span className="group-hover:drop-shadow-[0_0_6px_rgba(255,194,51,0.4)] transition-all duration-300">
        {children}
      </span>
    </button>
  );
});

DropdownItem.displayName = 'DropdownItem';
