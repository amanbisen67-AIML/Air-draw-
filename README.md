# Air-draw-
Air Draw is an interactive, browser-based drawing application that uses real-time computer vision to turn your hands into a digital paintbrush. Built entirely with Vanilla JavaScript, HTML5 Canvas, and Google's MediaPipe AI, this app tracks 21 3D hand landmarks through your webcam without requiring any external hardware or sensors.

NAME = AMAN MUKESHKUMAR BISEN 

MAIL = amanbisen67@gmail.com

MO.  = 8010765895

DATE = 03/04/2026

# ✍️ Air Draw — AI-Powered Gesture Doodler

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![MediaPipe](https://img.shields.io/badge/MediaPipe-00BFFF?style=for-the-badge&logo=google&logoColor=white)

**Air Draw** is an interactive, touchless drawing application that runs entirely in your web browser. Using real-time computer vision, it tracks 21 distinct 3D landmarks on your hand, allowing you to paint, erase, and navigate a digital canvas using natural hand gestures—no external sensors or hardware required.

🔗 **[Live Demo: Play Air Draw Here](https://air-draw-eta.vercel.app/)**

---

## ✨ Key Features

* **Real-Time Gesture Recognition:** Mapped physical hand states (Pinch, Point, Palm) to digital canvas actions using distance algorithms and knuckle-to-fingertip height comparisons.
* **3-Layer Neon Rendering Engine:** Uses HTML5 Canvas additive blending (`globalCompositeOperation = "lighter"`) to render strokes with a white-hot inner core, a solid color layer, and a wide blurred halo, creating a highly realistic neon/glitter aesthetic.
* **Precision "Hole-Punch" Eraser:** Calculates the exact radial distance between the true palm center and every drawn coordinate, severing lines precisely where the visual eraser ring passes.
* **Holographic AI Skeleton:** Overlays a custom-styled, cyberpunk-inspired skeletal wireframe directly onto the user's hand, featuring transparent connecting bones and glowing joints that dynamically match the selected pen color.
* **Glassmorphic UI:** A sleek, dark-mode overlay utilizing backdrop filters and modern CSS to float controls elegantly over the webcam feed.

## 🎮 How to Play (Gestures)

The app tracks your hand and recognizes four distinct states:

* ☝️ **Point (Draw):** Extend only your index finger to draw glowing lines.
* ✋ **Palm (Erase):** Open all five fingers to summon the precision eraser ring. Sweep it over lines to carve holes through them.
* 🤏 **Pinch (Move):** Pinch your index finger and thumb together to grab the canvas and drag it around (infinite panning).
* ✊ **Fist (Idle):** Close your hand into a fist to stop drawing and rest.

## 🛠️ Tech Stack

* **Frontend Layout:** HTML5 & CSS3 (Glassmorphism design)
* **Logic & Rendering:** Vanilla JavaScript & HTML5 `<canvas>` API
* **Computer Vision / AI:** Google MediaPipe Hands (runs client-side)

## 💻 How to Run Locally

If you want to download the code and run it on your own machine:

1. Clone this repository:
   ```bash
   git clone [https://github.com/YOUR_USERNAME/air-draw.git](https://github.com/YOUR_USERNAME/air-draw.git)
