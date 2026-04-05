export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-surface-base flex items-center justify-center">
      {children}
    </div>
  )
}
