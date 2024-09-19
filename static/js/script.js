// Apply theme immediately
const savedTheme = localStorage.getItem('selectedTheme');
if (savedTheme) {
    document.body.className = savedTheme;
    console.log('Theme applied:', savedTheme);
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    const linkButtons = document.querySelectorAll('.link-button');
    const timeDisplay = document.querySelector('.time');
    const windowElement = document.querySelector('.window');
    const titleBar = document.querySelector('.title-bar');
    const linkContainer = document.getElementById('linkContainer');
    const minimizeButton = document.querySelector('button[aria-label="Minimize"]');
    const maximizeButton = document.querySelector('button[aria-label="Maximize"]');
    const closeButton = document.querySelector('button[aria-label="Close"]');
    const taskbarIcons = document.querySelector('.taskbar-icons');
    const themeSelector = document.getElementById('themeSelector');
    const desktopIcons = document.querySelectorAll('.desktop-icons .icon');
    const startButton = document.querySelector('.start-button');

    const clickSound = new Audio('/static/sounds/click.wav');
    const startupSound = new Audio('/static/sounds/startup.wav');
    const errorSound = new Audio('/static/sounds/error.wav');

    clickSound.volume = 0.7;
    startupSound.volume = 0.7;
    errorSound.volume = 0.7;

    console.log('Audio objects created');

    // Function to play startup sound
    function playStartupSound() {
        console.log('Attempting to play startup sound');
        startupSound.play()
            .then(() => {
                console.log('Startup sound played successfully');
            })
            .catch((error) => {
                console.error('Error playing startup sound:', error);
            });
    }

    // Play startup sound when the page loads
    playStartupSound();

    // Rest of the code remains the same...
    // (Theme switching, desktop icons, link buttons, clock, window controls)

    console.log('script.js loaded');
});
