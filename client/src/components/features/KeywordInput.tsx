import { useTranslation } from 'react-i18next'
import { Sparkles } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { apiService } from '@/lib/api'
import { CONTENT_LANGUAGES } from '@/lib/utils'
import Card, { CardHeader } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Slider from '@/components/ui/Slider'
import Button from '@/components/ui/Button'

export default function KeywordInput() {
  const { t } = useTranslation()
  const {
    keyword,
    contentLanguage,
    minWords,
    maxWords,
    isGeneratingTitles,
    setKeyword,
    setContentLanguage,
    setWordRange,
    setTitles,
    setIsGeneratingTitles,
  } = useStore()

  const languageOptions = CONTENT_LANGUAGES.map(lang => ({
    value: lang.code,
    label: lang.name,
  }))

  const handleGenerateTitles = async () => {
    if (!keyword.trim()) {
      alert(t('errors.keywordRequired'))
      return
    }

    setIsGeneratingTitles(true)
    try {
      const response = await apiService.generateTitles({
        keyword: keyword.trim(),
        language: contentLanguage,
      })
      setTitles(response.titles, response.taskId)
    } catch (error) {
      console.error('Failed to generate titles:', error)
      alert(t('errors.generateFailed'))
    } finally {
      setIsGeneratingTitles(false)
    }
  }

  return (
    <Card>
      <CardHeader
        title={t('input.keyword')}
        subtitle={t('app.subtitle')}
      />

      <div className="space-y-6">
        {/* Keyword Input */}
        <Input
          id="keyword"
          label={t('input.keyword')}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={t('input.keywordPlaceholder')}
        />

        {/* Language Selection */}
        <Select
          id="language"
          label={t('input.language')}
          value={contentLanguage}
          onChange={(e) => setContentLanguage(e.target.value)}
          options={languageOptions}
          placeholder={t('input.languagePlaceholder')}
        />

        {/* Word Count Range */}
        <Slider
          label={t('input.wordCount')}
          min={200}
          max={2000}
          step={50}
          value={[minWords, maxWords]}
          onChange={([min, max]) => setWordRange(min, max)}
          formatValue={(min, max) => t('input.wordCountRange', { min, max })}
        />

        {/* Generate Button */}
        <Button
          onClick={handleGenerateTitles}
          loading={isGeneratingTitles}
          disabled={!keyword.trim()}
          className="w-full"
          size="lg"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {isGeneratingTitles ? t('input.generating') : t('input.generateTitles')}
        </Button>
      </div>
    </Card>
  )
}
