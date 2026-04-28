import router from "./router.tsx";
import { RouterProvider } from "react-router-dom";
import { Reset } from "./GlobalStyle";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./theme.ts";
import { isDarkAtom } from "./atom.ts";
import { useAtomValue } from "jotai";

function App() {
  const isDark = useAtomValue(isDarkAtom);
  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <Reset />
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={true} />
    </ThemeProvider>
  );
}

export default App;
