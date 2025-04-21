import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { vertices, indices } from './geometryData';
import OpenAI from 'openai';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const Editor = () => {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));

  const [geometryData, setGeometryData] = useState({
    vertices: Array.from(vertices),
    indices: Array.from(indices),
    wireframe: false,
  });

  const [instruction, setInstruction] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { vertices, indices } = geometryData;
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));
  }, [geometryData.vertices, geometryData.indices]);

  const handleGeometryChange = (event) => {
    try {
      const newGeometryData = JSON.parse(event.target.value);
      setGeometryData(newGeometryData);
    } catch (error) {
      console.error('Invalid JSON format:', error);
      // Optionally, you can set a state to show an error message to the user
    }
  };

  const toggleWireframe = () => setGeometryData(prev => ({ ...prev, wireframe: !prev.wireframe }));

  const openai = new OpenAI({ apiKey: OPENAI_API_KEY , dangerouslyAllowBrowser: true});

  const handleInstructionSubmit = async () => {
    setLoading(true);
    try {
      const response = await openai.responses.create({
        model: 'gpt-4.1',
        input: `Given the current geometry data: ${JSON.stringify(geometryData)}, modify it based on the following instruction: ${instruction}, only respond with json data of modified geometry no other text. Use as many number of vertices and indices as needed to describe the geometry.`,
      });
      console.log('OpenAI Response:', response);
      const responseText = response.output[0].content[0].text.trim();
      const jsonStartIndex = responseText.indexOf('{');
      if (jsonStartIndex !== -1) {
        const jsonString = responseText.substring(jsonStartIndex);
        try {
          const newGeometryData = JSON.parse(jsonString);
          setGeometryData(newGeometryData);
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
        }
      } else {
        console.error('No JSON found in response:', responseText);
      }
    } catch (error) {
      console.error('Error with OpenAI API:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh' }}>
      {loading && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2 }}>Loading...</div>}
      <textarea
        value={JSON.stringify(geometryData, null, 2)}
        onChange={handleGeometryChange}
        style={{ width: '300px', height: '100%', marginRight: '10px', fontSize: '12px' }}
      />
      <div style={{ position: 'relative', flex: 1 }}>
        <input
          type="text"
          placeholder="Enter instructions"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1, width: 'calc(100% - 20px)', marginBottom: '10px' }}
        />
        <button
          onClick={handleInstructionSubmit}
          style={{ position: 'absolute', top: '40px', left: '10px', zIndex: 1 }}
        >
          Send
        </button>
        <button
          onClick={toggleWireframe}
          style={{ position: 'absolute', top: '70px', left: '10px', zIndex: 1 }}
        >
          Toggle Wireframe
        </button>
        <Canvas style={{ width: '100%', height: '100%', backgroundColor: 'black' }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          {/* <Grid args={[100, 100]} color="white" /> */}
          <mesh geometry={geometry} position={[0, 0.5, 0]}>
            <meshStandardMaterial color="orange" wireframe={geometryData.wireframe} wireframeLinewidth={3} side={THREE.DoubleSide}/>
          </mesh>
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
};

export default Editor;
