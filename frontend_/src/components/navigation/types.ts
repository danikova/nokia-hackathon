import { ReactElement } from "react";
import { LinkProps } from "@tanstack/react-router";

export type BreadCrumbItem = {
  title: string;
  rootPath?: string;
  [k: string]: any;
};

export type NavBarItem = {
  icon: ReactElement;
  title: string;
  rootPath: Exclude<LinkProps["to"], undefined>;
  description: string;
  shortDescription?: string;
};
