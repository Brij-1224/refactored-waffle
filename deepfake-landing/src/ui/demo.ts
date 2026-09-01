export function initDemo(): void {
  const startButton = document.querySelector<HTMLButtonElement>('#start-demo')
  const progressFill = document.querySelector<HTMLElement>('#progress-fill')
  const status = document.querySelector<HTMLElement>('#demo-status')
  const confidence = document.querySelector<HTMLElement>('#confidence-score')
  const progressTrack = document.querySelector<HTMLElement>('.progress-track')

  if (!startButton || !progressFill || !status || !confidence || !progressTrack) {
    return
  }

  let running = false

  startButton.addEventListener('click', () => {
    if (running) {
      return
    }

    running = true
    confidence.hidden = true
    progressFill.style.width = '0%'
    status.textContent = 'Initializing forensic analysis...'

    const start = performance.now()
    const duration = 3200

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const value = Math.round(progress * 100)

      progressFill.style.width = `${value}%`
      progressTrack.setAttribute('aria-valuenow', `${value}`)

      if (value < 34) {
        status.textContent = 'Scanning media metadata...'
      } else if (value < 67) {
        status.textContent = 'Running multimodal anomaly detection...'
      } else if (value < 100) {
        status.textContent = 'Generating confidence score...'
      } else {
        status.textContent = 'Analysis complete: Synthetic threat detected.'
        confidence.hidden = false
        running = false
        return
      }

      requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  })
}
