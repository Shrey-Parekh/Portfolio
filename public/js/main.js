// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Three.js Scene Setup
let scene, camera, renderer, controls;
let stars = [], galaxies = [], blackHole;
let isIntroActive = true;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let hoveredObject = null;
let isRotating = false;
let originalCameraPosition = { x: 0, y: 5, z: 30 };
let hintTimeout;
let zoomLevel = 1;
let maxZoom = 3;
let minZoom = 0.5;
let projectsLoaded = false;

// Debug logging
console.log('Script starting...');

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Three.js...');
    try {
        // Load custom fonts
        loadCustomFonts();
        
        // Initialize Three.js scene
        initThreeJS();
        
        // Initialize GSAP animations
        initGSAPAnimations();
        
        // Load projects
        loadProjects();
        
        // Add entrance animations
        initEntranceAnimations();

        // Setup scroll blur effect
        setupScrollBlur();

        // Add floating particles
        addFloatingParticles();

        // Setup contact form
        setupContactForm();

    } catch (error) {
        console.error('Error during initialization:', error);
    }
});

function loadCustomFonts() {
    // Add Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Bungee+Shade&family=Monoton&family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&family=Audiowide&family=Orbitron:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Apply fonts to elements
    document.documentElement.style.setProperty('--font-primary', 'Space Grotesk, sans-serif');
    document.documentElement.style.setProperty('--font-secondary', 'Space Grotesk, sans-serif');
    document.documentElement.style.setProperty('--font-title', 'Audiowide, cursive');
    document.documentElement.style.setProperty('--font-tech', 'Orbitron, sans-serif');

    // Add custom font styles
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --font-primary: 'Space Grotesk', sans-serif;
            --font-secondary: 'Space Grotesk', sans-serif;
            --font-title: 'Audiowide', cursive;
            --font-tech: 'Orbitron', sans-serif;
             /* Define theme colors (Deep Space Blues, Purples, and Star accents) */
            --color-theme-primary: #BB86FC; /* Light Purple Accent */
            --color-theme-secondary: #03DAC6; /* Teal Accent */
            --color-theme-accent: #6200EE; /* Deep Purple */
            --color-text-main: #E0E0E0; /* Light Grey for readability */
            --color-space-dark: #0A0B1E; /* Define space dark color for button hover text */
        }

        /* General typography reset/base */
        body * {
            /* Ensure our custom fonts are the default */
            font-family: var(--font-secondary);
            letter-spacing: 0.02em;
             color: var(--color-text-main); /* Apply base text color */
        }

        h1, h2, h3, h4, h5, h6 {
            font-family: var(--font-primary);
            letter-spacing: 0.05em;
            text-transform: uppercase;
        }

        /* Removed blur and background from the text container */
        .container.text-center {
             padding: 0; /* Remove padding added for blur */
             border-radius: 0; /* Remove border radius added for blur */
             background-color: transparent; /* Remove background added for blur */
             backdrop-filter: none; /* Remove backdrop filter */
             -webkit-backdrop-filter: none; /* Remove webkit backdrop filter */
        }

        /* Specific styles for the hero section elements using more specific selectors */
        .container.text-center h1 {
            font-family: var(--font-title);
            font-weight: 400; /* Audiowide is typically 400 */
            font-size: 6rem; /* Size for Audiowide */
            color: var(--color-theme-primary);
            text-shadow:
                 0 0 8px var(--color-theme-primary),
                 0 0 20px var(--color-theme-secondary),
                 0 0 40px var(--color-theme-primary);
            letter-spacing: 0.05em; /* Letter spacing for Audiowide */
            position: relative;
            display: inline-block;
            opacity: 0; /* Initial state for animation */
            /* Remove default font-bold from Tailwind */
            font-weight: normal !important;
             /* Remove default text-5xl/7xl from Tailwind if necessary */
             font-size: 6rem !important;
             @media (max-width: 768px) {
                 font-size: 3.5rem !important;
             }

        }

         .container.text-center p {
            font-family: var(--font-tech);
            font-weight: 500;
            font-size: 2rem; /* Slightly increased size */
            color: var(--color-theme-secondary);
            text-shadow: 0 0 10px rgba(3, 218, 198, 0.5); /* Adjust shadow color to match theme */
            position: relative;
            display: inline-block;
             opacity: 0; /* Initial state for animation */
             /* Remove default text-xl/2xl from Tailwind */
             font-size: 2rem !important;
             @media (max-width: 768px) {
                 font-size: 1.6rem !important;
             }
        }

        .description {
             font-family: var(--font-secondary);
            font-weight: 400;
            line-height: 1.6;
            color: var(--color-text-main);
             letter-spacing: 0.02em;
        }

        /* Styling for the hero CTA buttons - Adjusted for glowing effect */
        .hero-cta-button {
            font-family: var(--font-secondary);
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            padding: 12px 24px; /* Added padding */
            border-radius: 8px; /* Slightly rounded corners */
            text-decoration: none; /* Remove underline */
            background-color: var(--color-space-dark); /* Dark background */
            color: var(--color-theme-secondary); /* Teal text color */
            position: relative; /* Needed for reflection */
            display: inline-block; /* Ensure transform works */
            opacity: 0; /* Initial state for animation */
            cursor: pointer;
            overflow: visible; /* Allow box-shadow to show */
            transition: all 0.3s ease; /* Smooth transition for changes */
        }

        /* Hover state for illumination effect */
        .hero-cta-button:hover {
             background-color: #FFFFFF; /* White background on hover */
             color: var(--color-space-dark); /* Dark text color on white background */
             box-shadow: 0 0 15px rgba(187, 134, 252, 0.8), 0 0 30px rgba(187, 134, 252, 0.6); /* Stronger glow on hover */
        }

        /* Reflection effect */
        .hero-cta-button::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: -50%; /* Position below the button */
            width: 100%;
            height: 50%; /* Height of the reflection */
            background: linear-gradient(to bottom, rgba(187, 134, 252, 0.6), transparent); /* Gradient glow */
            transform: perspective(100px) rotateX(180deg); /* Flip vertically and add perspective */
            transform-origin: top center;
            filter: blur(5px); /* Blur the reflection */
             opacity: 0.7; /* Subtle transparency */
            z-index: -1; /* Behind the button */
             transition: opacity 0.3s ease; /* Smooth transition for opacity */
        }

        /* Adjust reflection opacity on hover */
        .hero-cta-button:hover::after {
             opacity: 1; /* Make reflection fully visible on hover */
        }

         /* Removed default glowingButton animation */

         @keyframes textGlowPulse {
            0%, 100% { opacity: 1; text-shadow: 0 0 8px var(--color-theme-primary), 0 0 20px var(--color-theme-secondary), 0 0 40px var(--color-theme-primary); }\
            50% { opacity: 0.8; text-shadow: 0 0 4px var(--color-theme-primary), 0 0 10px var(--color-theme-secondary), 0 0 20px var(--color-theme-primary); }\
         }

         /* Scroll down arrow styling */
        .scroll-down-arrow {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10;
            color: var(--color-theme-primary);\n            font-size: 2rem;\n            animation: bounce 2s infinite;\n            cursor: pointer;\n            transition: transform 0.3s ease, color 0.3s ease; /* Added transition */
        }\n\n        .scroll-down-arrow:hover { /* Added hover state */\n            color: var(--color-theme-secondary); /* Change color on hover */\n            transform: translateX(-50%) translateY(-5px) scale(1.1); /* Slight move up and scale */\n        }\n\n        @keyframes bounce {\n            0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }\n            40% { transform: translateX(-50%) translateY(-20px); }\n            60% { transform: translateX(-50%) translateY(-10px); }\n        }\n\n\n        @media (max-width: 768px) {\n            .container.text-center h1 {\n                font-size: 3.5rem !important; /* Adjusted size for mobile */\n                letter-spacing: 0.05em;\n            }\n            .container.text-center p {\n                font-size: 1.6rem !important;\n            }\n             .hero-cta-button {\n                 padding: 10px 20px; /* Adjusted padding for mobile */\n                 font-size: 0.9rem;\n             }\n        }\n    `;
    document.head.appendChild(style);
}

function addFloatingParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'floating-particles';
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
    `;
    document.body.appendChild(particlesContainer);

    // Create particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: radial-gradient(circle, rgba(108,99,255,0.8) 0%, rgba(108,99,255,0) 70%);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5 + 0.2};
            animation: float ${Math.random() * 10 + 10}s linear infinite;
        `;
        particlesContainer.appendChild(particle);
    }

    // Add keyframes for floating animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% {
                transform: translateY(0) translateX(0);
            }
            25% {
                transform: translateY(-20px) translateX(10px);
            }
            50% {
                transform: translateY(-40px) translateX(0);
            }
            75% {
                transform: translateY(-20px) translateX(-10px);
            }
            100% {
                transform: translateY(0) translateX(0);
            }
        }
    `;
    document.head.appendChild(style);
}

function initEntranceAnimations() {
    // Animate the main title (h1)
    const mainTitle = document.querySelector('.container.text-center h1');
    if (mainTitle) {
         const text = mainTitle.textContent; // Store full text
         mainTitle.textContent = ''; // Clear text for typing effect

         // Animate to final state (scale/rotation) and then start typing
        gsap.to(mainTitle, {
            duration: 1.8,
            opacity: 1, // Keep opacity at 1 for typing effect
            scale: 1,
            rotationY: 0,
            ease: "back.out(1.7)",
            delay: 1,
            onComplete: () => {
                // Start typing animation after initial animation
                let i = 0;
                const typeWriter = () => {
                    if (i < text.length) {
                        mainTitle.textContent += text.charAt(i);
                        i++;
                        setTimeout(typeWriter, 70); // Typing speed (adjust as needed)
                    } else {
                         // Add continuous glow pulse animation after typing is complete
                         // mainTitle.style.animation = 'textGlowPulse 2.5s infinite alternate'; // Removed this line
                    }
                };
                typeWriter();
            }
        });
    }

    // Animate the role/subtitle (p) with typing effect
    const roleSubtitle = document.querySelector('.container.text-center p');
     if (roleSubtitle) {
         const text = roleSubtitle.textContent; // Store full text
         roleSubtitle.textContent = ''; // Clear text for typing effect

         // Initial state is set in CSS, animate to final state (opacity/position)
         gsap.to(roleSubtitle, {
            duration: 1.5,
            opacity: 1,
            y: 0,
            ease: "power2.out",
            delay: 1.5,
            onComplete: () => {
                 // Start typing animation after initial animation
                 let i = 0;
                 const typeWriter = () => {
                     if (i < text.length) {
                         roleSubtitle.textContent += text.charAt(i);
                         i++;
                         setTimeout(typeWriter, 70); // Typing speed
                     }
                 };
                 typeWriter();
            }
         });
     }

    // Animate the CTA buttons
    const ctaButtons = document.querySelectorAll('.hero-cta-button'); // Target the new class
    // Add a check to ensure buttons are found before animating
    if (ctaButtons.length > 0) {
        ctaButtons.forEach((button, index) => {
            // Initial state is set in CSS, animate to final state
            gsap.to(button, {
                duration: 1,
                opacity: 1,
                scale: 1,
                y: 0,
                ease: "back.out(1.7)",
                delay: 5, // Set a fixed delay to appear after text typing
                 onComplete: () => {
                    // Remove GSAP idle animation
                    // gsap.to(button, {
                    //      y: -2, // Subtle vertical float
                    //      repeat: -1,
                    //      yoyo: true,
                    //      duration: 1.5,
                    //      ease: "sine.inOut",
                    //      delay: Math.random() * 0.5 // Stagger idle animation slightly
                    // });
                 }
            });

             // Add more pronounced hover animation using GSAP
             button.addEventListener('mouseenter', () => {
                 // Removed GSAP scale hover animation to rely on CSS box-shadow and reflection
                 // gsap.to(button, { scale: 1.1, duration: 0.3, ease: "power2.out" }); // More pronounced scale
             });
             button.addEventListener('mouseleave', () => {
                  // Removed GSAP scale hover animation
                 // gsap.to(button, { scale: 1, duration: 0.3, ease: "power2.out" }); // Return to scale 1
             });
        });
    }

    // Animate the scroll down arrow
    const scrollArrow = document.querySelector('.scroll-down-arrow');
    // Add a check to ensure the arrow is found before animating
    if (scrollArrow) {
        gsap.from(scrollArrow, {
            duration: 1,
            y: 20,
            opacity: 0,
            ease: "power2.out",
            delay: 2.8 // Adjust delay to appear after buttons
        });
    }

    // Animate Navbar elements
    const navLogo = document.querySelector('nav .space-text');
    const navLinks = document.querySelectorAll('nav a');

    if (navLogo) {
        gsap.to(navLogo, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            delay: 0.5 // Appear relatively early
        });
    }

    if (navLinks.length > 0) {
        gsap.to(navLinks, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            delay: 0.8, // Appear shortly after the logo
            stagger: 0.1 // Stagger the animation for each link
        });
    }
}

function initThreeJS() {
    console.log('Initializing Three.js scene...');
    
    // Get canvas element
    const canvas = document.getElementById('space-canvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    console.log('Canvas found:', canvas);

    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050510);
    
    // Camera setup with initial position far away
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(originalCameraPosition.x, originalCameraPosition.y, originalCameraPosition.z * 2);
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: true,
        alpha: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    console.log('Basic Three.js setup complete');

    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    console.log('Lights added to scene');

    // Create space elements
    createStars();
    createGalaxies();
    createBlackHole();

    console.log('Space elements created');

    // Add orbit controls with limited movement
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.enableRotate = false;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minPolarAngle = 0;
    controls.maxAzimuthAngle = Math.PI;
    controls.minAzimuthAngle = -Math.PI;

    console.log('Controls initialized');

    // Show initial hint
    showHint("Scroll to zoom | Click and drag to rotate | Double click to reset");

    // Add event listeners
    setupEventListeners();

    // Animate camera to final position
    gsap.to(camera.position, {
        x: originalCameraPosition.x,
        y: originalCameraPosition.y,
        z: originalCameraPosition.z,
        duration: 2,
        ease: "power2.inOut",
        delay: 0.5
    });

    // Start animation loop
    animate();
    
    console.log('Three.js initialization complete');
}

function createStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 0.2,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    const starVertices = [];
    const starColors = [];
    const starSizes = [];

    for (let i = 0; i < 20000; i++) {
        const radius = 50 + Math.random() * 450;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        starVertices.push(x, y, z);

        const color = new THREE.Color();
        color.setHSL(Math.random() * 0.1 + 0.6, 0.8, 0.8);
        starColors.push(color.r, color.g, color.b);

        starSizes.push(Math.random() * 2 + 0.5);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
    starGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));

    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);
    stars.push(starField);
}

function createGalaxies() {
    // This function is now empty as galaxies are removed
}

function createBlackHole() {
    // Create black hole sphere with event horizon
    const geometry = new THREE.SphereGeometry(5, 256, 256);
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        roughness: 0.02, // Even smoother surface
        metalness: 0.95,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
        transmission: 0.05, // Reduced transparency
        ior: 2.5, // Higher refraction
        reflectivity: 1.0,
        opacity: 0.99,
        transparent: true,
        envMapIntensity: 2.5,
        emissive: 0x000000,
        emissiveIntensity: 0.4,
        // Add custom shader properties
        onBeforeCompile: (shader) => {
            shader.uniforms.time = { value: 0 };
            shader.vertexShader = `
                uniform float time;
                varying vec3 vNormal;
                varying vec3 vPosition;
                varying vec3 vViewPosition;
                void main() {
                    vNormal = normal;
                    vPosition = position;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    vViewPosition = -mvPosition.xyz;
                    gl_Position = projectionMatrix * mvPosition;
                }
            `;
            shader.fragmentShader = `
                uniform float time;
                varying vec3 vNormal;
                varying vec3 vPosition;
                varying vec3 vViewPosition;
                void main() {
                    // Create subtle surface distortion
                    float distortion = sin(vPosition.x * 10.0 + time) * 0.02 +
                                     sin(vPosition.y * 10.0 + time * 0.7) * 0.02 +
                                     sin(vPosition.z * 10.0 + time * 0.5) * 0.02;
                    
                    // Enhanced normal-based lighting
                    vec3 viewDir = normalize(vViewPosition);
                    float fresnel = pow(1.0 - dot(normalize(vNormal), viewDir), 4.0);
                    
                    // Create subtle color variation
                    vec3 baseColor = vec3(0.0); // Pure black
                    vec3 highlightColor = vec3(0.05, 0.05, 0.08); // Darker blue
                    vec3 rimColor = vec3(0.02, 0.02, 0.03); // Very subtle rim light
                    
                    // Mix colors based on fresnel and distortion
                    vec3 finalColor = mix(baseColor, highlightColor, fresnel * (1.0 + distortion * 0.5));
                    finalColor = mix(finalColor, rimColor, pow(fresnel, 2.0) * 0.5);
                    
                    gl_FragColor = vec4(finalColor, 0.99);
                }
            `;
        }
    });
    blackHole = new THREE.Mesh(geometry, material);
    scene.add(blackHole);

    // Tilt the black hole by 45 degrees from the north pole
    blackHole.rotation.z = Math.PI / 4;

    // Add a stronger glow around the event horizon
    const glowGeometry = new THREE.SphereGeometry(5.5, 256, 256);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x4B0082, // Darker purple
        transparent: true,
        opacity: 0.4,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    blackHole.add(glow);

    // Add a second, outer glow layer
    const outerGlowGeometry = new THREE.SphereGeometry(6.0, 256, 256);
    const outerGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0x9400D3, // Deep purple
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
    });
    const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
    blackHole.add(outerGlow);

    // Add accretion disk with color gradient
    const diskGeometry = new THREE.RingGeometry(6, 13, 256);
    const diskMaterial = new THREE.ShaderMaterial({
        uniforms: {
            color1: { value: new THREE.Color(0x8A2BE2) }, // Purple
            color2: { value: new THREE.Color(0x00ffff) }, // Cyan
            color3: { value: new THREE.Color(0x4B0082) }, // Indigo
            color4: { value: new THREE.Color(0x9400D3) }, // Deep Purple
            time: { value: 0.0 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 color1;
            uniform vec3 color2;
            uniform vec3 color3;
            uniform vec3 color4;
            uniform float time;
            varying vec2 vUv;

            // Improved noise function
            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }

            // Value noise
            float noise(vec2 st) {
                vec2 i = floor(st);
                vec2 f = fract(st);
                
                float a = random(i);
                float b = random(i + vec2(1.0, 0.0));
                float c = random(i + vec2(0.0, 1.0));
                float d = random(i + vec2(1.0, 1.0));

                vec2 u = f * f * (3.0 - 2.0 * f);
                return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
            }

            void main() {
                // Calculate angle and distance from center
                vec2 center = vec2(0.5, 0.5);
                float distance = length(vUv - center);
                float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
                
                // Normalize angle to 0-1 range
                float normalizedAngle = (angle + 3.14159265359) / (2.0 * 3.14159265359);
                
                // Create circular gradient based on angle with multiple layers
                float circularGradient = mod(normalizedAngle + time * 0.2, 1.0);
                float secondaryGradient = mod(normalizedAngle * 2.0 + time * 0.15, 1.0);
                float tertiaryGradient = mod(normalizedAngle * 3.0 - time * 0.1, 1.0);
                
                // Mix colors based on circular gradient with enhanced color mixing
                vec3 color = mix(color1, color2, circularGradient);
                
                // Add secondary color variation
                float secondaryMix = sin(secondaryGradient * 6.28318530718) * 0.5 + 0.5;
                color = mix(color, color * 1.2, secondaryMix);
                
                // Add tertiary color variation for smoother transitions
                float tertiaryMix = cos(tertiaryGradient * 6.28318530718) * 0.3 + 0.3;
                color = mix(color, color3, tertiaryMix);
                
                // Add quaternary color variation
                float quaternaryMix = sin(tertiaryGradient * 4.0 + time * 0.2) * 0.5 + 0.5;
                color = mix(color, color4, quaternaryMix * 0.3);
                
                // Add detailed texture using multiple layers of noise
                float noiseScale = 20.0;
                float noise1 = noise(vUv * noiseScale + time * 0.5);
                float noise2 = noise(vUv * noiseScale * 2.0 - time * 0.3);
                float noise3 = noise(vUv * noiseScale * 4.0 + time * 0.2);
                
                float combinedNoise = (noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2);
                
                // Add spiral effect with multiple layers
                float spiral1 = sin(angle * 8.0 + time * 2.0 + distance * 10.0) * 0.5 + 0.5;
                float spiral2 = sin(angle * 16.0 - time * 1.5 + distance * 15.0) * 0.5 + 0.5;
                float spiral = mix(spiral1, spiral2, 0.5);
                
                // Add turbulence effect
                float turbulence = sin(distance * 30.0 + time * 3.0) * 0.5 + 0.5;
                
                // Combine all effects with improved blending
                float distanceFactor = smoothstep(0.0, 0.5, distance);
                color = mix(color, color * 1.5, distanceFactor * 0.8);
                
                // Spiral effect with improved blending
                float spiralFactor = smoothstep(0.3, 0.7, spiral);
                color = mix(color, color * 1.2, spiralFactor);
                
                // Turbulence with smoother transition
                float turbulenceFactor = smoothstep(0.4, 0.6, turbulence);
                color = mix(color, color * 1.1, turbulenceFactor);
                
                // Noise texture with improved blending
                float noiseFactor = smoothstep(0.2, 0.8, combinedNoise);
                color = mix(color, color * 1.3, noiseFactor);
                
                // Add subtle color variation based on noise
                color += vec3(combinedNoise * 0.1);
                
                // Calculate opacity with enhanced edge effects
                float baseOpacity = smoothstep(0.5, 0.0, distance);
                float noiseOpacity = smoothstep(0.3, 0.7, combinedNoise) * 0.2;
                float spiralOpacity = smoothstep(0.4, 0.6, spiral) * 0.15;
                
                float opacity = baseOpacity + noiseOpacity + spiralOpacity;
                opacity = max(0.7, opacity); // Minimum opacity
                
                // Add subtle glow effect
                float glow = smoothstep(0.4, 0.0, distance) * 0.4;
                vec3 glowColor = mix(vec3(0.5, 0.8, 1.0), vec3(0.8, 0.9, 1.0), distance);
                color += glow * glowColor;
                
                gl_FragColor = vec4(color, opacity);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const accretionDisk = new THREE.Mesh(diskGeometry, diskMaterial);
    accretionDisk.rotation.x = Math.PI / 2;
    blackHole.add(accretionDisk);

    // Add atmospheric lighting (faint blue halo)
    const atmosphereGeometry = new THREE.SphereGeometry(7, 128, 128); // Increased segments for higher quality
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x00aaff,
        transparent: true,
        opacity: 0.3, // Increased opacity slightly for a more visible halo
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    blackHole.add(atmosphere);

    // Add lensing effect (subtle ring)
    const lensGeometry = new THREE.RingGeometry(13.5, 14, 256); // Increased segments for higher quality
    const lensMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.15, // Increased opacity slightly
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    });
    const lens = new THREE.Mesh(lensGeometry, lensMaterial);
    lens.rotation.x = Math.PI / 2;
    blackHole.add(lens);

    // Add a small layer of orbiting particles
    const orbitingParticleGeometry = new THREE.BufferGeometry();
    const orbitingParticleMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color1: { value: new THREE.Color(0x8A2BE2) }, // Purple
            color2: { value: new THREE.Color(0x00ffff) }, // Cyan
            color3: { value: new THREE.Color(0x4B0082) }, // Indigo
            color4: { value: new THREE.Color(0x9400D3) }, // Deep Purple
            color5: { value: new THREE.Color(0x00BFFF) }  // Deep Sky Blue
        },
        vertexShader: `
            uniform float time;
            varying vec3 vColor;
            varying float vAlpha;
            varying float vDistance;
            
            attribute float size;
            attribute vec3 customColor;
            attribute float speed;
            
            void main() {
                vColor = customColor;
                
                // Calculate particle position
                float angle = position.x + time * speed; // Variable rotation speed
                float radius = length(position.xy);
                
                // Add slight vertical oscillation
                float verticalOffset = sin(angle * 2.0 + time) * 0.15;
                verticalOffset += cos(angle * 3.0 + time * 0.5) * 0.1; // Additional wave
                
                // Calculate new position
                vec3 newPosition = vec3(
                    radius * cos(angle),
                    radius * sin(angle),
                    position.z + verticalOffset
                );
                
                // Calculate distance from center for effects
                vDistance = length(newPosition.xy) / 20.0;
                
                // Calculate alpha based on position and time
                vAlpha = 0.8 + 0.2 * sin(angle * 3.0 + time * 2.0);
                vAlpha *= smoothstep(0.0, 0.5, 1.0 - abs(position.z)); // Fade at edges
                
                vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
                gl_PointSize = size * (400.0 / -mvPosition.z); // Slightly larger particles
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform vec3 color1;
            uniform vec3 color2;
            uniform vec3 color3;
            uniform vec3 color4;
            uniform vec3 color5;
            uniform float time;
            
            varying vec3 vColor;
            varying float vAlpha;
            varying float vDistance;
            
            void main() {
                // Create circular gradient
                vec2 center = gl_PointCoord - vec2(0.5);
                float dist = length(center);
                
                // Create soft circular particle
                float alpha = smoothstep(0.5, 0.1, dist) * vAlpha; // Sharper edges
                
                // Mix colors based on position and time
                vec3 color = mix(color1, color2, sin(time + vColor.x) * 0.5 + 0.5);
                color = mix(color, color3, cos(time * 0.5 + vColor.y) * 0.5 + 0.5);
                color = mix(color, color4, sin(time * 0.3 + vDistance) * 0.5 + 0.5);
                color = mix(color, color5, cos(time * 0.7 + vColor.z) * 0.5 + 0.5);
                
                // Add subtle glow
                float glow = smoothstep(0.5, 0.0, dist) * 0.7; // Stronger glow
                color += glow * vec3(0.6, 0.9, 1.0); // Brighter glow color
                
                // Add sparkle effect
                float sparkle = pow(smoothstep(0.5, 0.0, dist), 2.0) * 
                               sin(time * 5.0 + vColor.x * 10.0) * 0.5 + 0.5;
                color += sparkle * vec3(1.0, 1.0, 1.0) * 0.3;
                
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const orbitingParticleVertices = [];
    const particleColors = [];
    const particleSizes = [];
    const particleSpeeds = [];

    const numOrbitingParticles = 2000; // Increased particle count
    const orbitingRadius = 15;

    for (let i = 0; i < numOrbitingParticles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = orbitingRadius + (Math.random() - 0.5) * 3; // Slightly wider distribution

        const x = r * Math.cos(angle);
        const y = r * Math.sin(angle);
        const z = (Math.random() - 0.5) * 0.8; // Slightly thicker disk

        orbitingParticleVertices.push(x, y, z);
        
        // Add color variation
        const color = new THREE.Color();
        color.setHSL(Math.random() * 0.15 + 0.6, 0.9, 0.9); // More vibrant colors
        particleColors.push(color.r, color.g, color.b);
        
        // Add size variation
        particleSizes.push(Math.random() * 0.15 + 0.05); // Slightly larger particles
        
        // Add speed variation
        particleSpeeds.push(Math.random() * 0.3 + 0.4); // Variable speeds
    }

    orbitingParticleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitingParticleVertices, 3));
    orbitingParticleGeometry.setAttribute('customColor', new THREE.Float32BufferAttribute(particleColors, 3));
    orbitingParticleGeometry.setAttribute('size', new THREE.Float32BufferAttribute(particleSizes, 1));
    orbitingParticleGeometry.setAttribute('speed', new THREE.Float32BufferAttribute(particleSpeeds, 1));

    const orbitingParticles = new THREE.Points(orbitingParticleGeometry, orbitingParticleMaterial);
    blackHole.add(orbitingParticles);
    blackHoleOrbitingParticles = orbitingParticles;

    // Note: Particle movement logic will need to be added in the animate() function.
    // We need to update the position attribute of the particle geometries in the animation loop.
}

function setupEventListeners() {
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let lastScrollTime = 0;
    const scrollCooldown = 100; // ms

    // Improved zoom with scroll
    window.addEventListener('wheel', (event) => {
        const currentTime = Date.now();
        if (currentTime - lastScrollTime < scrollCooldown) return;
        lastScrollTime = currentTime;

        const zoomSpeed = 0.1;
        const delta = -Math.sign(event.deltaY) * zoomSpeed;
        zoomLevel = Math.max(minZoom, Math.min(maxZoom, zoomLevel + delta));

        // Smooth zoom animation
        gsap.to(camera.position, {
            x: originalCameraPosition.x * zoomLevel,
            y: originalCameraPosition.y * zoomLevel,
            z: originalCameraPosition.z * zoomLevel,
            duration: 0.5,
            ease: "power2.out"
        });

        showHint(`Zoom Level: ${Math.round(zoomLevel * 100)}%`);
    });

    // Click and drag rotation
    window.addEventListener('mousedown', (event) => {
        if (event.button === 0) { // Left mouse button
            isDragging = true;
            previousMousePosition = {
                x: event.clientX,
                y: event.clientY
            };
            // Temporarily disable orbit controls rotation while dragging
            controls.enableRotate = false; // Ensure controls don't fight drag logic
        } else if (event.button === 1) { // Middle mouse button for zoom toggle
            event.preventDefault(); // Prevent default middle-click behavior (e.g., auto-scroll)
            
            const targetZoom = (zoomLevel === 1) ? maxZoom : 1; // Toggle between original and max zoom
            zoomLevel = targetZoom; // Update zoom level state

             if (camera && camera.position) {
                 gsap.to(camera.position, {
                     x: originalCameraPosition.x * zoomLevel,
                     y: originalCameraPosition.y * zoomLevel,
                     z: originalCameraPosition.z * zoomLevel,
                     duration: 0.8, // Smoother zoom duration
                     ease: "power2.inOut"
                 });
             }
            showHint(`Zoom Level: ${Math.round(zoomLevel * 100)}% (Middle Click Toggle)`);
        }
    });

    window.addEventListener('mousemove', (event) => {
        if (isDragging) {
            const deltaMove = {
                x: event.clientX - previousMousePosition.x,
                y: event.clientY - previousMousePosition.y
            };

            // Apply rotation directly to the camera based on mouse movement
            // This provides smoother, more direct control than orbit controls
            const rotationSpeed = 0.005; // Adjust sensitivity here
            camera.position.x += deltaMove.x * rotationSpeed;
            camera.position.y -= deltaMove.y * rotationSpeed; // Invert Y for intuitive control

            // Optional: Add limits to camera movement if needed
            // camera.position.x = Math.max(-limitX, Math.min(limitX, camera.position.x));
            // camera.position.y = Math.max(-limitY, Math.min(limitY, camera.position.y));

            // Keep the camera looking at the black hole center (0,0,0)
            camera.lookAt(0, 0, 0);

            previousMousePosition = {
                x: event.clientX,
                y: event.clientY
            };
        }
    });

    window.addEventListener('mouseup', (event) => {
        if (event.button === 0) { // Left mouse button
            if (!isDragging) { // It was a click, not a drag
                // Check if the click intersected the black hole
                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObjects([blackHole], true);

                if (intersects.length > 0) {
                    // Black hole clicked! Add pop and illuminate effect
                    const clickedObject = intersects[0].object; // This will be the black hole sphere
                    
                    // "Pop" effect (scale animation)
                    gsap.to(clickedObject.scale, {
                        x: 1.1, y: 1.1, z: 1.1, // Scale up slightly
                        duration: 0.2,
                        ease: "power2.out",
                        onComplete: () => {
                            gsap.to(clickedObject.scale, {
                                x: 1, y: 1, z: 1, // Scale back down
                                duration: 0.3,
                                ease: "elastic.out(1, 0.5)"
                            });
                        }
                    });

                    // Find the glow mesh (assuming it's a child of blackHole)
                    const glowMesh = blackHole.children.find(child => child.material && child.material.color.getHex() === 0x4B0082 && child.geometry.type === 'SphereGeometry');
                    
                    if(glowMesh && glowMesh.material && glowMesh.material.hasOwnProperty('opacity')) {
                        // "Illuminate" effect (glow opacity animation)
                         gsap.to(glowMesh.material, {
                             opacity: 0.8, // Increase opacity significantly
                             duration: 0.2,
                             ease: "power2.out",
                             onComplete: () => {
                                 gsap.to(glowMesh.material, {
                                     opacity: 0.5, // Fade back to normal glow opacity
                                     duration: 0.5,
                                     ease: "power2.out"
                                 });
                             }
                         });
                         // Optional: Temporarily change glow color
                         // gsap.to(glowMesh.material.color, {r: 1, g: 0, b: 0, duration: 0.2, yoyo: true, repeat: 1});
                    }
                }
            }
            isDragging = false; // Reset drag flag
        }
    });

    // Double click to reset
    window.addEventListener('dblclick', () => {
        zoomLevel = 1;
        // Add a check to ensure the camera position exists before animating
        if (camera && camera.position) {
            gsap.to(camera.position, {
                x: originalCameraPosition.x,
                y: originalCameraPosition.y,
                z: originalCameraPosition.z,
                duration: 1,
                ease: "power2.inOut"
            });
        }
        showHint("View reset");
    });

    // Hover effects
    window.addEventListener('pointermove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        
        // Check for intersection with the black hole group (including children)
        const intersects = raycaster.intersectObject(blackHole, true);

        // Find the glow mesh within the black hole children
        const glowMesh = blackHole ? blackHole.children.find(child => 
            child.material && child.material.color && child.material.color.getHex() === 0x4B0082 && child.geometry.type === 'SphereGeometry'
        ) : null;

        if (intersects.length > 0) {
            // Hovering over the black hole or its parts
            if (hoveredObject !== blackHole) { // Check if we just started hovering the black hole group
                if (glowMesh && glowMesh.material && glowMesh.material.hasOwnProperty('opacity')) {
                    // Animate glow opacity on hover
                    gsap.to(glowMesh.material, {
                        opacity: 0.8, // Increased opacity for hover illumination
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
                // Add subtle floating animation to the black hole
                gsap.to(blackHole.position, {
                    y: blackHole.position.y + 0.2, // Move slightly up
                    duration: 1.5,
                    ease: "sine.inOut",
                    repeat: -1, // Loop indefinitely
                    yoyo: true // Go back and forth
                });
                
                hoveredObject = blackHole;
            }
        } else {
            // Not hovering over the black hole
            if (hoveredObject === blackHole) { // Check if we just stopped hovering the black hole group
                 if (glowMesh && glowMesh.material && glowMesh.material.hasOwnProperty('opacity')) {
                     // Animate glow opacity back to normal
                     gsap.to(glowMesh.material, {
                         opacity: 0.5, // Normal glow opacity
                         duration: 0.3,
                         ease: "power2.out"
                     });
                 }
                // Stop the floating animation and return to original position
                 if (blackHole) {
                     gsap.killTweensOf(blackHole.position); // Stop ongoing animations
                     gsap.to(blackHole.position, {
                         y: 0, // Return to original Y position (assuming it starts at 0)
                         duration: 0.5,
                         ease: "power2.out"
                     });
                 }

                hoveredObject = null; // Reset hovered object
            }
        }
    });

    // Smooth scroll for the arrow
    const scrollArrow = document.querySelector('.scroll-down-arrow');
    // Add a check to ensure the arrow is found before animating
    if (scrollArrow) {
        gsap.from(scrollArrow, {
            duration: 1,
            y: 20,
            opacity: 0,
            ease: "power2.out",
            delay: 2.8 // Adjust delay to appear after buttons
        });
    }
}

function animate() {
    requestAnimationFrame(animate);

    if (controls) controls.update();

    // Rotate the black hole with dynamic, gradual spinning
    if (blackHole) {
        // Create smooth, continuous rotation on multiple axes
        const time = performance.now() * 0.0005; // Slower rotation speed
        
        // Primary rotation (around Z axis)
        blackHole.rotation.z = Math.sin(time) * 0.2; // Oscillating rotation
        
        // Secondary rotation (around X axis)
        blackHole.rotation.x = Math.cos(time * 0.7) * 0.15; // Different frequency
        
        // Tertiary rotation (around Y axis)
        blackHole.rotation.y = Math.sin(time * 0.3) * 0.1; // Even slower rotation

        // Update accretion disk shader time uniform for animation
        if (blackHole.children) {
            blackHole.children.forEach(child => {
                if (child.material && child.material.uniforms && child.material.uniforms.time) {
                    child.material.uniforms.time.value += 0.005; // Increment time for animation
                }
            });
        }
    }

    // Animate the small layer of orbiting particles
    if (blackHoleOrbitingParticles) {
        // Update shader time uniform for animation
        blackHoleOrbitingParticles.material.uniforms.time.value = performance.now() * 0.001;
    }

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    // Update camera
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    // Update renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Initialize GSAP animations
function initGSAPAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.registerPlugin(ScrollToPlugin);
     // Register other potentially useful plugins, though not strictly required for properties like opacity/scale/position
     // The issue might be the target being undefined, but registering these doesn't hurt.
     if (typeof AttrPlugin !== 'undefined') gsap.registerPlugin(AttrPlugin);
     if (typeof CSSRulePlugin !== 'undefined') gsap.registerPlugin(CSSRulePlugin);
     if (typeof TextPlugin !== 'undefined') gsap.registerPlugin(TextPlugin);

    // Animate skill bars on scroll
    gsap.utils.toArray('.skill-bar').forEach(bar => {
        const progress = bar.querySelector('div[style*="width"]');
        // Add a check to ensure the progress element exists
        if (progress) {
            const width = progress.style.width;
            progress.style.width = '0';
            
            gsap.to(progress, {
                width: width,
                duration: 1.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: bar,
                    start: 'top 80%'
                }
            });
        }
    });

    // Animate About section elements
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        // Animate the main text content and paragraphs
        gsap.utils.toArray('#about h3, #about p').forEach(element => {
            gsap.from(element, {
                opacity: 0,
                y: 20,
                duration: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Animate the info cards
        gsap.utils.toArray('.info-card').forEach(card => {
            gsap.from(card, {
                opacity: 0,
                scale: 0.8,
                duration: 1,
                ease: 'back.out(1.2)',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Animate the technology tags (staggered)
        gsap.from('.tech-tag', {
            opacity: 0,
            y: 10,
            duration: 0.5,
            ease: 'power2.out',
            stagger: 0.05,
            scrollTrigger: {
                trigger: '.tech-tag',
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });

        // Animate the Let's Connect button
        gsap.from('#about .hero-cta-button', {
            opacity: 0,
            y: 20,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '#about .hero-cta-button',
                start: 'top 90%',
                toggleActions: 'play none none none'
            }
        });

        // Animate the planet model/image placeholder
        gsap.from('#planet-model', {
            opacity: 0,
            scale: 0.9,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '#planet-model',
                start: 'top 75%',
                toggleActions: 'play none none none'
            }
        });
    }

    // Smooth scroll for anchor links (excluding #home, handled by arrow)
    document.querySelectorAll('a[href^="#"]:not([href="#home"])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: { y: target, offsetY: 70 },
                    ease: 'power2.inOut'
                });
            }
        });
    });
}

// Load and animate project cards
async function loadProjects() {
    // Prevent duplicate loading
    if (projectsLoaded) {
        console.log('Projects already loaded, skipping...');
        return;
    }

    projectsLoaded = true;

    try {
        const response = await fetch('/api/projects');
        // Check if the response is OK and if it's JSON
        const contentType = response.headers.get("content-type");
        if (!response.ok) {
             const errorText = await response.text(); // Read the error response as text
             console.error(`HTTP error! status: ${response.status}`, errorText);
             // Optionally display an error message on the page
             const projectsGrid = document.getElementById('projects-grid');
             if (projectsGrid) {
                  projectsGrid.innerHTML = '<p class="text-center text-red-500">Failed to load projects. API endpoint /api/projects not found.</p>';
             }
            return; // Stop execution if response is not ok
        }
        if (!contentType || !contentType.includes("application/json")) {
            const errorText = await response.text();
            console.error("Expected JSON response, but received:", errorText);
             const projectsGrid = document.getElementById('projects-grid');
             if (projectsGrid) {
                  projectsGrid.innerHTML = '<p class="text-center text-red-500">Invalid data received for projects.</p>';
             }
            return; // Stop execution if not JSON
        }

        const projects = await response.json();

        // Filter out duplicate projects based on title
        const uniqueProjects = [];
        const projectTitles = new Set();

        projects.forEach(project => {
            if (!projectTitles.has(project.title)) {
                projectTitles.add(project.title);
                uniqueProjects.push(project);
            }
        });
        
        const projectsGrid = document.getElementById('projects-grid');
        if (!projectsGrid) {
             console.error('Projects grid element not found!');
             return;
        }
        
        // Clear existing content before loading
        projectsGrid.innerHTML = '';

        uniqueProjects.forEach((project, index) => {
            const card = document.createElement('div');
            card.className = 'galaxy-card p-6 rounded-lg';
            card.innerHTML = `
                <img src="${project.image}" alt="${project.title}" class="w-full h-48 object-cover rounded-lg mb-4">
                <h3 class="text-xl font-semibold mb-2 text-space-primary">${project.title}</h3>
                <p class="text-space-light mb-4">${project.description}</p>
                <div class="flex flex-wrap gap-2 mb-4">
                    ${project.technologies.map(tech => `
                        <span class="px-3 py-1 bg-space-primary/20 text-space-primary rounded-full text-sm tech-skill">
                            ${tech}
                        </span>
                    `).join('')}
                </div>
                <div class="flex justify-between">
                    <a href="${project.github}" target="_blank" class="text-space-secondary hover:text-space-primary transition-colors">
                        GitHub
                    </a>
                    <a href="${project.live}" target="_blank" class="text-space-secondary hover:text-space-primary transition-colors">
                        Live Demo
                    </a>
                </div>
            `;
            
            projectsGrid.appendChild(card);
            
            // Animate card on scroll
            gsap.from(card, {
                y: 50,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%'
                }
            });
        });
         console.log(`Loaded ${uniqueProjects.length} unique projects.`);

    } catch (error) {
        console.error('Error loading projects:', error);
         const projectsGrid = document.getElementById('projects-grid');
         if (projectsGrid) {
              projectsGrid.innerHTML = '<p class="text-center text-red-500">An error occurred while loading projects.</p>';
         }
    }
}

// Show hint message (stub for now)
function showHint(msg) {
    // For now, just log to the console
    console.log("HINT:", msg);
}

function setupScrollBlur() {
    // Create blur overlay
    const blurOverlay = document.createElement('div');
    blurOverlay.className = 'blur-overlay';
    blurOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(0px);
        -webkit-backdrop-filter: blur(0px);
        pointer-events: none;
        z-index: 1;
        transition: backdrop-filter 0.3s ease, -webkit-backdrop-filter 0.3s ease;
    `;
    document.body.appendChild(blurOverlay);

    // Get the navbar element
    const navbar = document.querySelector('nav');
    const heroSection = document.getElementById('home');
    const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;
    const navbarHeight = navbar ? navbar.offsetHeight : 0;
    const scrollThreshold = heroHeight - navbarHeight; // Change class when scrolling past the hero section

    // Add scroll event listener
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const blurAmount = Math.min(scrollPosition / windowHeight * 10, 10); // Max blur of 10px
        
        blurOverlay.style.backdropFilter = `blur(${blurAmount}px)`;
        blurOverlay.style.webkitBackdropFilter = `blur(${blurAmount}px)`;

        // Add/remove 'scrolled' class to navbar
        if (navbar) {
            if (scrollPosition > scrollThreshold) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
}

// Setup contact form
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formGroups = contactForm ? contactForm.querySelectorAll('.form-group') : [];
    const submitButton = contactForm ? contactForm.querySelector('.submit-button') : null;
    const formStatusDiv = document.getElementById('form-status');

    if (contactForm) {
        // GSAP Animations for contact section elements (if not already handled by AOS or general animations)
        // These animations will be similar to the previous ones but adapted for the new structure
        const contactInfoItems = document.querySelectorAll('.contact-info-item');
        const socialLinks = document.querySelectorAll('#contact .social-link'); // Use more specific selector
        const reachOutHeading = document.querySelector('#contact h3:first-of-type');
        const sendMessageHeading = document.querySelector('#contact h3:nth-of-type(2)');
        const formContainer = document.querySelector('#contact .galaxy-card'); // Target the form container

        // Set initial states before animating
        if (reachOutHeading) {
            gsap.set(reachOutHeading, { opacity: 0, y: 50 });
        }
        if (sendMessageHeading) {
            gsap.set(sendMessageHeading, { opacity: 0, y: 50 });
        }
        if (contactInfoItems.length > 0) {
            gsap.set(contactInfoItems, { opacity: 0, x: -80 });
        }
        if (socialLinks.length > 0) {
            gsap.set(socialLinks, { opacity: 0, y: 50 });
        }
         if (formContainer) { // Also set initial state for the form container
              gsap.set(formContainer, { opacity: 0, y: 80 });
         }

        // Animate headings
        if (reachOutHeading) {
             gsap.to(reachOutHeading, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: reachOutHeading, start: 'top 80%' } });
        }
         if (sendMessageHeading) {
             gsap.to(sendMessageHeading, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: sendMessageHeading, start: 'top 80%' } });
         }

        // Animate contact info items
        if (contactInfoItems.length > 0) {
             gsap.to(contactInfoItems, { 
                 opacity: 1, 
                 y: 0, // Change from x: 0 to y: 0 for upward movement
                 duration: 1,
                 ease: 'power2.out',
                 stagger: 0.2, 
                 scrollTrigger: { 
                     trigger: contactInfoItems[0],
                     start: 'top 80%', // Adjust trigger start slightly if needed
                     toggleActions: 'play none none none'
                 } 
             });
        }

        // Animate social links
        if (socialLinks.length > 0) {
             gsap.to(socialLinks, { opacity: 1, y: 0, duration: 1, ease: 'power2.out', stagger: 0.15, scrollTrigger: { trigger: socialLinks[0], start: 'top 80%' } });
        }

         // Animate form container
         if(formContainer) { // Change from gsap.from to gsap.to
              gsap.to(formContainer, { opacity: 1, y: 0, duration: 1.5, ease: 'power4.out', scrollTrigger: { trigger: formContainer, start: 'top 80%' } });
         }

        // Real-time Form Validation
        formGroups.forEach(group => {
            const input = group.querySelector('.form-input');
            const errorMessage = group.querySelector('.error-message');
            const label = group.querySelector('label');

            if (input) {
                const validateInput = () => {
                    let valid = true;
                    console.log('Validating email input:', input.value.trim());
                    const emailRegexTestResult = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-zA-Z]{2,15}$/.test(input.value.trim());
                    console.log('Regex test result:', emailRegexTestResult);

                    if (input.required && input.value.trim() === '') {
                        valid = false;
                    } else if (input.type === 'email' && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-zA-Z]{2,15}$/.test(input.value.trim())) {
                        valid = false;
                    }

                    if (valid) {
                        group.classList.remove('invalid');
                        if (errorMessage) errorMessage.classList.add('hidden');
                         gsap.to(label, { color: 'var(--color-theme-primary)', duration: 0.3 }); // Revert label color
                    } else {
                        group.classList.add('invalid');
                        if (errorMessage) errorMessage.classList.remove('hidden');
                         gsap.to(label, { color: '#FF3366', duration: 0.3 }); // Change label color to red
                    }
                    return valid;
                };

                // Validate on blur and input
                input.addEventListener('blur', validateInput);
                input.addEventListener('input', validateInput);

                // GSAP Focus/Blur Animations (Refined)
                input.addEventListener('focus', () => {
                    gsap.to(input, {
                         boxShadow: '0 0 18px rgba(108, 99, 255, 0.4), inset 0 0 12px rgba(108, 99, 255, 0.3), 0 0 25px rgba(3, 218, 198, 0.4)', // Enhanced glow
                         borderColor: 'var(--color-theme-secondary)', // Secondary color border
                         duration: 0.4,
                         ease: 'power2.out'
                    });
                     gsap.to(label, { color: 'var(--color-theme-secondary)', duration: 0.4 }); // Highlight label
                });

                input.addEventListener('blur', () => {
                     // Revert styles based on validation status
                     if (group.classList.contains('invalid')) {
                          gsap.to(input, {
                              boxShadow: '0 0 10px rgba(255, 51, 102, 0.4)', // Red glow for invalid
                              borderColor: '#FF3366', // Red border for invalid
                              duration: 0.4,
                              ease: 'power2.out'
                          });
                          gsap.to(label, { color: '#FF3366', duration: 0.4 }); // Keep label red if invalid
                     } else {
                         gsap.to(input, {
                              boxShadow: '0 0 8px rgba(108, 99, 255, 0.1)', // Subtle initial glow
                              borderColor: 'rgba(108, 99, 255, 0.4)', // Primary border
                             duration: 0.4,
                             ease: 'power2.out'
                         });
                         gsap.to(label, { color: 'var(--color-theme-primary)', duration: 0.4 }); // Revert label color
                     }
                });
            }
        });

        // Form Submission Handling
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validate all fields on submit
            let allValid = true;
            formGroups.forEach(group => {
                const input = group.querySelector('.form-input');
                if (input && !group.classList.contains('invalid')) { // Check if input exists and is NOT already marked invalid
                     // Re-run validation on submit to catch any missed cases
                     if (!validateInputOfGroup(group)) { // Assuming a helper function exists or inline validation logic is here
                          allValid = false;
                     }
                } else if (input) { // If input exists but group IS invalid
                     allValid = false;
                }
                 // Note: If an input is missing within a form-group, it won't affect allValid here.
                 // Consider adding a check if inputs are expected in every form-group.
            });

            // Helper function to re-run validation for a specific group
             function validateInputOfGroup(group) {
                 const input = group.querySelector('.form-input');
                 const errorMessage = group.querySelector('.error-message');
                 const label = group.querySelector('label');
                 let valid = true;
                 if (input) {
                     if (input.required && input.value.trim() === '') {
                         valid = false;
                     } else if (input.type === 'email' && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-zA-Z]{2,15}$/.test(input.value.trim())) {
                         valid = false;
                     }

                     if (valid) {
                         group.classList.remove('invalid');
                         if (errorMessage) errorMessage.classList.add('hidden');
                          // Keep label color as is or revert to primary if needed
                          // gsap.to(label, { color: 'var(--color-theme-primary)', duration: 0.3 });
                     } else {
                         group.classList.add('invalid');
                         if (errorMessage) errorMessage.classList.remove('hidden');
                          gsap.to(label, { color: '#FF3366', duration: 0.3 }); // Change label color to red
                     }
                 }
                  return valid; // Return the validation status of this specific group
             }

            if (!allValid) {
                 // Add a shake animation to the form if validation fails
                 gsap.to(contactForm, {
                     x: -10, // Shake left
                     duration: 0.1,
                     repeat: 3, // Repeat shake
                     yoyo: true, // Go back and forth
                     ease: "power1.inOut",
                     onComplete: () => gsap.to(contactForm, { x: 0 }) // Return to original position
                 });
                if(formStatusDiv) {
                    formStatusDiv.textContent = 'Please fill out all required fields correctly.';
                    formStatusDiv.style.color = '#FF3366';
                }
                return; // Stop submission if not valid
            }

            // If validation passes, proceed with submission
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // Show sending status
            if(formStatusDiv) {
                formStatusDiv.textContent = 'SENDING...';
                formStatusDiv.style.color = 'var(--color-theme-secondary)';
            }
             if(submitButton) {
                 submitButton.disabled = true;
             }

            try {
                // Replace with your actual backend endpoint
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    console.log('Message sent successfully!');
                    // Success feedback
                    if(formStatusDiv) {
                        formStatusDiv.textContent = 'Message sent successfully!';
                        formStatusDiv.style.color = 'var(--color-theme-secondary)'; // Teal color for success
                    }
                     // Success animation (optional)
                     gsap.to(contactForm, { opacity: 0.5, scale: 0.95, duration: 0.5, ease: 'back.out(1.7)', onComplete: () => {
                          gsap.to(contactForm, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' });
                     }});

                    contactForm.reset(); // Clear the form
                     // Manually remove invalid classes after reset if needed
                     formGroups.forEach(group => {
                         group.classList.remove('invalid');
                          const errorMessage = group.querySelector('.error-message');
                          if (errorMessage) errorMessage.classList.add('hidden');
                          const label = group.querySelector('label');
                          if (label) gsap.to(label, { color: 'var(--color-theme-primary)', duration: 0.3 }); // Revert label color
                     });

                } else {
                    throw new Error(`Failed to send message: ${response.statusText}`);
                }
            } catch (error) {
                console.error('Error sending message:', error);
                // Error feedback
                if(formStatusDiv) {
                    formStatusDiv.textContent = 'Failed to send message. Please try again later.';
                    formStatusDiv.style.color = '#FF3366'; // Red color for error
                }
                 // Error animation (optional)
                  gsap.to(submitButton, { x: -5, repeat: 5, yoyo: true, duration: 0.1, ease: 'power1.inOut', onComplete: () => gsap.to(submitButton, { x: 0 }) });
            } finally {
                 if(submitButton) {
                      submitButton.disabled = false;
                 }
            }
        });

        // Initial validation check on load (optional, good for pre-filled forms)
        formGroups.forEach(group => {
             const input = group.querySelector('.form-input');
             if (input && input.value.trim() !== '') {
                  validateInputOfGroup(group); // Validate if input has a value on load
             }
        });

    } else {
        console.warn('Contact form element not found.');
    }
} 