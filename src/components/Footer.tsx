const footerLinks = [
  "Tesla © 2026",
  "Privacy policy",
  "Vehicle Recalls",
  "Contacts",
  "News",
  "Get Updates",
  "Locations",
  "Learn",
];

export default function Footer() {
  return (
    <footer className="flex flex-col items-center bg-white px-5 py-14 sm:px-8 lg:px-16 lg:py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8">
        <div className="h-px w-full border-t border-[rgba(2,8,9,0.15)]" />
        <div className="flex w-full flex-wrap justify-center gap-4 sm:gap-8">
          <div className="flex max-w-[920px] flex-wrap justify-center gap-4 text-sm font-semibold sm:gap-8">
            {footerLinks.map((link) => (
              <a key={link} href="#">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
