import { Router } from 'express'
import { queries } from '../db/queries.js'
import { callGLM, parseArticle } from '../services/glm.js'
import { prompts } from '../services/prompts.js'

const router = Router()

// Generate a single article with H2 count config
router.post('/generate', async (req, res) => {
  try {
    const { taskId, title, keyword, language, minWords, maxWords, minH2, maxH2, minH2Words, maxH2Words, customPrompt } = req.body

    if (!taskId || !title || !keyword || !language) {
      return res.status(400).json({
        error: 'taskId, title, keyword, and language are required',
      })
    }

    console.log(`Generating article: "${title}" (Words: ${minWords}-${maxWords}, H2: ${minH2}-${maxH2}, H2Words: ${minH2Words}-${maxH2Words})`)

    // Create article record
    const articleId = queries.createArticle(taskId, title)

    // Update status to generating
    queries.updateArticle(articleId, null, [], 'generating')

    // Generate article using GLM with H2 config
    const prompt = prompts.generateArticle(
      title,
      keyword,
      language,
      minWords || 800,
      maxWords || 1200,
      minH2 || 4,
      maxH2 || 7,
      minH2Words || 100,
      maxH2Words || 200,
      customPrompt
    )

    const content = await callGLM(prompt, { temperature: 0.8 })

    // Parse article content
    const parsed = parseArticle(content)

    // Add image placeholders to sections (include cover image as first item)
    const sectionsWithImages = parsed.sections.map((section, index) => ({
      ...section,
      imageUrl: null,
      imageBase64: null,
      imageStatus: 'pending', // pending, generating, completed, failed
      isCover: index === 0 && !section.h2, // 如果第一个section没有h2，当作引言，不是封面
    }))

    // Update article in database
    queries.updateArticle(articleId, parsed.content, sectionsWithImages, 'completed')

    const article = queries.getArticle(articleId)

    console.log(`Article generated: "${title}" (${sectionsWithImages.length} sections, ${content.length} chars)`)

    res.json({ article })
  } catch (error) {
    console.error('Article generation error:', error)
    res.status(500).json({
      error: 'Failed to generate article',
      message: error.message,
    })
  }
})

// Regenerate an existing article
router.post('/regenerate/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { keyword, language, minWords, maxWords, minH2, maxH2, minH2Words, maxH2Words, customPrompt } = req.body

    const existingArticle = queries.getArticle(id)
    if (!existingArticle) {
      return res.status(404).json({ error: 'Article not found' })
    }

    console.log(`Regenerating article: "${existingArticle.title}"`)

    // Update status to generating
    queries.updateArticle(id, null, [], 'generating')

    // Generate article using GLM
    const prompt = prompts.generateArticle(
      existingArticle.title,
      keyword,
      language,
      minWords || 800,
      maxWords || 1200,
      minH2 || 4,
      maxH2 || 7,
      minH2Words || 100,
      maxH2Words || 200,
      customPrompt
    )

    const content = await callGLM(prompt, { temperature: 0.85 })

    // Parse article content
    const parsed = parseArticle(content)

    // Add image placeholders to sections
    const sectionsWithImages = parsed.sections.map((section, index) => ({
      ...section,
      imageUrl: null,
      imageBase64: null,
      imageStatus: 'pending',
      isCover: index === 0 && !section.h2,
    }))

    // Update article in database
    queries.updateArticle(id, parsed.content, sectionsWithImages, 'completed')

    const article = queries.getArticle(id)

    console.log(`Article regenerated: "${existingArticle.title}" (${content.length} chars)`)

    res.json({ article })
  } catch (error) {
    console.error('Article regeneration error:', error)
    res.status(500).json({
      error: 'Failed to regenerate article',
      message: error.message,
    })
  }
})

// Get article by ID
router.get('/:id', async (req, res) => {
  try {
    const article = queries.getArticle(req.params.id)
    if (!article) {
      return res.status(404).json({ error: 'Article not found' })
    }
    res.json({ article })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
