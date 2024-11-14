import * as THREE from 'three';
import { Endpoints } from '../configs/Endpoints';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils';

const loader = new GLTFLoader();
const url = Endpoints.Download("HRobot15"); // Replace with your GLB file path

loader.load(url, (gltf) => {
    const scene = gltf.scene;
    const meshes = [];

    // Function to traverse and collect meshes
    const collectMeshes = (object) => {
        object.traverse((child) => {
            if (child.isMesh) {
                meshes.push(child);
            }
        });
    };

    collectMeshes(scene);

    // Create a single merged mesh if necessary
    const geometries = [];
    const materials = [];
    
    meshes.forEach((mesh) => {
        mesh.updateMatrix(); // Ensure the matrix is updated for transformations
        geometries.push(mesh.geometry);
        materials.push(mesh.material);
    });

    const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries, true);
    const mergedMesh = new THREE.Mesh(mergedGeometry, materials);

    // Exporting the mesh data to a file
    const exportMeshData = (mesh) => {
        const json = mesh.toJSON(); // Convert mesh to JSON format
        
    };

    exportMeshData(mergedMesh);
}, undefined, (error) => {
    console.error('An error occurred while loading the GLB model:', error);
});