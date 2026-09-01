import * as THREE from 'three'
import { gridFragmentShader, gridVertexShader, heroFragmentShader, heroVertexShader } from './shaders'

interface HeroSceneOptions {
  isMobile: boolean
  prefersReducedMotion: boolean
}

interface HeroSceneController {
  start: () => void
  dispose: () => void
}

export function createHeroScene(container: HTMLElement, options: HeroSceneOptions): HeroSceneController {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100)
  camera.position.z = 3.8

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))
  renderer.setClearColor(0x000000, 0)
  container.appendChild(renderer.domElement)

  const particleCount = options.isMobile ? 4500 : 12000
  const positions = new Float32Array(particleCount * 3)
  const noise = new Float32Array(particleCount)

  for (let i = 0; i < particleCount; i += 1) {
    const u = Math.random() * 2 - 1
    const v = Math.random() * 2 - 1
    const profile = Math.exp(-((u * u) * 1.2 + (v * v) * 2.2))
    const index = i * 3

    positions[index] = u * 1.25 + Math.sin(v * 9) * 0.05
    positions[index + 1] = v * 1.55
    positions[index + 2] = profile * 0.9 + (Math.random() - 0.5) * 0.08
    noise[i] = Math.random()
  }

  const particleGeometry = new THREE.BufferGeometry()
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particleGeometry.setAttribute('aNoise', new THREE.BufferAttribute(noise, 1))

  const heroUniforms = {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uGlitch: { value: 0.15 },
    uMobile: { value: options.isMobile ? 1 : 0 }
  }

  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: heroUniforms,
    vertexShader: heroVertexShader,
    fragmentShader: heroFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  const particles = new THREE.Points(particleGeometry, particleMaterial)
  scene.add(particles)

  const gridUniforms = {
    uTime: { value: 0 },
    uMobile: { value: options.isMobile ? 1 : 0 }
  }

  const gridPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(9.5, 6),
    new THREE.ShaderMaterial({
      uniforms: gridUniforms,
      vertexShader: gridVertexShader,
      fragmentShader: gridFragmentShader,
      transparent: true,
      depthWrite: false
    })
  )

  gridPlane.position.z = -2.8
  scene.add(gridPlane)

  let frameId = 0
  let lastThreatToggle = 0
  let targetGlitch = 0.15

  const resize = () => {
    const width = container.clientWidth
    const height = container.clientHeight

    renderer.setSize(width, height, false)
    camera.aspect = width / Math.max(height, 1)
    camera.updateProjectionMatrix()
  }

  const pointerMove = (event: PointerEvent) => {
    const rect = renderer.domElement.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1)
    heroUniforms.uMouse.value.set(x * 1.2, y * 1.2)
  }

  const animate = (time: number) => {
    frameId = requestAnimationFrame(animate)

    const t = time * 0.001
    heroUniforms.uTime.value = t
    gridUniforms.uTime.value = t

    if (t - lastThreatToggle > (options.prefersReducedMotion ? 4.6 : 2.8)) {
      targetGlitch = targetGlitch < 0.4 ? 1.0 : 0.15
      lastThreatToggle = t
    }

    const smoothing = options.prefersReducedMotion ? 0.03 : 0.08
    heroUniforms.uGlitch.value += (targetGlitch - heroUniforms.uGlitch.value) * smoothing

    particles.rotation.y = Math.sin(t * 0.28) * 0.2
    particles.rotation.x = Math.cos(t * 0.22) * 0.08

    renderer.render(scene, camera)
  }

  resize()
  window.addEventListener('resize', resize)
  renderer.domElement.addEventListener('pointermove', pointerMove)

  return {
    start: () => {
      frameId = requestAnimationFrame(animate)
    },
    dispose: () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      renderer.domElement.removeEventListener('pointermove', pointerMove)

      particleGeometry.dispose()
      particleMaterial.dispose()
      gridPlane.geometry.dispose()
      const gridMaterial = gridPlane.material
      if (gridMaterial instanceof THREE.Material) {
        gridMaterial.dispose()
      }

      scene.clear()
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }
}
