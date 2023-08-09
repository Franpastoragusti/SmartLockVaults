import React from "react";
import styles from "./customInput.module.css";

interface IInputProps {
  title: string;
  name: string;
  options?: {
    label: string;
    value: number;
  }[];
  subValue?: number | string;
  onSubtitleChange?: (val: string) => void;
  type: "number" | "text";
  value: string | number | null;
  onChange: (val: string | number | null) => void;
  disabled?: boolean;
}

export const CustomInput = ({
  title,
  name,
  options,
  disabled = false,
  type,
  subValue,
  onChange,
  value,
  onSubtitleChange,
}: IInputProps) => (
  <div className={`${styles.input} ${!!disabled ? styles.disabled : ""}`}>
    <label htmlFor={`${name}`}>{title}</label>

    <div className={styles.inputContainer}>
      <input
        disabled={disabled}
        name={`${name}`}
        type={type}
        value={value ?? ""}
        onChange={e => onChange(e.target.value)}
      />
      {!!options && (
        <span className={"text-primary"}>
          <select
            disabled={disabled}
            className={`${styles.select}`}
            name={`${name}`}
            value={subValue}
            onChange={e => onSubtitleChange!(e.target.value)}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </span>
      )}
      {!options && !!subValue &&  <span className={styles.unit}>
          {subValue}
        </span>}
    </div>
  </div>
);
