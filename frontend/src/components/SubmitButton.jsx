import React from "react";
import { Button } from "@nextui-org/react";

const SubmitButton = ({ isLoading, handleSubmit, isDisabled }) => {
  return (
    <Button
      variant="ghost"
      radius="full"
      isLoading={isLoading}
      isDisabled={isDisabled}
      className="w-full bg-white text-primary font-bold py-6 rounded-xl shadow-lg hover:bg-slate-100 transition-colors text-lg"
      onClick={handleSubmit}
    >
      Submit
    </Button>
  );
};

export default SubmitButton;
