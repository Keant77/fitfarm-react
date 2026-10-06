import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const DropdownMenuContext = createContext(null);

// ===============================
// DROPDOWN MENU
// ===============================
export function DropdownMenu({
  children,
  open: controlledOpen,
  onOpenChange,
}) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (value) => {
    if (!isControlled) {
      setInternalOpen(value);
    }

    if (onOpenChange) {
      onOpenChange(value);
    }
  };

  return (
    <DropdownMenuContext.Provider
      value={{
        open,
        setOpen,
      }}
    >
      <div className="dropdown-menu-root">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

// ===============================
// TRIGGER
// ===============================
export function DropdownMenuTrigger({
  children,
  render,
  asChild,
  ...props
}) {
  const { open, setOpen } = useContext(DropdownMenuContext);

  const handleClick = (event) => {
    if (props.onClick) {
      props.onClick(event);
    }

    if (!event.defaultPrevented) {
      setOpen(!open);
    }
  };

  // Mendukung pola shadcn:
  // <DropdownMenuTrigger render={<Button />} />
  if (render) {
    return React.cloneElement(render, {
      ...props,
      "aria-expanded": open,
      onClick: handleClick,
      children: children,
    });
  }

  return (
    <button
      type="button"
      {...props}
      aria-expanded={open}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

// ===============================
// CONTENT
// ===============================
export function DropdownMenuContent({
  children,
  align = "start",
  className = "",
  ...props
}) {
  const { open, setOpen } = useContext(DropdownMenuContext);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (event) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [open, setOpen]);

  if (!open) {
    return null;
  }

  return (
    <div
      ref={contentRef}
      className={`dropdown-menu-content ${
        align === "end"
          ? "dropdown-menu-align-end"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// ===============================
// GROUP
// ===============================
export function DropdownMenuGroup({ children }) {
  return (
    <div className="dropdown-menu-group">
      {children}
    </div>
  );
}

// ===============================
// ITEM
// ===============================
export function DropdownMenuItem({
  children,
  onClick,
  variant = "default",
  className = "",
  ...props
}) {
  const { setOpen } = useContext(DropdownMenuContext);

  const handleClick = (event) => {
    if (onClick) {
      onClick(event);
    }

    if (!event.defaultPrevented) {
      setOpen(false);
    }
  };

  return (
    <button
      type="button"
      className={`dropdown-menu-item ${
        variant === "destructive"
          ? "dropdown-menu-item-destructive"
          : ""
      } ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

// ===============================
// SEPARATOR
// ===============================
export function DropdownMenuSeparator({
  className = "",
}) {
  return (
    <div
      className={`dropdown-menu-separator ${className}`}
    />
  );
}