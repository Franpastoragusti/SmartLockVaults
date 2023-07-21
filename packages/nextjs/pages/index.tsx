import { useState } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { Distributton } from "~~/components/core/distributton/distributton";
import { DistributionCard, IDistributionSelections } from "~~/components/core/distributionCard/distributionCard";


const DISTRIBUTIONS: IDistributionSelections[] = [
  {
    type: "equal",
    frecuency: "each",
    time: "years",
    period: 1,
    distributeAddresses: ["0x32405C7bbF55e281dcCd40D836463C8E88ba1B6A", "0x32d3B95D3B34b3D118F0396f082E6ae731092d6b"],
    distributionBlock: 93827,
    address:"0x42405C7bbF55e281dcCd40D836463C8E88b7AB6A"
  },
  {
    type: "equal",
    frecuency: "each",
    time: "days",
    period: 1,
    distributeAddresses: [
      "0x32405C7bbF55e281dcCd40D836463C8E88ba1B6A",
      "0x32d3B95D3B34b3D118F0396f082E6ae731092d6b",
      "0x32805C7bbF55e281dcCd40D836463C8E88ba1B6A",
    ],
    distributionBlock: 100312,
    address:"0x32405C7bbF55e281dcCd40D836463C8F88b7AB6A"
  },
  {
    type: "equal",
    frecuency: "each",
    time: "days",
    period: 1,
    distributeAddresses: [
      "0x32405C7bbF55e281dcCd40D836463C8E88ba1B6A",
      "0x32d3B95D3B34b3D118F0396f082E6ae731092d6b",
      "0x32805C7bbF55e281dcCd40D836463C8E88ba1B6A",
    ],
    distributionBlock: 100312,
    address:"0x32405C7bbF55e281dcCd40D836463C8E88b7ABBA"
  },
  {
    type: "equal",
    frecuency: "each",
    time: "days",
    period: 1,
    distributeAddresses: [
      "0x32405C7bbF55e281dcCd40D836463C8E88ba1B6A",
      "0x32d3B95D3B34b3D118F0396f082E6ae731092d6b",
      "0x32805C7bbF55e281dcCd40D836463C8E88ba1B6A",
    ],
    distributionBlock: 100312,
    address:"0x32405C7bbF55e281dcCd40D836463D8E88b7AB6A"
  },
  {
    type: "equal",
    frecuency: "each",
    time: "days",
    period: 1,
    distributeAddresses: [
      "0x32405C7bbF55e281dcCd40D836463C8E88ba1B6A",
      "0x32d3B95D3B34b3D118F0396f082E6ae731092d6b",
      "0x32805C7bbF55e281dcCd40D836463C8E88ba1B6A",
    ],
    distributionBlock: 100312,
    address:"0x32405C7bbF55e281dcCd40D83646438E88b7AB6A"
  },
  {
    type: "equal",
    frecuency: "each",
    time: "days",
    period: 1,
    distributeAddresses: [
      "0x32405C7bbF55e281dcCd40D836463C8E88ba1B6A",
      "0x32d3B95D3B34b3D118F0396f082E6ae731092d6b",
      "0x32805C7bbF55e281dcCd40D836463C8E88ba1B6A",
    ],
    distributionBlock: 100312,
    address:"0x32405C7bbF55e281dcCd40C836463C8E88b7AB6A"
  },
  {
    type: "equal",
    frecuency: "each",
    time: "days",
    period: 30,
    distributeAddresses: [
      "0x32405C7bbF55e281dcCd40D836463C8E88ba1B6A",
      "0x32d3B95D3B34b3D118F0396f082E6ae731092d6b",
      "0x32405C7bbF55e281dcCd90D836463C8E88ba1B6A",
      "0x36505C7bbF55e281dcCd40D836463C8E88ba1B6A",
    ],
    distributionBlock: 46374,
    address:"0x32405C7bbF55e281dcCd40D836463C8E88b7AB6A"
  },
];

const Home: NextPage = () => {
  const [hasDistributions, setHasDistributions] = useState(true);
  const router = useRouter();
  const handleButtonClick = () => {
    router.push(`/create`);
  };
  return (
    <>
      <MetaHeader />
      <div className={styles.mainPage}>
        <h1 className={styles.title}>Your Distributions</h1>
        <ul className={styles.list}>
          {DISTRIBUTIONS.map((item, i) => (
              <DistributionCard key={item.address} distribution={item}/>
          ))}
          <li className={styles.createButton}>
            <Distributton isLoading={false} disabled={false} label={"Create"} action={handleButtonClick}></Distributton>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Home;
