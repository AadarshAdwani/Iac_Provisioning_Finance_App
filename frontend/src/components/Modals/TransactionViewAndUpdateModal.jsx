import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { object, string, number, date } from "yup";
import moment from "moment";
import { parseDate } from "@internationalized/date";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  DatePicker,
} from "@nextui-org/react";

import { Title, Category, Amount, Edit } from "../../utils/Icons";
import {
  closeModal,
  setRefetch,
} from "../../features/TransactionModals/viewAndUpdateModal";
import { updateLoader } from "../../features/loader/loaderSlice";
import { useUpdateExpenseMutation } from "../../features/api/apiSlices/expenseApiSlice";
import { useUpdateIncomeMutation } from "../../features/api/apiSlices/incomeApiSlice";
import validateForm from "../../utils/validateForm";

const TransactionViewAndUpdateModal = () => {
  const data = useSelector((state) => state.transactionViewAndUpdateModal);
  const {
    isOpen,
    isDisabled,
    transaction: initialTransaction,
    type,
    _id,
  } = data;
  const [mainTitle, setMainTitle] = useState("");
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: parseDate(moment().format("YYYY-MM-DD")),
  });

  const [errors, setErrors] = useState({});

  const incomeCategories = [
    { label: "Salary", value: "salary" },
    { label: "Freelance", value: "freelance" },
    { label: "Investments", value: "investments" },
    { label: "Rent", value: "rent" },
    { label: "Youtube", value: "youtube" },
    { label: "Bitcoin", value: "bitcoin" },
    { label: "Other", value: "other" },
  ];
  const expenseCategories = [
    { label: "Groceries", value: "groceries" },
    { label: "Utilities", value: "utilities" },
    { label: "Transportation", value: "transportation" },
    { label: "Healthcare", value: "healthcare" },
    { label: "Entertainment", value: "entertainment" },
    { label: "Clothing", value: "clothing" },
    { label: "Other", value: "other" },
  ];

  const validationSchema = object({
    title: string()
      .required("Title is required.")
      .min(5, "Title must be atleast 5 characters long.")
      .max(15, "Title should not be more than 15 characters."),
    amount: number()
      .typeError("Amount must be a number")
      .required("Amount is required.")
      .positive("Amount must be positive."),
    description: string()
      .required("Description is required.")
      .min(5, "Description must be atleast 5 characters long.")
      .max(80, "Description should not be more than 80 characters."),
    date: date().required("Date is required."),
    category: string()
      .required("Category is required.")
  });

  const handleOnChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    validateForm(e.target.name, e.target.value, validationSchema, setErrors);
  };

  const handleDateChange = (newDate) => {
    setFormData({ ...formData, date: newDate });
  };

  const { title, amount, category, description, date: transactionDate } = formData;
  const mutationHook = type === "income" ? useUpdateIncomeMutation : useUpdateExpenseMutation;
  const [updateTransaction, { isLoading }] = mutationHook();

  const handleUpdate = async (e) => {
    try {
      e.preventDefault();
      const initialTransactionDate = moment(initialTransaction?.date).format("YYYY-MM-DD");
      const formattedDate = moment({
        year: formData.date.year,
        month: formData.date.month - 1,
        day: formData.date.day,
      }).format("YYYY-MM-DD");
      
      let updatedFormData = { ...formData, date: formattedDate };

      if (JSON.stringify(updatedFormData) === JSON.stringify({ ...initialTransaction, date: initialTransactionDate })) {
        toast.error("No changes detected.");
        return;
      }

      dispatch(updateLoader(40));
      const res = await updateTransaction({ _id, data: updatedFormData }).unwrap();

      dispatch(updateLoader(60));
      dispatch(setRefetch(true));
      dispatch(closeModal());
      toast.success(res.message || "Transaction updated!");
    } catch (error) {
      toast.error(error?.data?.error || "Unexpected Error!");
    } finally {
      dispatch(setRefetch(false));
      dispatch(updateLoader(100));
    }
  };

useEffect(() => {
  if (initialTransaction && initialTransaction.date) {
    try {
      // Ensure the date is in YYYY-MM-DD format before parsing
      const formattedDate = moment(initialTransaction.date).format("YYYY-MM-DD");
      
      setFormData({
        ...initialTransaction,
        date: parseDate(formattedDate),
      });
      setMainTitle(initialTransaction.title);
    } catch (error) {
      console.error("Date parsing failed:", error);
      // Fallback to today if parsing fails
      setFormData({
        ...initialTransaction,
        date: parseDate(moment().format("YYYY-MM-DD")),
      });
    }
  }
}, [initialTransaction]);
  const hasErrors = Object.values(errors).some((error) => !!error);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => dispatch(closeModal())}
      placement="center"
      backdrop="blur"
      size="lg"
      classNames={{
        base: "bg-white rounded-3xl p-2",
        header: "border-b border-slate-100",
        footer: "border-t border-slate-100",
      }}
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1 py-6">
            <h4 className="text-2xl font-bold text-slate-900 capitalize">
              {isDisabled ? "Transaction Details" : `Edit ${mainTitle}`}
            </h4>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
                {type} Management
            </p>
          </ModalHeader>
          
          <ModalBody className="gap-y-6 py-8">
            <Input
              label="Title"
              name="title"
              labelPlacement="outside"
              placeholder="e.g. Monthly Rent"
              isDisabled={isDisabled}
              value={title}
              onChange={handleOnChange}
              isInvalid={!!errors.title}
              errorMessage={errors?.title}
              startContent={<Title className="text-slate-400" />}
              classNames={{
                label: "font-bold text-slate-700",
                inputWrapper: "bg-slate-50 border-slate-200 hover:border-primary transition-colors",
              }}
            />

            <Input
              type="number"
              label="Amount"
              name="amount"
              labelPlacement="outside"
              placeholder="0.00"
              isDisabled={isDisabled}
              value={amount}
              onChange={handleOnChange}
              isInvalid={!!errors.amount}
              errorMessage={errors?.amount}
              startContent={<Amount className="text-slate-400" />}
              endContent={<span className="text-slate-400 text-sm font-bold">USD</span>}
              classNames={{
                label: "font-bold text-slate-700",
                inputWrapper: "bg-slate-50 border-slate-200",
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">Category</label>
                {isDisabled ? (
                  <Input
                    name="category"
                    isDisabled
                    value={category}
                    startContent={<Category className="text-slate-400" />}
                    classNames={{ inputWrapper: "bg-slate-50" }}
                  />
                ) : (
                  <Select
                    name="category"
                    placeholder="Select category"
                    selectedKeys={[category]}
                    onChange={handleOnChange}
                    isInvalid={!!errors.category}
                    startContent={<Category className="text-slate-400" />}
                    classNames={{ trigger: "bg-slate-50 border-slate-200" }}
                  >
                    {(type === "income" ? incomeCategories : expenseCategories).map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              </div>

              <div className="flex flex-col gap-2">
                 <label className="text-sm font-bold text-slate-700">Date</label>
                 <DatePicker 
                      // ... other props
                      showMonthAndYearPickers
                      popoverProps={{
                        placement: "bottom",
                        triggerScaleOnOpen: false,
                        offset: 10,
                      }}
                    />
              </div>
            </div>

            <Textarea
              name="description"
              label="Description"
              labelPlacement="outside"
              placeholder="Add more details about this transaction..."
              isDisabled={isDisabled}
              maxRows={3}
              value={description}
              onChange={handleOnChange}
              isInvalid={!!errors.description}
              errorMessage={errors?.description}
              classNames={{
                label: "font-bold text-slate-700",
                inputWrapper: "bg-slate-50",
              }}
            />
          </ModalBody>

          <ModalFooter className="py-6">
            <Button
              variant="light"
              onPress={() => dispatch(closeModal())}
              className="text-slate-500 font-bold px-6"
            >
              {isDisabled ? "Close" : "Discard"}
            </Button>
            {!isDisabled && (
              <Button
                className={`text-white font-bold px-8 shadow-lg transition-transform active:scale-95 ${
                    type === "income" ? "bg-emerald-500 shadow-emerald-200" : "bg-rose-500 shadow-rose-200"
                }`}
                endContent={<Edit className="size-4" />}
                isLoading={isLoading}
                onClick={handleUpdate}
                isDisabled={!title || !amount || !category || hasErrors}
              >
                Save {type === "income" ? "Income" : "Expense"}
              </Button>
            )}
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default TransactionViewAndUpdateModal;