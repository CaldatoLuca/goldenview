"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSpots } from "@/hooks/useSpots";
import { spotService } from "@/lib/services/spotService";

import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SquareCheck, SquareMinus, SquareX } from "lucide-react";

export default function AdminSpotsPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [place, setPlace] = useState("");
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(
    undefined
  );
  const [publicFilter, setPublicFilter] = useState<boolean | undefined>(
    undefined
  );
  const [page, setPage] = useState(1);

  const limit = 10;

  const { data, isLoading, isError, refetch } = useSpots({
    page,
    limit,
    search: search || undefined,
    place: place || undefined,
    active: activeFilter,
    public: publicFilter,
  });

  const spots = data?.spots ?? [];
  const pagination = data?.pagination;

  const handleSearch = () => {
    setPage(1);
    refetch();
  };

  const handleReset = () => {
    setSearch("");
    setPlace("");
    setActiveFilter(undefined);
    setPublicFilter(undefined);
    setPage(1);
    refetch();
  };

  const handleDelete = async (id: string) => {
    try {
      await spotService.delete(id);
      toast.success("Spot cancellato correttamente");

      queryClient.invalidateQueries({
        queryKey: ["spots"],
      });
    } catch (err: any) {
      toast.error(err.message || "Errore nella cancellazione dello spot");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Input
          placeholder="Cerca per nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Input
          placeholder="Luogo..."
          value={place}
          onChange={(e) => setPlace(e.target.value)}
        />

        <div className="flex items-center space-x-2">
          <Switch
            id="active-filter"
            checked={activeFilter ?? false}
            onCheckedChange={(value: boolean) =>
              setActiveFilter(value ? true : undefined)
            }
          />
          <Label htmlFor="active-filter">Attivi</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="public-filter"
            checked={publicFilter ?? false}
            onCheckedChange={(value: boolean) =>
              setPublicFilter(value ? true : undefined)
            }
          />
          <Label htmlFor="public-filter">Pubblici</Label>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <Button onClick={handleSearch}>Cerca</Button>
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>

      {isLoading && (
        <div className="flex justify-center p-10">
          <Spinner />
        </div>
      )}

      {isError && (
        <p className="text-center text-red-500 p-6">
          Errore nel caricamento degli spot
        </p>
      )}

      {!isLoading && !isError && spots.length === 0 && (
        <p className="text-center py-6">Nessun spot trovato.</p>
      )}

      {spots.length > 0 && (
        <div className="overflow-x-auto shadow rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Nome</TableHead>
                <TableHead className="text-left">Luogo</TableHead>
                <TableHead className="text-left">Attivo</TableHead>
                <TableHead className="text-left">Pubblico</TableHead>
                <TableHead className="text-left">Azioni</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {spots.map((spot) => (
                <TableRow key={spot.id}>
                  <TableCell>{spot.name}</TableCell>
                  <TableCell>{spot.place}</TableCell>
                  <TableCell>
                    {spot.active ? (
                      <SquareCheck className="text-green-700" />
                    ) : (
                      <SquareMinus className="text-red-700" />
                    )}
                  </TableCell>
                  <TableCell>
                    {spot.public ? (
                      <SquareCheck className="text-green-700" />
                    ) : (
                      <SquareMinus className="text-red-700" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(spot.id)}
                      size={"sm"}
                    >
                      <SquareX />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* PAGINAZIONE */}
      {pagination && (
        <div className="flex justify-between items-center mt-6">
          <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            ← Precedente
          </Button>

          <span>
            Pagina {page} di {pagination.totalPages}
          </span>

          <Button
            disabled={page === pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Successiva →
          </Button>
        </div>
      )}
    </div>
  );
}
