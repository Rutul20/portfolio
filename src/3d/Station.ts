import * as THREE from 'three'
import { STATION_3D_CONFIGS, type Station3DConfig } from './constants'
import { createRandomCrowdPerson } from './Person'

export class StationSystem {
  public group: THREE.Group
  private disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = []

  constructor(trackCurve: THREE.CatmullRomCurve3) {
    this.group = new THREE.Group()
    this.group.name = 'MetroStations'

    this.buildStations(trackCurve)
  }

  private buildStations(trackCurve: THREE.CatmullRomCurve3): void {
    const slabMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.8,
      metalness: 0.15,
    })
    const canopyMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.4,
      metalness: 0.3,
    })
    const pillarMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.85,
      roughness: 0.2,
    })
    const tactileMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
    })
    const benchWoodMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0x92400e,
      roughness: 0.7,
    })
    const stainlessMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0xcfd8dc,
      metalness: 0.9,
      roughness: 0.2,
    })

    this.disposables.push(
      slabMaterial,
      canopyMaterial,
      pillarMaterial,
      tactileMaterial,
      benchWoodMaterial,
      stainlessMaterial
    )

    STATION_3D_CONFIGS.forEach((cfg: Station3DConfig) => {
      const stationGroup: THREE.Group = new THREE.Group()
      stationGroup.name = `Station-${cfg.id}`

      const centerPt: THREE.Vector3 = trackCurve.getPointAt(cfg.t)
      const tangent: THREE.Vector3 = trackCurve.getTangentAt(cfg.t).normalize()
      const up: THREE.Vector3 = new THREE.Vector3(0, 1, 0)
      const normal: THREE.Vector3 = new THREE.Vector3().crossVectors(tangent, up).normalize()

      const lateralDistance: number =
        cfg.platformSide === 1
          ? (1.8 + cfg.platformWidth / 2)
          : -(3.8 + 1.8 + cfg.platformWidth / 2)
      const platformCenter: THREE.Vector3 = centerPt
        .clone()
        .addScaledVector(normal, lateralDistance)
      platformCenter.y += 0.35

      stationGroup.position.copy(platformCenter)
      stationGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent)

      // 1. Concrete Platform Slab
      const slabGeo: THREE.BoxGeometry = new THREE.BoxGeometry(
        cfg.platformWidth,
        0.7,
        cfg.platformLength
      )
      this.disposables.push(slabGeo)
      const slabMesh: THREE.Mesh = new THREE.Mesh(slabGeo, slabMaterial)
      stationGroup.add(slabMesh)

      // 2. Colored Edge Light Strip
      const edgeColor: THREE.Color = new THREE.Color(cfg.color)
      const edgeMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
        color: edgeColor,
      })
      this.disposables.push(edgeMaterial)

      const edgeGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.12, 0.1, cfg.platformLength)
      this.disposables.push(edgeGeo)
      const edgeMesh: THREE.Mesh = new THREE.Mesh(edgeGeo, edgeMaterial)
      const edgeSideX: number = -cfg.platformSide * (cfg.platformWidth / 2 - 0.08)
      edgeMesh.position.set(edgeSideX, 0.35, 0)
      stationGroup.add(edgeMesh)

      // 3. Tactile Safety Strip
      const tactileGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.35, 0.04, cfg.platformLength - 0.4)
      this.disposables.push(tactileGeo)
      const tactileMesh: THREE.Mesh = new THREE.Mesh(tactileGeo, tactileMaterial)
      tactileMesh.position.set(edgeSideX + cfg.platformSide * 0.28, 0.36, 0)
      stationGroup.add(tactileMesh)

      // 4. Canopy Roof with Pillars
      const canopyHeight: number = 4.2
      const canopyGeo: THREE.BoxGeometry = new THREE.BoxGeometry(
        cfg.platformWidth + 0.8,
        0.24,
        cfg.platformLength - 2.0
      )
      this.disposables.push(canopyGeo)
      const canopyMesh: THREE.Mesh = new THREE.Mesh(canopyGeo, canopyMaterial)
      canopyMesh.position.set(0, canopyHeight, 0)
      stationGroup.add(canopyMesh)

      // Canopy Neon Underglow
      const canopyGlowGeo: THREE.BoxGeometry = new THREE.BoxGeometry(
        cfg.platformWidth + 0.6,
        0.05,
        cfg.platformLength - 2.4
      )
      this.disposables.push(canopyGlowGeo)
      const canopyGlowMesh: THREE.Mesh = new THREE.Mesh(canopyGlowGeo, edgeMaterial)
      canopyGlowMesh.position.set(0, canopyHeight - 0.14, 0)
      stationGroup.add(canopyGlowMesh)

      // Pillars
      const pillarCount: number = 4
      const pillarGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.12, 0.12, canopyHeight, 10)
      this.disposables.push(pillarGeo)

      for (let i: number = 0; i < pillarCount; i++) {
        const pillarZ: number =
          ((i - (pillarCount - 1) / 2) / ((pillarCount - 1) / 2)) * (cfg.platformLength / 2.6)
        const pillar: THREE.Mesh = new THREE.Mesh(pillarGeo, pillarMaterial)
        pillar.position.set(0, canopyHeight / 2, pillarZ)
        stationGroup.add(pillar)
      }

      // 5. Station Platform Benches (Wood & Steel)
      for (const benchZ of [-cfg.platformLength * 0.25, cfg.platformLength * 0.25]) {
        const benchGroup: THREE.Group = new THREE.Group()
        benchGroup.position.set(cfg.platformSide * 0.6, 0.35, benchZ)

        // Wooden Seat Slats
        const seatGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.65, 0.08, 2.2)
        this.disposables.push(seatGeo)
        const seat: THREE.Mesh = new THREE.Mesh(seatGeo, benchWoodMaterial)
        seat.position.set(0, 0.44, 0)
        benchGroup.add(seat)

        // Stainless Legs
        const legGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.6, 0.44, 0.08)
        this.disposables.push(legGeo)
        for (const lz of [-0.85, 0.85]) {
          const leg: THREE.Mesh = new THREE.Mesh(legGeo, stainlessMaterial)
          leg.position.set(0, 0.22, lz)
          benchGroup.add(leg)
        }
        stationGroup.add(benchGroup)
      }

      // 6. Suspended Digital Passenger Information Displays
      const dpidGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.2, 0.5, 1.4)
      const dpidMat: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0x0f172a })
      this.disposables.push(dpidGeo, dpidMat)
      for (const dZ of [-5, 5]) {
        const dpid: THREE.Mesh = new THREE.Mesh(dpidGeo, dpidMat)
        dpid.position.set(0, canopyHeight - 0.45, dZ)
        stationGroup.add(dpid)
      }

      // 7. COMMUTERS & PASSENGERS ON PLATFORMS (Living, Articulated 3D People)
      // A. Commuter Sitting on Bench 1
      const sitter1: THREE.Group = createRandomCrowdPerson(
        cfg.t * 100 + 1,
        this.disposables,
        'sitting-bench'
      )
      sitter1.position.set(cfg.platformSide * 0.6, 0.79, -cfg.platformLength * 0.25)
      sitter1.rotation.y = cfg.platformSide === 1 ? -Math.PI / 2 : Math.PI / 2
      stationGroup.add(sitter1)

      // B. Commuter Sitting on Bench 2
      const sitter2: THREE.Group = createRandomCrowdPerson(
        cfg.t * 100 + 2,
        this.disposables,
        'sitting-bench'
      )
      sitter2.position.set(cfg.platformSide * 0.6, 0.79, cfg.platformLength * 0.25)
      sitter2.rotation.y = cfg.platformSide === 1 ? -Math.PI / 2 : Math.PI / 2
      stationGroup.add(sitter2)

      // C. Standing & Walking Commuters
      interface PlatformPersonSpec {
        posZ: number
        posX: number
        rotY: number
        pose: 'standing-casual' | 'standing-phone' | 'walking-stride' | 'holding-coffee' | 'rolling-luggage' | 'hands-in-pocket'
        seedOffset: number
      }

      const platformPeople: PlatformPersonSpec[] = [
        {
          posZ: -8.8,
          posX: -cfg.platformSide * 0.45,
          rotY: -cfg.platformSide * 1.5,
          pose: 'rolling-luggage',
          seedOffset: 11,
        },
        {
          posZ: -5.6,
          posX: cfg.platformSide * 0.85,
          rotY: 0.35,
          pose: 'holding-coffee',
          seedOffset: 22,
        },
        {
          posZ: -2.8,
          posX: -cfg.platformSide * 0.30,
          rotY: -cfg.platformSide * 1.6,
          pose: 'standing-phone',
          seedOffset: 33,
        },
        {
          posZ: 0.8,
          posX: cfg.platformSide * 0.40,
          rotY: 2.7,
          pose: 'walking-stride',
          seedOffset: 44,
        },
        {
          posZ: 3.6,
          posX: -cfg.platformSide * 0.50,
          rotY: -cfg.platformSide * 1.4,
          pose: 'hands-in-pocket',
          seedOffset: 55,
        },
        {
          posZ: 6.5,
          posX: cfg.platformSide * 0.75,
          rotY: -0.45,
          pose: 'standing-casual',
          seedOffset: 66,
        },
        {
          posZ: 8.8,
          posX: -cfg.platformSide * 0.35,
          rotY: -cfg.platformSide * 1.7,
          pose: 'rolling-luggage',
          seedOffset: 77,
        },
      ]

      platformPeople.forEach((p: PlatformPersonSpec) => {
        const person: THREE.Group = createRandomCrowdPerson(
          cfg.t * 1000 + p.seedOffset,
          this.disposables,
          p.pose
        )
        person.position.set(p.posX, 0.35, p.posZ)
        person.rotation.y = p.rotY
        stationGroup.add(person)
      })

      // 8. High-Resolution Station Sign Board
      const signTexture: THREE.CanvasTexture = this.createSignTexture(cfg)
      this.disposables.push(signTexture)

      const signMat: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
        map: signTexture,
        transparent: true,
      })
      this.disposables.push(signMat)

      const signWidth: number = 5.2
      const signHeight: number = 1.3
      const signGeo: THREE.PlaneGeometry = new THREE.PlaneGeometry(signWidth, signHeight)
      this.disposables.push(signGeo)

      const signMeshFront: THREE.Mesh = new THREE.Mesh(signGeo, signMat)
      signMeshFront.position.set(0, canopyHeight - 0.85, 0)
      signMeshFront.rotation.y = cfg.platformSide === 1 ? -Math.PI / 2 : Math.PI / 2
      stationGroup.add(signMeshFront)

      const signMeshBack: THREE.Mesh = new THREE.Mesh(signGeo, signMat)
      signMeshBack.position.set(0, canopyHeight - 0.85, 0)
      signMeshBack.rotation.y = cfg.platformSide === 1 ? Math.PI / 2 : -Math.PI / 2
      stationGroup.add(signMeshBack)

      this.group.add(stationGroup)
    })
  }

  private createSignTexture(cfg: Station3DConfig): THREE.CanvasTexture {
    const canvas: HTMLCanvasElement = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 256
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d')

    if (ctx) {
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.roundRect(10, 10, 1004, 236, 24)
      ctx.fill()

      ctx.strokeStyle = cfg.color
      ctx.lineWidth = 6
      ctx.stroke()

      ctx.fillStyle = cfg.color
      ctx.beginPath()
      ctx.roundRect(40, 48, 140, 160, 16)
      ctx.fill()

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 64px Archivo, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(cfg.code, 110, 128)

      ctx.fillStyle = '#64748b'
      ctx.font = 'bold 30px "Geist Mono", monospace'
      ctx.textAlign = 'left'
      ctx.fillText(cfg.kicker.toUpperCase(), 220, 80)

      ctx.fillStyle = '#0f172a'
      ctx.font = 'bold 60px Archivo, sans-serif'
      ctx.fillText(cfg.title.toUpperCase(), 220, 155)

      ctx.fillStyle = cfg.color
      ctx.beginPath()
      ctx.arc(940, 128, 28, 0, Math.PI * 2)
      ctx.fill()
    }

    const texture: THREE.CanvasTexture = new THREE.CanvasTexture(canvas)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    return texture
  }

  public dispose(): void {
    for (const item of this.disposables) {
      item.dispose()
    }
    this.group.clear()
  }
}
