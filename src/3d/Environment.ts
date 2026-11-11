import * as THREE from 'three'
import { createRandomCrowdPerson } from './Person'

interface AnimatedVehicle {
  meshGroup: THREE.Group
  curve: THREE.CatmullRomCurve3
  u: number
  speed: number
  laneOffset: number
}

export class Environment {
  public group: THREE.Group
  private trackCurve: THREE.CatmullRomCurve3
  private trackSamples: THREE.Vector3[] = []
  private windTurbineRotors: THREE.Group[] = []
  private clouds: THREE.Group[] = []
  private animatedVehicles: AnimatedVehicle[] = []
  private time: number = 0
  private disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = []

  constructor(trackCurve: THREE.CatmullRomCurve3) {
    this.group = new THREE.Group()
    this.group.name = 'DaylightMetropolisCorridor'
    this.trackCurve = trackCurve

    this.precomputeTrackSamples()
    this.buildDaylightSkyAndClouds()
    this.buildExpansiveGroundAndRiver()
    this.buildContinuousCity()
    this.buildLushNatureAndHills()
    this.buildDaylightBridge()
    this.buildDaylightMountainPassAndTurbines()
    this.buildDaylightHighwayTraffic()
    this.buildCityVehicles()
    this.buildCityPedestriansAndPlazas()
    this.buildDaylightBillboards()
    this.buildDaylightPortalArches()
  }

  private precomputeTrackSamples(): void {
    const steps: number = 300
    for (let i: number = 0; i <= steps; i++) {
      this.trackSamples.push(this.trackCurve.getPointAt(i / steps))
    }
  }

  private getTrackPosAtZ(z: number): THREE.Vector3 {
    let closest: THREE.Vector3 = this.trackSamples[0]
    let minDiff: number = Infinity
    for (let i: number = 0; i < this.trackSamples.length; i++) {
      const pt: THREE.Vector3 = this.trackSamples[i]
      const diff: number = Math.abs(pt.z - z)
      if (diff < minDiff) {
        minDiff = diff
        closest = pt
      }
    }
    return closest
  }

  // Helper to create a realistic 3D person figure
  private createPersonFigure(seed: number): THREE.Group {
    return createRandomCrowdPerson(seed, this.disposables)
  }

  // Helper to create a stylized 3D modern car
  private createCarModel(paintColor: number): THREE.Group {
    const car: THREE.Group = new THREE.Group()

    const bodyMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: paintColor,
      metalness: 0.85,
      roughness: 0.2,
    })
    const glassMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.95,
      roughness: 0.05,
    })
    const wheelMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8,
    })
    const wheelRimMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.9,
      roughness: 0.15,
    })
    const headlampMat: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const tailLampMat: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xef4444 })
    this.disposables.push(bodyMat, glassMat, wheelMat, wheelRimMat, headlampMat, tailLampMat)

    // Lower Chassis
    const chassisGeo: THREE.BoxGeometry = new THREE.BoxGeometry(1.85, 0.48, 4.3)
    this.disposables.push(chassisGeo)
    const chassis: THREE.Mesh = new THREE.Mesh(chassisGeo, bodyMat)
    chassis.position.set(0, 0.46, 0)
    car.add(chassis)

    // Cabin Greenhouse
    const cabinGeo: THREE.BoxGeometry = new THREE.BoxGeometry(1.6, 0.58, 2.3)
    this.disposables.push(cabinGeo)
    const cabin: THREE.Mesh = new THREE.Mesh(cabinGeo, glassMat)
    cabin.position.set(0, 0.92, -0.2)
    car.add(cabin)

    // Car Roof
    const roofGeo: THREE.BoxGeometry = new THREE.BoxGeometry(1.5, 0.06, 2.1)
    this.disposables.push(roofGeo)
    const roof: THREE.Mesh = new THREE.Mesh(roofGeo, bodyMat)
    roof.position.set(0, 1.23, -0.2)
    car.add(roof)

    // 4 Wheels
    const wheelGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.32, 0.32, 0.18, 14)
    const rimGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.19, 10)
    this.disposables.push(wheelGeo, rimGeo)

    const wheelOffsets: { x: number; z: number }[] = [
      { x: -0.96, z: 1.3 },
      { x: 0.96, z: 1.3 },
      { x: -0.96, z: -1.3 },
      { x: 0.96, z: -1.3 },
    ]

    wheelOffsets.forEach((wo) => {
      const wheel: THREE.Mesh = new THREE.Mesh(wheelGeo, wheelMat)
      wheel.rotation.z = Math.PI / 2
      wheel.position.set(wo.x, 0.32, wo.z)
      car.add(wheel)

      const rim: THREE.Mesh = new THREE.Mesh(rimGeo, wheelRimMat)
      rim.rotation.z = Math.PI / 2
      rim.position.set(wo.x, 0.32, wo.z)
      car.add(rim)
    })

    // Front Headlamps
    const lampGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.32, 0.12, 0.06)
    this.disposables.push(lampGeo)
    for (const lx of [-0.65, 0.65]) {
      const lamp: THREE.Mesh = new THREE.Mesh(lampGeo, headlampMat)
      lamp.position.set(lx, 0.52, 2.16)
      car.add(lamp)
    }

    // Rear Taillights
    const tailGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.35, 0.1, 0.06)
    this.disposables.push(tailGeo)
    for (const tx of [-0.65, 0.65]) {
      const tail: THREE.Mesh = new THREE.Mesh(tailGeo, tailLampMat)
      tail.position.set(tx, 0.52, -2.16)
      car.add(tail)
    }

    return car
  }

  // Helper to create a modern city transit bus
  private createBusModel(): THREE.Group {
    const bus: THREE.Group = new THREE.Group()

    const busHullMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.7,
    })
    const blueStripeMat: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0x0284c7 })
    const glassMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0x090e17,
      metalness: 0.95,
      roughness: 0.05,
    })
    const wheelMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({ color: 0x1e293b })
    this.disposables.push(busHullMat, blueStripeMat, glassMat, wheelMat)

    // Bus Body
    const bodyGeo: THREE.BoxGeometry = new THREE.BoxGeometry(2.45, 2.85, 10.4)
    this.disposables.push(bodyGeo)
    const body: THREE.Mesh = new THREE.Mesh(bodyGeo, busHullMat)
    body.position.set(0, 1.75, 0)
    bus.add(body)

    // Blue Transit Swoop
    const stripeGeo: THREE.BoxGeometry = new THREE.BoxGeometry(2.48, 0.45, 10.4)
    this.disposables.push(stripeGeo)
    const stripe: THREE.Mesh = new THREE.Mesh(stripeGeo, blueStripeMat)
    stripe.position.set(0, 1.1, 0)
    bus.add(stripe)

    // Panoramic Window Belt
    const winGeo: THREE.BoxGeometry = new THREE.BoxGeometry(2.5, 0.95, 9.6)
    this.disposables.push(winGeo)
    const win: THREE.Mesh = new THREE.Mesh(winGeo, glassMat)
    win.position.set(0, 2.2, -0.1)
    bus.add(win)

    // Wheels (6 wheels)
    const wGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.44, 0.44, 0.22, 14)
    this.disposables.push(wGeo)
    const zWheelPos: number[] = [3.4, -2.8, -4.0]
    zWheelPos.forEach((wz) => {
      for (const wx of [-1.25, 1.25]) {
        const w: THREE.Mesh = new THREE.Mesh(wGeo, wheelMat)
        w.rotation.z = Math.PI / 2
        w.position.set(wx, 0.44, wz)
        bus.add(w)
      }
    })

    return bus
  }

  // --- 3. HIGHWAY VEHICLES & CITY TRAFFIC ---
  private buildCityVehicles(): void {
    // 1. Moving Vehicles on the Elevated Highway
    const highwayPoints: THREE.Vector3[] = [
      new THREE.Vector3(-75, 3, -40),
      new THREE.Vector3(-65, 5, 60),
      new THREE.Vector3(-68, 7, 160),
      new THREE.Vector3(-72, 6, 260),
      new THREE.Vector3(-66, 8, 360),
      new THREE.Vector3(-70, 4, 480),
    ]
    const highwayCurve: THREE.CatmullRomCurve3 = new THREE.CatmullRomCurve3(highwayPoints)

    const carColors: number[] = [
      0xf8fafc, // Pearl White
      0xef4444, // Crimson Red
      0x0284c7, // Sapphire Blue
      0xf59e0b, // Yellow Taxi
      0x334155, // Charcoal Grey
      0x10b981, // Emerald Green
    ]

    // Create 14 animated highway cars and 2 buses
    for (let i: number = 0; i < 14; i++) {
      const isBus: boolean = i === 4 || i === 11
      const vehicleGroup: THREE.Group = isBus
        ? this.createBusModel()
        : this.createCarModel(carColors[i % carColors.length])

      // Southbound (laneOffset = -1.2) or Northbound (laneOffset = 1.2)
      const isNorthbound: boolean = i % 2 === 0
      const laneOffset: number = isNorthbound ? 1.0 : -1.0
      const speed: number = isBus ? 0.0007 : 0.0011 + (i % 3) * 0.0003

      this.animatedVehicles.push({
        meshGroup: vehicleGroup,
        curve: highwayCurve,
        u: (i / 14) + Math.random() * 0.05,
        speed: isNorthbound ? speed : -speed,
        laneOffset,
      })

      this.group.add(vehicleGroup)
    }

    // 2. Stationary Parked Cars in Station Concourse Drop-off Loops
    const parkedCarLocations: { x: number; y: number; z: number; rotY: number; color: number }[] = [
      // Anand Central Drop-off Bay (Z: -15 to 25)
      { x: -36, y: -5.92, z: -10, rotY: 0.1, color: 0xf59e0b }, // Yellow taxi
      { x: -38, y: -5.92, z: -2, rotY: 0.05, color: 0xf8fafc }, // White sedan
      { x: -37, y: -5.92, z: 8, rotY: -0.1, color: 0x0284c7 }, // Blue car
      { x: -36, y: -5.92, z: 18, rotY: 0.0, color: 0x334155 }, // Dark grey car
      // Gandhinagar Concourse Drop-off Loop (Z: 410 to 450)
      { x: -44, y: -5.92, z: 415, rotY: -0.2, color: 0xf59e0b },
      { x: -46, y: -5.92, z: 425, rotY: -0.15, color: 0xef4444 },
      { x: -45, y: -5.92, z: 435, rotY: -0.1, color: 0xf8fafc },
    ]

    parkedCarLocations.forEach((loc) => {
      const car: THREE.Group = this.createCarModel(loc.color)
      car.position.set(loc.x, loc.y, loc.z)
      car.rotation.y = loc.rotY
      this.group.add(car)
    })
  }

  // --- 4. CITY PEDESTRIANS & URBAN PLAZAS ---
  private buildCityPedestriansAndPlazas(): void {
    // 1. Anand Hub Departure Concourse Plaza (Z: -25 to 30)
    for (let p: number = 0; p < 24; p++) {
      const person: THREE.Group = this.createPersonFigure(100 + p * 7)
      const x: number = -28 - (p % 6) * 3.2 - ((p * 13) % 7) * 0.5
      const z: number = -20 + p * 2.8
      person.position.set(x, -5.92, z)
      person.rotation.y = ((p * 47) % 360) * (Math.PI / 180)
      this.group.add(person)
    }

    // 2. Riverfront Promenade Walkers & Observers (Z: 86 and Z: 224)
    for (const quayZ of [86, 224]) {
      for (let p: number = 0; p < 12; p++) {
        const person: THREE.Group = this.createPersonFigure(500 + quayZ + p * 11)
        const x: number = (p - 5.5) * 11.5 + ((p * 3) % 4)
        person.position.set(x, -5.88, quayZ + ((p * 7) % 3) * 0.4 - 0.6)
        person.rotation.y = quayZ === 86 ? 0.15 * Math.sin(p) : Math.PI - 0.15 * Math.sin(p)
        this.group.add(person)
      }
    }

    // 3. Gandhinagar Capital Concourse Plaza & Convention Center (Z: 400 to 460)
    for (let p: number = 0; p < 26; p++) {
      const person: THREE.Group = this.createPersonFigure(900 + p * 9)
      const x: number = -32 - (p % 7) * 3.6 - ((p * 17) % 5) * 0.6
      const z: number = 404 + p * 2.1
      person.position.set(x, -5.92, z)
      person.rotation.y = ((p * 71) % 360) * (Math.PI / 180)
      this.group.add(person)
    }

    // 4. Modern Street Lamps along the plazas and quays
    const lampPostGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.08, 0.12, 6.5, 8)
    const lampArmGeo: THREE.BoxGeometry = new THREE.BoxGeometry(1.6, 0.08, 0.08)
    const luminaireGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.6, 0.08, 0.22)
    const lampSteelMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.85,
      roughness: 0.2,
    })
    const luminaireMat: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
    this.disposables.push(lampPostGeo, lampArmGeo, luminaireGeo, lampSteelMat, luminaireMat)

    const lampPositions: THREE.Vector3[] = [
      new THREE.Vector3(-32, -5.92, -15),
      new THREE.Vector3(-32, -5.92, 10),
      new THREE.Vector3(-32, -5.92, 35),
      new THREE.Vector3(-45, -5.92, 410),
      new THREE.Vector3(-45, -5.92, 435),
      new THREE.Vector3(-45, -5.92, 460),
    ]

    lampPositions.forEach((pos) => {
      const lampGroup: THREE.Group = new THREE.Group()
      lampGroup.position.copy(pos)

      const post: THREE.Mesh = new THREE.Mesh(lampPostGeo, lampSteelMat)
      post.position.set(0, 3.25, 0)
      lampGroup.add(post)

      const arm: THREE.Mesh = new THREE.Mesh(lampArmGeo, lampSteelMat)
      arm.position.set(0.6, 6.4, 0)
      lampGroup.add(arm)

      const luminaire: THREE.Mesh = new THREE.Mesh(luminaireGeo, luminaireMat)
      luminaire.position.set(1.2, 6.35, 0)
      lampGroup.add(luminaire)

      this.group.add(lampGroup)
    })
  }

  // --- 5. DAYLIGHT WINDOW & FACADE CANVAS TEXTURE ---
  private createDaylightBuildingTexture(theme: 'sky' | 'champagne' | 'emerald'): THREE.CanvasTexture {
    const canvas: HTMLCanvasElement = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 256
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d')

    if (ctx) {
      ctx.fillStyle = theme === 'champagne' ? '#f8f6f0' : '#f0f6fa'
      ctx.fillRect(0, 0, 128, 256)

      ctx.fillStyle = theme === 'champagne' ? '#e5e0d3' : '#d5e2ed'
      for (let y: number = 0; y < 256; y += 16) {
        ctx.fillRect(0, y, 128, 3)
      }

      const glassReflections: string[] =
        theme === 'sky'
          ? ['#7dd3fc', '#93c5fd', '#bae6fd', '#38bdf8', '#e0f2fe']
          : theme === 'champagne'
          ? ['#fef3c7', '#fde68a', '#e2e8f0', '#93c5fd', '#ffffff']
          : ['#a7f3d0', '#6ee7b7', '#93c5fd', '#34d399', '#f0fdf4']

      for (let y: number = 4; y < 250; y += 16) {
        for (let x: number = 3; x < 125; x += 14) {
          const rand: number = Math.random()
          if (rand > 0.12) {
            const col: string = glassReflections[Math.floor(Math.random() * glassReflections.length)]
            ctx.fillStyle = col
            ctx.fillRect(x, y, 10, 10)

            if (rand > 0.7) {
              ctx.fillStyle = '#ffffff'
              ctx.fillRect(x + 1, y + 1, 3, 3)
            }
          }
        }
      }
    }

    const texture: THREE.CanvasTexture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    this.disposables.push(texture)
    return texture
  }

  // --- 6. PUFFY DAYLIGHT 3D CLOUDS ---
  private buildDaylightSkyAndClouds(): void {
    const cloudMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.95,
      metalness: 0.05,
      transparent: true,
      opacity: 0.92,
    })
    this.disposables.push(cloudMat)

    const puffGeo: THREE.SphereGeometry = new THREE.SphereGeometry(1, 7, 7)
    this.disposables.push(puffGeo)

    const cloudCount: number = 36
    for (let c: number = 0; c < cloudCount; c++) {
      const cloud: THREE.Group = new THREE.Group()

      const side: number = c % 2 === 0 ? 1 : -1
      const x: number = side * (55 + Math.random() * 160)
      const y: number = 42 + Math.random() * 38
      const z: number = -60 + Math.random() * 560

      cloud.position.set(x, y, z)

      const puffs: number = 5 + Math.floor(Math.random() * 4)
      const baseScale: number = 7 + Math.random() * 8

      for (let p: number = 0; p < puffs; p++) {
        const puffMesh: THREE.Mesh = new THREE.Mesh(puffGeo, cloudMat)
        const ox: number = (Math.random() - 0.5) * baseScale * 1.5
        const oy: number = (Math.random() - 0.2) * baseScale * 0.6
        const oz: number = (Math.random() - 0.5) * baseScale * 1.2
        const s: number = baseScale * (0.6 + Math.random() * 0.7)

        puffMesh.position.set(ox, oy, oz)
        puffMesh.scale.set(s, s * 0.75, s)
        cloud.add(puffMesh)
      }

      this.clouds.push(cloud)
      this.group.add(cloud)
    }
  }

  // --- 7. VAST DAYLIGHT LANDSCAPE, URBAN PLINTHS & SPARKLING RIVER ---
  private buildExpansiveGroundAndRiver(): void {
    const terrainGeo: THREE.PlaneGeometry = new THREE.PlaneGeometry(1400, 1400, 24, 24)
    const terrainMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0x5fa855,
      roughness: 0.9,
      metalness: 0.05,
    })
    this.disposables.push(terrainGeo, terrainMat)

    const terrainMesh: THREE.Mesh = new THREE.Mesh(terrainGeo, terrainMat)
    terrainMesh.rotation.x = -Math.PI / 2
    terrainMesh.position.set(0, -6.0, 220)
    this.group.add(terrainMesh)

    // Anand Concourse Urban Plinth
    const plinthAGeo: THREE.PlaneGeometry = new THREE.PlaneGeometry(360, 210)
    const plinthAMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.85,
      metalness: 0.1,
    })
    this.disposables.push(plinthAGeo, plinthAMat)
    const plinthAMesh: THREE.Mesh = new THREE.Mesh(plinthAGeo, plinthAMat)
    plinthAMesh.rotation.x = -Math.PI / 2
    plinthAMesh.position.set(0, -5.92, 10)
    this.group.add(plinthAMesh)

    // Gandhinagar Concourse Urban Plinth
    const plinthBGeo: THREE.PlaneGeometry = new THREE.PlaneGeometry(380, 240)
    const plinthBMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0xe6edf5,
      roughness: 0.85,
      metalness: 0.1,
    })
    this.disposables.push(plinthBGeo, plinthBMat)
    const plinthBMesh: THREE.Mesh = new THREE.Mesh(plinthBGeo, plinthBMat)
    plinthBMesh.rotation.x = -Math.PI / 2
    plinthBMesh.position.set(0, -5.92, 420)
    this.group.add(plinthBMesh)

    // Sparkling River
    const waterGeo: THREE.PlaneGeometry = new THREE.PlaneGeometry(600, 125, 20, 20)
    const waterMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      roughness: 0.15,
      metalness: 0.85,
    })
    this.disposables.push(waterGeo, waterMat)

    const waterMesh: THREE.Mesh = new THREE.Mesh(waterGeo, waterMat)
    waterMesh.rotation.x = -Math.PI / 2
    waterMesh.position.set(0, -5.7, 155)
    this.group.add(waterMesh)

    // Riverbank Concrete Quays
    const quayGeo: THREE.BoxGeometry = new THREE.BoxGeometry(600, 2.5, 6)
    const quayMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      roughness: 0.8,
      metalness: 0.2,
    })
    this.disposables.push(quayGeo, quayMat)

    const northQuay: THREE.Mesh = new THREE.Mesh(quayGeo, quayMat)
    northQuay.position.set(0, -4.8, 93)
    this.group.add(northQuay)

    const southQuay: THREE.Mesh = new THREE.Mesh(quayGeo, quayMat)
    southQuay.position.set(0, -4.8, 217)
    this.group.add(southQuay)
  }

  // --- 8. CONTINUOUS CITY SKYLINE ---
  private buildContinuousCity(): void {
    const dummy: THREE.Object3D = new THREE.Object3D()
    const baseBoxGeo: THREE.BoxGeometry = new THREE.BoxGeometry(1, 1, 1)
    this.disposables.push(baseBoxGeo)

    const skyTex: THREE.CanvasTexture = this.createDaylightBuildingTexture('sky')
    skyTex.repeat.set(2, 6)
    const skyBuildingMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: skyTex,
      roughness: 0.25,
      metalness: 0.75,
    })

    const beigeTex: THREE.CanvasTexture = this.createDaylightBuildingTexture('champagne')
    beigeTex.repeat.set(2, 5)
    const beigeBuildingMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0xfbfbf8,
      map: beigeTex,
      roughness: 0.35,
      metalness: 0.55,
    })

    const emeraldTex: THREE.CanvasTexture = this.createDaylightBuildingTexture('emerald')
    emeraldTex.repeat.set(2, 6)
    const emeraldBuildingMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: emeraldTex,
      roughness: 0.25,
      metalness: 0.7,
    })

    const roofWhiteMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.6,
      metalness: 0.3,
    })
    const roofGreenMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0x4ade80,
      roughness: 0.9,
      metalness: 0.05,
    })
    const spireMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.9,
      roughness: 0.2,
    })
    this.disposables.push(
      skyBuildingMat,
      beigeBuildingMat,
      emeraldBuildingMat,
      roofWhiteMat,
      roofGreenMat,
      spireMat
    )

    interface BuildingZoneConfig {
      count: number
      zMin: number
      zMax: number
      material: THREE.MeshStandardMaterial
      avgHeight: number
      baseClearance: number
    }

    const zones: BuildingZoneConfig[] = [
      {
        count: 105,
        zMin: -70,
        zMax: 95,
        material: skyBuildingMat,
        avgHeight: 48,
        baseClearance: 44,
      },
      {
        count: 95,
        zMin: 95,
        zMax: 310,
        material: beigeBuildingMat,
        avgHeight: 38,
        baseClearance: 50,
      },
      {
        count: 115,
        zMin: 310,
        zMax: 520,
        material: emeraldBuildingMat,
        avgHeight: 52,
        baseClearance: 44,
      },
    ]

    zones.forEach((zone: BuildingZoneConfig) => {
      const mesh: THREE.InstancedMesh = new THREE.InstancedMesh(baseBoxGeo, zone.material, zone.count)

      for (let i: number = 0; i < zone.count; i++) {
        const side: number = i % 2 === 0 ? 1 : -1
        const z: number = zone.zMin + Math.random() * (zone.zMax - zone.zMin)

        const trackPt: THREE.Vector3 = this.getTrackPosAtZ(z)
        const trackX: number = trackPt.x

        const width: number = 10 + Math.random() * 16
        const depth: number = 10 + Math.random() * 16
        const height: number = 18 + Math.pow(Math.random(), 1.5) * zone.avgHeight
        const y: number = height / 2 - 6

        const distFromTrack: number = zone.baseClearance + width / 2 + Math.pow(Math.random(), 1.25) * 85
        const x: number = side === 1 ? trackX + distFromTrack : trackX - distFromTrack

        dummy.position.set(x, y, z)
        dummy.scale.set(width, height, depth)
        dummy.rotation.y = (Math.random() - 0.5) * 0.4
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)

        if (height > 44) {
          if (Math.random() > 0.45) {
            const terraceGeo: THREE.BoxGeometry = new THREE.BoxGeometry(width * 0.7, 1.2, depth * 0.7)
            this.disposables.push(terraceGeo)
            const terraceMesh: THREE.Mesh = new THREE.Mesh(terraceGeo, roofGreenMat)
            terraceMesh.position.set(x, height - 6 + 0.6, z)
            this.group.add(terraceMesh)
          }

          if (Math.random() > 0.5) {
            const spireGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.1, 0.35, 12, 6)
            this.disposables.push(spireGeo)
            const spireMesh: THREE.Mesh = new THREE.Mesh(spireGeo, spireMat)
            spireMesh.position.set(x, height - 6 + 6, z)
            this.group.add(spireMesh)
          }
        }
      }

      mesh.instanceMatrix.needsUpdate = true
      this.group.add(mesh)
    })

    // Gujarat State Futuristic Convention Dome at City B
    const domeTrackPt: THREE.Vector3 = this.getTrackPosAtZ(435)
    const domeGeo: THREE.SphereGeometry = new THREE.SphereGeometry(22, 28, 18, 0, Math.PI * 2, 0, Math.PI / 2)
    const domeMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.85,
      roughness: 0.2,
      wireframe: false,
    })
    this.disposables.push(domeGeo, domeMat)
    const domeMesh: THREE.Mesh = new THREE.Mesh(domeGeo, domeMat)
    domeMesh.position.set(domeTrackPt.x - 72, -6, 435)
    this.group.add(domeMesh)

    const ribGeo: THREE.SphereGeometry = new THREE.SphereGeometry(22.2, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2)
    const ribMat: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      wireframe: true,
    })
    this.disposables.push(ribGeo, ribMat)
    const ribMesh: THREE.Mesh = new THREE.Mesh(ribGeo, ribMat)
    ribMesh.position.set(domeTrackPt.x - 72, -6, 435)
    this.group.add(ribMesh)
  }

  // --- 9. LUSH GREEN NATURE, TREES & ROLLING HILLS ---
  private buildLushNatureAndHills(): void {
    const trunkMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.9,
    })
    const foliageMatA: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      roughness: 0.8,
    })
    const foliageMatB: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0x16a34a,
      roughness: 0.8,
    })
    const hillMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0x4f9446,
      roughness: 0.95,
    })
    this.disposables.push(trunkMat, foliageMatA, foliageMatB, hillMat)

    const hillPositions: { pos: THREE.Vector3; radius: number; height: number }[] = [
      { pos: new THREE.Vector3(-150, -6, 120), radius: 65, height: 26 },
      { pos: new THREE.Vector3(-170, -6, 260), radius: 75, height: 32 },
      { pos: new THREE.Vector3(-140, -6, 380), radius: 60, height: 24 },
      { pos: new THREE.Vector3(160, -6, 90), radius: 70, height: 28 },
      { pos: new THREE.Vector3(175, -6, 230), radius: 80, height: 35 },
      { pos: new THREE.Vector3(155, -6, 360), radius: 65, height: 26 },
    ]

    hillPositions.forEach((h) => {
      const hillGeo: THREE.ConeGeometry = new THREE.ConeGeometry(h.radius, h.height, 12)
      this.disposables.push(hillGeo)
      const hillMesh: THREE.Mesh = new THREE.Mesh(hillGeo, hillMat)
      hillMesh.position.set(h.pos.x, -6 + h.height / 2, h.pos.z)
      this.group.add(hillMesh)
    })

    const trunkGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.3, 0.45, 3.2, 5)
    const foliageGeo: THREE.ConeGeometry = new THREE.ConeGeometry(2.4, 5.2, 6)
    this.disposables.push(trunkGeo, foliageGeo)

    const treeCount: number = 130
    for (let t: number = 0; t < treeCount; t++) {
      const side: number = t % 2 === 0 ? 1 : -1
      const z: number = -40 + Math.random() * 520

      if (z > 98 && z < 210) continue

      const trackPt: THREE.Vector3 = this.getTrackPosAtZ(z)
      const distFromTrack: number = 24 + Math.random() * 18
      const x: number = side === 1 ? trackPt.x + distFromTrack : trackPt.x - distFromTrack

      const treeGroup: THREE.Group = new THREE.Group()
      treeGroup.position.set(x, -5.9, z)

      const trunk: THREE.Mesh = new THREE.Mesh(trunkGeo, trunkMat)
      trunk.position.y = 1.6
      treeGroup.add(trunk)

      const foliage: THREE.Mesh = new THREE.Mesh(foliageGeo, t % 3 === 0 ? foliageMatB : foliageMatA)
      foliage.position.y = 4.8
      const scaleS: number = 0.8 + Math.random() * 0.5
      foliage.scale.set(scaleS, scaleS, scaleS)
      treeGroup.add(foliage)

      this.group.add(treeGroup)
    }
  }

  // --- 10. GLEAMING WHITE DAYLIGHT CABLE-STAYED RIVER BRIDGE ---
  private buildDaylightBridge(): void {
    const bridgeConcreteMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.4,
      roughness: 0.3,
    })
    const cableMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.8,
      roughness: 0.2,
    })
    const pylonCrownMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.9,
      roughness: 0.1,
    })
    this.disposables.push(bridgeConcreteMat, cableMat, pylonCrownMat)

    const pylonZCoords: number[] = [125, 175]

    pylonZCoords.forEach((pylonZ: number) => {
      const trackPt: THREE.Vector3 = this.getTrackPosAtZ(pylonZ)
      const pylonGroup: THREE.Group = new THREE.Group()
      pylonGroup.position.set(trackPt.x - 1.8, trackPt.y, pylonZ)

      const pylonHeight: number = 46

      for (const sideX of [-1, 1]) {
        const legGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.75, 1.6, pylonHeight, 8)
        this.disposables.push(legGeo)
        const legMesh: THREE.Mesh = new THREE.Mesh(legGeo, bridgeConcreteMat)
        legMesh.position.set(sideX * 6.5, pylonHeight / 2 - 4, 0)
        legMesh.rotation.z = -sideX * 0.16
        pylonGroup.add(legMesh)
      }

      const apexGeo: THREE.BoxGeometry = new THREE.BoxGeometry(2.0, 13, 2.0)
      this.disposables.push(apexGeo)
      const apexMesh: THREE.Mesh = new THREE.Mesh(apexGeo, bridgeConcreteMat)
      apexMesh.position.set(0, pylonHeight - 2, 0)
      pylonGroup.add(apexMesh)

      const crownGeo: THREE.SphereGeometry = new THREE.SphereGeometry(1.0, 12, 12)
      this.disposables.push(crownGeo)
      const crownMesh: THREE.Mesh = new THREE.Mesh(crownGeo, pylonCrownMat)
      crownMesh.position.set(0, pylonHeight + 5.2, 0)
      pylonGroup.add(crownMesh)

      const cableCountPerSide: number = 10
      for (let c: number = 0; c < cableCountPerSide; c++) {
        const cableDistZ: number = (c + 1) * 4.2
        const cableTopY: number = pylonHeight - 2 + c * 0.55

        for (const sideX of [-8.2, 8.2]) {
          const cableGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.045, 0.045, 1, 4)
          this.disposables.push(cableGeo)

          for (const dirZ of [-1, 1]) {
            const cableMesh: THREE.Mesh = new THREE.Mesh(cableGeo, cableMat)
            const deckAttachPt: THREE.Vector3 = new THREE.Vector3(sideX, 2.5, dirZ * cableDistZ)
            const topAttachPt: THREE.Vector3 = new THREE.Vector3(0, cableTopY, 0)

            const midpoint: THREE.Vector3 = new THREE.Vector3()
              .addVectors(deckAttachPt, topAttachPt)
              .multiplyScalar(0.5)
            const length: number = deckAttachPt.distanceTo(topAttachPt)

            cableMesh.position.copy(midpoint)
            cableMesh.scale.set(1, length, 1)
            cableMesh.quaternion.setFromUnitVectors(
              new THREE.Vector3(0, 1, 0),
              new THREE.Vector3().subVectors(topAttachPt, deckAttachPt).normalize()
            )
            pylonGroup.add(cableMesh)
          }
        }
      }

      this.group.add(pylonGroup)
    })
  }

  // --- 11. MOUNTAIN PASS & WIND TURBINES ---
  private buildDaylightMountainPassAndTurbines(): void {
    const turbinePositions: THREE.Vector3[] = [
      new THREE.Vector3(-95, 0, 215),
      new THREE.Vector3(-110, 4, 260),
      new THREE.Vector3(-98, 2, 310),
      new THREE.Vector3(105, 1, 235),
      new THREE.Vector3(115, 3, 285),
    ]

    const towerMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.6,
      roughness: 0.25,
    })
    const bladeMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.5,
      roughness: 0.2,
    })
    const hubMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.7,
      roughness: 0.3,
    })
    this.disposables.push(towerMat, bladeMat, hubMat)

    turbinePositions.forEach((pos: THREE.Vector3) => {
      const turbineGroup: THREE.Group = new THREE.Group()
      turbineGroup.position.copy(pos)

      const towerGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.38, 1.15, 30, 12)
      this.disposables.push(towerGeo)
      const towerMesh: THREE.Mesh = new THREE.Mesh(towerGeo, towerMat)
      towerMesh.position.set(0, 15, 0)
      turbineGroup.add(towerMesh)

      const nacelleGeo: THREE.BoxGeometry = new THREE.BoxGeometry(1.2, 1.2, 3.4)
      this.disposables.push(nacelleGeo)
      const nacelleMesh: THREE.Mesh = new THREE.Mesh(nacelleGeo, towerMat)
      nacelleMesh.position.set(0, 30, 0)
      turbineGroup.add(nacelleMesh)

      const rotorGroup: THREE.Group = new THREE.Group()
      rotorGroup.position.set(0, 30, 1.9)

      const hubGeo: THREE.SphereGeometry = new THREE.SphereGeometry(0.7, 12, 12)
      this.disposables.push(hubGeo)
      const hubMesh: THREE.Mesh = new THREE.Mesh(hubGeo, hubMat)
      rotorGroup.add(hubMesh)

      for (let b: number = 0; b < 3; b++) {
        const bladeGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.42, 12.5, 0.09)
        this.disposables.push(bladeGeo)
        const bladeMesh: THREE.Mesh = new THREE.Mesh(bladeGeo, bladeMat)
        bladeMesh.position.set(0, 6.25, 0)
        bladeMesh.rotation.z = (b * Math.PI * 2) / 3
        rotorGroup.add(bladeMesh)
      }

      this.windTurbineRotors.push(rotorGroup)
      turbineGroup.add(rotorGroup)
      this.group.add(turbineGroup)
    })

    const rockMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.95,
      metalness: 0.1,
    })
    this.disposables.push(rockMat)

    for (const portalZ of [245, 275]) {
      const trackPt: THREE.Vector3 = this.getTrackPosAtZ(portalZ)

      for (const side of [-1, 1]) {
        const rockGeo: THREE.DodecahedronGeometry = new THREE.DodecahedronGeometry(12, 1)
        this.disposables.push(rockGeo)
        const rockMesh: THREE.Mesh = new THREE.Mesh(rockGeo, rockMat)
        rockMesh.position.set(trackPt.x + side * 34, 4, portalZ)
        rockMesh.scale.set(1.2, 1.8, 1.2)
        this.group.add(rockMesh)
      }
    }
  }

  // --- 12. HIGHWAY INFRASTRUCTURE ---
  private buildDaylightHighwayTraffic(): void {
    const highwayPoints: THREE.Vector3[] = [
      new THREE.Vector3(-75, 3, -40),
      new THREE.Vector3(-65, 5, 60),
      new THREE.Vector3(-68, 7, 160),
      new THREE.Vector3(-72, 6, 260),
      new THREE.Vector3(-66, 8, 360),
      new THREE.Vector3(-70, 4, 480),
    ]
    const highwayCurve: THREE.CatmullRomCurve3 = new THREE.CatmullRomCurve3(highwayPoints)

    const deckMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.85,
      metalness: 0.1,
    })
    this.disposables.push(deckMat)

    const deckGeo: THREE.TubeGeometry = new THREE.TubeGeometry(highwayCurve, 160, 2.6, 6, false)
    this.disposables.push(deckGeo)
    const deckMesh: THREE.Mesh = new THREE.Mesh(deckGeo, deckMat)
    deckMesh.position.y = -0.5
    deckMesh.scale.set(1.4, 0.35, 1)
    this.group.add(deckMesh)

    const stripeMat: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
    this.disposables.push(stripeMat)
    const stripeGeo: THREE.TubeGeometry = new THREE.TubeGeometry(highwayCurve, 160, 0.08, 4, false)
    this.disposables.push(stripeGeo)
    const stripeMesh: THREE.Mesh = new THREE.Mesh(stripeGeo, stripeMat)
    stripeMesh.position.y = 0.05
    this.group.add(stripeMesh)
  }

  // --- 13. EDITORIAL HOARDINGS ---
  private buildDaylightBillboards(): void {
    interface BillboardConfig {
      text: string
      kicker: string
      color: string
      z: number
      side: 1 | -1
      scale: number
    }

    const billboardData: BillboardConfig[] = [
      {
        text: 'SHARDUL METRO',
        kicker: 'HIGH-SPEED DAYLIGHT CORRIDOR',
        color: '#1d4ed8',
        z: 45,
        side: 1,
        scale: 1.2,
      },
      {
        text: 'ODOO HACKATHONS',
        kicker: '48-HOUR PAN-INDIA SUMMIT',
        color: '#0284c7',
        z: 120,
        side: -1,
        scale: 1.1,
      },
      {
        text: 'LOCAL PASSENGER',
        kicker: 'PROSE BOOK BY SHARDUL DAVE',
        color: '#7c3aed',
        z: 205,
        side: 1,
        scale: 1.0,
      },
      {
        text: 'ECOBHOO CAMPSITE',
        kicker: 'SIIP GOVT GRANT WINNER',
        color: '#15803d',
        z: 295,
        side: -1,
        scale: 1.1,
      },
      {
        text: 'SPEED 350 KM/H',
        kicker: 'CITY B GANDHINAGAR EXPRESS',
        color: '#b45309',
        z: 395,
        side: 1,
        scale: 1.0,
      },
    ]

    billboardData.forEach((data: BillboardConfig) => {
      const trackPt: THREE.Vector3 = this.getTrackPosAtZ(data.z)
      const lateralDist: number = 38 + data.scale * 3
      const x: number = trackPt.x + (data.side === 1 ? lateralDist : -lateralDist)
      const y: number = trackPt.y + 14 + data.scale * 2
      const rotY: number = data.side === 1 ? -0.32 : 0.32

      const canvas: HTMLCanvasElement = document.createElement('canvas')
      canvas.width = 512
      canvas.height = 256
      const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d')

      if (ctx) {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, 512, 256)

        ctx.fillStyle = data.color
        ctx.fillRect(0, 0, 512, 16)

        ctx.strokeStyle = '#cbd5e1'
        ctx.lineWidth = 6
        ctx.strokeRect(3, 3, 506, 250)

        ctx.fillStyle = '#64748b'
        ctx.font = 'bold 22px monospace'
        ctx.fillText(data.kicker, 32, 68)

        ctx.fillStyle = data.color
        ctx.font = '900 44px sans-serif'
        ctx.fillText(data.text, 32, 138)

        ctx.fillStyle = '#0f172a'
        ctx.font = 'bold 20px monospace'
        ctx.fillText('AUTOMATED HIGH-SPEED TRANSIT SYSTEM', 32, 200)
      }

      const tex: THREE.CanvasTexture = new THREE.CanvasTexture(canvas)
      this.disposables.push(tex)

      const boardMat: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
        map: tex,
        side: THREE.DoubleSide,
      })
      this.disposables.push(boardMat)

      const boardGeo: THREE.PlaneGeometry = new THREE.PlaneGeometry(12 * data.scale, 6 * data.scale)
      this.disposables.push(boardGeo)

      const boardMesh: THREE.Mesh = new THREE.Mesh(boardGeo, boardMat)
      boardMesh.position.set(x, y, data.z)
      boardMesh.rotation.y = rotY
      this.group.add(boardMesh)

      const supportMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
        color: 0x64748b,
        metalness: 0.8,
        roughness: 0.25,
      })
      this.disposables.push(supportMat)

      const pylonGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.28, 0.35, y + 6, 8)
      this.disposables.push(pylonGeo)
      const pylonMesh: THREE.Mesh = new THREE.Mesh(pylonGeo, supportMat)
      pylonMesh.position.set(x, (y - 6) / 2, data.z)
      this.group.add(pylonMesh)
    })
  }

  // --- 14. WELCOME PORTAL ARCHES ---
  private buildDaylightPortalArches(): void {
    this.createPortalArch(
      0,
      'CITY A // ANAND CENTRAL HUB',
      'LINE 01 TRUNK · DAYLIGHT DEPARTURE CONCOURSE',
      '#1d4ed8'
    )

    this.createPortalArch(
      410,
      'CITY B // GANDHINAGAR CAPITAL REACH',
      'LINE 01 TERMINUS · MISSION EXCELLENCE ARRIVED',
      '#059669'
    )
  }

  private createPortalArch(
    archZ: number,
    mainTitle: string,
    subTitle: string,
    accentColor: string
  ): void {
    const trackPt: THREE.Vector3 = this.getTrackPosAtZ(archZ)
    const archGroup: THREE.Group = new THREE.Group()
    archGroup.position.set(trackPt.x - 1.8, trackPt.y, archZ)

    const archFrameMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.5,
      roughness: 0.3,
    })
    this.disposables.push(archFrameMat)

    const colGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.8, 10.5, 1.0)
    this.disposables.push(colGeo)
    for (const sideX of [-8.5, 8.5]) {
      const colMesh: THREE.Mesh = new THREE.Mesh(colGeo, archFrameMat)
      colMesh.position.set(sideX, 5.25, 0)
      archGroup.add(colMesh)
    }

    const beamGeo: THREE.BoxGeometry = new THREE.BoxGeometry(17.8, 0.9, 1.3)
    this.disposables.push(beamGeo)
    const beamMesh: THREE.Mesh = new THREE.Mesh(beamGeo, archFrameMat)
    beamMesh.position.set(0, 10.0, 0)
    archGroup.add(beamMesh)

    const canvas: HTMLCanvasElement = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 256
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, 1024, 256)

      ctx.fillStyle = accentColor
      ctx.fillRect(0, 0, 1024, 18)

      ctx.strokeStyle = '#cbd5e1'
      ctx.lineWidth = 6
      ctx.strokeRect(3, 3, 1018, 250)

      ctx.fillStyle = '#64748b'
      ctx.font = 'bold 28px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(subTitle, 512, 70)

      ctx.fillStyle = accentColor
      ctx.font = '900 58px sans-serif'
      ctx.fillText(mainTitle, 512, 150)

      ctx.fillStyle = '#0f172a'
      ctx.font = 'bold 24px monospace'
      ctx.fillText('SPEED RECORD: 350 KM/H · DAYLIGHT HIGH-SPEED CORRIDOR', 512, 212)
    }

    const tex: THREE.CanvasTexture = new THREE.CanvasTexture(canvas)
    this.disposables.push(tex)
    const signMat: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
      map: tex,
      side: THREE.DoubleSide,
    })
    this.disposables.push(signMat)

    const signGeo: THREE.PlaneGeometry = new THREE.PlaneGeometry(16.0, 3.2)
    this.disposables.push(signGeo)
    const signMesh: THREE.Mesh = new THREE.Mesh(signGeo, signMat)
    signMesh.position.set(0, 7.8, 0)
    archGroup.add(signMesh)

    this.group.add(archGroup)
  }

  public update(): void {
    this.time += 0.02

    this.windTurbineRotors.forEach((rotor: THREE.Group) => {
      rotor.rotation.z += 0.026
    })

    this.clouds.forEach((cloud: THREE.Group, idx: number) => {
      cloud.position.x += 0.035 * (idx % 2 === 0 ? 1 : 0.8)
      if (cloud.position.x > 220) {
        cloud.position.x = -220
      }
    })

    // Animate Highway Traffic Vehicles smoothly along their lanes
    this.animatedVehicles.forEach((v: AnimatedVehicle) => {
      v.u += v.speed
      if (v.u > 1.0) v.u = 0.001
      if (v.u < 0.0) v.u = 0.999

      const pt: THREE.Vector3 = v.curve.getPointAt(v.u)
      const tangent: THREE.Vector3 = v.curve.getTangentAt(v.u).normalize()
      const up: THREE.Vector3 = new THREE.Vector3(0, 1, 0)
      const normal: THREE.Vector3 = new THREE.Vector3().crossVectors(tangent, up).normalize()

      // Position vehicle with lane lateral offset
      const pos: THREE.Vector3 = pt.clone().addScaledVector(normal, v.laneOffset)
      v.meshGroup.position.copy(pos)

      // Look in direction of motion (forward or backward depending on lane)
      const lookPt: THREE.Vector3 = pos.clone().addScaledVector(tangent, v.speed > 0 ? 1 : -1)
      v.meshGroup.lookAt(lookPt)
    })
  }

  public dispose(): void {
    for (const item of this.disposables) {
      item.dispose()
    }
    this.group.clear()
  }
}
