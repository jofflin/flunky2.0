"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

// define props
export type NavigationLinkProps = {
  href: string;
  icon: JSX.Element;
};

export default function NavigationLink({ href, icon }: NavigationLinkProps) {
  // get current path
  const pathName = usePathname();

  // apply class to active link
  const activeLink = (route: string) => {
    if (route === pathName) {
      return "inline-flex items-center px-1 pt-1 text-sm font-medium leading-5 text-lime-200 transition duration-150 ease-in-out border-b-2 border-lime-500 focus:outline-none focus:border-lime-700";
    } else {
      return "inline-flex items-center px-1 pt-1 text-sm font-medium leading-5 text-gray-100 transition duration-150 ease-in-out border-b-2 border-transparent hover:border-lime-200 hover:text-lime-200 focus:border-lime-200 focus:text-lime-200 focus:outline-none";
    }
  };

  return (
    <Link href={href} className={activeLink(href)}>
      {icon}
    </Link>
  );
}
