import { Router } from 'express'
import archiver from 'archiver'
import { queries } from '../db/queries.js'

const router = Router()

function sanitizeFilename(name) {
  return name
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 100)
}

// RFC 5987 编码用于 Content-Disposition
function encodeRFC5987(str) {
  return encodeURIComponent(str)
    .replace(/['()]/g, escape)
    .replace(/\*/g, '%2A')
}

// Export single article with images as ZIP
router.post('/article/:id', async (req, res) => {
  try {
    const { id } = req.params

    const article = queries.getArticle(id)
    if (!article) {
      return res.status(404).json({ error: 'Article not found' })
    }

    if (article.status !== 'completed') {
      return res.status(400).json({ error: 'Article is not completed' })
    }

    // Set response headers for ZIP download with UTF-8 filename support
    const filename = sanitizeFilename(article.title)
    const encodedFilename = encodeRFC5987(filename)
    res.setHeader('Content-Type', 'application/zip')
    res.setHeader('Content-Disposition', `attachment; filename="article.zip"; filename*=UTF-8''${encodedFilename}.zip`)

    // Create ZIP archive
    const archive = archiver('zip', {
      zlib: { level: 9 },
    })

    archive.on('error', (err) => {
      console.error('Archive error:', err)
      res.status(500).json({ error: 'Failed to create archive' })
    })

    // Pipe archive to response
    archive.pipe(res)

    // Add article content as TXT
    const articleContent = `${article.title}\n${'='.repeat(50)}\n\n${article.content}`
    archive.append(articleContent, { name: `${filename}.txt` })

    // Add cover image if exists
    if (article.cover_base64) {
      const matches = article.cover_base64.match(/^data:image\/(\w+);base64,(.+)$/)
      if (matches) {
        const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1]
        const imageBuffer = Buffer.from(matches[2], 'base64')
        archive.append(imageBuffer, { name: `img/cover.${ext}` })
      }
    }

    // Add H2 section images
    if (article.sections && article.sections.length > 0) {
      for (let i = 0; i < article.sections.length; i++) {
        const section = article.sections[i]
        if (section.h2 && section.imageBase64) {
          // Extract base64 data
          const matches = section.imageBase64.match(/^data:image\/(\w+);base64,(.+)$/)
          if (matches) {
            const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1]
            const imageBuffer = Buffer.from(matches[2], 'base64')
            // 使用序号+标题作为文件名，避免中文问题
            const imageName = `${String(i + 1).padStart(2, '0')}_${sanitizeFilename(section.h2)}`
            archive.append(imageBuffer, { name: `img/${imageName}.${ext}` })
          }
        }
      }
    }

    // Finalize archive
    await archive.finalize()

    console.log(`Exported article: "${article.title}" with images`)
  } catch (error) {
    console.error('Export error:', error)
    res.status(500).json({
      error: 'Failed to export article',
      message: error.message,
    })
  }
})

export default router
