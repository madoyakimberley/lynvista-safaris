"use client";

import { useRouter } from "next/navigation";
import { X, Check } from "lucide-react";

export function ServiceModal({ service, onClose }) {
  const router = useRouter();
  const Icon = service.icon;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-(--color-light) rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-auto shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 p-8 border-b border-[var(--color-dark)/10] flex items-center justify-between z-10 bg-linear-to-r from-(--color-dark) to-[#3d2817]">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-(--color-primary) to-(--color-primary-light) flex items-center justify-center shadow-lg">
              <Icon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white font-heading">
                {service.title}
              </h2>
              <p className="text-(--color-text-gold) mt-1 opacity-90">
                {service.description}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/10 p-3 rounded-full transition-colors"
          >
            <X className="h-7 w-7" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {service.process && (
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-(--color-dark) mb-6 font-heading">
                Our Process
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.process.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm"
                  >
                    <span className="shrink-0 w-8 h-8 rounded-full bg-(--color-primary) text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <p className="text-(--color-dark-muted)">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {service.options.map((option, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl border-2 border-[var(--color-primary-light)/20] bg-white"
              >
                <h3 className="text-2xl font-bold text-(--color-dark) mb-4 font-heading">
                  {option.name}
                </h3>
                <ul className="space-y-3">
                  {option.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 mt-1 text-(--color-accent)" />
                      <span className="text-(--color-dark-muted)">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 text-center bg-linear-to-r from-(--color-primary) to-(--color-primary-light)">
          <p className="text-xl mb-6 text-white font-semibold">
            Ready for an unforgettable journey?
          </p>
          <button
            className="px-12 py-4 rounded-full font-bold text-lg bg-(--color-secondary) text-(--color-dark) hover:bg-white transition-all shadow-lg"
            onClick={() => {
              onClose();
              router.push("/contact"); // <-- Navigate to contact page
            }}
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
}
