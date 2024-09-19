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
        help: 'Available commands: help, list (shows IDs), add, delete, swap, clear, exit',
        list: 'Listing links...',
        add: 'Usage: add <name> <url>',
        delete: 'Usage: delete <id>',
        swap: 'Usage: swap <number1> <number2>',
        exit: 'Exiting admin terminal...'
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
            case 'swap':
                console.log('Executing swap command');
                if (parts.length !== 3) return commands.swap;
                return swapLinks(parts[1], parts[2]);
            case 'clear':
                console.log('Executing clear command');
                terminalOutput.innerHTML = '';
                return '';
            case 'exit':
                console.log('Executing exit command');
                window.location.href = '/';
                return commands.exit;
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
                return links.map((link, index) => `${index + 1}. [ID: ${link.id}] ${link.name} - ${link.url}`).join('\n');
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
            return `Added: [ID: ${link.id}] ${link.name} - ${link.url}`;
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

    function swapLinks(number1, number2) {
        console.log('Swapping links:', { number1, number2 });
        return fetch('/api/links/swap', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({position1: parseInt(number1), position2: parseInt(number2)})
        })
        .then(response => response.json())
        .then(result => {
            console.log('Links swapped:', result);
            return `Swapped links at positions ${number1} and ${number2}`;
        })
        .catch(error => {
            console.error('Error swapping links:', error);
            return `Error: ${error}`;
        });
    }

    function typeWriter(text, element, index = 0, interval = 50) {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            setTimeout(() => typeWriter(text, element, index + 1, interval), interval);
        }
    }

    terminalInput.addEventListener('keyup', function(event) {
        console.log('Key pressed:', event.key);
        if (event.key === 'Enter') {
            const command = this.value;
            console.log('Command entered:', command);
            const outputElement = document.createElement('div');
            outputElement.innerHTML = `<span class="prompt">C:\\ADMIN&gt;</span>${command}\n`;
            terminalOutput.appendChild(outputElement);
            this.value = '';

            try {
                const result = processCommand(command);
                if (result instanceof Promise) {
                    result.then(output => {
                        console.log('Command output:', output);
                        const responseElement = document.createElement('div');
                        terminalOutput.appendChild(responseElement);
                        typeWriter(output + '\n', responseElement);
                        terminal.scrollTop = terminal.scrollHeight;
                    }).catch(error => {
                        console.error('Error processing command:', error);
                        terminalOutput.innerHTML += `Error: ${error.message}\n`;
                        terminal.scrollTop = terminal.scrollHeight;
                    });
                } else {
                    console.log('Command output:', result);
                    const responseElement = document.createElement('div');
                    terminalOutput.appendChild(responseElement);
                    typeWriter(result + '\n', responseElement);
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
    const welcomeMessage = 'Welcome to the Windows 98 Admin Terminal.\nType "help" for available commands.\n';
    typeWriter(welcomeMessage, terminalOutput);
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

console.log('terminal.js loaded');
