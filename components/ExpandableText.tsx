"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface ExpandableTextProps {
  text: string | null | undefined;
  lines?: number;
}

export default function ExpandableText({
  text,
  lines = 6,
}: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const [measuredHeight, setMeasuredHeight] = useState<number | null>(null);

  const fullRef = useRef<HTMLParagraphElement>(null);

  if (!text) return "";

  const collapsedHeight = `${lines * 1.5}rem`;

  useEffect(() => {
    if (fullRef.current) {
      setMeasuredHeight(fullRef.current.scrollHeight);
    }
  }, [text]);

  return (
    <div className="space-y-2 lg:hidden relative">
      <motion.div
        animate={{
          height: expanded ? measuredHeight ?? "auto" : collapsedHeight,
        }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p
          ref={fullRef}
          className="text-inherit absolute opacity-0 pointer-events-none select-none"
        >
          {text}
        </p>

        <p className="text-inherit">{text}</p>
      </motion.div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-inherit underline text-sm cursor-pointer"
      >
        {expanded ? "Mostra meno" : "Mostra altro"}
      </button>
    </div>
  );
}
