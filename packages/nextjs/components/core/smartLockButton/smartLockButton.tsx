
import { Spinner } from "~~/components/Spinner";
import styles from "./smartLockButton.module.css";
interface IActionProps {
  isLoading: boolean;
  disabled: boolean;
  label: string;
  type?:"secondary" | "primary" 
  action: () => void;
}
export const SmartLockButton = ({ isLoading, action, label, disabled, type = "primary" }: IActionProps) => (
  <button
    disabled={disabled}
    className={`${styles.button} ${isLoading ? styles.loading : ""} ${disabled ? styles.disabled : ""} btn-primary ${styles[type]}`}
    onClick={() => action()}
  >
    {!!isLoading ? <Spinner width="20px" height="20px"></Spinner> : <span>{label}</span>}
  </button>
);
