import * as THREE from 'three'
import { Track } from './Track'
import { Train } from './Train'
import { StationSystem } from './Station'
import { Environment } from './Environment'
import { CameraDirector } from './CameraDirector'

export class MetroWorld {
  public scene: THREE.Scene
  public camera: THREE.PerspectiveCamera
  public renderer: THREE.WebGLRenderer

  private track: Track
  private train: Train
  private stations: StationSystem
  private environment: Environment
  private director: CameraDirector

  private journey: number = 0.05
  private targetJourney: number = 0.05
  private animationFrameId: number = 0
  private isDisposed: boolean = false
  private envRenderTarget: THREE.WebGLRenderTarget | null = null

  constructor(canvas: HTMLCanvasElement) {
    // 1. Scene with Bright Daylight Sky & Gentle Atmospheric Haze
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xbfe3f7)
    this.scene.fog = new THREE.FogExp2(0xd9eefa, 0.0016)

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(
      48,
      window.innerWidth / window.innerHeight,
      0.1,
      1200
    )
    this.camera.position.set(0, 15, 30)

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.05

    // 4. Lights
    this.setupLights()

    // 5. Track
    this.track = new Track()
    this.scene.add(this.track.group)

    // 6. Train
    this.train = new Train()
    this.scene.add(this.train.group)

    // 7. Stations
    this.stations = new StationSystem(this.track.curve)
    this.scene.add(this.stations.group)

    // 8. Environment (Passed track curve for precise 3D clearance)
    this.environment = new Environment(this.track.curve)
    this.scene.add(this.environment.group)

    // 9. Camera Director
    this.director = new CameraDirector(this.camera)

    // Start render loop
    this.startLoop()
  }

  private setupLights(): void {
    // Ambient Daylight Sky Fill
    const ambientLight: THREE.AmbientLight = new THREE.AmbientLight(0xd9effc, 2.0)
    this.scene.add(ambientLight)

    // Primary Warm Sun (High in the sky, casting brilliant daylight across the world)
    const sunLight: THREE.DirectionalLight = new THREE.DirectionalLight(0xfffaee, 3.2)
    sunLight.position.set(90, 140, 180)
    this.scene.add(sunLight)

    // Secondary Soft Sky Fill Light
    const skyFill: THREE.DirectionalLight = new THREE.DirectionalLight(0xbfdbfe, 1.3)
    skyFill.position.set(-80, 90, 220)
    this.scene.add(skyFill)

    // Hemisphere Light: Azure sky dome to vibrant landscape terrain
    const hemiLight: THREE.HemisphereLight = new THREE.HemisphereLight(0x93c5fd, 0xd1fae5, 1.3)
    this.scene.add(hemiLight)

    // Procedural Daylight Sky & Horizon Environment Map for Metallic & Glass PBR Reflections
    const pmremGenerator: THREE.PMREMGenerator = new THREE.PMREMGenerator(this.renderer)
    pmremGenerator.compileEquirectangularShader()

    const canvas: HTMLCanvasElement = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 256
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d')
    if (ctx) {
      // Sky to countryside ground gradient
      const grad: CanvasGradient = ctx.createLinearGradient(0, 0, 0, 256)
      grad.addColorStop(0.0, '#38bdf8') // Clear blue zenith
      grad.addColorStop(0.38, '#bae6fd') // Atmosphere haze
      grad.addColorStop(0.48, '#fffbeb') // Warm horizon glow
      grad.addColorStop(0.53, '#a7f3d0') // Distant fields
      grad.addColorStop(1.0, '#15803d') // Lush green landscape
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 512, 256)

      // Radial sun glint for metallic reflection
      const sunGrad: CanvasGradient = ctx.createRadialGradient(320, 65, 0, 320, 65, 50)
      sunGrad.addColorStop(0, '#ffffff')
      sunGrad.addColorStop(0.35, '#fef08a')
      sunGrad.addColorStop(1, 'rgba(254, 240, 138, 0)')
      ctx.fillStyle = sunGrad
      ctx.beginPath()
      ctx.arc(320, 65, 50, 0, Math.PI * 2)
      ctx.fill()
    }

    const envTex: THREE.CanvasTexture = new THREE.CanvasTexture(canvas)
    this.envRenderTarget = pmremGenerator.fromEquirectangular(envTex)
    this.scene.environment = this.envRenderTarget.texture
    envTex.dispose()
    pmremGenerator.dispose()
  }

  public setJourney(targetT: number): void {
    // Map 0 -> 1 to curve range (0.04 to 0.96)
    const clampedT: number = Math.max(0, Math.min(1, targetT))
    this.targetJourney = 0.04 + clampedT * 0.92
  }

  private startLoop = (): void => {
    const tick = (): void => {
      if (this.isDisposed) return

      // Smoothly lerp journey progress toward scroll target
      const journeyDelta: number = (this.targetJourney - this.journey) * 0.075
      this.journey += journeyDelta

      const speed: number = Math.abs(journeyDelta) + 0.0003

      // Update Train along track
      this.train.update(this.track.curve, this.journey, speed)

      // Update Environment
      this.environment.update()

      // Update Camera Director
      const leadPos: THREE.Vector3 = this.train.getLeadPosition()
      const tangent: THREE.Vector3 = this.track.getTangentAt(this.journey)
      this.director.update(this.track.curve, leadPos, tangent, this.journey)

      // Render
      this.renderer.render(this.scene, this.camera)

      this.animationFrameId = requestAnimationFrame(tick)
    }

    this.animationFrameId = requestAnimationFrame(tick)
  }

  public resize(width: number, height: number): void {
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  public dispose(): void {
    this.isDisposed = true
    cancelAnimationFrame(this.animationFrameId)

    if (this.envRenderTarget) {
      this.envRenderTarget.dispose()
    }

    this.director.dispose()
    this.track.dispose()
    this.train.dispose()
    this.stations.dispose()
    this.environment.dispose()
    this.renderer.dispose()
  }
}
