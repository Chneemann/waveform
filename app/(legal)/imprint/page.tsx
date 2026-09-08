/**
 * @file app/(legal)/imprint/page.tsx
 * @description Server component rendering the imprint/legal notice page tailored to the app layout design.
 */

export default async function ImprintPage() {
  return (
    <section className="flex-1 overflow-y-auto w-full bg-background">
      <div className="relative p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">
          Legal Notice<span className="text-accent">.</span>
        </h1>

        <div className="space-y-6 text-sm mt-4 text-foreground/80 leading-relaxed">
          {/* Information pursuant to § 5 DDG */}
          <div className="rounded-2xl border border-surface/80 bg-surface/30 p-6 shadow-xl space-y-3">
            <h2 className="text-base font-semibold text-white flex items-center gap-2 font-mono">
              <span className="text-accent">//</span> Information Pursuant to §
              5 DDG
            </h2>
            <div className="font-mono text-xs bg-background/80 p-4 rounded-xl border border-surface/80 text-foreground space-y-1">
              <p className="font-semibold text-white">André Kempf</p>
              <p className="text-accent">Full-Stack Web Developer</p>
              <p className="text-muted">Großschneidersweg 2a</p>
              <p className="text-muted">76149 Karlsruhe, Germany</p>
            </div>
            <p className="text-xs text-muted">
              Also responsible for content pursuant to § 18 Abs. 2 MStV.
            </p>
          </div>

          {/* Contact */}
          <div className="rounded-2xl border border-surface/80 bg-surface/30 p-6 shadow-xl space-y-3">
            <h2 className="text-base font-semibold text-white flex items-center gap-2 font-mono">
              <span className="text-accent">//</span> Contact
            </h2>
            <div className="p-4 rounded-xl bg-background/80 border border-surface/80 font-mono text-xs">
              <p className="text-muted">
                <span className="text-white">Email:</span>{" "}
                <span className="text-accent hover:underline cursor-pointer">
                  dev@andre-kempf.com
                </span>
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="rounded-2xl border border-surface/80 bg-surface/30 p-6 shadow-xl space-y-4">
            <h2 className="text-base font-semibold text-white flex items-center gap-2 font-mono">
              <span className="text-accent">//</span> Disclaimer & Legal Notes
            </h2>
            <div className="space-y-1">
              <h3 className="font-semibold text-white text-sm">
                Liability for Content
              </h3>
              <p className="text-muted">
                As a service provider, I am responsible for my own content on
                these pages according to general laws pursuant to § 7 Abs. 1
                DDG. However, according to §§ 8 to 10 DDG, I am not obligated to
                monitor transmitted or stored third-party information or to
                investigate circumstances that indicate illegal activity.
              </p>
            </div>
            <div className="space-y-1 pt-3 border-t border-surface/60">
              <h3 className="font-semibold text-white text-sm">
                Liability for Links
              </h3>
              <p className="text-muted">
                My website contains links to external third-party websites over
                whose content I have no control. Therefore, I cannot accept any
                liability for these external contents. The respective provider
                or operator of the pages is always responsible for the content
                of the linked pages.
              </p>
            </div>
            <div className="space-y-1 pt-3 border-t border-surface/60">
              <h3 className="font-semibold text-white text-sm">Copyright</h3>
              <p className="text-muted">
                The content and works created on these pages are subject to
                German copyright law. Duplication, processing, distribution, or
                any form of commercialization beyond the scope of copyright law
                require the prior written consent of the author or creator.
              </p>
            </div>
          </div>

          {/* Dispute Resolution */}
          <div className="rounded-2xl border border-surface/80 bg-surface/30 p-6 shadow-xl space-y-3">
            <h2 className="text-base font-semibold text-white flex items-center gap-2 font-mono">
              <span className="text-accent">//</span> Dispute Resolution
            </h2>
            <p className="text-muted">
              The European Commission provides a platform for online dispute
              resolution (OS):{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline break-all"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
              .<br />I am neither willing nor obligated to participate in
              dispute resolution proceedings before a consumer arbitration
              board.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
