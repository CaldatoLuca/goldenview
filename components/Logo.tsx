interface LogoProps {
  textClassName?: string;
  iconClassName?: string;
  size?: number;
  text?: string;
}

export default function Logo({
  textClassName = "text-neutral-900 dark:text-white",
  iconClassName = "text-amber-500",
  size = 40,
  text = "GoldenView",
}) {
  const sunSize = size * 0.5;
  const raySize = size * 0.68;
  const horizonWidth = size * 0.68;
  const horizonHeight = size * 0.07;

  return (
    <div className="flex items-center gap-1 select-none">
      <div
        className="relative flex-shrink-0"
        style={{ width: size, height: size }}
      >
        <div
          className={`absolute rounded-full ${iconClassName}`}
          style={{
            width: sunSize,
            height: sunSize,
            bottom: size * 0.25,
            left: "50%",
            transform: "translateX(-50%)",
            background: "currentColor",
          }}
        />

        <div
          className={`absolute rounded-full border-2 ${iconClassName}`}
          style={{
            width: raySize,
            height: raySize,
            borderColor: "currentColor",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        <div
          className={`absolute rounded-full ${iconClassName}`}
          style={{
            width: horizonWidth,
            height: horizonHeight,
            background: "currentColor",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
      </div>

      <span className={`font-semibold tracking-tight text-xl ${textClassName}`}>
        {text}
      </span>
    </div>
  );
}
