import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import NextNProgress from "nextjs-progressbar";
import { Toaster } from "react-hot-toast";
import { useDarkMode } from "usehooks-ts";
import { WagmiConfig } from "wagmi";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/smartLockVault/header/Header";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { useNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { appChains } from "~~/services/web3/wagmiConnectors";
import "~~/styles/globals.css";
import Logo from "~~/public/assets/lockLogo.svg";
import LogoWhite from "~~/public/assets/lockLogoWhite.svg";
import Image from "next/image";

const ScaffoldEthApp = ({ Component, pageProps }: AppProps) => {
  const [isInitialAnimation, setIsInitialAnimation] = useState(true);
  const price = useNativeCurrencyPrice();
  const setNativeCurrencyPrice = useGlobalState(state => state.setNativeCurrencyPrice);
  const { isDarkMode } = useDarkMode(false);

  useEffect(() => {
    if (price > 0) {
      setNativeCurrencyPrice(price);
    }
  }, [setNativeCurrencyPrice, price]);

  useEffect(() => {
    const body = document.body;
    body.setAttribute("data-theme", isDarkMode ? "scaffoldEthDark" : "scaffoldEth");
  }, [isDarkMode]);

  useEffect(() => {
    setTimeout(() => {
setIsInitialAnimation(false)
    }, 2500);
  }, []);
  console.log(isInitialAnimation)

  if(!!isInitialAnimation){
    return   <div className={`animationContainer`}>
    <Image loading="lazy" alt="SE2 logo" width={50} src={!!isDarkMode ? LogoWhite :Logo} />
    <h1>Smart Lock Vault</h1>
    <h3>By BuidlGuidl</h3>
  </div>
  }
  return (
    <WagmiConfig config={wagmiConfig}>
      <NextNProgress />
      <RainbowKitProvider
        chains={appChains.chains}
        avatar={BlockieAvatar}
      >
              <div id="modal-root" className={isDarkMode ? "dark-mode":"light-mode"}></div>
        <div className="flex flex-col min-h-screen ">
          <Header isDarkMode={isDarkMode} />
          <main className="relative flex flex-col flex-1">
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
        <Toaster />
      </RainbowKitProvider>

    </WagmiConfig>
  );
};

export default ScaffoldEthApp;
