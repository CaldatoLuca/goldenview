import Header from "@/components/Header";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </>
  );
}
