import { useState, useEffect, useCallback } from 'react';

const useBookmarks = (initialBookmarks = []) => {
  const [bookmarks, setBookmarks] = useState(initialBookmarks);

  const addBookmark = useCallback((bookmark) => {
    setBookmarks((prevBookmarks) => [...prevBookmarks, bookmark]);
  }, []);

  const removeBookmark = useCallback((bookmarkToRemove) => {
    setBookmarks((prevBookmarks) =>
      prevBookmarks.filter((bookmark) => bookmark !== bookmarkToRemove)
    );
  }, []);

  const navigateToBookmark = useCallback((bookmarkIndex) => {
    if (bookmarks[bookmarkIndex]) {
      // Implement the navigation logic here
      console.log(`Navigating to bookmark at index ${bookmarkIndex}`);
    }
  }, [bookmarks]);

  useEffect(() => {
    // Any side effect related to bookmarks
  }, [bookmarks]);

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    navigateToBookmark,
  };
};

export default useBookmarks;
