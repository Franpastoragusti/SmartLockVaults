import { useState } from "react";
import Image from "next/image";
import styles from "./create.module.css";
import type { NextPage } from "next";
import { IDistributionSelections } from "~~/components/core/distributionCard/distributionCard";
import { OptionCards } from "~~/components/create/optionCard";

const DISTRIBUTION_TYPES = [
  {
    image: "/equal-square-svgrepo-com.svg",
    text: "Equal",
    id: "equal",
  },
  {
    image: "/equal-not-square-svgrepo-com.svg",
    text: "Not Equal",
    id: "not-equal",
  },
];

const FREQUENCY_TYPES = [
  {
    image: "/repeat-2-svgrepo-com.svg",
    text: "Several",
    id: "several",
  },
  {
    image: "/repeat-one-fill-svgrepo-com.svg",
    text: "Once",
    id: "once",
  },
];
const TIMES_TYPES = [
  {
    image: "/repeat-2-svgrepo-com.svg",
    text: "Blocks",
    id: "blocks",
  },
  {
    image: "/repeat-one-fill-svgrepo-com.svg",
    text: "Days",
    id: "days",
  },
  {
    image: "/repeat-one-fill-svgrepo-com.svg",
    text: "Years",
    id: "years",
  },
];
const Create: NextPage = () => {
  const [newDistribution, setNewDistribution] = useState<Partial<IDistributionSelections> | null>();
  const onChange = (val: string, name: keyof IDistributionSelections) => {
    setNewDistribution(current => ({ ...current, [name]: val }));
  };
  return (
    <div className={styles.mainPage}>
      <h1 className={styles.title}>Create</h1>
      <OptionCards
        title="Distribution Type"
        status={newDistribution?.type ? "done" : "active"}
        options={DISTRIBUTION_TYPES}
        value={newDistribution?.type}
        onChange={val => onChange(val, "type")}
      />
      <OptionCards
        title="Frecuency"
        status={newDistribution?.type && !newDistribution?.frecuency ? "active" : !!newDistribution?.frecuency ? "done" : "inActive"}
        options={FREQUENCY_TYPES}
        value={newDistribution?.frecuency}
        onChange={val => onChange(val, "frecuency")}
      />
       <OptionCards
        title="Time"
        status={newDistribution?.frecuency && !newDistribution?.time ? "active" : !!newDistribution?.time ? "done" : "inActive"}
        options={TIMES_TYPES}
        value={newDistribution?.time}
        onChange={val => onChange(val, "time")}
      />
    </div>
  );
};

export default Create;
