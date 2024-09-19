document.addEventListener('DOMContentLoaded', function() {
    const linkButtons = document.querySelectorAll('.link-button');
    const timeDisplay = document.querySelector('.time');
    const windowElement = document.querySelector('.window');
    const titleBar = document.querySelector('.title-bar');
    const linkContainer = document.getElementById('linkContainer');
    const minimizeButton = document.querySelector('button[aria-label="Minimize"]');
    const maximizeButton = document.querySelector('button[aria-label="Maximize"]');
    const closeButton = document.querySelector('button[aria-label="Close"]');
    const taskbarIcons = document.querySelector('.taskbar-icons');

    // Sound effects
    const clickSound = new Audio('/static/sounds/click.wav');
    const startupSound = new Audio('/static/sounds/startup.wav');
    const errorSound = new Audio('/static/sounds/error.wav');

    // Increase volume of sound effects
    clickSound.volume = 0.7;
    startupSound.volume = 0.7;
    errorSound.volume = 0.7;

    // Play startup sound
    startupSound.play().then(() => {
        console.log('Startup sound played successfully');
    }).catch((error) => {
        console.error('Error playing startup sound:', error);
    });

    // Fade-in effect when opening the window
    windowElement.style.opacity = '0';
    windowElement.style.transition = 'opacity 0.5s ease-in-out';
    setTimeout(() => {
        windowElement.style.opacity = '1';
    }, 100);

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

    // Update clock with pulsing effect
    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeDisplay.textContent = `${hours}:${minutes}`;
        timeDisplay.style.transform = 'scale(1.05)';
        setTimeout(() => {
            timeDisplay.style.transform = 'scale(1)';
        }, 500);
    }

    setInterval(updateClock, 1000);
    updateClock(); // Initial call to display time immediately

    // Make window draggable
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    titleBar.addEventListener("mousedown", dragStart);
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", dragEnd);

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === titleBar) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, windowElement);
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;

        isDragging = false;
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }

    // Minimize, Maximize, and Close functionality
    let isMinimized = false;
    let isMaximized = false;

    function createTaskbarIcon() {
        const icon = document.createElement('div');
        icon.classList.add('taskbar-icon');
        icon.innerHTML = `
            <img src="/static/images/window_icon.svg" alt="Window Icon">
            <span>My Links</span>
        `;
        icon.addEventListener('click', restoreWindow);
        taskbarIcons.appendChild(icon);
        return icon;
    }

    function removeTaskbarIcon(icon) {
        taskbarIcons.removeChild(icon);
    }

    function restoreWindow() {
        windowElement.classList.remove('minimized');
        isMinimized = false;
        removeTaskbarIcon(this);
        animateBounce(windowElement);
    }

    function animateBounce(element) {
        element.style.animation = 'bounce 0.5s';
        element.addEventListener('animationend', () => {
            element.style.animation = '';
        }, {once: true});
    }

    minimizeButton.addEventListener('click', () => {
        clickSound.play().then(() => {
            console.log('Click sound played successfully');
        }).catch((error) => {
            console.error('Error playing click sound:', error);
        });
        if (!isMinimized) {
            windowElement.classList.add('minimized');
            isMinimized = true;
            createTaskbarIcon();
        }
    });

    maximizeButton.addEventListener('click', () => {
        clickSound.play().then(() => {
            console.log('Click sound played successfully');
        }).catch((error) => {
            console.error('Error playing click sound:', error);
        });
        if (!isMaximized) {
            windowElement.classList.add('maximized');
            isMaximized = true;
        } else {
            windowElement.classList.remove('maximized');
            isMaximized = false;
        }
        animateBounce(windowElement);
    });

    closeButton.addEventListener('click', () => {
        errorSound.play().then(() => {
            console.log('Error sound played successfully');
            animateShake(windowElement);
        }).catch((error) => {
            console.error('Error playing error sound:', error);
        });
        windowElement.classList.add('minimized');
        isMinimized = true;
        createTaskbarIcon();
    });

    function animateShake(element) {
        element.style.animation = 'shake 0.5s';
        element.addEventListener('animationend', () => {
            element.style.animation = '';
        }, {once: true});
    }

    // Drag and drop functionality for link reordering
    let draggedItem = null;

    linkContainer.addEventListener('dragstart', (e) => {
        draggedItem = e.target.closest('.link-item');
        setTimeout(() => {
            draggedItem.style.opacity = '0.5';
        }, 0);
    });

    linkContainer.addEventListener('dragend', () => {
        setTimeout(() => {
            draggedItem.style.opacity = '1';
            draggedItem = null;
        }, 0);
    });

    linkContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(linkContainer, e.clientY);
        const currentItem = draggedItem;
        if (afterElement == null) {
            linkContainer.appendChild(draggedItem);
        } else {
            linkContainer.insertBefore(draggedItem, afterElement);
        }
    });

    linkContainer.addEventListener('dragenter', (e) => {
        e.preventDefault();
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.link-item:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // Save the new order to the server
    function saveNewOrder() {
        clickSound.play().then(() => {
            console.log('Click sound played successfully');
        }).catch((error) => {
            console.error('Error playing click sound:', error);
        });
        const linkItems = document.querySelectorAll('.link-item');
        const newOrder = Array.from(linkItems).map(item => item.dataset.id);

        fetch('/update_order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ order: newOrder }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Order updated successfully:', data);
        })
        .catch((error) => {
            console.error('Error updating order:', error);
            errorSound.play().then(() => {
                console.log('Error sound played successfully');
            }).catch((error) => {
                console.error('Error playing error sound:', error);
            });
        });
    }

    linkContainer.addEventListener('dragend', saveNewOrder);
});
