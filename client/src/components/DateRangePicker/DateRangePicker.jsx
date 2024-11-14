import * as React from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Stack, Box } from "@mui/material";

export default function DateRangePicker({ setFilteredDate, filterTasks }) {
  const [startDate, setStartDate] = React.useState(dayjs("2024-10-01"));
  const [endDate, setEndDate] = React.useState(dayjs("2024-10-05"));

  const handleDateSubmit = () => {
    alert(startDate)
    setFilteredDate({startDate, endDate});
    filterTasks();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          maxWidth: 300,
          backgroundColor: "#ebeeee",
          borderRadius: "10px",
          margin: "auto",
          padding: 2,
        }}
      >
        <Stack spacing={3}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            minDate={startDate}
          />
        </Stack>
        <div className="flex justify-around">
          <button
            className={`rounded flex gap-1 items-center py-2 mt-3 px-2 transition duration-150 text-slate-500 bg-[#fff] hover:bg-maingreen hover:shadow-md outline-none  shadow-lg`}
          >
            <p className="hidden md:block uppercase text-xs font-semibold">
              Cancel
            </p>
          </button>
          <button
            onClick={handleDateSubmit}
            className={`rounded flex gap-1 items-center py-2 mt-3 px-2 transition duration-150 text-slate-500 bg-[#ffffffcd] hover:bg-maingreen hover:shadow-md outline-none bg-maingreen shadow-lg`}
          >
            <p className="hidden md:block uppercase text-xs font-semibold">
              Filter
            </p>
          </button>
        </div>
      </Box>
    </LocalizationProvider>
  );
}
