const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const states = {
    day: 0,
    transitioningToNight: 1,
    night: 2,
    transitioningToDay: 3
};

let currentState = states.day;
let animationProgress = 0;

let zzzAnimationStartTime = 0;
const zzzAnimationDuration = 2000; // Durée d'une animation Zzz (en ms)
const zzzInterval = 3000; // Intervalle entre l'apparition de nouveaux Zzz (en ms)

let clouds = [];
const cloudSpeed = 0.5; // pixels par frame
const cloudPixelSize = 20; // Taille de base d'un "pixel" de nuage

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
        // Énorme soleil pixelisé
        ctx.fillStyle = '#FFFF00';
        ctx.fillRect(sunX - 60, sunY - 60, 120, 120);
        // Rayons massifs
        ctx.fillRect(sunX - 110, sunY - 10, 40, 20);
        ctx.fillRect(sunX + 70, sunY - 10, 40, 20);
        ctx.fillRect(sunX - 10, sunY - 110, 20, 40);
        ctx.fillRect(sunX - 10, sunY + 70, 20, 40);
        ctx.fillRect(sunX - 90, sunY - 90, 30, 30);
        ctx.fillRect(sunX + 60, sunY - 90, 30, 30);
        ctx.fillRect(sunX - 90, sunY + 60, 30, 30);
        ctx.fillRect(sunX + 60, sunY + 60, 30, 30);
    }

    if (currentState === states.night || currentState === states.transitioningToDay) {
        // Énorme lune en croissant
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(moonX - 70, moonY - 70, 140, 140);
        ctx.fillStyle = '#0B1437';
        ctx.fillRect(moonX - 30, moonY - 60, 110, 120);

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

    // Rajout de brins d'herbe pixelisés pour donner du relief
    for (let i = 0; i < canvasWidth; i += 40) {
        ctx.fillRect(i + 5, 560, 10, 20); // Brins hauts
        ctx.fillRect(i + 25, 570, 8, 10);  // Brins moyens
        ctx.fillRect(i + 18, 565, 5, 15);  // Brins fins
    }
}

function drawBed() {
    const bedX = 500; // Plus proche du centre
    const bedY = 320; 
    const bedWidth = 160; // Un peu plus large
    const bedHeight = 260; // Hauteur pour arriver au sol

    // Cadre en bois vertical
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(bedX, bedY, bedWidth, 25); // Tête de lit
    ctx.fillRect(bedX, bedY + bedHeight - 15, bedWidth, 15); // Pied de lit
    ctx.fillRect(bedX, bedY, 15, bedHeight); // Montant gauche
    ctx.fillRect(bedX + bedWidth - 15, bedY, 15, bedHeight); // Montant droit

    // Mattress
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(bedX + 15, bedY + 20, bedWidth - 30, bedHeight - 35);
    
    // Coussins
    ctx.fillStyle = '#F0F0F0';
    ctx.fillRect(bedX + 30, bedY + 30, 45, 35);
    ctx.fillRect(bedX + 85, bedY + 30, 45, 35);

    // Couette (Visible jour et nuit)
    ctx.fillStyle = '#0000FF';
    ctx.fillRect(bedX + 15, bedY + 110, bedWidth - 30, bedHeight - 125);
}

// Fonction pour initialiser les nuages
function initClouds() {
    // Chaque nuage est défini par sa position (x, y) et une série de "blocs" relatifs à cette position.
    // Les blocs sont (dx, dy, largeur_en_pixels, hauteur_en_pixels)
    clouds.push({ x: 100, y: 80, blocks: [
        { dx: 0, dy: 0, w: 3, h: 2 },
        { dx: 1, dy: 2, w: 2, h: 1 },
        { dx: 3, dy: 1, w: 1, h: 1 }
    ]});
    clouds.push({ x: 450, y: 150, blocks: [
        { dx: 0, dy: 1, w: 2, h: 1 },
        { dx: 1, dy: 0, w: 3, h: 2 },
        { dx: 3, dy: 1, w: 1, h: 1 }
    ]});
    clouds.push({ x: 700, y: 100, blocks: [
        { dx: 0, dy: 0, w: 4, h: 2 },
        { dx: 1, dy: 2, w: 2, h: 1 }
    ]});
    // Ajoute un nuage qui commence hors écran à droite pour un défilement continu
    clouds.push({ x: canvasWidth + 50, y: 130, blocks: [
        { dx: 0, dy: 1, w: 2, h: 1 },
        { dx: 1, dy: 0, w: 3, h: 2 },
        { dx: 3, dy: 1, w: 1, h: 1 }
    ]});
}

// Fonction pour dessiner les nuages
function drawClouds() {
    if (currentState === states.night || currentState === states.transitioningToNight) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'; // Blanc semi-transparent pour la nuit
    } else {
        ctx.fillStyle = '#FFFFFF'; // Blanc opaque pour le jour
    }

    for (const cloud of clouds) {
        for (const block of cloud.blocks) {
            ctx.fillRect(cloud.x + block.dx * cloudPixelSize, cloud.y + block.dy * cloudPixelSize, block.w * cloudPixelSize, block.h * cloudPixelSize);
        }
    }
}

function drawPerson() {
    const startX = 100; 
    const startY = 436; // Ajusté pour le nouveau p=8
    const bedX = 540;   // Ajusté pour le nouveau lit
    const bedY = 370;   
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
        
        const p = 8; // Perso plus grand
        
        // Cheveux courts
        ctx.fillStyle = '#4A2D1F';
        ctx.fillRect(walkX + p, walkY + p*2, p*10, p*5);
        ctx.fillStyle = '#2A1D0F'; // Ombre cheveux
        ctx.fillRect(walkX + p, walkY + p*4, p*2, p*3);

        ctx.fillStyle = '#FF0000'; // Chapeau détaillé
        ctx.fillRect(walkX + p*2, walkY, p*8, p*2);
        ctx.fillRect(walkX + p*4, walkY - p*1.5, p*4, p*1.5);
        
        ctx.fillStyle = '#FFD1A4'; // Visage
        ctx.fillRect(walkX + p*3, walkY + p*2, p*6, p*6);
        
        ctx.fillStyle = '#000000'; // Yeux
        ctx.fillRect(walkX + p*4, walkY + p*3.5, p, p*1.5);
        ctx.fillRect(walkX + p*7, walkY + p*3.5, p, p*1.5);
        
        ctx.fillStyle = '#8B4513'; // Moustache
        ctx.fillRect(walkX + p*3.5, walkY + p*6.5, p*5, p);

        // Corps
        ctx.fillStyle = '#0000FF';
        ctx.fillRect(walkX + p*2, walkY + p*8, p*8, p*6);
        ctx.fillStyle = '#FFFF00'; // Boutons
        ctx.fillRect(walkX + p*5.5, walkY + p*9.5, p, p);
        ctx.fillRect(walkX + p*5.5, walkY + p*12, p, p);

        // Bras et Mains
        ctx.fillStyle = '#0000FF';
        ctx.fillRect(walkX + p*0.5, walkY + p*8, p*1.5, p*4);
        ctx.fillRect(walkX + p*10, walkY + p*8, p*1.5, p*4);
        ctx.fillStyle = '#FFD1A4';
        ctx.fillRect(walkX + p*0.5, walkY + p*12, p*1.5, p*1.5);
        ctx.fillRect(walkX + p*10, walkY + p*12, p*1.5, p*1.5);

        // Pantalon et Chaussures
        ctx.fillStyle = '#333333';
        ctx.fillRect(walkX + p*2.5, walkY + p*14, p*3, p*2.5);
        ctx.fillRect(walkX + p*6.5, walkY + p*14, p*3, p*2.5);
        ctx.fillStyle = '#000000'; // Chaussures
        ctx.fillRect(walkX + p*2, walkY + p*16.5, p*3.5, p);
        ctx.fillRect(walkX + p*6.5, walkY + p*16.5, p*3.5, p);
    }

    if (currentState === states.night || currentState === states.transitioningToNight) {
        const p = 8;
        // Tête sur l'oreiller
        ctx.fillStyle = '#4A2D1F';
        ctx.fillRect(x + p*2, y + p*2, p*8, p*3);
        
        ctx.fillStyle = '#FF0000'; // Chapeau rectifié (comme le jour)
        ctx.fillRect(x + p*2, y + p*0.5, p*8, p*2);
        ctx.fillRect(x + p*4, y - p, p*4, p*1.5);

        ctx.fillStyle = '#FFD1A4'; // Visage
        ctx.fillRect(x + p*3, y + p*2.5, p*6, p*5);
        ctx.fillStyle = '#000000'; // Yeux fermés
        ctx.fillRect(x + p*4, y + p*4.5, p, p*0.5);
        ctx.fillRect(x + p*7, y + p*4.5, p, p*0.5);
        ctx.fillStyle = '#8B4513'; // Moustache
        ctx.fillRect(x + p*3.5, y + p*6.5, p*5, p*0.8);

        // Dessin de la couette par-dessus pour l'effet "sous le drap"
        ctx.fillStyle = '#0000FF';
        ctx.fillRect(515, 430, 130, 135);

        // Animation Zzz
        const currentTime = performance.now();

        if (zzzAnimationStartTime === 0) {
            // Initialise le temps de début de l'animation Zzz la première fois que la nuit arrive
            zzzAnimationStartTime = currentTime;
        }

        const timeSinceLastZzzCycle = currentTime - zzzAnimationStartTime;

        if (timeSinceLastZzzCycle >= zzzInterval) {
            // Réinitialise pour un nouveau cycle Zzz
            zzzAnimationStartTime = currentTime;
        }

        const zzzProgress = (currentTime - zzzAnimationStartTime) / zzzAnimationDuration;

        if (zzzProgress >= 0 && zzzProgress <= 1) {
            const alpha = 1 - zzzProgress; // S'estompe
            const yOffset = -zzzProgress * 60; // Monte de 60 pixels
            const zzzX = x + p * 10; 
            const zzzY = y - p * 2 + yOffset;

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = '#FFFFFF'; // Zzz blanc
            ctx.font = 'bold 18px Arial'; 
            ctx.fillText('Zzz', zzzX, zzzY);
            ctx.restore();
        }
    } else {
        // Réinitialise l'animation Zzz quand ce n'est pas la nuit
        zzzAnimationStartTime = 0;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawSky();
    drawClouds(); // Dessine les nuages après le ciel
    drawHeader();
    drawSunMoon();
    drawGround();
    drawBed();
    drawPerson();
}

// Initialise les nuages au démarrage
initClouds();

function animate() {
    if (currentState === states.transitioningToNight || currentState === states.transitioningToDay) {
        animationProgress += 0.02;
        if (animationProgress >= 1) {
            animationProgress = 0;
            currentState = currentState === states.transitioningToNight ? states.night : states.day;
        }
    }

    // Met à jour la position des nuages pour le défilement
    for (const cloud of clouds) {
        cloud.x -= cloudSpeed; // Déplace le nuage vers la gauche
        // Si le nuage est complètement sorti de l'écran à gauche, le repositionne à droite
        let cloudTotalWidth = 0;
        for (const block of cloud.blocks) {
            cloudTotalWidth = Math.max(cloudTotalWidth, (block.dx + block.w) * cloudPixelSize);
        }
        if (cloud.x + cloudTotalWidth < 0) {
            cloud.x = canvasWidth + Math.random() * 200; // Repositionne à droite, avec une petite variation
            cloud.y = 80 + Math.random() * 100; // Varie légèrement la hauteur
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