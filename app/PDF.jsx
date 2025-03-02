// components/PdfViewer.js
"use client"; // Mark as a Client Component

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Use the local worker script
pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
const PdfViewer = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedText, setSelectedText] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState({ x: 0, y: 0 });
  const [selectedFile, setSelectedFile] = useState("/r.pdf"); // Default PDF file
  const [error, setError] = useState(null);

  const files = [
    { name: "Sample PDF 1", url: "/r.pdf" },
    { name: "Sample PDF 2", url: "/sample2.pdf" },
  ];

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setError(null);
  };

  const onDocumentLoadError = (error) => {
    setError("Failed to load the PDF file. Please check the file path and try again.");
    console.error(error);
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    if (selectedText) {
      setSelectedText(selectedText);
      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      if (rect) {
        setSelectedPosition({ x: rect.right, y: rect.top });
        setIsDialogOpen(true);
      }
    }
  };

  const handleAddComment = () => {
    if (comment) {
      setComments([...comments, { text: selectedText, comment, position: selectedPosition }]);
      setComment("");
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4 h-screen p-4">
      {/* File List Column */}
      <div className="col-span-1 bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Files</h2>
        <ul>
          {files.map((file, index) => (
            <li
              key={index}
              className={`p-2 cursor-pointer ${
                selectedFile === file.url ? "bg-blue-100" : "hover:bg-gray-200"
              } rounded-md`}
              onClick={() => setSelectedFile(file.url)}
            >
              {file.name}
            </li>
          ))}
        </ul>
      </div>

      {/* PDF Content Column */}
      <div className="col-span-1 bg-white p-4 rounded-lg overflow-auto">
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <Document
            file={selectedFile}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
          >
            <Page pageNumber={pageNumber} onMouseUp={handleTextSelection}>
              {/* Render comments as overlays */}
              {comments.map((cmt, index) => (
                <div
                  key={index}
                  style={{
                    position: "absolute",
                    left: `${cmt.position.x}px`,
                    top: `${cmt.position.y}px`,
                    backgroundColor: "yellow",
                    padding: "2px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setSelectedText(cmt.text);
                    setComment(cmt.comment);
                    setIsDialogOpen(true);
                  }}
                >
                  {cmt.text}
                </div>
              ))}
            </Page>
          </Document>
        )}
      </div>

      {/* Comments List Column */}
      <div className="col-span-1 bg-gray-100 p-4 rounded-lg overflow-auto">
        <h2 className="text-lg font-semibold mb-4">Comments</h2>
        <ul>
          {comments.map((cmt, index) => (
            <li key={index} className="mb-2 p-2 bg-white rounded-md">
              <p className="font-semibold">"{cmt.text}"</p>
              <p>{cmt.comment}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Comment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a Comment</DialogTitle>
          </DialogHeader>
          <div>
            <p className="mb-2">
              <strong>Selected Text:</strong> {selectedText}
            </p>
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter your comment..."
            />
          </div>
          <DialogFooter>
            <Button onClick={handleAddComment}>Save Comment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PdfViewer;