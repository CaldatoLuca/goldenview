"use client";

import { spotService, Spot } from "@/lib/services/spotService";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Trash,
  SquareCheck,
  SquareX,
  SquareArrowLeft,
  SquareArrowRight,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AdminSpotsPage() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [place, setPlace] = useState("");
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(
    undefined
  );
  const [publicFilter, setPublicFilter] = useState<boolean | undefined>(
    undefined
  );

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const limit = 10;

  useEffect(() => {
    fetchSpots();
  }, [page, activeFilter, publicFilter]);

  const fetchSpots = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await spotService.getAll({
        page,
        limit,
        search: search || undefined,
        place: place || undefined,
        active: activeFilter,
        public: publicFilter,
      });

      setSpots(response.spots);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || "Errore nel caricamento degli spot spot");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchSpots();
  };

  const handleReset = () => {
    setSearch("");
    setPlace("");
    setActiveFilter(undefined);
    setPublicFilter(undefined);
    setPage(1);
    fetchSpots();
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await spotService.delete(id);

      setSpots((prevSpots) => prevSpots.filter((spot) => spot.id !== id));

      if (pagination) {
        setPagination({
          ...pagination,
          total: pagination.total - 1,
        });
      }
      toast.success("Spot cancellato correttamente");
    } catch (err: any) {
      toast.error(err.message || "Errore nella cancellazione dello spot");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-12 p-4 bg-orange-400 rounded-md shadow-2xl text-orange-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Cerca (nome, descrizione, indirizzo)
            </label>
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Es: surf, spiaggia..."
              className="w-full"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Luogo</label>
            <Input
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="Es: Milano, Roma..."
              className="w-full"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-8 mb-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="active-filter"
              checked={activeFilter === false}
              onCheckedChange={(checked) =>
                setActiveFilter(checked ? false : undefined)
              }
            />
            <Label htmlFor="active-filter" className="cursor-pointer">
              Nascondi Attivi
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="public-filter"
              checked={publicFilter === false}
              onCheckedChange={(checked) =>
                setPublicFilter(checked ? false : undefined)
              }
            />
            <Label htmlFor="public-filter" className="cursor-pointer">
              Nascondi Pubblici
            </Label>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleSearch}>Cerca</Button>
          <Button onClick={handleReset} variant={"secondary"}>
            Reset Filtri
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        <>
          {pagination && (
            <div className="mb-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Trovati {""}
                <span className="font-semibold">{pagination.total}</span> spot
                {search || place ? " con i filtri applicati" : ""}
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setPage(page - 1)}
                    disabled={!pagination.hasPrev}
                    size={"sm"}
                    variant="outline"
                  >
                    <SquareArrowLeft />
                  </Button>

                  <div className="text-sm">
                    Pagina {pagination.page} di {pagination.total}
                  </div>

                  <Button
                    onClick={() => setPage(page + 1)}
                    disabled={!pagination.hasNext}
                    size={"sm"}
                    variant="outline"
                  >
                    <SquareArrowRight />
                  </Button>
                </div>
              )}
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Luogo</TableHead>
                <TableHead>Attivo</TableHead>
                <TableHead>Pubblico</TableHead>
                <TableHead className="text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spots.map((spot) => (
                <TableRow key={spot.id}>
                  <TableCell className="font-medium">{spot.name}</TableCell>
                  <TableCell>{spot.place}</TableCell>
                  <TableCell>
                    {spot.active ? (
                      <SquareCheck className="text-green-600" />
                    ) : (
                      <SquareX className="text-red-600" />
                    )}
                  </TableCell>
                  <TableCell>
                    {spot.public ? (
                      <SquareCheck className="text-green-600" />
                    ) : (
                      <SquareX className="text-red-600" />
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={"destructive"}
                      size={"sm"}
                      onClick={() => handleDelete(spot.id)}
                      disabled={deletingId === spot.id}
                    >
                      {deletingId === spot.id ? (
                        <Spinner className="w-4 h-4" />
                      ) : (
                        <Trash />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
}
