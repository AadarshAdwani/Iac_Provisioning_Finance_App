import React, { useState, useEffect } from "react";
import { object, string, number, date } from "yup";
import { toast } from "react-toastify";
import moment from "moment";
import { parseDate } from "@internationalized/date";
import { NumericFormat } from "react-number-format";

import { useDispatch, useSelector } from "react-redux";
import {
  useGetIncomeQuery,
  useAddIncomeMutation,
} from "../../features/api/apiSlices/incomeApiSlice";
import { updateLoader } from "../../features/loader/loaderSlice";

import TransactionForm from "../../components/Forms/TransactionForm";
import validateForm from "../../utils/validateForm";
import TransactionTable from "../../components/Tables/TransactionTable";

const Incomes = () => {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: parseDate(moment().format("YYYY-MM-DD")),
  });

  const [errors, setErrors] = useState({});
  const [totalIncome, setTotalIncome] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const incomeCategories = [
    { label: "Salary", value: "salary" },
    { label: "Freelance", value: "freelance" },
    { label: "Investments", value: "investments" },
    { label: "Rent", value: "rent" },
    { label: "Youtube", value: "youtube" },
    { label: "Bitcoin", value: "bitcoin" },
    { label: "Other", value: "other" },
  ];

  const validationSchema = object({
    title: string().required("Title is required."),
    amount: number().required("Amount is required.").positive(),
    description: string().required("Description is required."),
    date: date().required("Date is required."),
    category: string().required("Category is required."),
  });

  const dispatch = useDispatch();
  const [addIncome, { isLoading }] = useAddIncomeMutation();

  const { data, refetch } = useGetIncomeQuery({
    page: currentPage,
    pageSize: 10,
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    const finalValue = name === "amount" ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    validateForm(name, finalValue, validationSchema, setErrors);
  };

  const handleDateChange = (newDate) => {
    setFormData({ ...formData, date: newDate });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formattedDate = moment({
        year: formData.date.year,
        month: formData.date.month - 1,
        day: formData.date.day,
      }).format("YYYY-MM-DD");

      const res = await addIncome({
        ...formData,
        date: formattedDate,
      }).unwrap();

      toast.success(res.message || "Income added!");

      setFormData({
        title: "",
        amount: "",
        description: "",
        category: "",
        date: parseDate(moment().format("YYYY-MM-DD")),
      });

      setErrors({});
      refetch();
    } catch (err) {
      toast.error(err?.data?.error || "Something went wrong!");
    }
  };

  useEffect(() => {
    if (data) {
      setTotalIncome(data.totalIncome || 0);
      setTotalPages(data.pagination?.totalPages || 1);
    }
  }, [data]);

  const hasErrors = Object.values(errors).some((e) => e);

  return (
    <div className="flex flex-col gap-8 p-6 max-w-[1600px] mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-2xl font-bold">Incomes</h2>
          <p className="text-gray-500">Manage your revenue streams</p>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500">Total Balance</p>
          <h3 className="text-3xl font-bold text-green-600">
            $ <NumericFormat value={totalIncome} displayType="text" thousandSeparator />
          </h3>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Form */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl shadow-sm p-6 h-[calc(100vh-200px)] flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Add Income</h3>

            <TransactionForm
              button="Add Income"
              categories={incomeCategories}
              btnColor="success"
              formData={formData}
              errors={errors}
              hasErrors={hasErrors}
              isLoading={isLoading}
              handleOnChange={handleOnChange}
              handleDateChange={handleDateChange}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>

        {/* Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm p-6">
          <TransactionTable
            data={data?.incomes}
            name="income"
            rowsPerPage={10}
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Incomes;
