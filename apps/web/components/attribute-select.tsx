"use client";

import { useState } from "react";
import Image from "next/image";

const OPTIONS = [
  { value: "Strength",     icon: "/images/Heroes/HeroMountainKing.png" },
  { value: "Agility",      icon: "/images/Heroes/HeroBlademaster.png" },
  { value: "Intelligence", icon: "/images/Heroes/HeroArchMage.png" },
];

type Props = {
  defaultValue?: string;
  name?: string;
  id?: string;
};

export function AttributeSelect({ defaultValue = "Intelligence", name = "primaryAttribute", id = "primaryAttribute" }: Props) {
  const [selected, setSelected] = useState(defaultValue);
  const [open, setOpen] = useState(false);

  const current = OPTIONS.find((o) => o.value === selected) ?? OPTIONS[2];

  return (
    <div className="icon-select" style={{ position: "relative" }}>
      <input type="hidden" name={name} value={selected} />
      <button
        type="button"
        id={id}
        className="icon-select__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onBlur={(e) => {
          if (!e.currentTarget.parentElement?.contains(e.relatedTarget as Node)) setOpen(false);
        }}
      >
        <Image src={current.icon} alt={current.value} width={20} height={20} className="icon-select__img" />
        {current.value}
        <svg className="icon-select__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <ul className="icon-select__menu" role="listbox">
          {OPTIONS.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === selected}
              className={`icon-select__option${opt.value === selected ? " icon-select__option--active" : ""}`}
              onMouseDown={() => { setSelected(opt.value); setOpen(false); }}
            >
              <Image src={opt.icon} alt={opt.value} width={20} height={20} className="icon-select__img" />
              {opt.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
