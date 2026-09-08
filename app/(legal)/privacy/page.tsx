/**
 * @file app/(legal)/privacy/page.tsx
 * @description Server component rendering the privacy policy page tailored to the app layout design.
 */

export default async function PrivacyPage() {
  return (
    <section className="flex-1 overflow-y-auto w-full bg-background">
      <div className="relative p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">
          Privacy Policy<span className="text-accent">.</span>
        </h1>

        <div className="space-y-6 text-sm mt-4 text-foreground/80 leading-relaxed">
          {/* Overview */}
          <div className="rounded-2xl border border-surface/80 bg-surface/30 p-6 shadow-xl space-y-4">
            <h2 className="text-base font-semibold text-white flex items-center gap-2 font-mono">
              <span className="text-accent">//</span> Data Protection at a
              Glance
            </h2>
            <div className="space-y-2">
              <h3 className="font-semibold text-white text-sm">
                General Information
              </h3>
              <p className="text-muted">
                The following notes provide a simple overview of what happens to
                your personal data when you visit this website. Personal data is
                any data that can be used to personally identify you.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-white text-sm">
                Data Collection on This Website
              </h3>
              <p className="text-muted">
                Data processing on this website is carried out by the website
                operator. Your data is collected when you provide it to us, or
                automatically by our IT systems when you visit the site.
              </p>
            </div>
          </div>

          {/* Responsible Party */}
          <div className="rounded-2xl border border-surface/80 bg-surface/30 p-6 shadow-xl space-y-3">
            <h2 className="text-base font-semibold text-white flex items-center gap-2 font-mono">
              <span className="text-accent">//</span> Responsible Party
              (Controller)
            </h2>
            <p className="text-muted">
              The controller responsible for data processing on this website is:
            </p>
            <div className="font-mono text-xs bg-background/80 p-4 rounded-xl border border-surface/80 text-foreground space-y-1">
              <p className="font-semibold text-white">André Kempf</p>
              <p className="text-muted">Großschneidersweg 2a</p>
              <p className="text-muted">76149 Karlsruhe, Germany</p>
              <p className="pt-2 text-muted">
                Email:{" "}
                <span className="text-accent hover:underline cursor-pointer font-medium">
                  dev@andre-kempf.com
                </span>
              </p>
            </div>
          </div>

          {/* Hosting & Server Log Files */}
          <div className="rounded-2xl border border-surface/80 bg-surface/30 p-6 shadow-xl space-y-3">
            <h2 className="text-base font-semibold text-white flex items-center gap-2 font-mono">
              <span className="text-accent">//</span> Hosting & Server
              Infrastructure
            </h2>
            <p className="text-muted">
              This website is hosted externally on web servers operated by
              Netcup GmbH. Personal data processed on this website is stored on
              the host&apos;s secure servers.
            </p>
            <p className="text-muted">
              The hosting provider automatically processes technical access data
              in server environment variables necessary to establish a stable
              connection and deliver page assets securely.
            </p>
          </div>

          {/* Server Analytics */}
          <div className="rounded-2xl border border-surface/80 bg-surface/30 p-6 shadow-xl space-y-3">
            <h2 className="text-base font-semibold text-white flex items-center gap-2 font-mono">
              <span className="text-accent">//</span> Server Analytics &
              Privacy-First Tracking
            </h2>
            <p className="text-muted">
              To evaluate website reach and optimize user experience, this
              website processes minimal access metrics (e.g., total daily views,
              coarse device category, and daily visitor counts).
            </p>
            <div className="p-4 rounded-xl bg-background/80 border border-surface/80 space-y-2 text-xs font-mono">
              <p className="text-emerald-400 font-semibold">
                // Key privacy guarantees:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted">
                <li>
                  <strong className="text-white">No Cookies:</strong> We do not
                  store cookies or local storage identifiers on your device.
                </li>
                <li>
                  <strong className="text-white">Anonymized IPs:</strong> IP
                  addresses are instantly hashed with a daily salt and never
                  stored in plain text.
                </li>
                <li>
                  <strong className="text-white">Zero Third Parties:</strong>{" "}
                  Analytics data is processed locally on our own server and
                  never shared with external tracking services.
                </li>
              </ul>
            </div>
            <p className="text-xs text-muted">
              The legal basis for this processing is our legitimate interest in
              maintaining and optimizing our online portfolio (Art. 6(1)(f)
              GDPR).
            </p>
          </div>

          {/* Your Rights */}
          <div className="rounded-2xl border border-surface/80 bg-surface/30 p-6 shadow-xl space-y-3">
            <h2 className="text-base font-semibold text-white flex items-center gap-2 font-mono">
              <span className="text-accent">//</span> Your Rights
            </h2>
            <p className="text-muted">
              You have the right at any time to receive information free of
              charge about the origin, recipient, and purpose of your stored
              personal data. You also have a right to request the correction or
              deletion of this data.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
