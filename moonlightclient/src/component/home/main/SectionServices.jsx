import { Rocket, Sparkles, ShieldCheck, TrendingUp } from "lucide-react";
import React from "react";

const services = [
  {
    icon: Rocket,
    title: "Launch Strategy",
    description:
      "Build a product roadmap, go-to-market plan, and brand launch strategy that converts users into customers.",
  },
  {
    icon: Sparkles,
    title: "Design Systems",
    description:
      "Create polished UI, motion-first interactions, and scalable visual systems for modern brands.",
  },
  {
    icon: ShieldCheck,
    title: "Growth & Trust",
    description:
      "Secure customer trust with reliable experiences, fast flows, and high-conversion digital products.",
  },
  {
    icon: TrendingUp,
    title: "Performance",
    description:
      "Drive long-term growth with data-informed design, smooth interactions, and conversion-focused pages.",
  },
];

export default function SectionServices() {
  return (
    <section id="services" className="w-full bg-[#f7f5f5] py-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm uppercase tracking-[0.4em] text-[#E8794A] font-semibold">
            What we do
          </p>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-[#111827] leading-tight">
            Professional digital services for ambitious teams.
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl leading-relaxed">
            We combine modern design, animation, and performance to build a website that feels premium
            from the first click.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.title}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-[#E8794A]/10 text-[#E8794A] transition-all duration-300 group-hover:bg-[#E8794A] group-hover:text-white">
                  <Icon size={24} />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-[#111827]">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {service.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
