/*
  A decorative magazine barcode. The bars are generated from the digits
  (your measurements), and the digits are printed underneath — a detail
  only people who look closely will notice.
*/
export default function Barcode({ value }: { value: string }) {
  const digits = value.replace(/\D/g, '').split('').map(Number);
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  const guard = () => {
    bars.push({ x, w: 1 });
    x += 2;
    bars.push({ x, w: 1 });
    x += 2;
  };
  guard();
  digits.forEach((d, i) => {
    const pattern = [1 + (d % 3), 1 + ((d + i) % 2), 2 + ((d * 3) % 2), 1 + ((d + 1) % 3)];
    pattern.forEach((w, k) => {
      if (k % 2 === 0) bars.push({ x, w });
      x += w;
    });
    x += 1;
  });
  guard();
  const width = x;

  return (
    <div className="barcode">
      <svg viewBox={`0 0 ${width} 40`} preserveAspectRatio="none" aria-hidden="true">
        {bars.map((b, i) => (
          <rect key={i} x={b.x} y={0} width={b.w} height={40} />
        ))}
      </svg>
      <span>{value}</span>
    </div>
  );
}
