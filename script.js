document.addEventListener('mousemove', (e) => {
    const pupil = document.querySelector('.pupil');
    const pupilRect = pupil.getBoundingClientRect();
    
    const pupilCenterX = pupilRect.left + pupilRect.width / 2;
    const pupilCenterY = pupilRect.top + pupilRect.height / 2;
    
    const angle = Math.atan2(e.clientY - pupilCenterY, e.clientX - pupilCenterX);
    
    const maxMovement = 34;
    const moveX = Math.cos(angle) * maxMovement;
    const moveY = Math.sin(angle) * maxMovement;
    
    pupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
});

const audio = document.getElementById("bgmusic");
const overlay = document.getElementById("overlay");

document.getElementById("overlay").addEventListener("click", () => {
    audio.muted = false
    audio.play();
    overlay.style.animation = "fade 1s ease-out forwards";
    content.style.animation = "fadein 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards";
    setTimeout(() => {
        overlay.style.display = "none";
    }, 1000);
})