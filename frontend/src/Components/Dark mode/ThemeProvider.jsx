import React from "react";
import { useSelector } from "react-redux";

const ThemeProvider = ({ children }) => {
  const { theme } = useSelector((state) => state.theme);
  return (
    <div className={theme}>
      <div className="bg-white min-h-screen text-gray-800 dark:bg-black dark:text-white">
        {children}
      </div>
    </div>
  );
};

export default ThemeProvider;
