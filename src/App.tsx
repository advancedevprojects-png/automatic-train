import { useState, useCallback } from 'react';
import { useBooks } from '@/hooks/useBooks';
import { UploadBook } from '@/components/UploadBook';
import { BookCard } from '@/components/BookCard';
import { PDFViewer } from '@/components/PDFViewer';
import { SizeFilter } from '@/components/SizeFilter';
import { EmptyState } from '@/components/EmptyState';
import { SizeLimit } from '@/types';

export function App() {
  const [sizeLimit, setSizeLimit] = useState<SizeLimit>(5);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);
  const [selectedBookName, setSelectedBookName] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const { books, loading, uploadBook, getBookData, deleteBook, filterBooksBySize } = useBooks();

  const filteredBooks = filterBooksBySize(sizeLimit);

  const handlePreview = useCallback(
    async (id: string) => {
      const book = books.find((b) => b.id === id);
      if (book) {
        setSelectedBookName(book.name);
        setSelectedBookId(id);
        const data = await getBookData(id);
        setPdfData(data);
      }
    },
    [books, getBookData]
  );

  const handleClosePreview = useCallback(() => {
    setSelectedBookId(null);
    setPdfData(null);
    setSelectedBookName('');
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      if (window.confirm('Are you sure you want to delete this book?')) {
        setDeletingId(id);
        await deleteBook(id);
        setDeletingId(null);
      }
    },
    [deleteBook]
  );

  if (selectedBookId) {
    return <PDFViewer pdfData={pdfData} bookName={selectedBookName} onClose={handleClosePreview} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">BookPreview</h1>
                <p className="text-xs text-gray-500">Secure PDF Reader</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <SizeFilter currentLimit={sizeLimit} onChange={setSizeLimit} />
              <button
                onClick={() => setShowUpload(!showUpload)}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-indigo-300"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Upload Book
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Security Info Banner */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 p-4 shadow-lg shadow-emerald-200/50">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="text-white">
              <h2 className="font-semibold">Secure Local Storage</h2>
              <p className="mt-1 text-sm text-emerald-100">
                All your books are stored securely in your browser's IndexedDB. Your files never leave your device
                and are protected by browser-level encryption.
              </p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        {showUpload && (
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Upload New Book</h2>
              <button
                onClick={() => setShowUpload(false)}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <UploadBook onUpload={uploadBook} sizeLimit={sizeLimit} />
          </div>
        )}

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl bg-white p-4 shadow-md">
            <div className="text-2xl font-bold text-indigo-600">{books.length}</div>
            <div className="text-sm text-gray-500">Total Books</div>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-md">
            <div className="text-2xl font-bold text-purple-600">{filteredBooks.length}</div>
            <div className="text-sm text-gray-500">Under {sizeLimit}MB</div>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-md">
            <div className="text-2xl font-bold text-emerald-600">
              {(books.reduce((acc, b) => acc + b.size, 0) / (1024 * 1024)).toFixed(1)}
            </div>
            <div className="text-sm text-gray-500">Total MB</div>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-md">
            <div className="text-2xl font-bold text-amber-600">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="text-sm text-gray-500">Secure Storage</div>
          </div>
        </div>

        {/* Books Grid */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Your Library
            <span className="ml-2 text-sm font-normal text-gray-500">
              (Showing books under {sizeLimit}MB)
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          </div>
        ) : filteredBooks.length === 0 ? (
          <EmptyState sizeLimit={sizeLimit} />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onPreview={handlePreview}
                onDelete={handleDelete}
                isDeleting={deletingId === book.id}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500">
            BookPreview — Secure, fast, and private PDF reading. All data stored locally.
          </p>
        </div>
      </footer>
    </div>
  );
}
