import hljs from 'highlight.js/lib/core'

export default function Code({ children, language, className }: { children: string, language: string, className?: string }) {
  const myHtml = hljs.highlight(children, { language }).value
  return (
    <pre className={`bg-[#333333] ${className}`}>
      <code dangerouslySetInnerHTML={{ __html: myHtml }} />
    </pre>
  )
}