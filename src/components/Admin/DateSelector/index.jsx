import React from "react";

function DateSelector({ date, onDateChange, tickets }) {
  return (
    <div className="bg-gray-300 p-4 shadow rounded">
      <h2 className="text-lg font-semibold mb-4">Chọn Thời Gian</h2>
      <input
        type="date"
        value={date}
        onChange={(e) => onDateChange(e.target.value)}
        className="border p-2 rounded"
      />
      <ul className="mt-4">
        {tickets.map((ticket) => (
          <li key={ticket.id} className="border-b py-2">
            {ticket.name} - {ticket.date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DateSelector;
