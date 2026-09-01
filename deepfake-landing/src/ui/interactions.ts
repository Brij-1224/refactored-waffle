const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value))

export function initInteractions(): void {
  const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-tilt]'))

  cards.forEach((card) => {
    card.addEventListener('pointermove', (event: PointerEvent) => {
      const rect = card.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width
      const y = (event.clientY - rect.top) / rect.height

      const tiltX = clamp((0.5 - y) * 9, -6, 6)
      const tiltY = clamp((x - 0.5) * 11, -8, 8)

      card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`
      card.style.boxShadow = `0 20px 45px rgba(0, 180, 255, ${0.22 + x * 0.15})`
    })

    card.addEventListener('pointerleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)'
      card.style.boxShadow = ''
    })
  })

  const ctaButton = document.querySelector<HTMLButtonElement>('#cta-button')

  if (ctaButton) {
    ctaButton.addEventListener('click', () => {
      ctaButton.classList.remove('glitch-pulse')
      void ctaButton.offsetWidth
      ctaButton.classList.add('glitch-pulse')

      const ripple = document.createElement('span')
      ripple.className = 'ripple'
      ctaButton.appendChild(ripple)

      window.setTimeout(() => {
        ripple.remove()
      }, 550)
    })
  }
}
