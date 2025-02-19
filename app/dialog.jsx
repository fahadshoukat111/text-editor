import { useState,useEffect } from "react";

const Dialog = ({ isOpen, onClose, word, onAddComment }) => {
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (isOpen && word) {
      setComment(onAddComment[word] || ""); // Pre-fill with the existing comment if available
    }
  }, [isOpen, word]);

  const handleSave = () => {
    onAddComment(word, comment);
    setComment("");
  };

  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-black p-4 rounded shadow-lg">
        <h3 className="text-lg font-semibold">Add Comment for "{word}"</h3>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 text-black border rounded mt-2"
          placeholder="Enter your comment"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
