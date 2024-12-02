import React, { useState } from "react";

function FeedbackItem({
  username,
  content,
  rate,
  date,
  time,
  isEdit,
  onEdit,
  onDelete,
}) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [editedRate, setEditedRate] = useState(rate);

  const handleEdit = () => {
    setIsEditing(true);
    setIsMenuVisible(false);
  };

  const handleSave = () => {
    onEdit(editedContent, editedRate);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(content);
    setEditedRate(rate);
  };

  const renderStars = (currentRate, isInteractive = false) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <i
        key={star}
        className={`fa-solid fa-star cursor-pointer ${
          currentRate >= star ? "text-yellow-400" : "text-gray-300"
        }`}
        onClick={isInteractive ? () => setEditedRate(star) : undefined}
      ></i>
    ));
  };

  return (
    <div className="flex flex-row mt-2">
      <div className="detail flex-grow flex gap-x-4">
        <div className="flex items-center">
          <h4 className="font-bold">{username}</h4>
        </div>
        <div className="flex-grow">
          {isEditing ? (
            <div>
              <div className="flex items-center gap-1 my-2">
                {renderStars(editedRate, true)}
              </div>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="bg-gray-200 p-3 rounded w-full"
              />
              <div className="flex gap-x-2 mt-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p>{rate} sao</p>
              <div className="flex items-center gap-x-1 my-1">
                {renderStars(rate)}
              </div>
              <p className="mt-2">
                Ngày: {date} {time}
              </p>
              <p className="mt-3 bg-gray-200 p-3 rounded max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                Nhận xét: {content}
              </p>
            </div>
          )}
        </div>
        {isEdit && !isEditing && (
          <div
            className="relative flex items-center"
            onMouseEnter={() => setIsMenuVisible(true)}
            onMouseLeave={() => setIsMenuVisible(false)}
          >
            <button className="option flex items-center hover:cursor-pointer">
              <i className="fa-solid fa-bars"></i>
            </button>
            {isMenuVisible && (
              <div className="absolute top-[36px] right-[8px] bg-white shadow-lg rounded mt-2 p-3 z-10">
                <button
                  onClick={handleEdit}
                  className="block rounded px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete()}
                  className="block rounded px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FeedbackItem;
