// Three.js - 3D Samarqand Registon
let scene, camera, renderer, controls;
let madrasahs = []; // 3 ta madrasa obyektlarini saqlash

// Madrasa ma'lumotlari
const madrasaData = [
    {
        name: "Ulug'bek Madrasasi",
        desc: "1420-yilda qurilgan. O'rta asrlarning eng buyuk astronomi Mirzo Ulug'bek tomonidan qurdirilgan. Bu madrasa Islom olamidagi eng qadimgi madrasalardan biri.",
        color: 0x3b82f6,
        year: 1420,
        position: { x: -3.5, z: 2 }
    },
    {
        name: "Sherdor Madrasasi",
        desc: "1636-yilda qurilgan. Nomi 'sherli' degan ma'noni anglatadi. Pesh tomonida quyoshga qarab borayotgan sher tasviri bor — bu Islom me'morchiligida nodir hodisa.",
        color: 0xfacc15,
        year: 1636,
        position: { x: 0, z: 2 }
    },
    {
        name: "Tilla-Qori Madrasasi",
        desc: "1660-yilda qurilgan. 'Tilla-Qori' — tillo bilan qoplangan degan ma'noni anglatadi. Ichkaridagi masjid zarhal bilan bezatilgan.",
        color: 0xef4444,
        year: 1660,
        position: { x: 3.5, z: 2 }
    }
];

// Sahifa yuklanganda
window.addEventListener('DOMContentLoaded', () => {
    init();
    animate();
});

function init() {
    // Scene yaratish
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050b1a);
    scene.fog = new THREE.FogExp2(0x050b1a, 0.008);

    // Camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(8, 6, 12);
    camera.lookAt(0, 0, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = false;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.zoomSpeed = 1.2;
    controls.rotateSpeed = 1;
    controls.target.set(0, 1.5, 0);

    // Yorug'liklar
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404060);
    scene.add(ambientLight);
    
    // Asosiy yorug'lik (sun)
    const dirLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    dirLight.receiveShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);
    
    // To'ldiruvchi yorug'lik
    const fillLight = new THREE.PointLight(0x445566, 0.5);
    fillLight.position.set(-2, 3, 4);
    scene.add(fillLight);
    
    // Orqa yorug'lik (atmosfera)
    const backLight = new THREE.PointLight(0x8866ff, 0.3);
    backLight.position.set(0, 2, -5);
    scene.add(backLight);
    
    // Yerdan aks etuvchi yorug'lik
    const groundLight = new THREE.PointLight(0xfacc15, 0.2);
    groundLight.position.set(0, -1, 0);
    scene.add(groundLight);

    // Zamin - kafel toshlar
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 0.7, metalness: 0.1 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Kafel naqshlari uchun grid
    const gridHelper = new THREE.GridHelper(20, 20, 0xfacc15, 0xd4a574);
    gridHelper.position.y = -0.45;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.3;
    scene.add(gridHelper);

    // 3 ta madrasa yaratish
    madrasaData.forEach((data, index) => {
        const group = new THREE.Group();
        
        // Asosiy bino (kub shaklida)
        const geometry = new THREE.BoxGeometry(2.2, 2.5, 2.2);
        const material = new THREE.MeshStandardMaterial({ 
            color: data.color, 
            roughness: 0.3, 
            metalness: 0.7,
            emissive: 0x221100,
            emissiveIntensity: 0.15
        });
        const building = new THREE.Mesh(geometry, material);
        building.castShadow = true;
        building.receiveShadow = true;
        building.position.y = 1.25;
        group.add(building);
        
        // Gumbaz (sfera)
        const domeGeo = new THREE.SphereGeometry(0.9, 32, 32);
        const domeMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.2 });
        const dome = new THREE.Mesh(domeGeo, domeMat);
        dome.position.y = 2.5 + 0.9;
        dome.castShadow = true;
        group.add(dome);
        
        // Gumbaz ustidagi hilol
        const crescentGeo = new THREE.CylinderGeometry(0.15, 0.25, 0.4, 8);
        const crescentMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9 });
        const crescent = new THREE.Mesh(crescentGeo, crescentMat);
        crescent.position.y = 2.5 + 1.6;
        group.add(crescent);
        
        // Pesh tomonidagi ark (torus yoki yarim doira)
        const archGeo = new THREE.TorusGeometry(0.7, 0.1, 16, 32, Math.PI);
        const archMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9 });
        const arch = new THREE.Mesh(archGeo, archMat);
        arch.rotation.x = Math.PI / 2;
        arch.rotation.z = Math.PI;
        arch.position.set(0, 1.4, 1.15);
        group.add(arch);
        
        // Minorlar (yon tomonda)
        const minaretGeo = new THREE.CylinderGeometry(0.35, 0.45, 2.2, 12);
        const minaretMat = new THREE.MeshStandardMaterial({ color: 0xc9a87c, metalness: 0.4 });
        
        const leftMinaret = new THREE.Mesh(minaretGeo, minaretMat);
        leftMinaret.position.set(-1.2, 1.1, -1);
        leftMinaret.castShadow = true;
        group.add(leftMinaret);
        
        const rightMinaret = new THREE.Mesh(minaretGeo, minaretMat);
        rightMinaret.position.set(1.2, 1.1, -1);
        rightMinaret.castShadow = true;
        group.add(rightMinaret);
        
        // Minor uchun kichik gumbaz
        const miniDome = new THREE.SphereGeometry(0.35, 16, 16);
        const leftTop = new THREE.Mesh(miniDome, domeMat);
        leftTop.position.set(-1.2, 2.2, -1);
        group.add(leftTop);
        
        const rightTop = new THREE.Mesh(miniDome, domeMat);
        rightTop.position.set(1.2, 2.2, -1);
        group.add(rightTop);
        
        // Joylashuv
        group.position.set(data.position.x, -0.5, data.position.z);
        
        // Custom ma'lumot qo'shish
        group.userData = {
            name: data.name,
            desc: data.desc,
            year: data.year,
            index: index
        };
        
        scene.add(group);
        madrasahs.push(group);
    });
    
    // Markaziy maydonga favvora
    const fountainBase = new THREE.CylinderGeometry(1.2, 1.5, 0.3, 16);
    const fountainMat = new THREE.MeshStandardMaterial({ color: 0x6699cc, metalness: 0.6 });
    const fountain = new THREE.Mesh(fountainBase, fountainMat);
    fountain.position.set(0, -0.35, -0.5);
    fountain.castShadow = true;
    scene.add(fountain);
    
    // Yulduzlar (atmosfera)
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 800;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
        starPositions[i*3] = (Math.random() - 0.5) * 400;
        starPositions[i*3+1] = (Math.random() - 0.5) * 100 + 20;
        starPositions[i*3+2] = (Math.random() - 0.5) * 150 - 70;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.2, transparent: true, opacity: 0.6 });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    
    // Raycaster (bosishni aniqlash uchun)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    window.addEventListener('click', (event) => {
        // Mouse koordinatalarini hisoblash
        mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        
        // Madrasalar bilan kesishishni tekshirish
        const intersects = raycaster.intersectObjects(madrasahs, true);
        
        if (intersects.length > 0) {
            let clickedGroup = null;
            let obj = intersects[0].object;
            
            // Groupni topish
            while (obj.parent) {
                if (madrasahs.includes(obj)) {
                    clickedGroup = obj;
                    break;
                }
                obj = obj.parent;
            }
            
            if (clickedGroup && clickedGroup.userData) {
                showModal(clickedGroup.userData.name, clickedGroup.userData.desc);
            }
        }
    });
    
    // Oddiy animatsiya uchun yulduzlar aylanishi
    function animateStars() {
        stars.rotation.y += 0.0005;
        stars.rotation.x += 0.0003;
        requestAnimationFrame(animateStars);
    }
    animateStars();
    
    // Window resize
    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Globallarga saqlash
    window.renderer = renderer;
    window.scene = scene;
    window.camera = camera;
    window.controls = controls;
}

function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update();
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

function showModal(title, description) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalText = document.getElementById('modalText');
    
    modalTitle.textContent = title;
    modalText.textContent = description;
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
}