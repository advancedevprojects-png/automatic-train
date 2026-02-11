import { useState, useEffect, useCallback } from 'react';
import { db, Book } from '@/services/database';
import { SizeLimit, BookMetadata } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export function useBooks() {
  const [books, setBooks] = useState<BookMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBooks = useCallback(async () => {
    try {
      setLoading(true);
      await db.init();
      const allBooks = await db.getAllBooks();
      const metadata: BookMetadata[] = allBooks.map((book) => ({
        id: book.id,
        name: book.name,
        size: book.size,
        type: book.type,
        uploadDate: book.uploadDate,
        pageCount: book.pageCount,
      }));
      setBooks(metadata.sort((a, b) => 
        new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      ));
      setError(null);
    } catch (err) {
      setError('Failed to load books');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const uploadBook = async (
    file: File,
    sizeLimit: SizeLimit
  ): Promise<{ success: boolean; error?: string }> => {
    const maxSize = sizeLimit * 1024 * 1024; // Convert MB to bytes

    if (file.size > maxSize) {
      return {
        success: false,
        error: `File size exceeds ${sizeLimit}MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
      };
    }

    if (file.type !== 'application/pdf') {
      return {
        success: false,
        error: 'Only PDF files are supported',
      };
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      
      const book: Book = {
        id: uuidv4(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString(),
        data: arrayBuffer,
      };

      await db.addBook(book);
      await loadBooks();

      return { success: true };
    } catch (err) {
      console.error('Upload error:', err);
      return {
        success: false,
        error: 'Failed to upload book. Please try again.',
      };
    }
  };

  const getBookData = async (id: string): Promise<ArrayBuffer | null> => {
    try {
      const book = await db.getBook(id);
      return book?.data || null;
    } catch {
      return null;
    }
  };

  const deleteBook = async (id: string): Promise<boolean> => {
    try {
      await db.deleteBook(id);
      await loadBooks();
      return true;
    } catch {
      return false;
    }
  };

  const filterBooksBySize = (limit: SizeLimit): BookMetadata[] => {
    const maxSize = limit * 1024 * 1024;
    return books.filter((book) => book.size <= maxSize);
  };

  return {
    books,
    loading,
    error,
    uploadBook,
    getBookData,
    deleteBook,
    filterBooksBySize,
    refreshBooks: loadBooks,
  };
}
