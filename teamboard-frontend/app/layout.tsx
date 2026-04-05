import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TeamBoard',
  description: 'Ekip Görev Yönetim Sistemi',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className="dark">
      <body className="bg-surface-base text-tx-primary min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
