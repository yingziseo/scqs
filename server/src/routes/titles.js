import { Router } from 'express'
import { queries } from '../db/queries.js'
import { callGLM, parseTitles } from '../services/glm.js'
import { prompts } from '../services/prompts.js'

const router = Router()

// Generate 40 SEO titles for a keyword
router.post('/generate', async (req, res) => {
  try {
    const { keyword, language, customPrompt } = req.body

    if (!keyword || !language) {
      return res.status(400).json({
        error: 'keyword and language are required',
      })
    }

    console.log(`Generating 40 titles for keyword: "${keyword}" in ${language}`)
    if (customPrompt) {
      console.log(`Custom prompt: ${customPrompt.substring(0, 100)}...`)
    }

    // Create task in database
    const taskId = queries.createTask(keyword, language, 600, 800)

    // Generate titles using GLM
    const prompt = prompts.generateTitles(keyword, language, customPrompt)
    const content = await callGLM(prompt, { temperature: 0.9 })

    // Parse titles from response - get up to 40
    let titles = parseTitles(content)
    titles = titles.slice(0, 40)

    console.log(`Generated ${titles.length} titles`)

    res.json({
      taskId,
      titles,
    })
  } catch (error) {
    console.error('Title generation error:', error)
    res.status(500).json({
      error: 'Failed to generate titles',
      message: error.message,
    })
  }
})

export default router
