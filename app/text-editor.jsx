"use client";
import { useState } from "react";
import Dialog from "./dialog";

const TextDisplay = () => {
  const [selectedWord, setSelectedWord] = useState(null);
  const [comments, setComments] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletedWords, setDeletedWords] = useState({});

  const text = "This is a sample text for the commenting feature.";

  // Handle word selection without opening the dialog
  const handleWordClick = (word, event) => {
    event.stopPropagation(); // Prevent event bubbling
    setSelectedWord(word);

    // Focus the main container after selecting the word
    document.getElementById("main-container")?.focus();
  };

  // Open dialog only when explicitly needed
  const handleOpenDialog = () => {
    if (selectedWord) {
      setIsDialogOpen(true);
    }
  };

  // Add or update comments
  const handleAddComment = (word, comment) => {
    setComments({ ...comments, [word]: comment });
    setIsDialogOpen(false);
  };

  // Edit an existing comment
  const handleEditComment = (word) => {
    setSelectedWord(word);
    setIsDialogOpen(true);
  };

  // Delete a comment
  const handleDeleteComment = (word) => {
    setComments((prev) => {
      const newComments = { ...prev };
      delete newComments[word];
      return newComments;
    });
  };

  // Handle deletion of words using the Delete key
  const handleKeyDown = (event) => {
    if (event.key === "Delete" && selectedWord) {
      setDeletedWords((prev) => ({ ...prev, [selectedWord]: true }));
      setComments((prev) => {
        const newComments = { ...prev };
        delete newComments[selectedWord];
        return newComments;
      });
      setSelectedWord(null);
    }
  };

  return (
    <div
      id="main-container"
      className="flex h-screen p-4"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Main Text Area */}
      <div className="flex-1 p-4 bg-black rounded-lg shadow-md">
        <p className="flex flex-wrap space-x-2">
          {text.split(" ").map((word, idx) => (
            <span
              key={idx}
              className={`cursor-pointer px-1 py-0.5 rounded-md transition-all duration-200 ${
                comments[word] ? "bg-yellow-200" : "hover:bg-gray-200"
              } ${deletedWords[word] ? "line-through text-gray-500" : ""}`}
              onClick={(event) => handleWordClick(word, event)}
              onDoubleClick={handleOpenDialog} // Open dialog only on double click
            >
              {word}
            </span>
          ))}
        </p>
      </div>

      {/* Comments Sidebar */}
      <div className="w-1/3 bg-black border-l border-gray-300 p-4 shadow-md overflow-y-auto">
        <h3 className="text-lg font-semibold mb-3">Comments</h3>
        {Object.keys(comments).length > 0 ? (
          <ul className="space-y-3">
            {Object.entries(comments).map(([word, comment]) => (
              <li key={word} className="p-3 bg-gray-100 rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <strong className="block text-blue-600">{word}:</strong>
                    <p className="text-gray-700">{comment}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditComment(word)}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteComment(word)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No comments yet. Click on a word to add one.</p>
        )}
      </div>

      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        word={selectedWord}
        onAddComment={handleAddComment}
      />
    </div>
  );
};

export default TextDisplay;
