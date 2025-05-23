import React from "react";
import { Calendar } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");

function CustomCalendar() {
  const today = dayjs();

  // Custom phần tiêu đề
  const headerRender = ({ value, onChange }) => {
    const current = value.clone();

    const changeMonth = (diff) => {
      const newValue = current.add(diff, "month");
      onChange(newValue);
    };

    return (
      <div className="flex justify-between items-center px-4 py-2">
        <button onClick={() => changeMonth(-1)} className="text-lg">
          ◀
        </button>
        <div className="text-base font-semibold">
          THÁNG {current.month() + 1} &nbsp; {current.year()}
        </div>
        <button onClick={() => changeMonth(1)} className="text-lg">
          ▶
        </button>
      </div>
    );
  };

  return (
    <div className="w-[320px] bg-[#ece8da] p-4 rounded-2xl shadow-md">
      <Calendar fullscreen={false} headerRender={headerRender} />
    </div>
  );
}

export default CustomCalendar;
