import './style.css'
import { initCounters } from './ui/counters'
import { initDemo } from './ui/demo'
import { initInteractions } from './ui/interactions'
import { initScrollAnimations } from './ui/scrollAnimations'

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('App root not found.')
}

app.innerHTML = `
  <div class="matrix-bg" aria-hidden="true"></div>
  <div class="scanlines" aria-hidden="true"></div>

  <header class="section hero" id="hero">
    <div class="hero-content reveal">
      <p class="eyebrow">AI-Powered Deepfake Defense</p>
      <h1>Detect Voice, Video, and Image Deepfakes in Real Time</h1>
      <p class="tagline">Enterprise-grade fraud prevention with explainable confidence scoring and forensic signal analysis.</p>
      <button id="cta-button" class="cta-button" type="button">Run Threat Scan</button>
    </div>
    <div class="hero-visual reveal" id="hero-visual" aria-label="Animated 3D deepfake detection visual"></div>
  </header>

  <main>
    <section class="section reveal" id="problem">
      <h2>Why Deepfake Detection Matters</h2>
      <p class="section-copy">Synthetic media attacks are accelerating across identity verification, social engineering, and payment fraud channels.</p>
      <div class="stats-grid">
        <article class="stat-card">
          <span class="stat-value" data-counter="83">0</span>
          <span class="stat-label">of organizations reported deepfake exposure in 2025</span>
        </article>
        <article class="stat-card">
          <span class="stat-value" data-counter="320">0</span>
          <span class="stat-label">increase in voice spoofing incidents year over year</span>
        </article>
        <article class="stat-card threat">
          <span class="stat-value" data-counter="74">0</span>
          <span class="stat-label">of financial fraud losses tied to synthetic identity vectors</span>
        </article>
      </div>
    </section>

    <section class="section reveal" id="how-it-works">
      <h2>How It Works</h2>
      <div class="pipeline">
        <article class="pipeline-step">
          <span class="step-icon">⬆</span>
          <h3>Upload</h3>
          <p>Securely submit voice, video, or image assets through encrypted channels.</p>
        </article>
        <span class="connector" aria-hidden="true"></span>
        <article class="pipeline-step">
          <span class="step-icon">◉</span>
          <h3>AI Analysis</h3>
          <p>Neural artifact scanning, temporal consistency checks, and biometric mismatch detection.</p>
        </article>
        <span class="connector" aria-hidden="true"></span>
        <article class="pipeline-step">
          <span class="step-icon">✓</span>
          <h3>Result</h3>
          <p>Receive confidence score, tampering signatures, and incident response recommendations.</p>
        </article>
      </div>
    </section>

    <section class="section reveal" id="features">
      <h2>Detection Features</h2>
      <div class="feature-grid">
        <article class="feature-card" data-tilt>
          <h3>Voice Detection</h3>
          <p>Prosody drift analysis, spectral artifact discovery, and spoofing fingerprint matching.</p>
        </article>
        <article class="feature-card" data-tilt>
          <h3>Video Detection</h3>
          <p>Frame-level anomaly mapping, lip-sync integrity checks, and GAN residue tracing.</p>
        </article>
        <article class="feature-card" data-tilt>
          <h3>Image Detection</h3>
          <p>Compression noise irregularity detection, semantic boundary checks, and EXIF consistency tests.</p>
        </article>
      </div>
    </section>

    <section class="section reveal" id="live-demo">
      <h2>Live Demo</h2>
      <p class="section-copy">Simulate an upload to see analysis progress and confidence scoring.</p>
      <div class="demo-card">
        <label class="upload-label" for="mock-upload">Upload Sample</label>
        <input id="mock-upload" class="upload-input" type="file" aria-label="Mock upload" />
        <button id="start-demo" class="secondary-button" type="button">Start Mock Analysis</button>
        <div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
          <span id="progress-fill" class="progress-fill"></span>
        </div>
        <p id="demo-status" class="demo-status">Awaiting upload...</p>
        <p id="confidence-score" class="confidence-score" hidden>Confidence score: 97.2% synthetic likelihood</p>
      </div>
    </section>
  </main>

  <footer class="section footer reveal">
    <p>DeepShield Labs · 2026</p>
    <nav>
      <a href="#hero">Top</a>
      <a href="#features">Features</a>
      <a href="#live-demo">Live Demo</a>
    </nav>
  </footer>
`

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const isMobile = window.matchMedia('(max-width: 900px), (pointer: coarse)').matches

let cleanupScene: (() => void) | null = null

const heroVisual = document.querySelector<HTMLElement>('#hero-visual')

if (heroVisual) {
  const heroObserver = new IntersectionObserver(
    async (entries) => {
      if (!entries[0]?.isIntersecting || cleanupScene) {
        return
      }

      const { createHeroScene } = await import('./three/heroScene')
      const scene = createHeroScene(heroVisual, { isMobile, prefersReducedMotion })
      cleanupScene = () => scene.dispose()
      scene.start()
      heroObserver.disconnect()
    },
    { rootMargin: '150px' }
  )

  heroObserver.observe(heroVisual)
}

initCounters()
initInteractions()
initDemo()
initScrollAnimations(prefersReducedMotion)

document.querySelector<HTMLElement>('#cta-button')?.addEventListener('click', () => {
  document.querySelector<HTMLElement>('#live-demo')?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })
})

window.addEventListener('beforeunload', () => {
  cleanupScene?.()
})
