
import { Spinner } from "~~/components/Spinner";
import styles from "./smartLockButton.module.css";
interface IActionProps {
  isLoading: boolean;
  disabled: boolean;
  label: string;
  type?:"btn-secondary" | "btn-primary" 
  action: () => void;
}
export const SmartLockButton = ({ isLoading, action, label, disabled, type = "btn-primary" }: IActionProps) => (
  <button
    disabled={disabled}
    className={`btn ${type} btn-sm rounded-full font-normal normal-case`}
    onClick={() => action()}
  >
    {!!isLoading ? <Spinner width="20px" height="20px"></Spinner> : <span>{label}</span>}
  </button>
);
