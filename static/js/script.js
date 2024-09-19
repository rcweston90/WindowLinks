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

    const clickSound = new Audio('/static/sounds/click.wav');
    const startupSound = new Audio('/static/sounds/startup.wav');
    const errorSound = new Audio('/static/sounds/error.wav');

    clickSound.volume = 0.7;
    startupSound.volume = 0.7;
    errorSound.volume = 0.7;

    startupSound.play().then(() => {
        console.log('Startup sound played successfully');
    }).catch((error) => {
        console.error('Error playing startup sound:', error);
    });

    // Desktop icon functionality
    desktopIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            clickSound.play().then(() => {
                console.log('Click sound played successfully');
                const action = this.getAttribute('data-action');
                switch(action) {
                    case 'open-computer':
                        alert('Opening My Computer');
                        break;
                    case 'open-documents':
                        alert('Opening My Documents');
                        break;
                    default:
                        console.log('Unknown action:', action);
                }
            }).catch((error) => {
                console.error('Error playing click sound:', error);
            });
        });
    });

    // Rest of the existing code...
    // (Keep all the existing code below this point)

});

console.log('script.js loaded');
