import { Montserrat } from "next/font/google";
import { AuthProvider } from "../../firebase/auth"; 
import "./globals.css";

// Load font
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-montserrat",
});

export const metadata = {
  title: "Clio",
  description: "Role-based Firebase Auth App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <AuthProvider>
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
