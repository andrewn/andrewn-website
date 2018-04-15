//@flow
import React from "react";
import { all } from "../models/images";

let context = null;

export const createContext = async () => {
  if (!context) {
    context = React.createContext(await all());
  }

  return context;
};

export default () => context;
