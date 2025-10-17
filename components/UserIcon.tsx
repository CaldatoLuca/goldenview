"use client";
import Image from "next/image";
import { FaUserCircle as User } from "react-icons/fa";

interface UserIconProps {
  width?: number;
  height?: number;
  userImage?: string | null;
  textColor?: string;
  bgColor?: string;
  iconClassName?: string;
}

export default function UserIcon({
  width = 40,
  height = 40,
  userImage,
  iconClassName = "text-orange-50 bg-inherit",
}: UserIconProps) {
  if (userImage) {
    return (
      <Image
        src={userImage}
        alt="User Profile Picture"
        width={width}
        height={height}
        className="rounded-full block border-3"
      />
    );
  }

  return (
    <User size={width} className={`rounded-full block ${iconClassName}`} />
  );
}
