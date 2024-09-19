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

    // Theme switching functionality
    themeSelector.addEventListener('change', function() {
        const selectedTheme = this.value;
        document.body.className = selectedTheme;
        localStorage.setItem('selectedTheme', selectedTheme);
        console.log('Theme changed to:', selectedTheme);
    });

    if (savedTheme) {
        themeSelector.value = savedTheme;
    }

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

    // Link buttons functionality
    linkButtons.forEach(button => {
        button.addEventListener('click', function() {
            clickSound.play().then(() => {
                console.log('Click sound played successfully');
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 100);
            }).catch((error) => {
                console.error('Error playing click sound:', error);
            });
            const url = this.getAttribute('data-url');
            window.open(url, '_blank');
        });
    });

    // Update clock
    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeDisplay.textContent = `${hours}:${minutes}`;
    }

    setInterval(updateClock, 1000);
    updateClock();

    // Window controls functionality
    let isMinimized = false;
    let isMaximized = false;

    minimizeButton.addEventListener('click', () => {
        clickSound.play().catch(console.error);
        windowElement.style.display = 'none';
        createTaskbarIcon();
    });

    maximizeButton.addEventListener('click', () => {
        clickSound.play().catch(console.error);
        if (!isMaximized) {
            windowElement.style.width = '100%';
            windowElement.style.height = 'calc(100% - 28px)';
            windowElement.style.top = '0';
            windowElement.style.left = '0';
            windowElement.style.transform = 'none';
            isMaximized = true;
        } else {
            windowElement.style.width = '400px';
            windowElement.style.height = 'auto';
            windowElement.style.top = '50%';
            windowElement.style.left = '50%';
            windowElement.style.transform = 'translate(-50%, -50%)';
            isMaximized = false;
        }
    });

    closeButton.addEventListener('click', () => {
        errorSound.play().catch(console.error);
        windowElement.style.display = 'none';
        createTaskbarIcon();
    });

    function createTaskbarIcon() {
        const icon = document.createElement('div');
        icon.classList.add('taskbar-icon');
        icon.innerHTML = '<img src="/static/images/window_icon.svg" alt="Window Icon"> My Links';
        icon.addEventListener('click', restoreWindow);
        taskbarIcons.appendChild(icon);
    }

    function restoreWindow() {
        windowElement.style.display = 'block';
        this.remove();
    }
});

console.log('script.js loaded');
