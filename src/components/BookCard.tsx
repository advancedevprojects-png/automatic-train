import { BookMetadata } from '@/types';
import { cn } from '@/utils/cn';

interface BookCardProps {
  book: BookMetadata;
  onPreview: (id: string) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function BookCard({ book, onPreview, onDelete, isDeleting }: BookCardProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSizeColor = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    if (mb <= 1) return 'bg-green-100 text-green-700';
    if (mb <= 3) return 'bg-yellow-100 text-yellow-700';
    return 'bg-orange-100 text-orange-700';
  };

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl',
        isDeleting && 'pointer-events-none opacity-50'
      )}
    >
      {/* Book Cover Placeholder */}
      <div className="relative aspect-[3/4] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
        <div className="flex h-full flex-col items-center justify-center text-white">
          <svg
            className="mb-3 h-16 w-16 opacity-80"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
            />
          </svg>
          <span className="text-xs font-medium uppercase tracking-wider opacity-75">PDF</span>
        </div>
        
        {/* Size Badge */}
        <div
          className={cn(
            'absolute right-2 top-2 rounded-full px-2 py-1 text-xs font-semibold',
            getSizeColor(book.size)
          )}
        >
          {formatFileSize(book.size)}
        </div>
      </div>

      {/* Book Info */}
      <div className="p-4">
        <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-800" title={book.name}>
          {book.name.replace('.pdf', '')}
        </h3>
        <p className="mb-4 text-xs text-gray-500">{formatDate(book.uploadDate)}</p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onPreview(book.id)}
            className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Preview
          </button>
          <button
            onClick={() => onDelete(book.id)}
            disabled={isDeleting}
            className="rounded-lg bg-gray-100 px-3 py-2 text-gray-600 transition-colors hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
