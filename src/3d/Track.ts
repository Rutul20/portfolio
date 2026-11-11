import * as THREE from 'three'

export class Track {
  public group: THREE.Group
  public curve: THREE.CatmullRomCurve3
  private disposables: (THREE.BufferGeometry | THREE.Material)[] = []

  constructor() {
    this.group = new THREE.Group()
    this.group.name = 'DoubleTrackRailwayCorridor'

    // Control points for a graceful, cinematic transit corridor from City A to City B
    const points: THREE.Vector3[] = [
      new THREE.Vector3(0, 0, -20),
      new THREE.Vector3(0, 0, 15),       // Station 0: Anand Central (t ~ 0.05)
      new THREE.Vector3(8, 2, 45),
      new THREE.Vector3(22, 4, 75),      // Station 1: Blueprint Terminal (t ~ 0.20)
      new THREE.Vector3(18, 6, 110),
      new THREE.Vector3(-14, 5, 145),    // Station 2: River Crossing / Career (t ~ 0.38)
      new THREE.Vector3(-26, 4, 180),
      new THREE.Vector3(8, 3, 215),      // Station 3: Open Corridor / Projects (t ~ 0.54)
      new THREE.Vector3(28, 5, 245),
      new THREE.Vector3(12, 7, 280),     // Station 4: Mountain Pass / Skills (t ~ 0.69)
      new THREE.Vector3(-18, 5, 315),
      new THREE.Vector3(-8, 3, 350),     // Station 5: City B Approach / Honours (t ~ 0.83)
      new THREE.Vector3(14, 1, 385),
      new THREE.Vector3(0, 0, 420),      // Station 6: City B Concourse (t ~ 0.95)
      new THREE.Vector3(0, 0, 460),
    ]

    this.curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.45)

    this.buildTrackGeometry()
  }

  public getPointAt(t: number, target: THREE.Vector3 = new THREE.Vector3()): THREE.Vector3 {
    const clampedT: number = Math.max(0, Math.min(1, t))
    return this.curve.getPointAt(clampedT, target)
  }

  public getTangentAt(t: number, target: THREE.Vector3 = new THREE.Vector3()): THREE.Vector3 {
    const clampedT: number = Math.max(0, Math.min(1, t))
    return this.curve.getTangentAt(clampedT, target)
  }

  private buildTrackGeometry(): void {
    const sampleCount: number = 380
    const railGauge: number = 1.15
    const counterTrackOffset: number = 3.6 // Parallel Return Track Offset

    // Main Track Rails
    const leftRailPoints: THREE.Vector3[] = []
    const rightRailPoints: THREE.Vector3[] = []

    // Parallel Counter-Track Rails (Real Double-Track High-Speed Line)
    const counterLeftRailPoints: THREE.Vector3[] = []
    const counterRightRailPoints: THREE.Vector3[] = []

    // Parapets and Catenary
    const leftBarrierPoints: THREE.Vector3[] = []
    const rightBarrierPoints: THREE.Vector3[] = []
    const contactWirePoints: THREE.Vector3[] = []
    const messengerWirePoints: THREE.Vector3[] = []

    const up: THREE.Vector3 = new THREE.Vector3(0, 1, 0)

    for (let i: number = 0; i <= sampleCount; i++) {
      const u: number = i / sampleCount
      const pt: THREE.Vector3 = this.curve.getPointAt(u)
      const tangent: THREE.Vector3 = this.curve.getTangentAt(u).normalize()
      const normal: THREE.Vector3 = new THREE.Vector3().crossVectors(tangent, up).normalize()

      // Track 1 (Main Track): Left & Right Rails
      leftRailPoints.push(pt.clone().addScaledVector(normal, -railGauge))
      rightRailPoints.push(pt.clone().addScaledVector(normal, railGauge))

      // Track 2 (Parallel Counter-Track): Left & Right Rails
      counterLeftRailPoints.push(pt.clone().addScaledVector(normal, -counterTrackOffset - railGauge))
      counterRightRailPoints.push(pt.clone().addScaledVector(normal, -counterTrackOffset + railGauge))

      // Double-Track Viaduct Outer Parapets with Neon Edge Runners
      leftBarrierPoints.push(pt.clone().addScaledVector(normal, -counterTrackOffset - 2.8).add(new THREE.Vector3(0, 0.45, 0)))
      rightBarrierPoints.push(pt.clone().addScaledVector(normal, 3.2).add(new THREE.Vector3(0, 0.45, 0)))

      // Overhead Catenary System (OCS) Wires over Main Track
      contactWirePoints.push(pt.clone().add(new THREE.Vector3(0, 4.3, 0)))
      messengerWirePoints.push(pt.clone().add(new THREE.Vector3(0, 4.88, 0)))
    }

    const leftRailCurve: THREE.CatmullRomCurve3 = new THREE.CatmullRomCurve3(leftRailPoints)
    const rightRailCurve: THREE.CatmullRomCurve3 = new THREE.CatmullRomCurve3(rightRailPoints)
    const counterLeftCurve: THREE.CatmullRomCurve3 = new THREE.CatmullRomCurve3(counterLeftRailPoints)
    const counterRightCurve: THREE.CatmullRomCurve3 = new THREE.CatmullRomCurve3(counterRightRailPoints)

    const leftBarrierCurve: THREE.CatmullRomCurve3 = new THREE.CatmullRomCurve3(leftBarrierPoints)
    const rightBarrierCurve: THREE.CatmullRomCurve3 = new THREE.CatmullRomCurve3(rightBarrierPoints)
    const contactWireCurve: THREE.CatmullRomCurve3 = new THREE.CatmullRomCurve3(contactWirePoints)
    const messengerWireCurve: THREE.CatmullRomCurve3 = new THREE.CatmullRomCurve3(messengerWirePoints)

    // 1. High-Performance Rail Material (Gleaming Polished Steel with Metallic Sheen)
    const railMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0xc8d7eb,
      metalness: 0.95,
      roughness: 0.14,
    })
    this.disposables.push(railMaterial)

    // Tubular Steel Rails for Track 1 & Track 2
    const leftRailGeo: THREE.TubeGeometry = new THREE.TubeGeometry(leftRailCurve, 380, 0.13, 8, false)
    const rightRailGeo: THREE.TubeGeometry = new THREE.TubeGeometry(rightRailCurve, 380, 0.13, 8, false)
    const counterLeftGeo: THREE.TubeGeometry = new THREE.TubeGeometry(counterLeftCurve, 380, 0.12, 8, false)
    const counterRightGeo: THREE.TubeGeometry = new THREE.TubeGeometry(counterRightCurve, 380, 0.12, 8, false)
    this.disposables.push(leftRailGeo, rightRailGeo, counterLeftGeo, counterRightGeo)

    this.group.add(new THREE.Mesh(leftRailGeo, railMaterial))
    this.group.add(new THREE.Mesh(rightRailGeo, railMaterial))
    this.group.add(new THREE.Mesh(counterLeftGeo, railMaterial))
    this.group.add(new THREE.Mesh(counterRightGeo, railMaterial))

    // 2. Center Golden Laser Guide Line
    const guideMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.85,
    })
    this.disposables.push(guideMaterial)

    const guideGeo: THREE.TubeGeometry = new THREE.TubeGeometry(this.curve, 380, 0.045, 6, false)
    this.disposables.push(guideGeo)
    this.group.add(new THREE.Mesh(guideGeo, guideMaterial))

    // 3. Double-Track Concrete Sleepers (Ties) with Steel Tie-Plates
    const sleeperCount: number = 340
    // Wide sleeper spanning both tracks with tie-plates
    const sleeperGeo: THREE.BoxGeometry = new THREE.BoxGeometry(8.2, 0.2, 0.45)
    const sleeperMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4dce8, // Light concrete sleepers
      roughness: 0.85,
      metalness: 0.15,
    })
    this.disposables.push(sleeperGeo, sleeperMaterial)

    const sleepers: THREE.InstancedMesh = new THREE.InstancedMesh(sleeperGeo, sleeperMaterial, sleeperCount)
    const dummy: THREE.Object3D = new THREE.Object3D()

    for (let i: number = 0; i < sleeperCount; i++) {
      const u: number = i / sleeperCount
      const pt: THREE.Vector3 = this.curve.getPointAt(u)
      const tangent: THREE.Vector3 = this.curve.getTangentAt(u).normalize()
      const normal: THREE.Vector3 = new THREE.Vector3().crossVectors(tangent, up).normalize()

      // Center sleeper between track 1 and track 2
      const sleeperPos: THREE.Vector3 = pt.clone().addScaledVector(normal, -counterTrackOffset * 0.5)
      sleeperPos.y -= 0.13

      dummy.position.copy(sleeperPos)
      dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent)
      dummy.updateMatrix()
      sleepers.setMatrixAt(i, dummy.matrix)
    }
    sleepers.instanceMatrix.needsUpdate = true
    this.group.add(sleepers)

    // 4. Ballast Gravel Bed Underneath (Granite Ballast Bed)
    const ballastMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0x64748b, // Grey granite ballast bed
      roughness: 0.95,
      metalness: 0.05,
    })
    this.disposables.push(ballastMaterial)

    const ballastGeo: THREE.TubeGeometry = new THREE.TubeGeometry(this.curve, 260, 4.4, 6, false)
    this.disposables.push(ballastGeo)
    const ballastMesh: THREE.Mesh = new THREE.Mesh(ballastGeo, ballastMaterial)
    ballastMesh.position.y = -0.7
    ballastMesh.scale.set(1.4, 0.35, 1.0)
    this.group.add(ballastMesh)

    // 5. Viaduct Parapet Safety Barriers with Edge Runners
    const barrierNeonMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.8,
    })
    this.disposables.push(barrierNeonMaterial)

    const leftBarrierGeo: THREE.TubeGeometry = new THREE.TubeGeometry(leftBarrierCurve, 260, 0.06, 6, false)
    const rightBarrierGeo: THREE.TubeGeometry = new THREE.TubeGeometry(rightBarrierCurve, 260, 0.06, 6, false)
    this.disposables.push(leftBarrierGeo, rightBarrierGeo)

    this.group.add(new THREE.Mesh(leftBarrierGeo, barrierNeonMaterial))
    this.group.add(new THREE.Mesh(rightBarrierGeo, barrierNeonMaterial))

    // 6. Massive Viaduct Piers (Descending to Ground Level)
    const pierCount: number = 18
    const pierGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(1.6, 2.0, 18, 12)
    const pierMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0, // Clean light concrete viaduct piers
      roughness: 0.85,
      metalness: 0.15,
    })
    this.disposables.push(pierGeo, pierMaterial)

    for (let i: number = 0; i < pierCount; i++) {
      const u: number = 0.02 + (i / pierCount) * 0.96
      const pt: THREE.Vector3 = this.curve.getPointAt(u)
      const tangent: THREE.Vector3 = this.curve.getTangentAt(u).normalize()
      const normal: THREE.Vector3 = new THREE.Vector3().crossVectors(tangent, up).normalize()

      const pierPos: THREE.Vector3 = pt.clone().addScaledVector(normal, -counterTrackOffset * 0.5)
      const pierMesh: THREE.Mesh = new THREE.Mesh(pierGeo, pierMaterial)
      pierMesh.position.set(pierPos.x, (pt.y - 6) / 2, pierPos.z)
      const pierHeight: number = Math.max(4, pt.y + 6)
      pierMesh.scale.set(1, pierHeight / 18, 1)
      this.group.add(pierMesh)
    }

    // 7. Overhead Catenary System (OCS) Power Wires
    const wireMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
      color: 0x64748b,
      transparent: true,
      opacity: 0.7,
    })
    this.disposables.push(wireMaterial)

    const contactWireGeo: THREE.TubeGeometry = new THREE.TubeGeometry(contactWireCurve, 320, 0.026, 4, false)
    const messengerWireGeo: THREE.TubeGeometry = new THREE.TubeGeometry(messengerWireCurve, 320, 0.022, 4, false)
    this.disposables.push(contactWireGeo, messengerWireGeo)

    this.group.add(new THREE.Mesh(contactWireGeo, wireMaterial))
    this.group.add(new THREE.Mesh(messengerWireGeo, wireMaterial))

    // 8. Broad Steel Portal Mast Gantries Spanning Both Tracks
    const gantryCount: number = 14
    const gantrySteelMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8, // Galvanized silver steel
      metalness: 0.8,
      roughness: 0.25,
    })
    const insulatorMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
      color: 0xffb547,
    })
    this.disposables.push(gantrySteelMaterial, insulatorMaterial)

    for (let i: number = 0; i < gantryCount; i++) {
      const u: number = 0.04 + (i / gantryCount) * 0.92
      const pt: THREE.Vector3 = this.curve.getPointAt(u)
      const tangent: THREE.Vector3 = this.curve.getTangentAt(u).normalize()
      const normal: THREE.Vector3 = new THREE.Vector3().crossVectors(tangent, up).normalize()

      const gantryGroup: THREE.Group = new THREE.Group()
      const gantryCenter: THREE.Vector3 = pt.clone().addScaledVector(normal, -counterTrackOffset * 0.5)
      gantryGroup.position.copy(gantryCenter)
      gantryGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent)

      // Dual Mast Columns (Spanning across both tracks: width 9.5m)
      const mastGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.24, 6.2, 0.28)
      this.disposables.push(mastGeo)
      for (const sideX of [-4.8, 4.8]) {
        const mastMesh: THREE.Mesh = new THREE.Mesh(mastGeo, gantrySteelMaterial)
        mastMesh.position.set(sideX, 3.0, 0)
        gantryGroup.add(mastMesh)
      }

      // Horizontal Truss Crossbeam
      const beamGeo: THREE.BoxGeometry = new THREE.BoxGeometry(9.8, 0.3, 0.35)
      this.disposables.push(beamGeo)
      const crossBeam: THREE.Mesh = new THREE.Mesh(beamGeo, gantrySteelMaterial)
      crossBeam.position.set(0, 5.8, 0)
      gantryGroup.add(crossBeam)

      // Cantilever Drop Arms & Insulators over Track 1 and Track 2
      const armGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.04, 0.04, 1.1, 6)
      const insulatorGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.24, 8)
      this.disposables.push(armGeo, insulatorGeo)

      for (const trackX of [counterTrackOffset * 0.5, -counterTrackOffset * 0.5]) {
        const armMesh: THREE.Mesh = new THREE.Mesh(armGeo, gantrySteelMaterial)
        armMesh.position.set(trackX, 5.2, 0)
        gantryGroup.add(armMesh)

        const insMesh: THREE.Mesh = new THREE.Mesh(insulatorGeo, insulatorMaterial)
        insMesh.position.set(trackX, 4.6, 0)
        gantryGroup.add(insMesh)
      }

      this.group.add(gantryGroup)
    }

    // 9. Authentic Trackside Kilometre Distance Milestone Posts & Speed Limit Boards
    const milepostMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 0xedf2f7,
      metalness: 0.3,
      roughness: 0.6,
    })
    const speedBoardMat: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xffd166 })
    this.disposables.push(milepostMat, speedBoardMat)

    const milestones: { u: number; km: string; speed: string }[] = [
      { u: 0.05, km: 'KM 00 - ANAND (CITY A)', speed: 'MAX 120' },
      { u: 0.20, km: 'KM 25', speed: 'MAX 250' },
      { u: 0.38, km: 'KM 55 - RIVER VIADUCT', speed: 'MAX 300' },
      { u: 0.54, km: 'KM 80', speed: 'MAX 350' },
      { u: 0.69, km: 'KM 105 - MOUNTAIN PASS', speed: 'MAX 280' },
      { u: 0.83, km: 'KM 130', speed: 'MAX 200' },
      { u: 0.95, km: 'KM 150 - CITY B', speed: 'MAX 80' },
    ]

    milestones.forEach((m) => {
      const pt: THREE.Vector3 = this.curve.getPointAt(m.u)
      const tangent: THREE.Vector3 = this.curve.getTangentAt(m.u).normalize()
      const normal: THREE.Vector3 = new THREE.Vector3().crossVectors(tangent, up).normalize()

      const postGroup: THREE.Group = new THREE.Group()
      const postPos: THREE.Vector3 = pt.clone().addScaledVector(normal, 2.7)
      postGroup.position.copy(postPos)
      postGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent)

      // Milestone Post Pillar
      const postGeo: THREE.BoxGeometry = new THREE.BoxGeometry(0.3, 1.2, 0.3)
      this.disposables.push(postGeo)
      const postMesh: THREE.Mesh = new THREE.Mesh(postGeo, milepostMat)
      postMesh.position.set(0, 0.6, 0)
      postGroup.add(postMesh)

      // Speed Board Disk
      const speedGeo: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.06, 16)
      this.disposables.push(speedGeo)
      const speedMesh: THREE.Mesh = new THREE.Mesh(speedGeo, speedBoardMat)
      speedMesh.rotation.x = Math.PI / 2
      speedMesh.position.set(0, 1.5, 0)
      postGroup.add(speedMesh)

      this.group.add(postGroup)
    })
  }

  public dispose(): void {
    for (const item of this.disposables) {
      item.dispose()
    }
    this.group.clear()
  }
}
