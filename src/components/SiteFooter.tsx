export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-v-smoke/20 bg-v-black/30 px-8 py-16 md:px-16 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-16">
          <div>
            <h2 className="font-[family-name:var(--font-geist-mono)] text-[9px] uppercase tracking-[0.45em] text-v-smoke">
              Studio
            </h2>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href="#studio"
                  className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.2em] text-v-silver transition-colors hover:text-v-chalk"
                  data-cursor-magnetic
                  data-cursor-label="View"
                >
                  Method
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.2em] text-v-silver transition-colors hover:text-v-chalk"
                  data-cursor-magnetic
                  data-cursor-label="Read"
                >
                  Philosophy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-geist-mono)] text-[9px] uppercase tracking-[0.45em] text-v-smoke">
              Work
            </h2>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href="#services"
                  className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.2em] text-v-silver transition-colors hover:text-v-chalk"
                  data-cursor-magnetic
                  data-cursor-label="Explore"
                >
                  Services
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-geist-mono)] text-[9px] uppercase tracking-[0.45em] text-v-smoke">
              Contact
            </h2>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href="#contact"
                  className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.2em] text-v-silver transition-colors hover:text-v-chalk"
                  data-cursor-magnetic
                  data-cursor-label="Connect"
                >
                  Inquire
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@volari.studio"
                  className="font-[family-name:var(--font-geist-mono)] text-[11px] tracking-[0.08em] text-v-accent/90 transition-colors hover:text-v-chalk"
                  data-cursor-magnetic
                  data-cursor-label="Email"
                >
                  hello@volari.studio
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 border-t border-v-smoke/15 pt-10 sm:grid-cols-3 sm:items-center sm:gap-4">
          <span className="justify-self-start font-[family-name:var(--font-playfair)] text-xl tracking-[-0.02em] text-v-chalk sm:justify-self-start">
            Volari
          </span>
          <span className="max-w-md justify-self-center text-center font-[family-name:var(--font-geist-mono)] text-[9px] uppercase leading-relaxed tracking-[0.35em] text-v-smoke">
            Digital Experiences Studio — Bespoke Creative Technology
          </span>
          <span className="justify-self-start font-[family-name:var(--font-geist-mono)] text-[9px] uppercase tracking-[0.35em] text-v-smoke/80 sm:justify-self-end">
            &copy; {year} Volari
          </span>
        </div>
      </div>
    </footer>
  );
}
