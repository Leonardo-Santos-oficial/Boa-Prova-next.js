import { useEffect, useRef } from 'react'

interface ArticleContentProps {
  content: string
}

export default function ArticleContent({ content }: ArticleContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return

    // Add IDs to all h2 and h3 headings
    const headings = contentRef.current.querySelectorAll('h2, h3')
    headings.forEach((heading) => {
      const text = heading.textContent || ''
      const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
      heading.id = id
      
      // Add scroll margin for fixed headers
      if (heading instanceof HTMLElement) {
        heading.style.scrollMarginTop = '5rem'
      }
    })
  }, [content])

  return (
    <div
      ref={contentRef}
      className="prose dark:prose-dark max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h3:text-2xl prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:italic"
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  )
}
