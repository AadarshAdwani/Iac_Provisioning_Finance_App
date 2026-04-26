import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import { useLogoutMutation } from "../../features/api/apiSlices/userApiSlice";
import { closeModal } from "../../features/logoutModal/logoutModalSlice";
import { resetCredentials } from "../../features/authenticate/authSlice";
import { updateLoader } from "../../features/loader/loaderSlice";
import { Logout } from "../../utils/Icons";

const LogoutModal = () => {
  const isOpen = useSelector((state) => state.logoutModal.isOpen);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async (e) => {
    try {
      e.preventDefault();
      dispatch(updateLoader(40));
      const res = await logout().unwrap();
      await dispatch(resetCredentials());

      dispatch(updateLoader(60));
      await dispatch(closeModal());
      toast.success(res.message || "Logged out successfully!");

      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.error || "Unexpected Internal Server Error!");
    } finally {
      dispatch(updateLoader(100));
    }
  };

  return (
    <Modal
        isOpen={isOpen}
        onClose={() => dispatch(closeModal())}
        placement="center"
        backdrop="blur"
        scrollBehavior="inside"   // ⭐ IMPORTANT
        size="md"                 // keeps modal within viewport

      // Custom classNames to style the NextUI slots
      classNames={{
        base: "bg-white rounded-2xl border border-slate-200 shadow-2xl",
        header: "border-b border-slate-100 pb-4",
        footer: "border-t border-slate-100 pt-4",
        closeButton: "hover:bg-slate-100 transition-colors",
      }}
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">
            <h4 className="text-2xl font-bold text-slate-900">
              Logout Confirmation
            </h4>
          </ModalHeader>
          <ModalBody className="py-6">
            <p className="text-slate-600 leading-relaxed">
              Are you sure you want to log out? Logging out will end your
              current session and you will need to sign in again to access your
              account.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={() => dispatch(closeModal())}
              className="text-slate-600 font-semibold px-6"
            >
              Stay Logged In
            </Button>
            <Button
              // Using your primary blue color
              className="bg-primary text-white font-bold px-8 shadow-md hover:opacity-90 transition-opacity"
              onClick={handleLogout}
              endContent={<Logout className="size-4" />}
              isLoading={isLoading}
            >
              Yes, Logout
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default LogoutModal;