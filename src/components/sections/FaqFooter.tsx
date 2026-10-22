"use client";

export function FaqFooter({
  contact,
}: {
  contact: { name: string; phone: string; role?: string }[];
}) {
  return (
    <footer className="mx-auto flex flex-col items-center justify-center max-w-2xl px-6 py-16 text-center">
      <h2 className="mb-8 font-serif text-4xl">RSVP & Contact</h2>
      
      {contact && contact.length > 0 ? (
        <div className="space-y-8">
          {contact.map((c) => (
            <div key={c.name} className="flex flex-col items-center">
              {c.role && <span className="text-sm uppercase tracking-widest opacity-60 mb-1">{c.role}</span>}
              <p className="font-medium text-2xl mb-1">{c.name}</p>
              <a href={`tel:${c.phone}`} className="text-lg opacity-80 hover:opacity-100 transition-opacity">
                {c.phone}
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <p className="text-lg opacity-80">For any questions or RSVP updates,</p>
          <p className="text-lg opacity-80 mt-1">please reach out to the hosts directly.</p>
        </div>
      )}
    </footer>
  );
}
