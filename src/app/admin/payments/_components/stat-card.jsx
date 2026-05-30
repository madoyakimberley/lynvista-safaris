"use client";

export default function StatCard({
  icon: Icon,
  label,
  value,
  badge,
  borderColor = "#442c23",
}) {
  return (
    <div
      className="rounded-2xl p-6 space-y-4 border-2"
      style={{
        borderColor: borderColor,
        backgroundColor: "#ffffff",
      }}
    >
      {/* Icon and Badge */}
      <div className="flex items-start justify-between">
        <div className="w-8 h-8" style={{ color: borderColor }}>
          {Icon && <Icon size={32} strokeWidth={1.5} />}
        </div>
        {badge && (
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{
              backgroundColor: borderColor + "15",
              color: borderColor,
            }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Label */}
      <div>
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "#8b6f47" }}
        >
          {label}
        </p>
      </div>

      {/* Value */}
      <div>
        <h3 className="text-3xl font-bold" style={{ color: "#442c23" }}>
          {value}
        </h3>
      </div>
    </div>
  );
}
