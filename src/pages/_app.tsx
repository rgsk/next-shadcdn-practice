import { ThemeProvider } from "@/providers/theme-provider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "react-resizable/css/styles.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
