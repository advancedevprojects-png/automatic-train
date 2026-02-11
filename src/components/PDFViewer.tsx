import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { cn } from '@/utils/cn';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  pdfData: ArrayBuffer | null;
  bookName: string;
  onClose: () => void;
}

export function PDFViewer({ pdfData, bookName, onClose }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goToPrevPage();
      if (e.key === 'ArrowRight') goToNextPage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, numPages]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (err: Error) => {
    console.error('PDF load error:', err);
    setError('Failed to load PDF. The file may be corrupted.');
    setLoading(false);
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(numPages, prev + 1));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(2, prev + 0.25));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(0.5, prev - 0.25));
  };

  if (!pdfData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <div className="text-center text-white">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white mx-auto" />
          <p>Loading PDF...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">Back</span>
          </button>
          <h1 className="max-w-md truncate text-lg font-semibold text-white">
            {bookName.replace('.pdf', '')}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 rounded-lg bg-gray-700 p-1">
            <button
              onClick={zoomOut}
              disabled={scale <= 0.5}
              className="rounded p-2 text-gray-300 transition-colors hover:bg-gray-600 hover:text-white disabled:opacity-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
              </svg>
            </button>
            <span className="min-w-[4rem] text-center text-sm text-gray-300">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={zoomIn}
              disabled={scale >= 2}
              className="rounded p-2 text-gray-300 transition-colors hover:bg-gray-600 hover:text-white disabled:opacity-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Page Info */}
          <div className="flex items-center gap-2 rounded-lg bg-gray-700 px-3 py-2 text-sm text-gray-300">
            <span>Page</span>
            <input
              type="number"
              min={1}
              max={numPages}
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= numPages) {
                  setCurrentPage(page);
                }
              }}
              className="w-12 rounded bg-gray-600 px-2 py-1 text-center text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span>of {numPages}</span>
          </div>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto">
        <div className="flex min-h-full items-start justify-center p-4">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-white">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white" />
              <p>Loading document...</p>
            </div>
          )}
          
          {error && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 rounded-full bg-red-500/20 p-4">
                <svg className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-lg font-medium text-red-400">{error}</p>
            </div>
          )}

          <Document
            file={{ data: pdfData }}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading=""
            className={cn(loading && 'hidden')}
          >
            <Page
              pageNumber={currentPage}
              scale={scale}
              className="shadow-2xl"
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </Document>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-center gap-4 border-t border-gray-700 bg-gray-800 px-4 py-3">
        <button
          onClick={goToPrevPage}
          disabled={currentPage <= 1}
          className={cn(
            'flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors',
            currentPage <= 1
              ? 'cursor-not-allowed bg-gray-700 text-gray-500'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          )}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, numPages) }, (_, i) => {
            let pageNum: number;
            if (numPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= numPages - 2) {
              pageNum = numPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={i}
                onClick={() => setCurrentPage(pageNum)}
                className={cn(
                  'h-8 w-8 rounded-lg text-sm font-medium transition-colors',
                  pageNum === currentPage
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                )}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          onClick={goToNextPage}
          disabled={currentPage >= numPages}
          className={cn(
            'flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors',
            currentPage >= numPages
              ? 'cursor-not-allowed bg-gray-700 text-gray-500'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          )}
        >
          Next
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
