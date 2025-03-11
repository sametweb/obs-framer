import { FolderOpen, LucideProps, Proportions, Type } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type NavItem = {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  label: string;
  path: string;
};

export const browseRoute: NavItem = {
  icon: FolderOpen,
  label: "Browse",
  path: "/browse",
};
export const editorRoute: NavItem = {
  icon: Proportions,
  label: "Editor",
  path: "/editor",
};
export const textRoute: NavItem = { icon: Type, label: "Text", path: "/text" };
