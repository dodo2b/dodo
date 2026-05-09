const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = true;

const states = {
    day: 0,
    transitioningToNight: 1,
    night: 2,
    transitioningToDay: 3
};

let currentState = states.day;
let animationProgress = 0;

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

function drawSky() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    if (currentState === states.day) {
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#60B2E6');
    } else if (currentState === states.night) {
        gradient.addColorStop(0, '#0B1437');
        gradient.addColorStop(1, '#101F4A');
    } else if (currentState === states.transitioningToNight) {
        const r = Math.floor(135 + (11 - 135) * animationProgress);
        const g = Math.floor(206 + (20 - 206) * animationProgress);
        const b = Math.floor(235 + (55 - 235) * animationProgress);
        gradient.addColorStop(0, `rgb(${r}, ${g}, ${b})`);
        gradient.addColorStop(1, '#101F4A');
    } else {
        const r = Math.floor(11 + (135 - 11) * animationProgress);
        const g = Math.floor(20 + (206 - 20) * animationProgress);
        const b = Math.floor(55 + (235 - 55) * animationProgress);
        gradient.addColorStop(0, `rgb(${r}, ${g}, ${b})`);
        gradient.addColorStop(1, '#60B2E6');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

function drawHeader() {
    ctx.fillStyle = '#0033AA';
    ctx.fillRect(0, 0, canvasWidth, 48);
    ctx.fillStyle = '#E7F7FF';
    ctx.font = '22px sans-serif';
    ctx.fillText('Jeu Jour/Nuit', 24, 32);
    ctx.font = '16px sans-serif';
    ctx.fillText('Clique ou tapote pour changer', 260, 32);
}

function drawSunMoon() {
    const sunX = 760;
    const moonX = 760;
    const sunStartY = 80;
    const sunEndY = 540;
    const moonStartY = 540;
    const moonEndY = 80;

    const sunY = currentState === states.day
        ? sunStartY
        : currentState === states.transitioningToNight
            ? sunStartY + animationProgress * (sunEndY - sunStartY)
            : sunEndY;

    const moonY = currentState === states.night
        ? moonEndY
        : currentState === states.transitioningToDay
            ? moonStartY - animationProgress * (moonStartY - moonEndY)
            : moonStartY;

    if (currentState === states.day || currentState === states.transitioningToNight) {
        // Much bigger sun
        ctx.fillStyle = '#FFFF00';
        ctx.fillRect(sunX - 25, sunY - 25, 50, 50);
        // More rays
        ctx.fillRect(sunX - 40, sunY - 5, 15, 10);
        ctx.fillRect(sunX + 25, sunY - 5, 15, 10);
        ctx.fillRect(sunX - 5, sunY - 40, 10, 15);
        ctx.fillRect(sunX - 5, sunY + 25, 10, 15);
        ctx.fillRect(sunX - 30, sunY - 30, 15, 10);
        ctx.fillRect(sunX + 15, sunY - 30, 15, 10);
        ctx.fillRect(sunX - 30, sunY + 20, 15, 10);
        ctx.fillRect(sunX + 15, sunY + 20, 15, 10);
    }

    if (currentState === states.night || currentState === states.transitioningToDay) {
        // Much bigger crescent moon
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(moonX - 40, moonY - 40, 80, 80);
        ctx.fillStyle = '#0B1437';
        ctx.fillRect(moonX - 10, moonY - 30, 40, 60);

        // More stars, less geometric
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 35; i++) {
            const x = 100 + (i * 28) % 700;
            const y = 100 + ((i * 31) % 180);
            // Star shape with rects
            ctx.fillRect(x - 2, y, 5, 1);
            ctx.fillRect(x, y - 2, 1, 5);
        }
    }
}

function drawGround() {
    ctx.fillStyle = '#8B4513';
    for (let i = 0; i < canvasWidth; i += 20) {
        ctx.fillRect(i, 600, 20, 50);
        ctx.fillRect(i, 620, 20, 30);
    }
    ctx.fillStyle = '#228B22';
    for (let i = 0; i < canvasWidth; i += 20) {
        ctx.fillRect(i, 580, 20, 20);
    }
}

function drawBed() {
    const bedX = 250;
    const bedY = 350;
    const bedWidth = 400;
    const bedHeight = 200;

    // Bed frame
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(bedX, bedY, bedWidth, 20);
    ctx.fillRect(bedX, bedY + bedHeight - 20, bedWidth, 20);
    ctx.fillRect(bedX, bedY, 20, bedHeight);
    ctx.fillRect(bedX + bedWidth - 20, bedY, 20, bedHeight);

    // Mattress
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(bedX + 20, bedY + 20, bedWidth - 40, 60);

    // Pillows
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(bedX + 40, bedY + 30, 60, 30);
    ctx.fillRect(bedX + bedWidth - 100, bedY + 30, 60, 30);

    // Blanket
    ctx.fillStyle = '#0000FF';
    ctx.fillRect(bedX + 20, bedY + 80, bedWidth - 40, 100);
}

function drawPerson() {
    const startX = 170;
    const startY = 300;
    const bedX = 360;
    const bedY = 400;
    let x = startX;
    let y = startY;

    if (currentState === states.transitioningToNight) {
        x = startX + animationProgress * (bedX - startX);
        y = startY + animationProgress * (bedY - startY);
    } else if (currentState === states.night) {
        x = bedX;
        y = bedY;
    }

    if (currentState === states.day || currentState === states.transitioningToDay) {
        const walkX = currentState === states.transitioningToDay ? startX + (1 - animationProgress) * (bedX - startX) : startX;
        const walkY = currentState === states.transitioningToDay ? startY + (1 - animationProgress) * (bedY - startY) : startY;

        // Bigger hat
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(walkX + 18, walkY + 9, 30, 15);
        // Bigger face
        ctx.fillStyle = '#FFD1A4';
        ctx.fillRect(walkX + 21, walkY + 24, 24, 24);
        // Eyes
        ctx.fillStyle = '#000000';
        ctx.fillRect(walkX + 24, walkY + 27, 4, 4);
        ctx.fillRect(walkX + 37, walkY + 27, 4, 4);
        // Mustache
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(walkX + 24, walkY + 39, 18, 4);
        // Shirt
        ctx.fillStyle = '#0000FF';
        ctx.fillRect(walkX + 15, walkY + 48, 36, 30);
        // Arms (more pixelated)
        ctx.fillStyle = '#FFD1A4';
        ctx.fillRect(walkX + 9, walkY + 54, 9, 24);
        ctx.fillRect(walkX + 48, walkY + 54, 9, 24);
        // Pants
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(walkX + 18, walkY + 78, 12, 24);
        ctx.fillRect(walkX + 36, walkY + 78, 12, 24);
        // Shoes
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(walkX + 15, walkY + 99, 15, 9);
        ctx.fillRect(walkX + 36, walkY + 99, 15, 9);
    }

    if (currentState === states.night || currentState === states.transitioningToNight) {
        // Only head sticking out, bigger
        // Hat
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(x + 18, y - 42, 30, 15);
        // Face
        ctx.fillStyle = '#FFD1A4';
        ctx.fillRect(x + 21, y - 27, 24, 24);
        // Eyes
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + 24, y - 24, 4, 4);
        ctx.fillRect(x + 37, y - 24, 4, 4);
        // Mustache
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x + 24, y - 6, 18, 4);

        // Blanket covering body, starting at face bottom
        ctx.fillStyle = '#0000FF';
        ctx.fillRect(270, 400, 360, 120);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawSky();
    drawHeader();
    drawSunMoon();
    drawGround();
    drawBed();
    drawPerson();
}

function animate() {
    if (currentState === states.transitioningToNight || currentState === states.transitioningToDay) {
        animationProgress += 0.02;
        if (animationProgress >= 1) {
            animationProgress = 0;
            currentState = currentState === states.transitioningToNight ? states.night : states.day;
        }
    }
    draw();
    requestAnimationFrame(animate);
}

function toggleDayNight() {
    if (currentState === states.day) {
        currentState = states.transitioningToNight;
        animationProgress = 0;
    } else if (currentState === states.night) {
        currentState = states.transitioningToDay;
        animationProgress = 0;
    }
}

canvas.addEventListener('click', toggleDayNight);
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    toggleDayNight();
});

animate();