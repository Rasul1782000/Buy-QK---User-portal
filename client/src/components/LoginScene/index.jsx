import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment, ContactShadows } from '@react-three/drei'

function TrolleyBody() {
  return (
    <group>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.2, 0.8, 0.8]} />
        <meshStandardMaterial color="#c0c0c0" roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.5, 0.41]}>
        <boxGeometry args={[1.2, 0.8, 0.02]} />
        <meshStandardMaterial color="#888" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0.61, 0.5, 0]}>
        <boxGeometry args={[0.02, 0.8, 0.8]} />
        <meshStandardMaterial color="#888" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[-0.61, 0.5, 0]}>
        <boxGeometry args={[0.02, 0.8, 0.8]} />
        <meshStandardMaterial color="#888" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[1.22, 0.02, 0.82]} />
        <meshStandardMaterial color="#888" roughness={0.3} metalness={0.5} />
      </mesh>
    </group>
  )
}

function TrolleyHandle() {
  return (
    <group position={[-0.7, 0.9, 0]}>
      <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
        <meshStandardMaterial color="#666" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.55, 0.35]}>
        <boxGeometry args={[0.06, 0.5, 0.06]} />
        <meshStandardMaterial color="#666" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.55, -0.35]}>
        <boxGeometry args={[0.06, 0.5, 0.06]} />
        <meshStandardMaterial color="#666" roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  )
}

function TrolleyWheels() {
  const positions = [
    [-0.45, 0.08, 0.35],
    [0.45, 0.08, 0.35],
    [-0.45, 0.08, -0.35],
    [0.45, 0.08, -0.35],
  ]
  return (
    <>
      {positions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.1, 0.04, 8, 16]} />
            <meshStandardMaterial color="#333" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </>
  )
}

function Apple({ position, rotation }) {
  return (
    <group position={position} rotation={rotation || [0, 0, 0]}>
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#e74c3c" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.01, 0.015, 0.04, 6]} />
        <meshStandardMaterial color="#5d4037" roughness={0.6} />
      </mesh>
      <mesh position={[0.02, 0.13, 0]}>
        <planeGeometry args={[0.04, 0.03]} />
        <meshStandardMaterial color="#4caf50" roughness={0.5} side={2} />
      </mesh>
    </group>
  )
}

function Orange({ position }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color="#ff9800" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.015, 6, 6]} />
        <meshStandardMaterial color="#4caf50" roughness={0.5} />
      </mesh>
    </group>
  )
}

function Broccoli({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, -0.08, 0]}>
        <cylinderGeometry args={[0.03, 0.05, 0.15, 8]} />
        <meshStandardMaterial color="#6d8c54" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#4caf50" roughness={0.7} />
      </mesh>
      <mesh position={[0.06, 0.04, 0.05]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#66bb6a" roughness={0.7} />
      </mesh>
      <mesh position={[-0.05, 0.05, -0.04]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#43a047" roughness={0.7} />
      </mesh>
    </group>
  )
}

function MilkCarton({ position }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.1, 0.18, 0.08]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.1, 0.03, 0.08]} />
        <meshStandardMaterial color="#2196f3" roughness={0.3} />
      </mesh>
      <mesh position={[0.052, 0, 0]}>
        <boxGeometry args={[0.005, 0.16, 0.07]} />
        <meshStandardMaterial color="#2196f3" roughness={0.3} />
      </mesh>
    </group>
  )
}

function Bread({ position }) {
  return (
    <group position={position} rotation={[0, 0, 0.2]}>
      <mesh>
        <boxGeometry args={[0.18, 0.08, 0.14]} />
        <meshStandardMaterial color="#f4d03f" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.18, 0.03, 0.14]} />
        <meshStandardMaterial color="#e67e22" roughness={0.5} />
      </mesh>
    </group>
  )
}

function Egg({ position }) {
  return (
    <group position={position} rotation={[0, 0, 0.1]}>
      <mesh>
        <capsuleGeometry args={[0.04, 0.06, 8, 12]} />
        <meshStandardMaterial color="#fafafa" roughness={0.2} />
      </mesh>
    </group>
  )
}

function SodaCan({ position }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.05, 0.06, 0.16, 12]} />
        <meshStandardMaterial color="#e53935" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.09, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.02, 12]} />
        <meshStandardMaterial color="#b71c1c" roughness={0.2} metalness={0.6} />
      </mesh>
      <mesh position={[0, -0.01, 0.052]}>
        <circleGeometry args={[0.02, 8]} />
        <meshStandardMaterial color="#fff" roughness={0.2} />
      </mesh>
    </group>
  )
}

function ShoppingTrolley() {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = -1.0 + Math.sin(state.clock.elapsedTime * 0.8) * 0.1
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.3}>
        <TrolleyBody />
        <TrolleyHandle />
        <TrolleyWheels />

        <Apple position={[-0.2, 0.55, 0.1]} rotation={[0.3, 0.5, 0.2]} />
        <Orange position={[0.25, 0.5, -0.1]} />
        <Broccoli position={[-0.1, 0.45, -0.25]} />
        <MilkCarton position={[0.3, 0.4, 0.2]} />
        <Bread position={[-0.3, 0.5, -0.15]} />
        <Egg position={[0.15, 0.55, 0.25]} />
        <SodaCan position={[-0.25, 0.55, 0.25]} />

        <mesh position={[0.1, 0.5, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#ffeb3b" roughness={0.4} />
        </mesh>

        <mesh position={[-0.15, 0.48, 0.2]}>
          <torusKnotGeometry args={[0.04, 0.02, 16, 8]} />
          <meshStandardMaterial color="#ff5722" roughness={0.3} />
        </mesh>
      </Float>
    </group>
  )
}

function FloatingGrocery({ position, children, speed }) {
  return (
    <Float speed={speed || 1} rotationIntensity={0.5} floatIntensity={0.6}>
      <group position={position}>
        {children}
      </group>
    </Float>
  )
}

function FloatingItems() {
  const items = useMemo(() => [
    { pos: [-1.8, 0.5, -0.5], color: '#e74c3c', size: 0.1, speed: 0.8 },
    { pos: [1.8, 0.8, -0.3], color: '#ff9800', size: 0.12, speed: 0.6 },
    { pos: [-1.5, -0.2, -0.8], color: '#4caf50', size: 0.09, speed: 1.0 },
    { pos: [1.6, 0.2, -0.6], color: '#9c27b0', size: 0.08, speed: 0.7 },
    { pos: [-2.0, 0.0, 0.3], color: '#ffeb3b', size: 0.07, speed: 0.9 },
    { pos: [1.9, 0.6, 0.5], color: '#2196f3', size: 0.1, speed: 0.5 },
    { pos: [0, 1.5, -1.0], color: '#ff5722', size: 0.11, speed: 0.4 },
    { pos: [-1.2, 1.2, -0.2], color: '#8bc34a', size: 0.08, speed: 0.75 },
    { pos: [1.3, 1.0, 0.2], color: '#e91e63', size: 0.09, speed: 0.65 },
    { pos: [0.5, -0.5, -1.2], color: '#00bcd4', size: 0.07, speed: 1.1 },
  ], [])

  return (
    <>
      {items.map((item, i) => (
        <FloatingGrocery key={i} position={item.pos} speed={item.speed}>
          <mesh>
            {i % 3 === 0 ? (
              <sphereGeometry args={[item.size, 16, 16]} />
            ) : i % 3 === 1 ? (
              <boxGeometry args={[item.size * 1.3, item.size * 1.3, item.size * 1.3]} />
            ) : (
              <torusGeometry args={[item.size, item.size * 0.4, 8, 16]} />
            )}
            <meshStandardMaterial color={item.color} roughness={0.3} metalness={0.2} />
          </mesh>
        </FloatingGrocery>
      ))}
    </>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.0} color="#ffffff" />
      <directionalLight position={[-3, 4, -2]} intensity={0.3} color="#6da0ff" />
      <pointLight position={[0, 3, 2]} intensity={0.4} color="#f8cb46" />
      <pointLight position={[2, 1, 3]} intensity={0.3} color="#ff9800" />

      <ShoppingTrolley />

      <FloatingItems />

      <ContactShadows
        position={[0, -1.3, 0]}
        opacity={0.3}
        scale={6}
        blur={2.5}
        far={3}
      />

      <Environment preset="city" />
    </>
  )
}

export default function LoginScene() {
  return (
    <div className="login-scene">
      <Canvas
        camera={{ position: [0, 0.3, 4.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
