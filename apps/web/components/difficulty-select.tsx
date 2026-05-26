"use client";

import { useState } from "react";

const OPTIONS = [
  { value: "Easy",      label: "Easy",      color: "#6bdb8d" },
  { value: "Medium",    label: "Medium",    color: "#f5c842" },
  { value: "Hard",      label: "Hard",      color: "#f5923c" },
  { value: "Very Hard", label: "Very Hard", color: "#f87171" },
];

type Props = {
  defaultValue?: string;
  name?: string;
  id?: string;
};

export function DifficultySelect({ defaultValue = "Medium", name = "difficulty", id = "difficulty" }: Props) {
  const [selected, setSelected] = useState(defaultValue);
  const [open, setOpen] = useState(false);

  const current = OPTIONS.find((o) => o.value === selected) ?? OPTIONS[1];

  return (
    <div className="difficulty-select" style={{ position: "relative" }}>
      <input type="hidden" name={name} value={selected} />
      <button
        type="button"
        id={id}
        className="difficulty-select__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onBlur={(e) => {
          if (!e.currentTarget.parentElement?.contains(e.relatedTarget as Node)) {
            setOpen(false);
          }
        }}
      >
        <span className="difficulty-select__dot" style={{ background: current.color, boxShadow: `0 0 4px ${current.color}99` }} />
        {current.label}
        <svg className="difficulty-select__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <ul className="difficulty-select__menu" role="listbox">
          {OPTIONS.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === selected}
              className={`difficulty-select__option${opt.value === selected ? " difficulty-select__option--active" : ""}`}
              onMouseDown={() => {
                setSelected(opt.value);
                setOpen(false);
              }}
            >
              <span className="difficulty-select__dot" style={{ background: opt.color, boxShadow: `0 0 4px ${opt.color}99` }} />
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
