import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  CheckCircle,
  XCircle,
  Loader2,
  Clock,
  Eye,
  RefreshCw,
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import type { Article } from '@/lib/api'
import Card, { CardHeader } from '@/components/ui/Card'
import Progress from '@/components/ui/Progress'
import Button from '@/components/ui/Button'

interface ArticleListProps {
  onPreview: (article: Article) => void
  onRegenerate: (article: Article) => void
}

export default function ArticleList({ onPreview, onRegenerate }: ArticleListProps) {
  const { t } = useTranslation()
  const {
    articles,
    selectedTitles,
    currentGeneratingIndex,
    isGeneratingArticles,
  } = useStore()

  if (articles.length === 0 && !isGeneratingArticles) {
    return null
  }

  const completedCount = articles.filter(a => a.status === 'completed').length
  const totalCount = selectedTitles.length || articles.length

  const getStatusIcon = (status: Article['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-apple-green" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-apple-red" />
      case 'generating':
        return <Loader2 className="w-5 h-5 text-apple-blue animate-spin" />
      default:
        return <Clock className="w-5 h-5 text-apple-gray-400" />
    }
  }

  return (
    <Card>
      <CardHeader
        title={t('articles.header')}
        subtitle={
          isGeneratingArticles
            ? t('articles.progress', {
                current: currentGeneratingIndex + 1,
                total: totalCount,
              })
            : completedCount === totalCount
            ? t('articles.completed')
            : undefined
        }
      />

      {/* Progress Bar */}
      {(isGeneratingArticles || articles.length > 0) && (
        <div className="mb-6">
          <Progress
            value={completedCount}
            max={totalCount}
            showLabel
            label={`${completedCount} / ${totalCount}`}
          />
        </div>
      )}

      {/* Article List */}
      <div className="space-y-3">
        {articles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
              flex items-center gap-4 p-4 rounded-apple border transition-apple
              ${article.status === 'completed'
                ? 'border-apple-green/30 bg-apple-green/5'
                : article.status === 'failed'
                ? 'border-apple-red/30 bg-apple-red/5'
                : article.status === 'generating'
                ? 'border-apple-blue/30 bg-apple-blue/5'
                : 'border-apple-gray-200'
              }
            `}
          >
            {/* Status Icon */}
            <div className="flex-shrink-0">
              {getStatusIcon(article.status)}
            </div>

            {/* Title */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-apple-gray-600 truncate">
                {article.title}
              </p>
              <p className="text-xs text-apple-gray-400 mt-0.5">
                {t(`articles.status.${article.status}`)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {article.status === 'completed' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPreview(article)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              )}
              {(article.status === 'completed' || article.status === 'failed') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRegenerate(article)}
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              )}
            </div>
          </motion.div>
        ))}

        {/* Pending titles (not yet started) */}
        {isGeneratingArticles &&
          selectedTitles.slice(articles.length).map((title, index) => (
            <div
              key={`pending-${index}`}
              className="flex items-center gap-4 p-4 rounded-apple border border-apple-gray-200 opacity-50"
            >
              <Clock className="w-5 h-5 text-apple-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-apple-gray-500 truncate">{title}</p>
                <p className="text-xs text-apple-gray-400 mt-0.5">
                  {t('articles.status.pending')}
                </p>
              </div>
            </div>
          ))}
      </div>
    </Card>
  )
}
