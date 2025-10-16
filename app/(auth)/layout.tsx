import Image from "next/image";
import Logo from "@/components/Logo";
import Link from "next/link";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-orange-200">
      <div className="container mx-auto px-4 flex justify-center">
        <div className="bg-orange-400/80 border-0  shadow-2xl rounded-lg p-10 lg:p-6 grid grid-cols-2 gap-6 w-full md:w-3/4 lg:w-3/4">
          <div className="col-span-1 hidden lg:block rounded-lg overflow-hidden relative">
            <Image
              src="/images/auth-sunset.webp"
              alt="Authentication Image"
              width={400}
              height={400}
              className="w-full h-full object-cover"
            />

            <Link href={"/"} className="absolute top-4 left-4">
              <Logo
                textClassName="text-orange-100"
                iconClassName="text-orange-200"
                size={50}
              />
            </Link>

            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-orange-100">
              <p className="text-xl text-center italic font-semibold">
                Ogni Golden Hour ha una storia da raccontare, qual è la tua?
              </p>
            </div>
          </div>
          <div className="col-span-2 lg:col-span-1 flex justify-center items-center">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
