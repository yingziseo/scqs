import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Globe,
  FileText,
  Check,
  Play,
  Eye,
  RefreshCw,
  Download,
  Loader2,
  XCircle,
  Clock,
  ChevronLeft,
  Settings,
  Image as ImageIcon,
  ArrowRight,
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { apiService, type Article } from '@/lib/api'
import { CONTENT_LANGUAGES } from '@/lib/utils'

// ============ Header Component ============
function Header() {
  const { i18n } = useTranslation()
  const { currentStep, reset } = useStore()

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh')
  }

  return (
    <header className="glass sticky top-0 z-50 border-b border-black/5">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={reset}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0071e3] to-[#00c7be] flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-[17px] font-semibold tracking-tight">SEO Writer</h1>
            <p className="text-[11px] text-secondary tracking-wide">Powered by AI</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 text-sm">
            <span className="text-tertiary">步骤</span>
            <span className="font-semibold text-[#0071e3]">{currentStep}</span>
            <span className="text-tertiary">/ 5</span>
          </div>
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 hover:bg-black/10 transition-all text-sm font-medium"
          >
            <Globe className="w-4 h-4" />
            {i18n.language === 'zh' ? 'EN' : '中文'}
          </button>
        </div>
      </div>
    </header>
  )
}

// ============ Step Progress Bar ============
function StepProgressBar({ currentStep }: { currentStep: number }) {
  const steps = [
    { num: 1, label: '关键词' },
    { num: 2, label: '选标题' },
    { num: 3, label: '配置' },
    { num: 4, label: '生成文章' },
    { num: 5, label: '配图导出' },
  ]

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-[#e8e8ed]" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-[#0071e3] transition-all duration-500"
          style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
        />

        {steps.map((step) => (
          <div key={step.num} className="flex flex-col items-center relative z-10">
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                ${currentStep >= step.num
                  ? 'bg-[#0071e3] text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white border-2 border-[#e8e8ed] text-tertiary'
                }
              `}
            >
              {currentStep > step.num ? <Check className="w-4 h-4" /> : step.num}
            </div>
            <span className={`mt-2 text-xs font-medium ${
              currentStep >= step.num ? 'text-[#0071e3]' : 'text-tertiary'
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============ Back Button ============
function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-[#0071e3] hover:text-[#0077ed] transition-colors mb-6 group"
    >
      <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      <span className="font-medium">返回上一步</span>
    </button>
  )
}

// ============ Step 1: Keyword Input ============
function Step1KeywordInput() {
  const {
    keyword,
    customPrompt,
    contentLanguage,
    isGeneratingTitles,
    setKeyword,
    setCustomPrompt,
    setContentLanguage,
    setTitles,
    setIsGeneratingTitles,
  } = useStore()

  const handleGenerate = async () => {
    if (!keyword.trim()) return
    setIsGeneratingTitles(true)
    try {
      const res = await apiService.generateTitles({
        keyword: keyword.trim(),
        language: contentLanguage,
        customPrompt: customPrompt.trim() || undefined,
      })
      setTitles(res.titles, res.taskId)
    } catch (e) {
      console.error(e)
      alert('生成失败，请重试')
    } finally {
      setIsGeneratingTitles(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-xl mx-auto"
    >
      <div className="text-center mb-10">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-xl shadow-purple-500/25">
          <FileText className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-3">输入SEO关键词</h2>
        <p className="text-secondary text-lg">AI将为您生成40个高质量SEO标题</p>
      </div>

      <div className="card-premium p-8">
        <div className="space-y-6">
          <div>
            <label className="label-premium">关键词 <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="输入您想要优化的关键词..."
              className="input-premium text-lg"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              autoFocus
            />
          </div>

          <div>
            <label className="label-premium">补充描述 <span className="text-tertiary text-xs font-normal">(可选，提高生成质量)</span></label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="描述您的行业、目标受众、内容风格等，例如：\n• 这是一篇面向电商卖家的运营指南\n• 目标读者是30-45岁的职场白领\n• 希望内容专业且有深度"
              className="input-premium text-base resize-none"
              rows={4}
            />
            <p className="text-xs text-tertiary mt-2">
              💡 提示：详细的描述有助于AI生成更贴合您需求的标题、文章内容和配图
            </p>
          </div>

          <div>
            <label className="label-premium">内容语言</label>
            <select
              value={contentLanguage}
              onChange={(e) => setContentLanguage(e.target.value)}
              className="select-premium"
            >
              {CONTENT_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!keyword.trim() || isGeneratingTitles}
            className="btn-premium btn-primary w-full h-14 text-lg mt-4"
          >
            {isGeneratingTitles ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                正在生成标题...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                生成40个SEO标题
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ============ Step 2: Title Selection (Select 5 from 40) ============
function Step2TitleSelection() {
  const {
    titles,
    selectedTitles,
    toggleTitle,
    selectAllTitles,
    goBack,
    setStep,
  } = useStore()

  const handleNext = () => {
    if (selectedTitles.length === 5) {
      setStep(3)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto"
    >
      <BackButton onClick={goBack} />

      <div className="card-premium p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">选择5个标题</h2>
              <p className="text-secondary">
                已选择 <span className="text-[#0071e3] font-bold">{selectedTitles.length}</span> / 5 个标题
              </p>
            </div>
          </div>
          <button
            onClick={selectAllTitles}
            className="btn-premium btn-secondary text-sm px-4 py-2"
          >
            {selectedTitles.length === 5 ? '取消全选' : '选择前5个'}
          </button>
        </div>

        {/* Selection Progress */}
        <div className="mb-6">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full transition-all ${
                  i <= selectedTitles.length ? 'bg-[#0071e3]' : 'bg-[#e8e8ed]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Title Grid - 4 columns x 10 rows */}
        <div className="grid grid-cols-4 gap-3 max-h-[520px] overflow-y-auto pr-2">
          {titles.map((title, idx) => {
            const isSelected = selectedTitles.includes(title)
            const canSelect = isSelected || selectedTitles.length < 5

            return (
              <motion.label
                key={title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.01 }}
                className={`
                  flex flex-col gap-2 p-3 rounded-xl cursor-pointer transition-all min-h-[100px]
                  ${isSelected
                    ? 'bg-[#0071e3]/8 border-2 border-[#0071e3]/40'
                    : canSelect
                    ? 'bg-[#f5f5f7] border-2 border-transparent hover:bg-[#ebebed]'
                    : 'bg-[#f5f5f7]/50 border-2 border-transparent opacity-50 cursor-not-allowed'
                  }
                `}
                onClick={() => canSelect && toggleTitle(title)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-tertiary font-medium">#{idx + 1}</span>
                  <div
                    className={`
                      w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all
                      ${isSelected
                        ? 'bg-[#0071e3] shadow-lg shadow-blue-500/30'
                        : 'bg-white border-2 border-[#d1d1d6]'
                      }
                    `}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                  </div>
                </div>
                <span className="text-[13px] leading-snug line-clamp-3 flex-1">{title}</span>
              </motion.label>
            )
          })}
        </div>

        <button
          onClick={handleNext}
          disabled={selectedTitles.length !== 5}
          className="btn-premium btn-primary w-full h-14 text-lg mt-6"
        >
          <Settings className="w-5 h-5" />
          下一步：配置文章参数
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </motion.div>
  )
}

// ============ Step 3: Article Config ============
function Step3ArticleConfig() {
  const {
    minWords,
    maxWords,
    minH2,
    maxH2,
    minH2Words,
    maxH2Words,
    setWordRange,
    setH2Range,
    setH2WordsRange,
    goBack,
    setStep,
  } = useStore()

  const handleNext = () => {
    setStep(4)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-xl mx-auto"
    >
      <BackButton onClick={goBack} />

      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 shadow-xl shadow-blue-500/25">
          <Settings className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-3">配置文章参数</h2>
        <p className="text-secondary text-lg">设置文章字数、H2数量和段落字数</p>
      </div>

      <div className="card-premium p-8 space-y-8">
        {/* Word Count Range */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-lg font-semibold">文章总字数</label>
            <span className="text-lg font-bold text-[#0071e3]">
              {minWords} - {maxWords} 字
            </span>
          </div>
          <div className="bg-[#f5f5f7] rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-xs text-tertiary mb-1 block">最少字数</label>
                <input
                  type="range"
                  min={400}
                  max={2000}
                  step={100}
                  value={minWords}
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    setWordRange(val, Math.max(val + 200, maxWords))
                  }}
                  className="w-full h-2 bg-[#e8e8ed] rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md
                    [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0071e3] [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <div className="text-center text-sm font-medium mt-1">{minWords}</div>
              </div>
              <span className="text-2xl text-tertiary">—</span>
              <div className="flex-1">
                <label className="text-xs text-tertiary mb-1 block">最多字数</label>
                <input
                  type="range"
                  min={600}
                  max={3000}
                  step={100}
                  value={maxWords}
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    setWordRange(Math.min(minWords, val - 200), val)
                  }}
                  className="w-full h-2 bg-[#e8e8ed] rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md
                    [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0071e3] [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <div className="text-center text-sm font-medium mt-1">{maxWords}</div>
              </div>
            </div>
          </div>
        </div>

        {/* H2 Count Range */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-lg font-semibold">H2标题数量</label>
            <span className="text-lg font-bold text-[#0071e3]">
              {minH2} - {maxH2} 个
            </span>
          </div>
          <div className="bg-[#f5f5f7] rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-xs text-tertiary mb-1 block">最少H2</label>
                <input
                  type="range"
                  min={3}
                  max={10}
                  step={1}
                  value={minH2}
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    setH2Range(val, Math.max(val + 1, maxH2))
                  }}
                  className="w-full h-2 bg-[#e8e8ed] rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md
                    [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0071e3] [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <div className="text-center text-sm font-medium mt-1">{minH2}</div>
              </div>
              <span className="text-2xl text-tertiary">—</span>
              <div className="flex-1">
                <label className="text-xs text-tertiary mb-1 block">最多H2</label>
                <input
                  type="range"
                  min={4}
                  max={12}
                  step={1}
                  value={maxH2}
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    setH2Range(Math.min(minH2, val - 1), val)
                  }}
                  className="w-full h-2 bg-[#e8e8ed] rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md
                    [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0071e3] [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <div className="text-center text-sm font-medium mt-1">{maxH2}</div>
              </div>
            </div>
          </div>
        </div>

        {/* H2 Section Word Count Range */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-lg font-semibold">每个H2段落字数</label>
            <span className="text-lg font-bold text-[#0071e3]">
              {minH2Words} - {maxH2Words} 字
            </span>
          </div>
          <div className="bg-[#f5f5f7] rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-xs text-tertiary mb-1 block">最少字数</label>
                <input
                  type="range"
                  min={50}
                  max={300}
                  step={10}
                  value={minH2Words}
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    setH2WordsRange(val, Math.max(val + 50, maxH2Words))
                  }}
                  className="w-full h-2 bg-[#e8e8ed] rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md
                    [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0071e3] [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <div className="text-center text-sm font-medium mt-1">{minH2Words}</div>
              </div>
              <span className="text-2xl text-tertiary">—</span>
              <div className="flex-1">
                <label className="text-xs text-tertiary mb-1 block">最多字数</label>
                <input
                  type="range"
                  min={100}
                  max={500}
                  step={10}
                  value={maxH2Words}
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    setH2WordsRange(Math.min(minH2Words, val - 50), val)
                  }}
                  className="w-full h-2 bg-[#e8e8ed] rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md
                    [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0071e3] [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <div className="text-center text-sm font-medium mt-1">{maxH2Words}</div>
              </div>
            </div>
          </div>
          <p className="text-xs text-tertiary mt-2">
            💡 每个H2小标题下段落的字数要求，更详细的内容需要更多字数
          </p>
        </div>

        <button
          onClick={handleNext}
          className="btn-premium btn-primary w-full h-14 text-lg"
        >
          <Play className="w-5 h-5" />
          开始批量生成5篇文章
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </motion.div>
  )
}

// ============ Step 4: Article Generation & Selection ============
function Step4ArticleGeneration() {
  const {
    articles,
    selectedTitles,
    selectedArticleId,
    currentGeneratingIndex,
    isGeneratingArticles,
    taskId,
    keyword,
    customPrompt,
    contentLanguage,
    minWords,
    maxWords,
    minH2,
    maxH2,
    minH2Words,
    maxH2Words,
    goBack,
    setStep,
    setIsGeneratingArticles,
    setCurrentGeneratingIndex,
    addArticle,
    updateArticle,
    setSelectedArticleId,
  } = useStore()

  const [previewArticle, setPreviewArticle] = useState<Article | null>(null)

  // Start generation if not started yet
  const startGeneration = async () => {
    if (!taskId || selectedTitles.length === 0 || isGeneratingArticles) return
    setIsGeneratingArticles(true)

    for (let i = 0; i < selectedTitles.length; i++) {
      setCurrentGeneratingIndex(i)
      const title = selectedTitles[i]
      try {
        const res = await apiService.generateArticle({
          taskId,
          title,
          keyword,
          language: contentLanguage,
          minWords,
          maxWords,
          minH2,
          maxH2,
          minH2Words,
          maxH2Words,
          customPrompt: customPrompt.trim() || undefined,
        })
        addArticle(res.article)
      } catch (e) {
        addArticle({
          id: `failed-${Date.now()}-${i}`,
          title,
          content: '',
          sections: [],
          status: 'failed',
        })
      }
    }

    setCurrentGeneratingIndex(-1)
    setIsGeneratingArticles(false)
  }

  const handleRegenerate = async (article: Article) => {
    if (!taskId) return
    updateArticle(article.id, { status: 'generating' })
    try {
      const res = await apiService.regenerateArticle(article.id, {
        taskId,
        title: article.title,
        keyword,
        language: contentLanguage,
        minWords,
        maxWords,
        minH2,
        maxH2,
        minH2Words,
        maxH2Words,
        customPrompt: customPrompt.trim() || undefined,
      })
      updateArticle(article.id, {
        content: res.article.content,
        sections: res.article.sections,
        status: 'completed',
      })
    } catch (e) {
      updateArticle(article.id, { status: 'failed' })
    }
  }

  const handleSelectArticle = (id: string) => {
    setSelectedArticleId(id)
  }

  const handleNext = () => {
    if (selectedArticleId) {
      setStep(5)
    }
  }

  // Auto-start generation on mount
  useState(() => {
    if (articles.length === 0 && !isGeneratingArticles) {
      startGeneration()
    }
  })

  const completedCount = articles.filter((a) => a.status === 'completed').length
  const totalCount = selectedTitles.length || 5
  const progress = totalCount > 0 ? (articles.length / totalCount) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto"
    >
      <BackButton onClick={goBack} />

      <div className="card-premium p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">文章生成</h2>
            <p className="text-secondary">
              {isGeneratingArticles
                ? `正在生成第 ${currentGeneratingIndex + 1} / ${totalCount} 篇`
                : completedCount === totalCount
                ? '全部完成！请选择一篇满意的文章'
                : `${completedCount} / ${totalCount} 篇已完成`}
            </p>
          </div>
          {!isGeneratingArticles && articles.length === 0 && (
            <button onClick={startGeneration} className="btn-premium btn-primary">
              <Play className="w-4 h-4" />
              开始生成
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="progress-premium mb-6">
          <div className="progress-premium-bar" style={{ width: `${progress}%` }} />
        </div>

        {/* Article List */}
        <div className="space-y-3">
          {articles.map((article, idx) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`
                flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer
                ${selectedArticleId === article.id
                  ? 'bg-[#0071e3]/10 border-2 border-[#0071e3]'
                  : article.status === 'completed' ? 'bg-green-50 hover:bg-green-100 border-2 border-transparent' : ''
                }
                ${article.status === 'failed' ? 'bg-red-50 border-2 border-transparent' : ''}
                ${article.status === 'generating' ? 'bg-blue-50 border-2 border-transparent' : ''}
                ${article.status === 'pending' ? 'bg-[#f5f5f7] border-2 border-transparent' : ''}
              `}
              onClick={() => article.status === 'completed' && handleSelectArticle(article.id)}
            >
              {/* Selection Radio */}
              <div
                className={`
                  w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all
                  ${selectedArticleId === article.id
                    ? 'bg-[#0071e3] shadow-lg shadow-blue-500/30'
                    : article.status === 'completed'
                    ? 'bg-white border-2 border-[#d1d1d6]'
                    : 'bg-transparent'
                  }
                `}
              >
                {selectedArticleId === article.id && <Check className="w-4 h-4 text-white" />}
                {article.status === 'generating' && <Loader2 className="w-4 h-4 text-[#0071e3] animate-spin" />}
                {article.status === 'failed' && <XCircle className="w-4 h-4 text-red-500" />}
                {article.status === 'pending' && <Clock className="w-4 h-4 text-tertiary" />}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-medium truncate">{article.title}</p>
                <p className="text-xs text-tertiary mt-0.5">
                  {article.status === 'completed' && `${article.sections?.length || 0} 个H2段落`}
                  {article.status === 'generating' && '正在生成...'}
                  {article.status === 'failed' && '生成失败'}
                  {article.status === 'pending' && '等待中'}
                </p>
              </div>

              {(article.status === 'completed' || article.status === 'failed') && (
                <div className="flex items-center gap-2">
                  {article.status === 'completed' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setPreviewArticle(article) }}
                      className="p-2 rounded-lg hover:bg-black/5 transition-colors"
                      title="预览"
                    >
                      <Eye className="w-4 h-4 text-[#0071e3]" />
                    </button>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRegenerate(article) }}
                    className="p-2 rounded-lg hover:bg-black/5 transition-colors"
                    title="重新生成"
                  >
                    <RefreshCw className="w-4 h-4 text-tertiary" />
                  </button>
                </div>
              )}
            </motion.div>
          ))}

          {/* Pending items */}
          {isGeneratingArticles &&
            selectedTitles.slice(articles.length).map((title, idx) => (
              <div
                key={`pending-${idx}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#f5f5f7] opacity-50 border-2 border-transparent"
              >
                <Clock className="w-5 h-5 text-tertiary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] truncate">{title}</p>
                  <p className="text-xs text-tertiary mt-0.5">等待中</p>
                </div>
              </div>
            ))}
        </div>

        <button
          onClick={handleNext}
          disabled={!selectedArticleId || isGeneratingArticles}
          className="btn-premium btn-primary w-full h-14 text-lg mt-6"
        >
          <ImageIcon className="w-5 h-5" />
          下一步：为H2标题生成配图
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>

      {/* Preview Modal */}
      <PreviewModal article={previewArticle} onClose={() => setPreviewArticle(null)} />
    </motion.div>
  )
}

// ============ Step 5: Image Generation & Export ============
function Step5ImageGeneration() {
  const {
    articles,
    selectedArticleId,
    keyword,
    customPrompt,
    generatingImageIndex,
    goBack,
    updateArticle,
    updateArticleSection,
    updateArticleCover,
    setGeneratingImageIndex,
  } = useStore()

  const [isExporting, setIsExporting] = useState(false)
  const [isGeneratingCover, setIsGeneratingCover] = useState(false)
  const [isGeneratingAll, setIsGeneratingAll] = useState(false)

  const selectedArticle = articles.find((a) => a.id === selectedArticleId)

  if (!selectedArticle) {
    return <div className="text-center py-20 text-secondary">未找到选中的文章</div>
  }

  // 生成单个H2配图
  const handleGenerateImage = async (sectionIndex: number) => {
    if (!selectedArticle || generatingImageIndex !== null || isGeneratingAll) return

    const section = selectedArticle.sections[sectionIndex]
    if (!section) return

    setGeneratingImageIndex(sectionIndex)
    updateArticleSection(selectedArticle.id, sectionIndex, { imageStatus: 'generating' })

    try {
      const res = await apiService.generateImage({
        articleId: selectedArticle.id,
        sectionIndex,
        h2Title: section.h2,
        keyword,
        customPrompt: customPrompt.trim() || undefined,
      })

      updateArticleSection(selectedArticle.id, sectionIndex, {
        imageUrl: res.imageUrl,
        imageBase64: res.imageBase64,
        imageStatus: 'completed',
      })
    } catch (e) {
      console.error('Image generation failed:', e)
      updateArticleSection(selectedArticle.id, sectionIndex, {
        imageStatus: 'failed',
      })
    } finally {
      setGeneratingImageIndex(null)
    }
  }

  // 生成封面图
  const handleGenerateCover = async () => {
    if (!selectedArticle || isGeneratingCover || isGeneratingAll) return

    setIsGeneratingCover(true)
    updateArticleCover(selectedArticle.id, null, null, 'generating')

    try {
      const res = await apiService.generateCover({
        articleId: selectedArticle.id,
        title: selectedArticle.title,
        keyword,
        customPrompt: customPrompt.trim() || undefined,
      })

      updateArticleCover(selectedArticle.id, res.coverUrl, res.coverBase64, 'completed')
    } catch (e) {
      console.error('Cover generation failed:', e)
      updateArticleCover(selectedArticle.id, null, null, 'failed')
    } finally {
      setIsGeneratingCover(false)
    }
  }

  // 一键生成所有配图（封面+所有H2）
  const handleGenerateAllImages = async () => {
    if (!selectedArticle || isGeneratingAll || generatingImageIndex !== null || isGeneratingCover) return

    setIsGeneratingAll(true)

    // 更新所有状态为 generating
    updateArticleCover(selectedArticle.id, null, null, 'generating')
    selectedArticle.sections.forEach((_, idx) => {
      updateArticleSection(selectedArticle.id, idx, { imageStatus: 'generating' })
    })

    try {
      const res = await apiService.generateAllImages({
        articleId: selectedArticle.id,
        keyword,
        customPrompt: customPrompt.trim() || undefined,
      })

      // 更新封面结果
      if (res.results.cover) {
        if (res.results.cover.success) {
          updateArticleCover(
            selectedArticle.id,
            res.results.cover.url || null,
            res.results.cover.base64 || null,
            'completed'
          )
        } else {
          updateArticleCover(selectedArticle.id, null, null, 'failed')
        }
      }

      // 更新各段落结果
      res.results.sections.forEach((sectionResult) => {
        if (sectionResult.success) {
          updateArticleSection(selectedArticle.id, sectionResult.sectionIndex, {
            imageUrl: sectionResult.url || null,
            imageBase64: sectionResult.url || null, // API返回的是base64格式的URL
            imageStatus: 'completed',
          })
        } else {
          updateArticleSection(selectedArticle.id, sectionResult.sectionIndex, {
            imageStatus: 'failed',
          })
        }
      })
    } catch (e) {
      console.error('Generate all images failed:', e)
      // 标记所有为失败
      updateArticleCover(selectedArticle.id, null, null, 'failed')
      selectedArticle.sections.forEach((_, idx) => {
        updateArticleSection(selectedArticle.id, idx, { imageStatus: 'failed' })
      })
    } finally {
      setIsGeneratingAll(false)
    }
  }

  const handleExport = async () => {
    if (!selectedArticle) return
    setIsExporting(true)
    try {
      const blob = await apiService.exportArticle(selectedArticle.id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${selectedArticle.title.replace(/[<>:"/\\|?*]/g, '').substring(0, 50)}.zip`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error('Export failed:', e)
      alert('导出失败，请重试')
    } finally {
      setIsExporting(false)
    }
  }

  const completedImages = selectedArticle.sections.filter((s) => s.imageStatus === 'completed').length
  const totalSections = selectedArticle.sections.length
  const hasCover = selectedArticle.cover_status === 'completed'
  const totalImages = totalSections + 1 // H2配图 + 封面
  const completedTotal = completedImages + (hasCover ? 1 : 0)
  const isAnyGenerating = isGeneratingCover || isGeneratingAll || generatingImageIndex !== null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      <BackButton onClick={goBack} />

      <div className="card-premium p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <ImageIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">配图生成</h2>
              <p className="text-secondary">
                已生成 {completedTotal} / {totalImages} 张配图（含封面）
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleGenerateAllImages}
              disabled={isAnyGenerating}
              className="btn-premium btn-secondary"
            >
              {isGeneratingAll ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  一键生成所有配图
                </>
              )}
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="btn-premium btn-primary"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  导出中...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  下载文章+配图
                </>
              )}
            </button>
          </div>
        </div>

        {/* Article Title */}
        <div className="bg-gradient-to-r from-[#f5f5f7] to-white rounded-2xl p-5 mb-6">
          <h3 className="text-xl font-bold text-[#1d1d1f]">{selectedArticle.title}</h3>
        </div>

        {/* Cover Image Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border-2 border-[#0071e3]/20 overflow-hidden mb-6"
        >
          <div className="flex items-center justify-between p-5 bg-gradient-to-r from-[#0071e3]/5 to-[#0071e3]/10 border-b border-[#e8e8ed]">
            <h4 className="text-lg font-semibold text-[#1d1d1f] flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#0071e3] text-white flex items-center justify-center text-sm font-bold">
                封面
              </span>
              文章封面图
            </h4>
            <button
              onClick={handleGenerateCover}
              disabled={isAnyGenerating}
              className={`
                btn-premium text-sm px-4 py-2
                ${selectedArticle.cover_status === 'completed'
                  ? 'btn-secondary'
                  : selectedArticle.cover_status === 'generating'
                  ? 'bg-blue-100 text-blue-600'
                  : 'btn-primary'
                }
              `}
            >
              {selectedArticle.cover_status === 'generating' || isGeneratingCover ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  生成中...
                </>
              ) : selectedArticle.cover_status === 'completed' ? (
                <>
                  <RefreshCw className="w-4 h-4" />
                  重新生成
                </>
              ) : selectedArticle.cover_status === 'failed' ? (
                <>
                  <RefreshCw className="w-4 h-4" />
                  重试
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4" />
                  生成封面图
                </>
              )}
            </button>
          </div>

          <div className="p-5">
            {selectedArticle.cover_base64 ? (
              <div className="rounded-xl overflow-hidden border border-[#e8e8ed]">
                <img
                  src={selectedArticle.cover_base64}
                  alt="文章封面"
                  className="w-full h-auto max-h-[400px] object-cover"
                />
              </div>
            ) : selectedArticle.cover_status === 'failed' ? (
              <div className="p-4 bg-red-50 rounded-xl text-red-600 text-sm flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                封面图生成失败，请点击重试
              </div>
            ) : (
              <div className="p-8 bg-[#f5f5f7] rounded-xl text-center text-secondary">
                <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>点击上方按钮生成文章封面图</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* H2 Sections with Image Generation */}
        <div className="space-y-6">
          {selectedArticle.sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl border border-[#e8e8ed] overflow-hidden"
            >
              {/* Section Header */}
              <div className="flex items-center justify-between p-5 bg-[#fafafa] border-b border-[#e8e8ed]">
                <h4 className="text-lg font-semibold text-[#1d1d1f] flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center text-sm font-bold">
                    H2
                  </span>
                  {section.h2}
                </h4>
                <button
                  onClick={() => handleGenerateImage(idx)}
                  disabled={isAnyGenerating}
                  className={`
                    btn-premium text-sm px-4 py-2
                    ${section.imageStatus === 'completed'
                      ? 'btn-secondary'
                      : section.imageStatus === 'generating'
                      ? 'bg-blue-100 text-blue-600'
                      : 'btn-primary'
                    }
                  `}
                >
                  {section.imageStatus === 'generating' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      生成中...
                    </>
                  ) : section.imageStatus === 'completed' ? (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      重新生成
                    </>
                  ) : section.imageStatus === 'failed' ? (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      重试
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-4 h-4" />
                      生成配图
                    </>
                  )}
                </button>
              </div>

              {/* Section Content */}
              <div className="p-5">
                <p className="text-[15px] leading-relaxed text-[#424245] mb-4 line-clamp-3">
                  {section.content}
                </p>

                {/* Image Preview */}
                {section.imageBase64 && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-[#e8e8ed]">
                    <img
                      src={section.imageBase64}
                      alt={section.h2}
                      className="w-full h-auto max-h-[300px] object-cover"
                    />
                  </div>
                )}

                {section.imageStatus === 'failed' && (
                  <div className="mt-4 p-4 bg-red-50 rounded-xl text-red-600 text-sm flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    配图生成失败，请点击重试
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Export Section */}
        <div className="mt-8 p-6 bg-gradient-to-br from-[#f5f5f7] to-white rounded-2xl border border-[#e8e8ed]">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold mb-1">准备导出</h4>
              <p className="text-secondary text-sm">
                ZIP包含：TXT文章文件 + img文件夹（封面+配图以H2标题命名）
              </p>
            </div>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="btn-premium btn-primary h-12 px-6"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  导出中...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  下载 ZIP 文件
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ============ Preview Modal ============
function PreviewModal({ article, onClose }: { article: Article | null; onClose: () => void }) {
  if (!article) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 sticky top-0 bg-white z-10">
            <h3 className="text-lg font-semibold truncate pr-4">{article.title}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-black/5 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[calc(85vh-60px)]">
            {article.sections?.map((section, idx) => (
              <div key={idx} className="mb-6">
                {section.h2 && (
                  <h2 className="text-xl font-semibold mb-3 text-[#1d1d1f]">{section.h2}</h2>
                )}
                <p className="text-[15px] leading-relaxed text-[#424245] whitespace-pre-wrap">
                  {section.content}
                </p>
              </div>
            ))}
            {(!article.sections || article.sections.length === 0) && article.content && (
              <div className="text-[15px] leading-relaxed text-[#424245] whitespace-pre-wrap">
                {article.content}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ============ Main App ============
export default function App() {
  const { currentStep } = useStore()

  return (
    <div className="min-h-screen bg-[#fbfbfd]">
      <Header />

      <main className="px-6 py-10">
        <StepProgressBar currentStep={currentStep} />

        <AnimatePresence mode="wait">
          {currentStep === 1 && <Step1KeywordInput key="step1" />}
          {currentStep === 2 && <Step2TitleSelection key="step2" />}
          {currentStep === 3 && <Step3ArticleConfig key="step3" />}
          {currentStep === 4 && <Step4ArticleGeneration key="step4" />}
          {currentStep === 5 && <Step5ImageGeneration key="step5" />}
        </AnimatePresence>
      </main>
    </div>
  )
}
