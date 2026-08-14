import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { name: string };

export function Icon({ name, ...props }: IconProps) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    ...props,
  };

  const paths: Record<string, React.ReactNode> = {
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18M8 15l2 2 5-5"/></>,
    video: <><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3z"/></>,
    chat: <><path d="M21 15a4 4 0 0 1-4 4H8l-5 3 1.6-4A7 7 0 0 1 3 13V9a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/></>,
    check: <><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></>,
    shield: <><path d="M12 3 20 6v5c0 5-3.2 8.2-8 10-4.8-1.8-8-5-8-10V6z"/><path d="m9.5 12 1.7 1.7 3.5-4"/></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    play: <><circle cx="12" cy="12" r="9"/><path d="m10 9 5 3-5 3z"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></>,
    whatsapp: <><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z"/><path d="M9 8.5c.5 2.6 2.2 4.3 4.8 5l1.2-1.2 2 .7c.2 1.2-.2 2.2-1.2 2.7-4.2.1-7.7-3.4-7.7-7.7.4-.9 1.4-1.3 2.5-1.1l.7 2-1.3 1.1"/></>,
  };

  return <svg {...common}>{paths[name]}</svg>;
}
