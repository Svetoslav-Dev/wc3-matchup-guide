"use client";

import { useState } from "react";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  itemName: string;
  hiddenFields: Record<string, string>;
  label?: string;
  className?: string;
};

export function ConfirmDelete({ action, itemName, hiddenFields, label = "Del", className }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={className ?? "button button--danger button--sm"}
        onClick={() => setOpen(true)}
      >
        {label}
      </button>

      {open && (
        <div className="confirm-overlay" onClick={() => setOpen(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <p className="confirm-modal__title">Delete {itemName}?</p>
            <p className="confirm-modal__body">This action cannot be undone.</p>
            <div className="confirm-modal__actions">
              <button
                type="button"
                className="button button--cancel button--sm"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <form action={action}>
                {Object.entries(hiddenFields).map(([name, value]) => (
                  <input key={name} type="hidden" name={name} value={value} />
                ))}
                <button type="submit" className="button button--danger button--sm">
                  Delete
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
