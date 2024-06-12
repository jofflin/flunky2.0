'use client'
import { useTitleContext } from '@/context/title'

export default function HeaderTitle() {
  const { title } = useTitleContext()

  return <h1 className="text-2xl font-light truncate">{title}</h1>
}
