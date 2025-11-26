import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Play } from 'lucide-react'
import { useStore } from '@/store/useStore'
import Card, { CardHeader } from '@/components/ui/Card'
import Checkbox from '@/components/ui/Checkbox'
import Button from '@/components/ui/Button'

interface TitleListProps {
  onStartGeneration: () => void
}

export default function TitleList({ onStartGeneration }: TitleListProps) {
  const { t } = useTranslation()
  const {
    titles,
    selectedTitles,
    isGeneratingArticles,
    toggleTitle,
    selectAllTitles,
  } = useStore()

  if (titles.length === 0) {
    return null
  }

  const isAllSelected = selectedTitles.length === titles.length

  return (
    <Card>
      <CardHeader
        title={t('titles.header')}
        subtitle={t('titles.selected', { count: selectedTitles.length })}
        action={
          <Button
            variant="ghost"
            size="sm"
            onClick={selectAllTitles}
          >
            {isAllSelected ? t('titles.selectAll') : t('titles.selectAll')}
          </Button>
        }
      />

      {/* Title List */}
      <div className="space-y-2 mb-6 max-h-[400px] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {titles.map((title, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: index * 0.03 }}
              className="group"
            >
              <label
                className={`
                  flex items-start gap-3 p-4 rounded-apple border cursor-pointer transition-apple
                  ${selectedTitles.includes(title)
                    ? 'border-apple-blue bg-apple-blue/5'
                    : 'border-apple-gray-200 hover:border-apple-gray-300 hover:bg-apple-gray-50'
                  }
                `}
              >
                <Checkbox
                  checked={selectedTitles.includes(title)}
                  onChange={() => toggleTitle(title)}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-apple-gray-400 flex-shrink-0" />
                    <span className="text-sm text-apple-gray-600 line-clamp-2">
                      {title}
                    </span>
                  </div>
                </div>
              </label>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Generate Articles Button */}
      <Button
        onClick={onStartGeneration}
        disabled={selectedTitles.length === 0 || isGeneratingArticles}
        className="w-full"
        size="lg"
      >
        <Play className="w-4 h-4 mr-2" />
        {t('titles.generateArticles')} ({selectedTitles.length})
      </Button>
    </Card>
  )
}
