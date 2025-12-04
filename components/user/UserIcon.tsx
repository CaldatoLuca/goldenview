"use client";
import Image from "next/image";
import { FaUserCircle as User } from "react-icons/fa";
import UserIconSkeleton from "./Skeleton";

interface UserIconProps {
  width?: number;
  height?: number;
  userImage?: string | null;
  loading?: boolean;
  iconClassName?: string;
}

export default function UserIcon({
  width = 40,
  height = 40,
  userImage,
  loading = false,
  iconClassName = "text-orange-400 bg-orange-200",
}: UserIconProps) {
  if (loading) {
    return <UserIconSkeleton size={width} />;
  }

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
