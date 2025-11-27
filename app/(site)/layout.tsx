import Header from "@/components/Header";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="pt-18 bg-orange-200">{children}</main>
    </>
  );
}
