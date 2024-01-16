import SequenceControllerComponent from "./SequenceController";
import React, { useState, memo } from "react";
import { SequenceControllerProvider } from "./Context/SequenceContext";
import { GlobalProvider } from "@Context/Global/GlobalProvider";


export default function SequenceBuilder() {

  return (
    <GlobalProvider>
      <SequenceControllerProvider>
        <SequenceControllerComponent />
      </SequenceControllerProvider>
    </GlobalProvider>
  )


}