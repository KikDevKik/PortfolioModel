/*
  Flags drawn as simple SVG backgrounds for the representation cards.
  Add a country here and it becomes available in the editor ("Flag").
*/
export const FLAG_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Brazil', value: 'br' },
  { label: 'Colombia', value: 'co' },
  { label: 'Japan', value: 'jp' },
  { label: 'France', value: 'fr' },
  { label: 'Italy', value: 'it' },
  { label: 'Germany', value: 'de' },
] as const;

export type FlagCode = (typeof FLAG_OPTIONS)[number]['value'];

export default function Flag({ code }: { code: string }) {
  const common = { viewBox: '0 0 300 200', preserveAspectRatio: 'xMidYMid slice', 'aria-hidden': true, className: 'flag' } as const;
  switch (code) {
    case 'co':
      return (
        <svg {...common}>
          <rect width="300" height="100" fill="#FCD116" />
          <rect y="100" width="300" height="50" fill="#003893" />
          <rect y="150" width="300" height="50" fill="#CE1126" />
        </svg>
      );
    case 'br':
      return (
        <svg {...common}>
          <rect width="300" height="200" fill="#009C3B" />
          <polygon points="150,22 278,100 150,178 22,100" fill="#FFDF00" />
          <circle cx="150" cy="100" r="46" fill="#002776" />
          <path d="M106 90 Q150 76 194 104" stroke="#fff" strokeWidth="9" fill="none" />
        </svg>
      );
    case 'jp':
      return (
        <svg {...common}>
          <rect width="300" height="200" fill="#fff" />
          <circle cx="150" cy="100" r="60" fill="#BC002D" />
        </svg>
      );
    case 'fr':
      return (
        <svg {...common}>
          <rect width="100" height="200" fill="#0055A4" />
          <rect x="100" width="100" height="200" fill="#fff" />
          <rect x="200" width="100" height="200" fill="#EF4135" />
        </svg>
      );
    case 'it':
      return (
        <svg {...common}>
          <rect width="100" height="200" fill="#009246" />
          <rect x="100" width="100" height="200" fill="#fff" />
          <rect x="200" width="100" height="200" fill="#CE2B37" />
        </svg>
      );
    case 'de':
      return (
        <svg {...common}>
          <rect width="300" height="67" fill="#000" />
          <rect y="67" width="300" height="66" fill="#DD0000" />
          <rect y="133" width="300" height="67" fill="#FFCE00" />
        </svg>
      );
    default:
      return null;
  }
}
