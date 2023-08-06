import { cn } from '@/lib/utils'
import hljs from 'highlight.js/lib/core'

export default function Code({ children, language, className }: { children: string, language: string, className?: string }) {
  const myHtml = hljs.highlight(children, { language }).value
  return (
    <pre className={cn('bg-[#333333] w-full h-full', className)}>
      <code dangerouslySetInnerHTML={{ __html: myHtml }} className='break-all whitespace-break-spaces' />
    </pre>
  )
}