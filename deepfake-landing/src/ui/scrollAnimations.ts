import { gsap } from 'gsap'

export function initScrollAnimations(prefersReducedMotion: boolean): void {
  if (prefersReducedMotion) {
    document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
      el.classList.add('is-visible')
    })
    return
  }

  const observer = new IntersectionObserver(
    (entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return
        }

        const el = entry.target as HTMLElement
        el.classList.add('is-visible')

        gsap.fromTo(
          el,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out'
          }
        )

        activeObserver.unobserve(el)
      })
    },
    { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
  )

  document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => observer.observe(el))
}
