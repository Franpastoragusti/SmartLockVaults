import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

// const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
//   const router = useRouter();
//   const isActive = router.pathname === href;
//   return (
//     <Link href={href} passHref className={`${styles.navLink} ${isActive ? styles.active : ""}`}>
//       {children}
//     </Link>
//   );
// };

/**
 * Site header
 */
export const Header = ({isDarkMode}:{isDarkMode:boolean}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );
  const router = useRouter();
  const handleButtonClick = () => {
    router.push(`/create`);
  };
  const navLinks = (
    <>
      {/* <li>
        <NavLink href="/myVaults">My Vaults</NavLink>
      </li>
      <li>
        <NavLink href="/explore">Explore</NavLink>
      </li> */}
    </>
  );

  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 px-0 sm:px-2">
      <div className="navbar-start w-auto lg:w-1/2">
        {/* <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <>
              <ul
                tabIndex={0}
                className="menu menu-compact dropdown-content mt-3 p-2 bg-base-100 rounded-box w-52"
                onClick={() => {
                  setIsDrawerOpen(false);
                }}
              >
                {navLinks}
              </ul>
              <Distributton
                isLoading={false}
                disabled={false}
                label={"Create"}
                action={handleButtonClick}
              ></Distributton>
            </>
          )}
        </div> */}
        <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6">
          <div className="flex relative w-10 h-10">
            <Image alt="SE2 logo" className="cursor-pointer" fill src={isDarkMode ? "/logo.svg": "/logo-white.svg"}/>
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-tight">Smart Lock Vault</span>
            <span className="text-xs">By BuidlGuidl</span>
          </div>
        </Link>
      </div>
      <div className="navbar-end flex-grow mr-4">
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">{navLinks}</ul>
        {/* <Distributton
          isLoading={false}
          disabled={false}
          label={"Create"}
          action={handleButtonClick}
        ></Distributton> */}
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>
    </div>
  );
};
