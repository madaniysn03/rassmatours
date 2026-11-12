import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

const base = (size: number, props: IconProps) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
  ...props,
})

export const ArrowRightIcon = ({ size = 20, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const ArrowUpRightIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
)

export const MenuIcon = ({ size = 22, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

export const CloseIcon = ({ size = 22, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const ClockIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
)

export const PinIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
)

export const PhoneIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M6.5 3h3l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5L17 13l4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5a2 2 0 0 1 2-2Z" />
  </svg>
)

export const MessageIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M4.5 5.5h15a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H10l-4.5 3.5V16.5h-1a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z" />
    <path d="M8 10h8M8 13h5" />
  </svg>
)

export const MailIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </svg>
)

export const CheckIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
)

export const PlusIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const UsersIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 19a5.5 5.5 0 0 1 11 0M15.5 5.5a3 3 0 0 1 0 5.8M17 14.2a5 5 0 0 1 3.5 4.8" />
  </svg>
)

export const LanguageIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.5 2.7 2.5 14.3 0 17M12 3.5c-2.5 2.7-2.5 14.3 0 17" />
  </svg>
)

export const CarIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M4 13.5 5.8 8.2A2 2 0 0 1 7.7 7h8.6a2 2 0 0 1 1.9 1.2L20 13.5M4 13.5h16v4H4zM6.5 17.5V19M17.5 17.5V19" />
    <circle cx="7.5" cy="15.5" r=".8" fill="currentColor" />
    <circle cx="16.5" cy="15.5" r=".8" fill="currentColor" />
  </svg>
)

/** Pictogramme WhatsApp (tracé simplifié, monochrome). */
export const WhatsAppIcon = ({ size = 18, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable={false} {...props}>
    <path d="M12 2.2a9.8 9.8 0 0 0-8.4 14.8L2.3 21.8l4.9-1.3A9.8 9.8 0 1 0 12 2.2Zm0 17.9a8.1 8.1 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8.1 8.1 0 1 1 12 20.1Zm4.5-6c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.3-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.1.6 2.8.5a2.4 2.4 0 0 0 1.6-1.1c.2-.6.2-1 .1-1.1l-.5-.3Z" />
  </svg>
)
