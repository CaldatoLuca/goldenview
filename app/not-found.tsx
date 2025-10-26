"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Moon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const homeRedirect = () => {
    if (session?.user) {
      // Se l'utente è loggato, controlla il ruolo
      if (session.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } else {
      // Se non è loggato, va alla home
      router.push("/");
    }
  };

  return (
    <main className="flex justify-center items-center w-screen h-screen bg-gradient-to-b from-indigo-900 via-indigo-800  to-purple-600 relative overflow-hidden">
      {/* Stelle decorative */}
      <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-pulse"></div>
      <div className="absolute top-32 left-32 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
      <div className="absolute top-20 right-40 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-300"></div>
      <div className="absolute top-40 right-20 w-1 h-1 bg-white rounded-full animate-pulse delay-700"></div>
      <div className="absolute top-16 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-500"></div>
      <div className="absolute top-48 left-48 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-200"></div>
      <div className="absolute top-24 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-1000"></div>
      <div className="absolute top-56 right-16 w-2 h-2 bg-white rounded-full animate-pulse delay-400"></div>
      <div className="absolute top-12 left-2/3 w-1 h-1 bg-white rounded-full animate-pulse delay-800"></div>
      <div className="absolute top-44 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-600"></div>
      <div className="absolute top-28 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-900"></div>
      <div className="absolute top-52 left-20 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>

      {/* Bagliori crepuscolari */}
      <div className="absolute top-1/4 left-20 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-32 w-56 h-56 bg-orange-400/30 rounded-full blur-3xl animate-pulse delay-500"></div>
      <div className="absolute bottom-32 left-1/4 w-48 h-48 bg-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <article className="flex flex-col items-center gap-6 text-center px-6 z-10 max-w-2xl">
        <header className="flex flex-col items-center gap-8">
          <div className="space-y-2">
            <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-pink-300 to-purple-200 drop-shadow-2xl tracking-tight">
              404
            </h1>
            <div className="flex items-center justify-center gap-2 text-purple-100">
              <Moon
                className="w-5 h-5 animate-pulse"
                style={{ animationDuration: "3s" }}
              />
              <span className="text-sm font-medium uppercase tracking-wider">
                Pagina non trovata
              </span>
            </div>
          </div>
        </header>

        <section className="space-y-4">
          <p className="text-lg text-orange-100 leading-relaxed font-medium">
            Il sole è appena tramontato dietro questa pagina...
          </p>
          <p className="text-purple-100/90 leading-relaxed">
            Le stelle stanno emergendo, ma la tua destinazione non è qui. Lascia
            che ti guidiamo verso orizzonti più luminosi.
          </p>
        </section>

        <nav className="flex gap-3 mt-4">
          <Button
            variant="secondary"
            size="lg"
            className="bg-gradient-to-r from-purple-100 to-pink-100 hover:from-white hover:to-purple-50 text-purple-900 font-semibold shadow-lg hover:shadow-2xl transition-all border-0"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Torna indietro
          </Button>

          <Button
            variant="ghost"
            size="lg"
            className="text-purple-50 hover:bg-purple-600/30 hover:text-white font-semibold border-2 border-purple-200/50 hover:border-purple-100 backdrop-blur-sm"
            onClick={homeRedirect}
          >
            <Home className="mr-2 h-5 w-5" />
            Home
          </Button>
        </nav>
      </article>
    </main>
  );
}
