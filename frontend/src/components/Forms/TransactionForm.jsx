import React from "react";
import { Input, Button, Select, SelectItem, DatePicker } from "@nextui-org/react";
import { FaPlus } from "react-icons/fa";

const TransactionForm = ({
  button = "Submit",
  categories = [],
  btnColor = "primary",
  formData = {},
  errors = {},
  hasErrors = false,
  isLoading = false,
  handleOnChange,
  handleDateChange,
  handleSubmit,
}) => {
  /** ✅ Safe fallback values (prevents undefined crashes) */
  const safeForm = {
    title: formData.title || "",
    amount: formData.amount ?? "",
    category: formData.category || "",
    date: formData.date || null,
    description: formData.description || "",
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      {/* Scrollable Inputs */}
      <div className="flex flex-col gap-6 overflow-y-auto pr-2 pb-4">

        {/* Title */}
        <Input
          name="title"
          label="Title"
          placeholder="Enter transaction title"
          variant="bordered"
          size="lg"
          value={safeForm.title}
          onChange={handleOnChange}
          isInvalid={!!errors.title}
          errorMessage={errors.title}
        />

        {/* Amount */}
        <Input
          name="amount"
          type="number"
          label="Amount"
          placeholder="0.00"
          variant="bordered"
          size="lg"
          value={safeForm.amount}
          onChange={(e) => {
            /** ✅ Always send number to parent */
            const value = e.target.value;
            handleOnChange({
              target: {
                name: "amount",
                value: value === "" ? "" : Number(value),
              },
            });
          }}
          isInvalid={!!errors.amount}
          errorMessage={errors.amount}
        />

        {/* Category */}
        <Select
          label="Category"
          placeholder="Select category"
          variant="bordered"
          size="lg"
          selectedKeys={safeForm.category ? [safeForm.category] : []}
          isInvalid={!!errors.category}
          errorMessage={errors.category}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] || "";
            handleOnChange({
              target: { name: "category", value },
            });
          }}
        >
          {categories.map((item) => (
            <SelectItem key={item.value}>{item.label}</SelectItem>
          ))}
        </Select>

        {/* Date */}
        <DatePicker
          label="Date"
          variant="bordered"
          size="lg"
          value={safeForm.date}
          onChange={handleDateChange}
          isInvalid={!!errors.date}
          errorMessage={errors.date}
        />

        {/* Description */}
        <Input
          name="description"
          label="Description"
          placeholder="Add some details..."
          variant="bordered"
          size="lg"
          value={safeForm.description}
          onChange={handleOnChange}
          isInvalid={!!errors.description}
          errorMessage={errors.description}
        />
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t mt-auto">
        <Button
          type="submit"
          color={btnColor}
          size="lg"
          isLoading={isLoading}
          isDisabled={hasErrors || isLoading}
          className="w-full font-semibold"
          startContent={!isLoading && <FaPlus />}
        >
          {isLoading ? "Processing..." : button}
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;
