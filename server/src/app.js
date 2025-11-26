import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import titlesRouter from './routes/titles.js'
import articlesRouter from './routes/articles.js'
import imagesRouter from './routes/images.js'
import exportRouter from './routes/export.js'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' }))

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`)
  next()
})

// Routes
app.use('/api/titles', titlesRouter)
app.use('/api/articles', articlesRouter)
app.use('/api/images', imagesRouter)
app.use('/api/export', exportRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 SEO Article Generator API Server`)
  console.log(`   Running on http://localhost:${PORT}`)
  console.log(`   Press Ctrl+C to stop\n`)
})
