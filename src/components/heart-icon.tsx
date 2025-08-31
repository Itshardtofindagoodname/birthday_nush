import type * as React from "react"

type Props = React.SVGProps<SVGSVGElement> & { className?: string }

export function HeartIcon({ className, ...props }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...props}>
      <path
        fill="currentColor"
        d="M12.1 21.35c-.1.07-.23.07-.33 0C7.14 17.86 4 15.06 4 11.66 4 9.28 5.86 7.5 8.14 7.5c1.38 0 2.73.64 3.56 1.67.83-1.03 2.18-1.67 3.56-1.67 2.28 0 4.14 1.78 4.14 4.16 0 3.4-3.14 6.2-7.4 9.69z"
      />
    </svg>
  )
}
