// --- 1. SETUP & DOM ELEMENTS ---
const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('output_canvas');
const ctx = canvasElement.getContext('2d');
canvasElement.width = window.innerWidth;
canvasElement.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;
});

const statusText = document.getElementById('status-text');
const gestureIcon = document.getElementById('gesture-icon');
const thickSlider = document.getElementById('thickness-slider');
const glowSlider = document.getElementById('glow-slider');
const cameraToggle = document.getElementById('camera-toggle');

let strokes = []; 
let currentPath = []; 
let canvasOffsetX = 0; 
let canvasOffsetY = 0; 
let previousPinchX = null;
let previousPinchY = null;

// Exact starting color
let penColor = '#00FF00';
let penThickness = parseInt(thickSlider.value);
let penGlow = parseInt(glowSlider.value);

// --- 2. EVENT LISTENERS ---
document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.color-btn').forEach(b => {
            b.classList.remove('active');
            b.style.boxShadow = 'none';
        });
        e.target.classList.add('active');
        penColor = e.target.getAttribute('data-color');
        e.target.style.boxShadow = `0 0 15px ${penColor}`; 
    });
});

thickSlider.addEventListener('input', (e) => { 
    penThickness = parseInt(e.target.value); 
    document.getElementById('thick-val').innerText = penThickness + 'px'; 
});
glowSlider.addEventListener('input', (e) => { 
    penGlow = parseInt(e.target.value); 
    document.getElementById('glow-val').innerText = penGlow + '%'; 
});
document.getElementById('clear-btn').addEventListener('click', () => { strokes = []; });
cameraToggle.addEventListener('change', (e) => { 
    videoElement.style.opacity = e.target.checked ? '0.35' : '0'; 
});

// --- 3. GESTURE RECOGNITION MATH ---
function detectGesture(landmarks) {
    const pinchDist = Math.hypot(landmarks[8].x - landmarks[4].x, landmarks[8].y - landmarks[4].y);
    const indexUp = landmarks[8].y < landmarks[6].y;
    const middleUp = landmarks[12].y < landmarks[10].y;
    const ringUp = landmarks[16].y < landmarks[14].y;
    const pinkyUp = landmarks[20].y < landmarks[18].y;

    if (pinchDist < 0.05) return 'PINCH'; 
    if (indexUp && middleUp && ringUp && pinkyUp) return 'PALM'; 
    if (indexUp && !middleUp && !ringUp && !pinkyUp) return 'POINT'; 
    return 'FIST'; 
}

// --- 4. RENDER LOOP ---
function drawEverything(landmarks, gesture, rawX, rawY) {
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    ctx.save();
    ctx.translate(canvasOffsetX, canvasOffsetY);
    const allStrokes = [...strokes];
    if (currentPath.length > 0) {
        allStrokes.push({ points: currentPath, color: penColor, thick: penThickness, glow: penGlow });
    }

    // Removed the "lighter" composite operation so the colors stay solid and deeply saturated
    ctx.globalCompositeOperation = "source-over";

    allStrokes.forEach(stroke => {
        if (stroke.points.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length; i++) {
            ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.thick;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowBlur = stroke.glow;
        ctx.shadowColor = stroke.color;
        ctx.stroke();
    });
    ctx.restore();

    // Exact Erasing Circle
    if (gesture === 'PALM' && landmarks) {
        ctx.save();
        const palmCenterX = (1 - ((landmarks[0].x + landmarks[9].x) / 2)) * canvasElement.width;
        const palmCenterY = ((landmarks[0].y + landmarks[9].y) / 2) * canvasElement.height;
        
        ctx.beginPath();
        ctx.arc(palmCenterX, palmCenterY, 35, 0, 2 * Math.PI); 
        ctx.strokeStyle = '#ff007f'; 
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff007f'; 
        ctx.stroke();
        ctx.restore();
    }

    // Hand Skeleton
    if (landmarks) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-canvasElement.width, 0);
        
        drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
            color: 'rgba(255, 255, 255, 0.2)', 
            lineWidth: 1
        });
        
        drawLandmarks(ctx, landmarks, {
            color: penColor, 
            fillColor: '#000000', 
            lineWidth: 2, 
            radius: 4 
        });
        
        ctx.restore();
    }
}

// --- 5. MEDIAPIPE AI SETUP & LOGIC ---
const hands = new Hands({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.7, minTrackingConfidence: 0.7 });

hands.onResults((results) => {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        statusText.innerText = "Ready";
        const landmarks = results.multiHandLandmarks[0];
        const gesture = detectGesture(landmarks);
        
        const rawX = (1 - landmarks[8].x) * canvasElement.width;
        const rawY = landmarks[8].y * canvasElement.height;

        if (gesture === 'POINT') {
            gestureIcon.innerText = '☝️';
            currentPath.push({ x: rawX - canvasOffsetX, y: rawY - canvasOffsetY });
            previousPinchX = null;
        } 
        else if (gesture === 'PINCH') {
            gestureIcon.innerText = '🤏';
            if (currentPath.length > 0) { 
                strokes.push({ points: currentPath, color: penColor, thick: penThickness, glow: penGlow }); 
                currentPath = []; 
            }
            if (previousPinchX != null) { 
                canvasOffsetX += (rawX - previousPinchX); 
                canvasOffsetY += (rawY - previousPinchY); 
            }
            previousPinchX = rawX; 
            previousPinchY = rawY;
        }
        else if (gesture === 'PALM') {
            gestureIcon.innerText = '✋';
            if (currentPath.length > 0) { 
                strokes.push({ points: currentPath, color: penColor, thick: penThickness, glow: penGlow }); 
                currentPath = []; 
            }
            previousPinchX = null;
            
            const palmCenterX = (1 - ((landmarks[0].x + landmarks[9].x) / 2)) * canvasElement.width;
            const palmCenterY = ((landmarks[0].y + landmarks[9].y) / 2) * canvasElement.height;
            const adjX = palmCenterX - canvasOffsetX; 
            const adjY = palmCenterY - canvasOffsetY;
            
            const ERASER_RADIUS = 35; 
            
            let newStrokes = [];
            strokes.forEach(stroke => {
                let currentSegment = [];
                stroke.points.forEach(p => {
                    if (Math.hypot(p.x - adjX, p.y - adjY) > ERASER_RADIUS) {
                        currentSegment.push(p); 
                    } else {
                        if (currentSegment.length > 0) {
                            newStrokes.push({ points: currentSegment, color: stroke.color, thick: stroke.thick, glow: stroke.glow });
                            currentSegment = [];
                        }
                    }
                });
                if (currentSegment.length > 0) {
                    newStrokes.push({ points: currentSegment, color: stroke.color, thick: stroke.thick, glow: stroke.glow });
                }
            });
            strokes = newStrokes; 
        }
        else {
            gestureIcon.innerText = '✊';
            if (currentPath.length > 0) { 
                strokes.push({ points: currentPath, color: penColor, thick: penThickness, glow: penGlow }); 
                currentPath = []; 
            }
            previousPinchX = null;
        }

        drawEverything(landmarks, gesture, rawX, rawY);
    } else {
        statusText.innerText = "Initializing hand tracking...";
        gestureIcon.innerText = '👀';
        if (currentPath.length > 0) { 
            strokes.push({ points: currentPath, color: penColor, thick: penThickness, glow: penGlow }); 
            currentPath = []; 
        }
        drawEverything(null, 'IDLE', -100, -100);
    }
});

// --- 6. START CAMERA ---
const camera = new Camera(videoElement, { 
    onFrame: async () => await hands.send({image: videoElement}), 
    width: 1280, 
    height: 720 
});
camera.start();
