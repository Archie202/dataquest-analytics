import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/common/Navbar"
import { Footer } from "@/components/common/Footer"
import { Providers } from "@/components/layout/Providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "DataQuest Analytics – Master Data Analytics through Gamified Quests",
  description:
    "Level up your data analytics skills with gamified quests, skill trees, and hands-on projects. Learn SQL, Python, statistics, and more.",
  keywords: [
    "data analytics",
    "gamified learning",
    "data science",
    "SQL",
    "Python",
    "quests",
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem("dataquest-theme");
                if (t === "light") document.documentElement.classList.remove("dark");
                else document.documentElement.classList.add("dark");
              } catch(e) {}
            `,
          }}
        />
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
