console.log('terminal.js loading');

function initializeTerminal() {
    console.log('Initializing terminal');
    const terminal = document.getElementById('terminal');
    const terminalOutput = document.getElementById('terminalOutput');
    const terminalInput = document.getElementById('terminalInput');
    
    console.log('Terminal elements:', { terminal, terminalOutput, terminalInput });

    if (!terminal || !terminalOutput || !terminalInput) {
        console.error('One or more terminal elements not found!');
        return;
    }

    const commands = {
        help: 'Available commands: help, list, add, delete, move, clear',
        list: 'Listing links...',
        add: 'Usage: add <name> <url>',
        delete: 'Usage: delete <id>',
        move: 'Usage: move <id> <new_position>'
    };

    function processCommand(command) {
        console.log('Processing command:', command);
        const parts = command.split(' ');
        const cmd = parts[0].toLowerCase();

        switch (cmd) {
            case 'help':
                console.log('Executing help command');
                return commands.help;
            case 'list':
                console.log('Executing list command');
                return listLinks();
            case 'add':
                console.log('Executing add command');
                if (parts.length < 3) return commands.add;
                return addLink(parts[1], parts.slice(2).join(' '));
            case 'delete':
                console.log('Executing delete command');
                if (parts.length !== 2) return commands.delete;
                return deleteLink(parts[1]);
            case 'move':
                console.log('Executing move command');
                if (parts.length !== 3) return commands.move;
                return moveLink(parts[1], parts[2]);
            case 'clear':
                console.log('Executing clear command');
                terminalOutput.innerHTML = '';
                return '';
            default:
                console.log('Unknown command:', cmd);
                return `Unknown command: ${cmd}. Type 'help' for available commands.`;
        }
    }

    function listLinks() {
        console.log('Fetching links...');
        return fetch('/api/links')
            .then(response => response.json())
            .then(links => {
                console.log('Links fetched:', links);
                return links.map(link => `${link.id}: ${link.name} - ${link.url}`).join('\n');
            })
            .catch(error => {
                console.error('Error fetching links:', error);
                return `Error: ${error}`;
            });
    }

    function addLink(name, url) {
        console.log('Adding link:', { name, url });
        return fetch('/api/links', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name, url})
        })
        .then(response => response.json())
        .then(link => {
            console.log('Link added:', link);
            return `Added: ${link.id}: ${link.name} - ${link.url}`;
        })
        .catch(error => {
            console.error('Error adding link:', error);
            return `Error: ${error}`;
        });
    }

    function deleteLink(id) {
        console.log('Deleting link with id:', id);
        return fetch(`/api/links/${id}`, {method: 'DELETE'})
            .then(response => response.json())
            .then(result => {
                console.log('Link deleted:', result);
                return `Deleted link with id: ${id}`;
            })
            .catch(error => {
                console.error('Error deleting link:', error);
                return `Error: ${error}`;
            });
    }

    function moveLink(id, newPosition) {
        console.log('Moving link:', { id, newPosition });
        return fetch(`/api/links/${id}/move`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({new_position: parseInt(newPosition)})
        })
        .then(response => response.json())
        .then(result => {
            console.log('Link moved:', result);
            return `Moved link with id: ${id} to position: ${newPosition}`;
        })
        .catch(error => {
            console.error('Error moving link:', error);
            return `Error: ${error}`;
        });
    }

    terminalInput.addEventListener('keyup', function(event) {
        console.log('Key pressed:', event.key);
        if (event.key === 'Enter') {
            const command = this.value;
            console.log('Command entered:', command);
            terminalOutput.innerHTML += `$ ${command}\n`;
            this.value = '';

            try {
                const result = processCommand(command);
                if (result instanceof Promise) {
                    result.then(output => {
                        console.log('Command output:', output);
                        terminalOutput.innerHTML += `${output}\n`;
                        terminal.scrollTop = terminal.scrollHeight;
                    }).catch(error => {
                        console.error('Error processing command:', error);
                        terminalOutput.innerHTML += `Error: ${error.message}\n`;
                        terminal.scrollTop = terminal.scrollHeight;
                    });
                } else {
                    console.log('Command output:', result);
                    terminalOutput.innerHTML += `${result}\n`;
                    terminal.scrollTop = terminal.scrollHeight;
                }
            } catch (error) {
                console.error('Error processing command:', error);
                terminalOutput.innerHTML += `Error: ${error.message}\n`;
                terminal.scrollTop = terminal.scrollHeight;
            }
        }
    });

    // Initial welcome message
    terminalOutput.innerHTML = 'Welcome to the Admin Terminal. Type "help" for available commands.\n';
    console.log('Initial welcome message set');
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded');
    try {
        initializeTerminal();
    } catch (error) {
        console.error('Error initializing terminal:', error);
    }
});

// Mutation Observer to check for dynamically added elements
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
            const addedNodes = mutation.addedNodes;
            for (let i = 0; i < addedNodes.length; i++) {
                if (addedNodes[i].id === 'terminal') {
                    console.log('Terminal element dynamically added');
                    observer.disconnect();
                    initializeTerminal();
                    return;
                }
            }
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true });

// Fallback mechanism using setTimeout
setTimeout(function() {
    if (!document.getElementById('terminal')) {
        console.log('Terminal element not found after timeout, attempting to initialize');
        initializeTerminal();
    }
}, 5000);

console.log('terminal.js loaded');
