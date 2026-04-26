import React from "react";
import { Avatar } from "@nextui-org/react";
import { Link } from "react-router-dom";

import avatar from "../../assets/avatar.webp";

const UserAuthForm = ({
  title,
  imageSrc,
  imageTitle,
  alt,
  form,
  footer,
  footerLink,
  footerLinkPath,
}) => {
  return (
    /* Changed h-[85%] to min-h-[500px] and removed sm:size-[80%] 
       to allow the container to grow with the form content.
    */
    <div className="w-full flex flex-col lg:flex-row items-stretch box-shadow rounded-3xl overflow-visible bg-white">
      
      {/* Left Side: Illustration - Visible only on Desktop */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 p-8 border-r border-slate-100">
        <h4 className="text-3xl xl:text-4xl text-primary relative animateBottom mb-8 text-center">
          {imageTitle}
        </h4>
        <img src={imageSrc} alt={alt} className="w-full max-w-[320px] object-contain" />
      </div>

      {/* Right Side: Form Container */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-10 sm:p-14 bg-primary rounded-3xl lg:rounded-l-none relative mt-10 lg:mt-0">
        
        {/* Avatar: Adjusted positioning to ensure it doesn't clip badly */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Avatar
            src={avatar}
            name="Avatar"
            className="w-20 h-20 sm:w-24 sm:h-24 text-lg"
            isBordered
            color="secondary"
            showFallback
          />
        </div>

        {/* Title */}
        <h3 className="text-white text-2xl md:text-3xl xl:text-4xl mb-8 font-bold text-center">
          {title}
        </h3>

        {/* Form Slot: The gap-y-5 from Login.jsx will now work perfectly here */}
        <div className="w-full max-w-[350px]">
          {form}
        </div>

        {/* Footer */}
        {footer && (
          <div className="mt-8 text-center">
            <span className="text-sm sm:text-base text-white/90">
              {footer}
            </span>
            <Link 
              to={footerLinkPath} 
              className="ml-2 text-white font-bold underline hover:text-secondary transition-colors"
            >
              {footerLink}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAuthForm;