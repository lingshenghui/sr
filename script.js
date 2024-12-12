document.addEventListener('DOMContentLoaded', () => {
    const guidePage = document.getElementById('guide');
    const birthdayPage = document.getElementById('birthday');
    const cardPage = document.getElementById('card');
    
    let currentStep = 0;
    
    // 礼花效果设置
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    const celebrationSound = document.getElementById('celebrationSound');
    
    // 设置画布尺寸
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // 礼花粒子类
    class Particle {
        constructor() {
            this.reset();
        }
    
        reset() {
            this.x = Math.random() < 0.5 ? 0 : canvas.width;
            this.y = canvas.height;
            this.size = Math.random() * 6 + 4;
            this.speedX = this.x === 0 
                ? Math.random() * 15  // 左下角喷发向右
                : Math.random() * -15; // 右下角喷发向左
            this.speedY = -Math.random() * 15 - 10; // 向上喷发
            this.gravity = 0.5;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 5;
            this.opacity = 1;
            const colors = ['#ff0000', '#ff69b4', '#ff1493', '#ffd700', '#ff4500'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
    
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.speedY += this.gravity;
            this.rotation += this.rotationSpeed;
            this.opacity -= 0.008;
        }
    
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }
    }
    
    // 创建粒子数组
    const particles = Array.from({ length: 150 }, () => new Particle());
    
    let isAnimating = false;
    
    // 动画循环
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let hasActiveParticles = false;
        particles.forEach(particle => {
            particle.update();
            particle.draw();
            
            if (particle.opacity <= 0) {
                particle.reset();
            }
            if (particle.opacity > 0) {
                hasActiveParticles = true;
            }
        });
        
        if (hasActiveParticles && isAnimating) {
            requestAnimationFrame(animate);
        } else {
            isAnimating = false;
        }
    }
    
    // 播放庆祝效果
    function playCelebration() {
        if (!isAnimating) {
            isAnimating = true;
            celebrationSound.currentTime = 0;
            celebrationSound.play();
            particles.forEach(particle => particle.reset());
            animate();
        }
    }

    // 在原有的点击事件中触发庆祝效果
    guidePage.addEventListener('click', () => {
        if (currentStep === 0) {
            guidePage.classList.remove('active');
            birthdayPage.style.display = 'flex';
            showBirthdayAnimation();
            currentStep = 1;
        }
    });

    // 生日页面动画
    function showBirthdayAnimation() {
        // 显示祝福文字
        setTimeout(() => {
            document.querySelector('.wish-text').style.opacity = '1';
            document.querySelector('.wish-text').style.transform = 'translateY(0)';
        }, 500);

        // 添加气球动画
        createBalloons();

        // 礼物盒子点击事件
        const giftBox = document.querySelector('.gift-box');
        giftBox.addEventListener('click', () => {
            if (currentStep === 1) {
                giftBox.classList.add('opening');
                playCelebration();
                
                // 等待动画完成后显示卡片
                setTimeout(() => {
                    birthdayPage.style.display = 'none';
                    cardPage.style.display = 'flex';
                    currentStep = 2;
                }, 1500);
            }
        });
    }

    // 创建气球
    function createBalloons() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeead'];
        const balloonContainer = document.querySelector('.balloons');

        for (let i = 0; i < 10; i++) {
            const balloon = document.createElement('div');
            balloon.className = 'balloon';
            balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            balloon.style.left = `${Math.random() * 100}%`;
            balloon.style.animationDelay = `${Math.random() * 2}s`;
            balloonContainer.appendChild(balloon);
        }
    }

    // 卡片翻转效果
    const card = document.querySelector('.card');
    let cardFlipped = false;
    card.addEventListener('click', () => {
        if (currentStep === 2 && !cardFlipped) {
            card.style.transform = 'rotateY(180deg)';
            playCelebration();
            cardFlipped = true;
        }
    });

    // 创建星星
    function createStars() {
        const starsContainer = document.querySelector('.stars');
        const starCount = 50;

        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 3}s`;
            starsContainer.appendChild(star);
        }
    }

    // 在初始化时调用
    createStars();
}); 