import styles from "./distributionCard.module.css";
import { Address, Balance } from "~~/components/scaffold-eth";

interface IProps {
  distribution: IDistributionSelections;
}

export interface IDistributionSelections {
  type: "equal" | "not-equal";
  frecuency: "each" | "periodic";
  time: "blocks" | "days" | "years";
  period: number;
  distributeAddresses: any[];
  distributionBlock: number;
  address: string;
}

export const DistributionCard = ({ distribution }: IProps) => {
  const distributionLabel = `Equatable Distribution each ${distribution.period} ${distribution.time}`;
  return (
    <li className={styles.distribution}>
      <div className={styles.addressContainer}>
        <Address size="sm" address={distribution.address} format="short" />
        <Balance address={distribution.address} />
      </div>
      <div className={styles.information}>
        <div className={styles.section}>
          <div>
            <p className={styles.infoTitle}>Definition</p>
            <p className={styles.infoLabel}>{distributionLabel}</p>
          </div>
          <div>
            <p className={styles.infoTitle}>Next distribution</p>
            <p className={styles.infoLabel}>{distribution.distributionBlock}</p>
          </div>
        </div>
        <div className={styles.section}>
          <p className={styles.infoTitle}>Beneficiaries</p>
          <div className={styles.beneficiaries}>
            {distribution.distributeAddresses.map(addresse => (
              <Address key={addresse} address={addresse}></Address>
            ))}
          </div>
        </div>
      </div>
    </li>
  );
};
