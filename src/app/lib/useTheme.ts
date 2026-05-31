import { useEffect, useState } from "react";

export type Theme = "sand" | "dark" | "red";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("sand");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme === "sand" || savedTheme === "dark" || savedTheme === "red") {
      setThemeState(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      const docTheme = document.documentElement.getAttribute("data-theme") as Theme;
      if (docTheme === "sand" || docTheme === "dark" || docTheme === "red") {
        setThemeState(docTheme);
      }
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return { theme, setTheme };
}
