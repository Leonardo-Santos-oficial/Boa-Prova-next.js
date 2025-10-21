interface ArticleHeaderProps {
  title: string
  date: string
  author?: {
    node: {
      name: string
      avatar: {
        url: string
      }
    }
  }
  categories?: Array<{
    name: string
    uri: string
  }>
}

export default function ArticleHeader({ title, date, author, categories }: ArticleHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        {title}
      </h1>
      
      <div className="flex items-center justify-between mb-4">
        <time className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(date).toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </time>
        
        {author && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Por {author.node.name}
            </span>
          </div>
        )}
      </div>

      {categories && categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <span 
              key={category.uri}
              className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm"
            >
              {category.name}
            </span>
          ))}
        </div>
      )}
    </header>
  )
}
