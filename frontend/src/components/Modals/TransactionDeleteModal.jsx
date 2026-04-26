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
import { toast } from "react-toastify";

import { Delete } from "../../utils/Icons";
import { useDeleteIncomeMutation } from "../../features/api/apiSlices/incomeApiSlice";
import { useDeleteExpenseMutation } from "../../features/api/apiSlices/expenseApiSlice";
import {
  closeModal,
  setRefetch,
} from "../../features/TransactionModals/deleteModal";
import { updateLoader } from "../../features/loader/loaderSlice";

const TransactionDeleteModal = () => {
  const data = useSelector((state) => state.deleteTransactionModal);
  const { isOpen, _id, title, type } = data;
  const dispatch = useDispatch();

  const mutationHook =
    type === "income" ? useDeleteIncomeMutation : useDeleteExpenseMutation;
  const [deleteTransaction, { isLoading }] = mutationHook();

  const handleDelete = async (e) => {
    try {
      e.preventDefault();
      dispatch(updateLoader(40));
      const res = await deleteTransaction(_id).unwrap();

      dispatch(updateLoader(60));
      await dispatch(setRefetch(true));
      await dispatch(closeModal());
      toast.success(res.message || `${type.charAt(0).toUpperCase() + type.slice(1)} deleted!`);
    } catch (error) {
      toast.error(error?.data?.error || "Unexpected Internal Server Error!");
    } finally {
      await dispatch(setRefetch(false));
      dispatch(updateLoader(100));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => dispatch(closeModal())}
      placement="center"
      backdrop="blur"
      classNames={{
        base: "bg-white rounded-3xl border border-slate-100 p-2",
        header: "pt-6 px-6",
        body: "pb-6 px-6",
        footer: "bg-slate-50/50 rounded-b-3xl px-6 py-4 mt-2",
      }}
    >
      <ModalContent>
        <>
          <ModalHeader>
            <div className="flex flex-col gap-1">
              <h4 className="text-xl font-bold text-slate-900 leading-tight">
                Delete {title}?
              </h4>
              <p className="text-xs font-bold text-rose-500 uppercase tracking-widest">
                Permanent Action
              </p>
            </div>
          </ModalHeader>
          <ModalBody>
            <p className="text-slate-600 leading-relaxed">
              This will permanently remove this <span className="font-bold text-slate-900">{type}</span> entry. 
              Data recovery is not possible once this process is complete.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={() => dispatch(closeModal())}
              className="text-slate-500 font-bold px-6"
            >
              No, Keep it
            </Button>
            <Button
              className="bg-rose-500 text-white font-bold px-8 shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all active:scale-95"
              onClick={handleDelete}
              isLoading={isLoading}
              endContent={<Delete className="size-4" />}
            >
              Delete Permanently
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default TransactionDeleteModal;