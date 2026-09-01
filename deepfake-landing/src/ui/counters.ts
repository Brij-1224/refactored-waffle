const easeOutExpo = (x: number): number => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x))

export function initCounters(): void {
  const counterElements = Array.from(document.querySelectorAll<HTMLElement>('[data-counter]'))

  const observer = new IntersectionObserver(
    (entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return
        }

        const el = entry.target as HTMLElement
        const target = Number(el.dataset.counter)
        const duration = 1300
        const start = performance.now()

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          const value = Math.round(target * easeOutExpo(progress))
          el.textContent = `${value}%`

          if (progress < 1) {
            requestAnimationFrame(tick)
          }
        }

        requestAnimationFrame(tick)
        activeObserver.unobserve(el)
      })
    },
    { threshold: 0.45 }
  )

  counterElements.forEach((el) => observer.observe(el))
}
