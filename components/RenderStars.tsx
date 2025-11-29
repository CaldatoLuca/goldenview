import { FaStar } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa";

export default function RenderStars({ rating }: { rating: number }) {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-gray-300" />);
    }
  }

  return <div className="flex gap-1">{stars}</div>;
}
