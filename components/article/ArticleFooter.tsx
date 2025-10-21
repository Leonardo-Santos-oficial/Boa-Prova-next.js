interface ArticleFooterProps {
  tags?: Array<{
    name: string
    uri: string
  }>
}

export default function ArticleFooter({ tags }: ArticleFooterProps) {
  if (!tags || tags.length === 0) return null

  return (
    <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Tags
      </h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span 
            key={tag.uri}
            className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {tag.name}
          </span>
        ))}
      </div>
    </footer>
  )
}
