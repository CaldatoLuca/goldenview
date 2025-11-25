import { AlertCircle, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

interface LocationErrorBannerProps {
  error?: string;
  onRetry: () => void;
}

export function LocationErrorBanner({
  error,
  onRetry,
}: LocationErrorBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200 rounded-xl p-4 mb-6 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-orange-600 mt-0.5">
          <AlertCircle size={24} />
        </div>

        <div className="flex-1">
          <h3 className="text-orange-900 font-semibold mb-1">
            Posizione non disponibile
          </h3>
          <p className="text-orange-800 text-sm mb-3">
            Per offrirti suggerimenti di spot nelle tue vicinanze, abbiamo
            bisogno della tua posizione. Attiva la geolocalizzazione per una
            migliore esperienza!
          </p>

          <Button
            onClick={onRetry}
            size="sm"
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <MapPin size={16} className="mr-2" />
            Attiva posizione
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
