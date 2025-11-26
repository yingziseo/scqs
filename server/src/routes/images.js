import { Router } from 'express'
import { queries } from '../db/queries.js'
import { generateImage, downloadImageAsBase64 } from '../services/doubao.js'
import { prompts } from '../services/prompts.js'

const router = Router()

// Generate cover image for an article
router.post('/generate-cover', async (req, res) => {
  try {
    const { articleId, title, keyword, customPrompt } = req.body

    if (!articleId || !title) {
      return res.status(400).json({
        error: 'articleId and title are required',
      })
    }

    console.log(`Generating cover image for article: "${title}"`)

    // Get article
    const article = queries.getArticle(articleId)
    if (!article) {
      return res.status(404).json({ error: 'Article not found' })
    }

    // Update cover status to generating
    queries.updateArticleCover(articleId, null, null, 'generating')

    // Generate image prompt using prompts helper
    const imagePrompt = prompts.generateCoverImagePrompt(title, keyword, customPrompt)

    // Call Doubao API to generate image
    const result = await generateImage(imagePrompt)

    // Download image and convert to base64
    const imageData = await downloadImageAsBase64(result.url)

    // Update article cover
    queries.updateArticleCover(
      articleId,
      result.url,
      `data:${imageData.contentType};base64,${imageData.base64}`,
      'completed'
    )

    console.log(`Cover image generated for article: "${title}"`)

    res.json({
      success: true,
      coverUrl: result.url,
      coverBase64: `data:${imageData.contentType};base64,${imageData.base64}`,
    })
  } catch (error) {
    console.error('Cover image generation error:', error)

    // Update cover status to failed if possible
    try {
      const { articleId } = req.body
      if (articleId) {
        queries.updateArticleCover(articleId, null, null, 'failed')
      }
    } catch (e) {
      // Ignore
    }

    res.status(500).json({
      error: 'Failed to generate cover image',
      message: error.message,
    })
  }
})

// Generate image for a specific H2 section
router.post('/generate', async (req, res) => {
  try {
    const { articleId, sectionIndex, h2Title, keyword, customPrompt } = req.body

    if (!articleId || sectionIndex === undefined || !h2Title) {
      return res.status(400).json({
        error: 'articleId, sectionIndex, and h2Title are required',
      })
    }

    console.log(`Generating image for H2: "${h2Title}"`)

    // Get article
    const article = queries.getArticle(articleId)
    if (!article) {
      return res.status(404).json({ error: 'Article not found' })
    }

    // Update section status to generating
    const sections = [...article.sections]
    if (sections[sectionIndex]) {
      sections[sectionIndex].imageStatus = 'generating'
      queries.updateArticleSections(articleId, sections)
    }

    // Generate image prompt using prompts helper
    const imagePrompt = prompts.generateH2ImagePrompt(h2Title, keyword, customPrompt)

    // Call Doubao API to generate image
    const result = await generateImage(imagePrompt)

    // Download image and convert to base64
    const imageData = await downloadImageAsBase64(result.url)

    // Update section with image data
    if (sections[sectionIndex]) {
      sections[sectionIndex].imageUrl = result.url
      sections[sectionIndex].imageBase64 = `data:${imageData.contentType};base64,${imageData.base64}`
      sections[sectionIndex].imageStatus = 'completed'
      queries.updateArticleSections(articleId, sections)
    }

    console.log(`Image generated for H2: "${h2Title}"`)

    res.json({
      success: true,
      sectionIndex,
      imageUrl: result.url,
      imageBase64: `data:${imageData.contentType};base64,${imageData.base64}`,
    })
  } catch (error) {
    console.error('Image generation error:', error)

    // Update section status to failed if possible
    try {
      const { articleId, sectionIndex } = req.body
      if (articleId && sectionIndex !== undefined) {
        const article = queries.getArticle(articleId)
        if (article && article.sections[sectionIndex]) {
          const sections = [...article.sections]
          sections[sectionIndex].imageStatus = 'failed'
          queries.updateArticleSections(articleId, sections)
        }
      }
    } catch (e) {
      // Ignore
    }

    res.status(500).json({
      error: 'Failed to generate image',
      message: error.message,
    })
  }
})

// Batch generate all images for an article (cover + all H2 sections)
router.post('/generate-all', async (req, res) => {
  try {
    const { articleId, keyword, customPrompt } = req.body

    if (!articleId) {
      return res.status(400).json({
        error: 'articleId is required',
      })
    }

    const article = queries.getArticle(articleId)
    if (!article) {
      return res.status(404).json({ error: 'Article not found' })
    }

    console.log(`Batch generating images for article: "${article.title}"`)

    const results = {
      cover: null,
      sections: [],
    }

    // Generate cover image first
    try {
      const coverPrompt = prompts.generateCoverImagePrompt(article.title, keyword, customPrompt)
      const coverResult = await generateImage(coverPrompt)
      const coverData = await downloadImageAsBase64(coverResult.url)

      queries.updateArticleCover(
        articleId,
        coverResult.url,
        `data:${coverData.contentType};base64,${coverData.base64}`,
        'completed'
      )

      results.cover = {
        success: true,
        url: coverResult.url,
        base64: `data:${coverData.contentType};base64,${coverData.base64}`,
      }
    } catch (error) {
      console.error('Cover generation failed:', error.message)
      queries.updateArticleCover(articleId, null, null, 'failed')
      results.cover = { success: false, error: error.message }
    }

    // Generate images for each H2 section
    const sections = [...article.sections]
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i]
      if (!section.h2) continue // Skip intro section

      try {
        sections[i].imageStatus = 'generating'
        queries.updateArticleSections(articleId, sections)

        const sectionPrompt = prompts.generateH2ImagePrompt(section.h2, keyword, customPrompt)
        const sectionResult = await generateImage(sectionPrompt)
        const sectionData = await downloadImageAsBase64(sectionResult.url)

        sections[i].imageUrl = sectionResult.url
        sections[i].imageBase64 = `data:${sectionData.contentType};base64,${sectionData.base64}`
        sections[i].imageStatus = 'completed'
        queries.updateArticleSections(articleId, sections)

        results.sections.push({
          sectionIndex: i,
          h2: section.h2,
          success: true,
          url: sectionResult.url,
        })
      } catch (error) {
        console.error(`Section ${i} image generation failed:`, error.message)
        sections[i].imageStatus = 'failed'
        queries.updateArticleSections(articleId, sections)
        results.sections.push({
          sectionIndex: i,
          h2: section.h2,
          success: false,
          error: error.message,
        })
      }
    }

    console.log(`Batch image generation completed for article: "${article.title}"`)

    res.json({
      success: true,
      results,
    })
  } catch (error) {
    console.error('Batch image generation error:', error)
    res.status(500).json({
      error: 'Failed to generate images',
      message: error.message,
    })
  }
})

export default router
