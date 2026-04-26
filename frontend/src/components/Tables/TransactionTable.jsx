import React from "react";
import moment from "moment";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Pagination,
  Chip,
  Spinner,
} from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { openModal as deleteModal } from "../../features/TransactionModals/deleteModal";
import { openModal as viewAndUpdateModal } from "../../features/TransactionModals/viewAndUpdateModal";
import { EyeOutline as Eye, Edit, Delete } from "../../utils/Icons";

/** ✅ Default safe color map (prevents refresh crash) */
const defaultChipColorMap = {
  salary: "success",
  freelance: "default",
  investments: "success",
  rent: "warning",
  youtube: "danger",
  bitcoin: "warning",
  other: "default",
};

const TransactionTable = ({
  data,
  name,
  isLoading,
  setCurrentPage,
  totalPages,
  currentPage,
  chipColorMap = defaultChipColorMap, // ✅ fallback if not passed
}) => {
  const dispatch = useDispatch();

  /** ✅ Ensure safe array */
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="w-full h-full flex justify-center">
      <Table
        aria-label="Transactions table"
        bottomContent={
          totalPages > 1 ? (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={currentPage}
                total={totalPages}
                onChange={(page) => setCurrentPage(page)}
              />
            </div>
          ) : null
        }
        classNames={{
          base: "pb-12",
          wrapper: "h-full px-8 box-shadow-second",
          table: safeData.length === 0 ? "h-full" : "",
        }}
      >
        <TableHeader>
          <TableColumn className="capitalize">{name}</TableColumn>
          <TableColumn>Amount</TableColumn>
          <TableColumn>Category</TableColumn>
          <TableColumn>Description</TableColumn>
          <TableColumn>Date</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>

        <TableBody
          items={safeData}
          loadingContent={<Spinner color="primary" size="lg" />}
          loadingState={isLoading ? "loading" : "idle"}
          emptyContent={
            !isLoading
              ? `No ${name}s to display. Please add some ${name}s!`
              : ""
          }
        >
          {safeData.map(
            ({ title, amount, category, description, date, _id }, index) => (
              <TableRow key={_id || index}>
                {/* Title */}
                <TableCell className="text-primary font-calSans tracking-wider capitalize">
                  {title || "-"}
                </TableCell>

                {/* Amount */}
                <TableCell>${amount ?? 0}</TableCell>

                {/* Category */}
                <TableCell>
                  <Chip
                    className="capitalize"
                    color={chipColorMap?.[category] || "default"} // ✅ SAFE
                    size="sm"
                    variant="flat"
                  >
                    {category || "N/A"}
                  </Chip>
                </TableCell>

                {/* Description */}
                <TableCell
                  className={`transition-all ${
                    description?.length > 20
                      ? "hover:text-gray-400 hover:cursor-pointer"
                      : ""
                  }`}
                  onClick={() => {
                    if (description?.length > 20) {
                      dispatch(
                        viewAndUpdateModal({
                          transaction: {
                            title,
                            amount,
                            category,
                            description,
                            date,
                          },
                          _id,
                          type: name,
                          isDisabled: true,
                        })
                      );
                    }
                  }}
                >
                  {description
                    ? description.length > 20
                      ? `${description.slice(0, 20)}...`
                      : description
                    : "-"}
                </TableCell>

                {/* Date */}
                <TableCell>
                  {date ? moment(date).format("YYYY-MM-DD") : "-"}
                </TableCell>

                {/* Actions */}
                <TableCell className="relative flex items-center gap-2">
                  {/* View */}
                  <Tooltip content="View More">
                    <span
                      className="text-lg text-default-400 cursor-pointer active:opacity-50"
                      onClick={() =>
                        dispatch(
                          viewAndUpdateModal({
                            transaction: {
                              title,
                              amount,
                              category,
                              description,
                              date,
                            },
                            _id,
                            type: name,
                            isDisabled: true,
                          })
                        )
                      }
                    >
                      <Eye />
                    </span>
                  </Tooltip>

                  {/* Edit */}
                  <Tooltip content="Edit">
                    <span
                      className="text-lg text-default-400 cursor-pointer active:opacity-50"
                      onClick={() =>
                        dispatch(
                          viewAndUpdateModal({
                            transaction: {
                              _id,
                              title,
                              amount,
                              category,
                              description,
                              date,
                            },
                            _id,
                            type: name,
                          })
                        )
                      }
                    >
                      <Edit />
                    </span>
                  </Tooltip>

                  {/* Delete */}
                  <Tooltip color="danger" content="Delete">
                    <span
                      className="text-lg text-danger cursor-pointer active:opacity-50"
                      onClick={() =>
                        dispatch(deleteModal({ title, _id, type: name }))
                      }
                    >
                      <Delete />
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;
