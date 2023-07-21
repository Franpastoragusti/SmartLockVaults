import Image from "next/image";
import styles from "./optionCard.module.css";

interface IOptionCardsProps {
    status: "active" | "inActive" | "done";
    title: string;
    value?: string;
    onChange: (val: string) => void;
    options: {
      image: string;
      text: string;
      id: string;
    }[];
  }
  export const OptionCards = ({ status, options, title, value, onChange }: IOptionCardsProps) => {
    return (
      <>
        <h3 className={`${styles.subtitle} ${styles[status]}`}>{title}</h3>
  
        <div className={`${styles.imageSelectionContainer} ${styles[status]}`}>
          {options.map((item, i) => (
            <>
              {options.length === i + 1 ? <div className={styles.separator}>OR</div> : <></>}
              <div
                className={`${styles.imageSelection} 
                ${!value ? "" : styles.withValue} 
                ${value === item.id ? styles.selected : ""}
                `}
                key={item.id}
                onClick={() => onChange(item.id)}
              >
                <div className={styles.image}>
                  <Image alt="SE2 logo" fill src={item.image} />
                </div>
                <span className={styles.value}>{item.text}</span>
              </div>
            </>
          ))}
        </div>
      </>
    );
  };