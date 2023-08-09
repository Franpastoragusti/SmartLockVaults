import { useState } from "react";
import styles from "./multiAddressInput.module.css";
import { Address } from "~~/components/scaffold-eth";

interface IInputAddressProps {
  title: string;
  name: string;
  subtitle: string;
  onConfirm: (value: string) => boolean;
  onDelete: (value: string) => void;
  values: string[];
  disabled?: boolean;
}

export const MultiAddressInput = ({
  title,
  name,
  onConfirm,
  values,
  disabled = false,
  onDelete,
}: IInputAddressProps) => {
  const [value, setValue] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);
  return (
    <div className={`${styles.inputAddress} ${!!disabled ? styles.disabled : ""}`}>
      <label htmlFor={`${name}`}>{title}</label>

      <div
        className={`${styles.addressContainer} ${hasError ? styles.error : ""} mainAddressContainer ${
          !!disabled ? "disabled" : ""
        }`}
      >
        <input
          disabled={disabled}
          name={`${name}`}
          type="text"
          value={value}
          onChange={e => {
            setHasError(false);
            setValue(e.target.value);
          }}
          onKeyDown={e => {
            if (e.key === "Enter") {
              onConfirm(value);
              setValue("");
            }
          }}
        />
        <div className={`${styles.distributedAddressContainer}  ${!!disabled ? styles.disabled : ""}`}>
          {values.map((item, i) => (
            <div key={i} className={styles.distributedAddress} onClick={() => onDelete(item)}>
              <Address disableAddressLink={true} address={item} format="long"></Address>
              <span>X</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
