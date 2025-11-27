import { ReactNode } from 'react'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-lg border bg-white shadow-sm ${className}`}>{children}</div>
}
export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-4 py-3 border-b ${className}`}>{children}</div>
}
export function CardBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-4 py-3 ${className}`}>{children}</div>
}
export function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-4 py-3 border-t ${className}`}>{children}</div>
}
