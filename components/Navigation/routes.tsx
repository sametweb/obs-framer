import { FolderOpen, Home, LucideProps, Proportions, Type } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type NavItem = {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  label: string;
  path: string;
};

export const homeRoute: NavItem = { icon: Home, label: "Home", path: "/" };
export const projectsRoute: NavItem = {
  icon: FolderOpen,
  label: "Projects",
  path: "/projects",
};
export const frameRoute: NavItem = {
  icon: Proportions,
  label: "Frame",
  path: "/frame",
};
export const textRoute: NavItem = { icon: Type, label: "Text", path: "/text" };
