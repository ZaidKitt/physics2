import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Interactive Physics Project",
  description: "Explore physics concepts with interactive simulations",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ 
        fontFamily: "'Inter', sans-serif",
        backgroundColor: "#0f1116", 
        color: "#ffffff",
        margin: 0,
        padding: 0
      }}>
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          minHeight: "100vh" 
        }}>
          <Navbar />
          
          <main style={{ flexGrow: 1 }}>
            {children}
          </main>
          
          <footer style={{ 
            padding: "1.5rem 0", 
            borderTop: "1px solid #1f2937",
            backgroundColor: "rgba(26, 28, 37, 0.5)"
          }}>
            <div style={{ 
              maxWidth: "80rem", 
              marginLeft: "auto", 
              marginRight: "auto", 
              padding: "0 1rem" 
            }}>
              <div className="footer-content">
                <div className="footer-copyright">
                  <p style={{ color: "#d1d5db" }}>
                    &copy; {new Date().getFullYear()} Created by <span style={{ color: "#00b7eb" }}>Zaid Alsaleh</span> | University ID: <span style={{ color: "#00b7eb" }}>20220126</span>
                  </p>
                </div>
                <div className="footer-title">
                  <p style={{ color: "#d1d5db" }}>
                    Interactive Physics Project
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
