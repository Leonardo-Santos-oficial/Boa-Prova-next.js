interface ArticleContentProps {
  content: string
}

export default function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div 
      className="prose dark:prose-dark max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h3:text-2xl prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:italic"
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  )
}
