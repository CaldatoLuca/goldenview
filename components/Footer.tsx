import Link from "next/link";
import Logo from "./Logo";
import {
  FaFacebook,
  FaInstagram,
  FaPinterest,
  FaTwitter,
} from "react-icons/fa";

const socials = [
  { key: "instagram", link: "/", icon: <FaInstagram /> },
  { key: "twitter", link: "/", icon: <FaTwitter /> },
  { key: "facebook", link: "/", icon: <FaFacebook /> },
  { key: "pinterest", link: "/", icon: <FaPinterest /> },
];

const links = [
  {
    title: "Esplora",
    actions: [
      { name: "Spot popolari", link: "/spot-popolari" },
      { name: "Nuove aggiunte", link: "/nuove-aggiunte" },
      { name: "Tramonti nelle vicinanze", link: "/tramonti-vicino" },
      { name: "Momenti stagionali", link: "/momenti-stagionali" },
    ],
  },
  {
    title: "Community",
    actions: [
      { name: "Linee guida", link: "/linee-guida" },
      { name: "Invia uno spot", link: "/invio-spot" },
      { name: "Consigli fotografici", link: "/consigli-fotografia" },
      { name: "Meetup", link: "/meetup" },
    ],
  },
  {
    title: "Supporto",
    actions: [
      { name: "Centro assistenza", link: "/help-center" },
      { name: "Informativa privacy", link: "/privacy" },
      { name: "Termini di servizio", link: "/termini" },
      { name: "Contattaci", link: "/contatti" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-blue-50 py-12 shadow-2xl">
      <div className="container mx-auto px-4 ">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Logo textClassName="text-blue-50" />
            <p className="my-4 text-blue-100/80">
              Scopri e condividi gli Spot <br /> più belli del mondo.
            </p>

            <ul className="flex gap-3 items-center text-2xl">
              {socials.map((s) => (
                <li key={s.key} className="hover:text-orange-300 transition">
                  <Link href={s.link}>{s.icon}</Link>
                </li>
              ))}
            </ul>
          </div>

          {links.map((l) => (
            <div key={l.title}>
              <h3 className="font-semibold mb-3">{l.title}</h3>
              <ul className="space-y-2">
                {l.actions.map((a) => (
                  <li key={a.name}>
                    <Link
                      href={a.link}
                      className="text-blue-100/80 hover:text-orange-300 transition"
                    >
                      {a.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="my-8 border-blue-100" />

        <div className="text-orange-100/50 text-center">
          © 2025 GoldenView. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
