import { useEffect, useCallback } from "preact/hooks";

export function Drawer({ open, onClose, title, children }) {
  const handleKey = useCallback(
    (e) => {
      if (e.key === "Escape" && open) onClose();
    },
    [open, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className={`drawer-root${open ? " open" : ""}`}>
      {/* Overlay */}
      <div className="drawer-overlay" onClick={onClose} aria-hidden="true" />

      {/* Panel */}
      <div className="drawer-panel" role="dialog" aria-label={title}>
        {/* Header */}
        <div className="drawer-header">
          <h3 className="drawer-title">
            <i className="ti ti-book-2" aria-hidden="true"></i>
            {title}
          </h3>
          <button className="drawer-close" onClick={onClose} aria-label="关闭">
            <i className="ti ti-x" aria-hidden="true"></i>
          </button>
        </div>

        {/* Body */}
        <div className="drawer-body">
          {children}
        </div>
      </div>
    </div>
  );
}
