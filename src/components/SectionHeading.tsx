import type { ReactNode } from 'react'

type SectionHeadingProps = {
  eyebrow?: string
  title: ReactNode
  text?: ReactNode
  align?: 'left' | 'center'
  tone?: 'ink' | 'ivory'
  size?: 'md' | 'lg'
  className?: string
  as?: 'h1' | 'h2' | 'h3'
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = 'left',
  tone = 'ink',
  size = 'lg',
  className = '',
  as = 'h2',
}: SectionHeadingProps) {
  const Tag = as
  const alignClass = align === 'center' ? 'mx-auto text-center items-center' : ''
  const titleClass = size === 'lg' ? 'display-lg' : 'display-md'
  const textColor = tone === 'ivory' ? 'text-ivory/75' : 'text-ink-soft'
  return (
    <div className={`reveal flex max-w-2xl flex-col ${alignClass} ${className}`}>
      {eyebrow && <span className="eyebrow mb-5">{eyebrow}</span>}
      <Tag className={`${titleClass} ${tone === 'ivory' ? 'text-ivory' : 'text-ink'}`}>{title}</Tag>
      {text && (
        <p className={`mt-5 text-lg leading-relaxed ${textColor}`} style={{ fontWeight: 300 }}>
          {text}
        </p>
      )}
    </div>
  )
}
