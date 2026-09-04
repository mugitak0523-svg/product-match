"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "@/components/dropdown.module.css";

export type DropdownOption = { value: string; label: string };

type DropdownProps = {
  ariaLabel: string;
  name?: string;
  value: string;
  options: DropdownOption[];
  placeholder?: string;
  required?: boolean;
  onChange?: (value: string) => void;
};

export function Dropdown({ ariaLabel, name, value, options, placeholder = "Select", required, onChange }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const root = useRef<HTMLDivElement>(null);
  const currentValue = onChange ? value : internalValue;
  const selected = options.find((option) => option.value === currentValue);

  useEffect(() => {
    function close(event: MouseEvent) { if (!root.current?.contains(event.target as Node)) setOpen(false); }
    function escape(event: KeyboardEvent) { if (event.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", escape); };
  }, []);

  return <div className={styles.root} ref={root}>
    {name && <input type="hidden" name={name} value={currentValue} required={required} />}
    <button type="button" className={styles.trigger} aria-label={ariaLabel} aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
      <span className={selected ? undefined : styles.placeholder}>{selected?.label ?? placeholder}</span><ChevronDown size={17} className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}/>
    </button>
    {open && <ul className={styles.menu} role="listbox" aria-label={ariaLabel}>{options.map((option) => <li key={option.value}><button type="button" role="option" aria-selected={option.value === currentValue} className={`${styles.option} ${option.value === currentValue ? styles.optionSelected : ""}`} onClick={() => { if (onChange) onChange(option.value); else setInternalValue(option.value); setOpen(false); }}>{option.label}{option.value === currentValue && <Check size={16}/>}</button></li>)}</ul>}
  </div>;
}
