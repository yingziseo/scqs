import type { Article } from '@/lib/api'
import Modal from '@/components/ui/Modal'

interface ArticlePreviewProps {
  article: Article | null
  onClose: () => void
}

export default function ArticlePreview({ article, onClose }: ArticlePreviewProps) {

  if (!article) return null

  return (
    <Modal
      isOpen={!!article}
      onClose={onClose}
      title={article.title}
      size="lg"
    >
      <article className="prose prose-apple max-w-none">
        {article.sections?.map((section, index) => (
          <div key={index} className="mb-6">
            {section.h2 && (
              <h2 className="text-xl font-semibold text-apple-gray-600 mb-3">
                {section.h2}
              </h2>
            )}
            <div className="text-apple-gray-500 leading-relaxed whitespace-pre-wrap">
              {section.content}
            </div>
          </div>
        ))}

        {/* Fallback to raw content if no sections */}
        {(!article.sections || article.sections.length === 0) && article.content && (
          <div className="text-apple-gray-500 leading-relaxed whitespace-pre-wrap">
            {article.content}
          </div>
        )}
      </article>
    </Modal>
  )
}
