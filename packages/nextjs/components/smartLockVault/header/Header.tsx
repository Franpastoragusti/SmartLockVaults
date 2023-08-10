import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BlackLogoSvg from "../../../public/assets/blackLogo.svg";
import WhiteLogoSvg from "../../../public/assets/logoWhite.png";
import styles from "./header.module.css";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

export const Header = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 px-0 sm:px-2">
      <div className="navbar-start w-auto lg:w-1/2">
        <Link href="/" passHref className="flex items-center gap-2 ml-4 mr-6">
          <div className="flex relative w-10 h-10">
            <Image alt="SE2 logo" className="cursor-pointer" fill src={isDarkMode ? WhiteLogoSvg : BlackLogoSvg} />
          </div>
          <div className={`${styles.titleContainer} ${styles.hide} flex flex-col`}>
            <span className="font-bold leading-tight">Smart Lock Vaults</span>
            <span className="text-xs">By BuidlGuidl</span>
          </div>
        </Link>
      </div>
      <div className="navbar-end flex-grow mr-4">
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>
    </div>
  );
};
