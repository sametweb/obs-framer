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
export const myFramesRoute: NavItem = {
  icon: FolderOpen,
  label: "My frames",
  path: "/my-frames",
};
export const editorRoute: NavItem = {
  icon: Proportions,
  label: "Editor",
  path: "/editor",
};
export const textRoute: NavItem = { icon: Type, label: "Text", path: "/text" };
