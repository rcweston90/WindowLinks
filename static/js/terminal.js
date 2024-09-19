document.addEventListener('DOMContentLoaded', function() {
    const terminal = document.getElementById('terminal');
    const terminalOutput = document.getElementById('terminalOutput');
    const terminalInput = document.getElementById('terminalInput');
    
    const commands = {
        help: 'Available commands: help, list, add, delete, clear',
        list: 'Listing links...',
        add: 'Usage: add <name> <url>',
        delete: 'Usage: delete <id>'
    };

    function processCommand(command) {
        const parts = command.split(' ');
        const cmd = parts[0].toLowerCase();

        switch (cmd) {
            case 'help':
                return commands.help;
            case 'list':
                return listLinks();
            case 'add':
                if (parts.length < 3) return commands.add;
                return addLink(parts[1], parts.slice(2).join(' '));
            case 'delete':
                if (parts.length !== 2) return commands.delete;
                return deleteLink(parts[1]);
            case 'clear':
                terminalOutput.innerHTML = '';
                return '';
            default:
                return `Unknown command: ${cmd}. Type 'help' for available commands.`;
        }
    }

    function listLinks() {
        return fetch('/api/links')
            .then(response => response.json())
            .then(links => {
                return links.map(link => `${link.id}: ${link.name} - ${link.url}`).join('\n');
            })
            .catch(error => `Error: ${error}`);
    }

    function addLink(name, url) {
        return fetch('/api/links', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name, url})
        })
        .then(response => response.json())
        .then(link => `Added: ${link.id}: ${link.name} - ${link.url}`)
        .catch(error => `Error: ${error}`);
    }

    function deleteLink(id) {
        return fetch(`/api/links/${id}`, {method: 'DELETE'})
            .then(response => response.json())
            .then(result => `Deleted link with id: ${id}`)
            .catch(error => `Error: ${error}`);
    }

    terminalInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            const command = this.value;
            terminalOutput.innerHTML += `$ ${command}\n`;
            this.value = '';

            const result = processCommand(command);
            if (result instanceof Promise) {
                result.then(output => {
                    terminalOutput.innerHTML += `${output}\n`;
                    terminal.scrollTop = terminal.scrollHeight;
                });
            } else {
                terminalOutput.innerHTML += `${result}\n`;
                terminal.scrollTop = terminal.scrollHeight;
            }
        }
    });

    // Initial welcome message
    terminalOutput.innerHTML = 'Welcome to the Admin Terminal. Type "help" for available commands.\n';
});
