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
    const startupSound = new Audio('/static/sounds/startup.mp3');
    const errorSound = new Audio('/static/sounds/error.wav');

    clickSound.volume = 0.7;
    startupSound.volume = 0.7;
    errorSound.volume = 0.7;

    console.log('Audio objects created');

    // Create play button
    const playButton = document.createElement('button');
    playButton.textContent = 'Play Startup Sound';
    playButton.style.position = 'fixed';
    playButton.style.top = '10px';
    playButton.style.right = '10px';
    playButton.style.zIndex = '9999';
    document.body.appendChild(playButton);

    // Function to play startup sound
    function playStartupSound() {
        console.log('About to play startup sound');
        startupSound.play()
            .then(() => {
                console.log('Startup sound played successfully');
            })
            .catch(error => {
                console.error('Error playing startup sound:', error);
                console.error('Audio state:', startupSound.readyState);
                console.error('Audio network state:', startupSound.networkState);
            });
    }

    // Add click event listener to the button
    playButton.addEventListener('click', playStartupSound);

    // Attempt to play automatically on page load
    playStartupSound();

    // Check if the audio file is loaded correctly
    startupSound.addEventListener('loadeddata', () => {
        console.log('Startup sound loaded successfully');
    });

    startupSound.addEventListener('error', (error) => {
        console.error('Error loading startup sound:', error);
        console.error('Audio state:', startupSound.readyState);
        console.error('Audio network state:', startupSound.networkState);
    });

    // Rest of the code remains the same...
    // (Theme switching, desktop icons, link buttons, clock, window controls)

    console.log('script.js loaded');
});
