import React from "react";
import { Button } from "@nextui-org/react";
import OtpInput from "../Inputs/OtpInput";

const OtpForm = ({
  otp,
  email,
  setOtp,
  handleOtpSubmit,
  verifyOtpLoading,
  resendOtp,
  countdown,
}) => {
  return (
    /* We use a flex container here to manage the internal spacing 
       of the OTP elements specifically. */
    <div className="flex flex-col items-center w-full gap-y-6">
      
      <div className="w-full flex justify-center">
        <OtpInput
          otp={otp}
          email={email}
          setOtp={setOtp}
          onSubmit={handleOtpSubmit}
        />
      </div>

      <Button
        variant="solid" // Changed to solid for better visibility on the blue background
        radius="full"
        isLoading={verifyOtpLoading}
        isDisabled={!otp || otp.length !== 4}
        /* Adjusted classes for Tailwind v4 and better contrast */
        className="bg-white text-primary font-bold text-lg w-full h-12 hover:bg-slate-100 transition-colors shadow-lg"
        onClick={handleOtpSubmit}
      >
        Verify OTP
      </Button>

      <div className="text-center font-medium">
        <p className="text-white/90 text-sm sm:text-base">
          Didn't receive OTP?
          {countdown === 0 ? (
            <button 
              onClick={resendOtp} 
              className="ml-2 text-white underline hover:text-secondary-200 transition-all cursor-pointer bg-transparent border-none"
            >
              Resend OTP
            </button>
          ) : (
            <span className="ml-2 text-white/70 italic">
              Resend in {countdown}s
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default OtpForm;