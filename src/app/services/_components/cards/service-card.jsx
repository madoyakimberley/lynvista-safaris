"use client";

export default function ServiceCard({ service, onClick }) {
  const Icon = service.icon;

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer p-8 rounded-2xl bg-white flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-transparent"
    >
      {/* The Circular Icon from Image */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full border-4 border-(--color-primary-light) flex items-center justify-center bg-white transition-colors group-hover:bg-(--color-primary)">
          <Icon className="h-10 w-10 text-(--color-primary) group-hover:text-white transition-colors" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-(--color-dark) mb-3 font-heading uppercase tracking-wide">
        {service.title}
      </h3>

      <p className="text-(--color-dark-muted) text-sm leading-relaxed line-clamp-3">
        {service.description}
      </p>

      <div className="mt-4 w-12 h-1 bg-(--color-primary-light) rounded-full group-hover:w-20 transition-all" />
    </div>
  );
}
