import SearchPlaceBar from "@/components/SearchPlaceBar";

export default function Hero() {
  return (
    <section className="h-[calc(60vh)] flex justify-center items-center flex-col bg-cover bg-center bg-no-repeat relative ">
      <div className="absolute inset-0 bg-orange-300 z-0" />

      <h2 className="relative z-10 text-white w-1/2 text-center mb-8 text-2xl font-semibold drop-shadow">
        Trova il tramonto più bello in giro per il mondo
      </h2>

      <div className="relative z-10 w-2/3 md:w-1/3">
        <SearchPlaceBar />
      </div>
    </section>
  );
}
