import { createContext, useState, useContext } from 'react';

// Создаём контекст
const SearchContext = createContext();

// Hook для использования контекста
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return context;
};

// Провайдер контекста
export const SearchProvider = ({ children }) => {
  // Коробка для текста поиска
  const [searchText, setSearchText] = useState('');
  
  // Коробка для выбранной категории (пустая строка = "Все категории")
  const [selectedCategory, setSelectedCategory] = useState('');

  const value = {
    searchText,
    setSearchText,
    selectedCategory,
    setSelectedCategory
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};