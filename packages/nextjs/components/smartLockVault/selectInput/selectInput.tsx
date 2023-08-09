import styles from "./selectInput.module.css";

interface ISelectProps {
  name: string;
  options: {
    label: string;
    value: number;
  }[];
  placeholder: string;
  value: string | number;
  onChange: (val: string | number | null) => void;
}

export const SelectInput = ({ name, options, onChange, value, placeholder }: ISelectProps) => (
  <div className={styles.selectContainer}>
    <select
      placeholder={placeholder}
      className={styles.select}
      name={`${name}`}
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      <option disabled={true} value="">
        {placeholder}
      </option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);
