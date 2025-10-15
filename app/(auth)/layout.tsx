export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-500">
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
