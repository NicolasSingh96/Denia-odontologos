document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;

    // Ajustar tamaño del canvas
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Configuración
    const particles = [];
    const particleCount = 80; // Cantidad de nodos
    const connectionDist = 140; // Distancia para conectar líneas
    const codeDrops = [];
    const codeSymbols = "01{}<>/;var";

    // --- CLASE PARTÍCULA (Puntos Cian / Red Neuronal) ---
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.8; // Velocidad X
            this.vy = (Math.random() - 0.5) * 0.8; // Velocidad Y
            this.size = Math.random() * 2 + 1.5;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            // Rebotar en bordes
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = '#00f0ff'; // Color Cian Brillante
            ctx.fill();
        }
    }

    // --- CLASE CÓDIGO (Lluvia Matrix) ---
    class CodeDrop {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.text = codeSymbols[Math.floor(Math.random() * codeSymbols.length)];
            this.speed = Math.random() * 1.5 + 0.5;
            this.opacity = Math.random() * 0.4 + 0.1;
        }
        update() {
            this.y += this.speed;
            if (this.y > height) {
                this.y = -20;
                this.x = Math.random() * width;
            }
        }
        draw() {
            ctx.fillStyle = `rgba(0, 240, 255, ${this.opacity})`;
            ctx.font = '14px "Space Grotesk"';
            ctx.fillText(this.text, this.x, this.y);
        }
    }

    // Inicializar
    function init() {
        for (let i = 0; i < particleCount; i++) particles.push(new Particle());
        for (let i = 0; i < 50; i++) codeDrops.push(new CodeDrop());
    }

    // Bucle de Animación Principal
    function animate() {
        // Limpiar el canvas 
        ctx.clearRect(0, 0, width, height);

        // 1. Dibujar Lluvia de Código
        codeDrops.forEach(drop => {
            drop.update();
            drop.draw();
        });

        // 2. Dibujar Red Neuronal
        particles.forEach((p, index) => {
            p.update();
            p.draw();

            // Dibujar líneas entre puntos cercanos
            for (let j = index + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDist) {
                    ctx.beginPath();
                    // Opacidad basada en distancia (más lejos = más transparente)
                    const opacity = 1 - (distance / connectionDist);
                    ctx.strokeStyle = `rgba(138, 43, 226, ${opacity})`; // Violeta
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    }

    init();
    animate();
});

// --- 2. SWITCH DE MONEDA (ARS / USD) ---
const currencySwitch = document.getElementById('currency-switch');
const labelArs = document.getElementById('label-ars');
const labelUsd = document.getElementById('label-usd');

if (currencySwitch) {
    currencySwitch.addEventListener('change', function() {
        const isUsd = this.checked;
        
        // Estilo de los labels
        if (isUsd) {
            labelUsd.classList.add('active');
            labelArs.classList.remove('active');
        } else {
            labelArs.classList.add('active');
            labelUsd.classList.remove('active');
        }

        // Actualizar Precios de Planes
        document.querySelectorAll('.plan-price').forEach(el => {
            const amountEl = el.querySelector('.amount');
            const symbolEl = el.querySelector('.currency-symbol');
            
            if (isUsd) {
                if (el.dataset.usd) {
                    amountEl.textContent = el.dataset.usd;
                    symbolEl.textContent = 'US$';
                }
            } else {
                if (el.dataset.ars) {
                    amountEl.textContent = el.dataset.ars;
                    symbolEl.textContent = '$';
                }
            }
        });
    });
}