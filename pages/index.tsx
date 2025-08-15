import React, { useMemo, useState, useEffect } from "react";

const DENOMS = [10, 15, 20, 25, 30, 50, 100];
function cx(...c: any[]) { return c.filter(Boolean).join(" "); }
function fmt(n: number) { return Number(n).toFixed(2).replace('.', ','); }

export default function Home() {
  const [amount, setAmount] = useState(25);
  const [qty, setQty] = useState(1);
  const [email, setEmail] = useState("");
  const [pm, setPm] = useState("Klarna");
  const [agree, setAgree] = useState(false);
  const [notice, setNotice] = useState("");
  const [open, setOpen] = useState(false);

  const total = useMemo(() => amount * qty, [amount, qty]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "+") setQty((q) => Math.min(q + 1, 20));
      if (e.key === "-") setQty((q) => Math.max(q - 1, 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const canPay = agree && /.+@.+\..+/.test(email) && total > 0 && !!pm;

  const grad = "bg-gradient-to-r from-purple-600 to-orange-500";
  const gradHover = "hover:from-purple-700 hover:to-orange-600";

  const Header = () => (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-r from-purple-600 to-orange-500" />
          <a href="#top" className="text-lg font-semibold tracking-tight text-purple-700">CardSprint</a>
        </div>
        <button onClick={() => setOpen(true)} className={cx("rounded-2xl px-4 py-2 text-sm font-semibold text-white shadow focus:outline-none focus:ring-2 focus:ring-purple-600", grad, gradHover)}>
          Jetzt kaufen
        </button>
      </div>
    </header>
  );

  const PaymentPill = ({ label }: {label: string}) => (
    <button onClick={() => setPm(label)} aria-pressed={pm === label} className={cx("flex-1 rounded-2xl border px-3 py-3 text-sm font-semibold transition-colors", pm === label ? "border-purple-600 bg-purple-600 text-white" : "hover:border-orange-400")}>
      {label}
    </button>
  );

  const QuickBuy = () => (
    <section id="top" className="relative">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 px-4 py-10 md:grid-cols-2">
        <div>
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-purple-700 md:text-5xl">Paysafecard in Sekunden kaufen</h1>
          <p className="mb-2 text-base text-slate-600 md:text-lg">Betrag wählen, E‑Mail eingeben, zahlen. Code kommt sofort per E‑Mail (optional SMS). 24/7.</p>

          <div className="mt-4 mb-4 grid grid-cols-4 gap-2 md:grid-cols-7">
            {DENOMS.map((d) => (
              <button key={d} onClick={() => setAmount(d)} className={cx("rounded-2xl border px-3 py-2 text-sm font-semibold transition-colors", amount === d ? "border-purple-600 bg-purple-600 text-white" : "hover:border-orange-400")}>{d}€</button>
            ))}
          </div>

          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm">Anzahl</span>
              <div className="inline-flex items-center rounded-xl border">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2">−</button>
                <input value={qty} onChange={(e)=> setQty(Math.max(1, Number(e.target.value)))} type="number" min={1} className="w-16 border-x px-3 py-2 text-center" />
                <button onClick={() => setQty(Math.min(20, qty + 1))} className="px-3 py-2">+</button>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">Gesamt</div>
              <div className="text-2xl font-extrabold text-orange-500">{total.toFixed(2)} €</div>
            </div>
          </div>

          <label htmlFor="email" className="mb-1 block text-sm font-medium">E‑Mail für Zustellung</label>
          <input id="email" value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="dein@mail.de" className="mb-3 w-full rounded-xl border px-3 py-3" />

          <div className="mb-1 grid grid-cols-2 gap-2">
            {['Klarna','PayPal','Kreditkarte','Handypayment'].map((l) => <PaymentPill key={l} label={l} />)}
          </div>
          <p className="mb-4 text-xs text-slate-600">Sicher zahlen mit 3‑D Secure (Karten), Käuferschutz je Zahlungsart, starke Kundenauthentifizierung. Keine Weitergabe deiner Daten an Dritte.</p>

          <div className="mb-4 flex items-start gap-2">
            <input id="agree" type="checkbox" className="mt-1" checked={agree} onChange={(e)=>setAgree(e.target.checked)} />
            <label htmlFor="agree" className="text-xs text-slate-600">Ich bestätige AGB & Widerruf (digitale Inhalte). Hinweise zu Gebühren/KYC siehe unten.</label>
          </div>

          {notice && <p className="mb-3 text-sm text-red-600">{notice}</p>}

          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => setOpen(true)} className={cx("rounded-2xl px-5 py-3 text-sm font-semibold text-white", grad, gradHover)}>Zur Kasse</button>
            <div className="text-sm text-slate-600">⌚️ Kaufdauer: ~30–45 Sekunden</div>
          </div>

          <ol className="mt-8 grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
            {[{n:1,t:"Betrag wählen",d:"10–100 €"},{n:2,t:"Zahlen",d:"Klarna, PayPal, Karte, Handy"},{n:3,t:"Code erhalten",d:"Sofort per E‑Mail"}].map((s)=>(
              <li key={s.n} className="rounded-2xl border bg-white p-4"><div className="mb-1 text-xs text-purple-700">Schritt {s.n}</div><div className="font-semibold">{s.t}</div><div className="text-slate-600">{s.d}</div></li>
            ))}
          </ol>
        </div>

        <aside className="sticky top-20 h-fit rounded-3xl border bg-white p-6 shadow-lg">
          <h2 className="mb-3 text-lg font-semibold">Zusammenfassung</h2>
          <div className="mb-2 text-sm text-slate-600">Paysafecard</div>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-xl font-extrabold">{amount}€</div>
            <div className="text-sm">× {qty}</div>
          </div>
          <div className="mb-4 h-px w-full bg-gray-200" />
          <div className="mb-1 flex items-center justify-between text-sm"><span>Zwischensumme</span><span>{fmt(amount*qty)} €</span></div>
          <div className="mb-1 flex items-center justify-between text-sm"><span>Dienstleistungsgebühr</span><span>0,00 €</span></div>
          <div className="mb-2 flex items-center justify-between text-sm"><span>inkl. USt.</span><span>enthalten</span></div>
          <div className="mb-4 h-px w-full bg-gray-200" />
          <div className="mb-2 flex items-center justify-between"><span className="text-sm text-slate-600">Gesamt</span><span className="text-2xl font-extrabold text-orange-500">{fmt(total)} €</span></div>
          <button onClick={() => setOpen(true)} className={cx("mt-3 w-full rounded-2xl px-4 py-3 text-white font-semibold shadow", grad, gradHover)}>Jetzt zahlen</button>
          <p className="mt-3 text-xs text-slate-600">Sicher zahlen mit 3‑D Secure / Käuferschutz.</p>
        </aside>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-3xl border bg-white p-6 shadow-2xl">
            <h3 className="mb-4 text-lg font-semibold text-purple-700">Checkout (Demo)</h3>
            <label htmlFor="c-email" className="mb-1 block text-sm font-medium">E‑Mail</label>
            <input id="c-email" value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className="mb-3 w-full rounded-xl border px-3 py-3" />
            <div className="mb-3 grid grid-cols-2 gap-2">
              {['Klarna','PayPal','Kreditkarte','Handypayment'].map((l) => (
                <button key={l} onClick={()=>setPm(l)} aria-pressed={pm===l} className={cx("rounded-2xl border px-3 py-3 text-sm font-semibold", pm===l?"border-purple-600 bg-purple-600 text-white":"hover:border-orange-400")}>{l}</button>
              ))}
            </div>
            <div className="mb-3 flex items-start gap-2">
              <input id="c-agree" type="checkbox" checked={agree} onChange={(e)=>setAgree(e.target.checked)} />
              <label htmlFor="c-agree" className="text-xs text-slate-600">AGB & Widerruf akzeptieren.</label>
            </div>
            {notice && <p className="mb-3 text-sm text-red-600">{notice}</p>}
            <div className="flex items-center justify-between"><div className="text-sm text-slate-600">Gesamt</div><div className="text-2xl font-extrabold text-orange-500">{fmt(total)} €</div></div>
            <div className="mt-4 flex justify-between">
              <button onClick={() => setOpen(false)} className="rounded-2xl border px-4 py-2 text-sm font-semibold">Zurück</button>
              <button onClick={() => alert('Demo‑Zahlung – morgen schalten wir echte Zahlungen frei.')} disabled={!canPay} className={cx("rounded-2xl px-4 py-2 text-sm font-semibold text-white", canPay?`${grad} ${gradHover}`:"bg-gray-400 cursor-not-allowed")}>Zahlen</button>
            </div>
            <p className="mt-3 text-[11px] text-slate-500">*Digitale Lieferung; kein Widerruf nach Auslieferungsbeginn.</p>
          </div>
        </div>
      )}

      <footer className="border-t bg-white/60 mt-14">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 md:grid-cols-4">
          <div>
            <div className="mb-3 text-sm font-semibold">Rechtliches</div>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#impressum" className="hover:underline">Impressum</a></li>
              <li><a href="#agb" className="hover:underline">AGB</a></li>
              <li><a href="#datenschutz" className="hover:underline">Datenschutz</a></li>
              <li><a href="#widerruf" className="hover:underline">Widerruf</a></li>
            </ul>
          </div>
          <div>
            <div className="mb-3 text-sm font-semibold">Support</div>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>Live‑Chat 24/7</li>
              <li>E‑Mail: support@cardsprint.io</li>
              <li>Response SLA: &lt; 10 Min</li>
            </ul>
          </div>
          <div>
            <div className="mb-3 text-sm font-semibold">Zahlungen</div>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>Klarna Rechnung & Raten</li>
              <li>PayPal</li>
              <li>Kredit-/Debitkarte</li>
              <li>Handypayment</li>
            </ul>
          </div>
          <div>
            <div className="mb-3 text-sm font-semibold">Newsletter</div>
            <div className="flex gap-2">
              <input className="w-full rounded-xl border px-3 py-2" placeholder="E‑Mail" />
              <button className="rounded-xl px-3 py-2 text-white bg-purple-600 hover:bg-purple-700">Anmelden</button>
            </div>
            <p className="mt-2 text-xs text-slate-600">Deals & Limits zuerst erfahren. Abmeldung jederzeit möglich.</p>
          </div>
        </div>
        <div className="border-t py-6 text-center text-xs text-slate-600">© {new Date().getFullYear()} CardSprint – Alle Rechte vorbehalten.</div>
      </footer>
    </section>
  );
}
