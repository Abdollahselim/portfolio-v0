interface MarqueeProps {
  items: string[];
}

export function Marquee({ items }: MarqueeProps): React.ReactElement {
  const marqueeItems = [...items, ...items];

  return (
    <section className="overflow-hidden border-y border-white/10 bg-[#111111] py-5">
      <div className="portfolio-marquee flex w-max gap-6 whitespace-nowrap text-lg font-semibold text-[#ededed]">
        {marqueeItems.map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </section>
  );
}
