import React from "react";
import { Button } from "../ui/button";
import { AlertTriangle } from "lucide-react";

export function ConfirmDialog({
  open,
  title = "Konfirmasi Aksi",
  message = "Apakah Anda yakin ingin melanjutkan?",
  confirmText = "Hapus",
  cancelText = "Batal",
  onConfirm,
  onClose,
  variant = "destructive",
}) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: "420px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "16px" }}>
          <div
            style={{
              padding: "10px",
              borderRadius: "50%",
              backgroundColor:
                variant === "destructive"
                  ? "rgba(220, 38, 38, 0.12)"
                  : "rgba(15, 109, 58, 0.12)",
              color: variant === "destructive" ? "#dc2626" : "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 style={{ margin: "0 0 6px 0", fontSize: "18px", color: "var(--text-primary)" }}>
              {title}
            </h3>
            <p style={{ margin: 0, fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              {message}
            </p>
          </div>
        </div>

        <div className="modal-actions" style={{ marginTop: "20px", paddingTop: "14px" }}>
          <Button type="button" variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={variant}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
