"use client";
import { FaSun as Sun } from "react-icons/fa6";

type Props = {
  title: string;
  onClick?: () => void;
};

export default function CustomMarker({ title, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className=" text-2xl font-bold text-orange-500 shadow-lg cursor-pointer"
    >
      <Sun />
    </div>
  );
}
