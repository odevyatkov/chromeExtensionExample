'use strict';

chrome.runtime.sendMessage(
    {type: 'getMessages'},
    function(response) {
        renderMessagesList(response.messages);
    }
);

function sendMessage() {
    const message = document.getElementById('messageInput').value;
    if (!message) {
        return;
    }
    document.getElementById('messageInput').setAttribute('disabled', 'disabled');
    const request = {
        type: 'sendMessage',
        message,
        from: 'popup',
    };
    chrome.runtime.sendMessage(
        request,
        function(response) {
            renderMessagesList(response.messages);
            document.getElementById('messageInput').value = '';
            document.getElementById('messageInput').removeAttribute('disabled');
            document.getElementById('messageInput').focus();
        }
    );
}

function renderMessagesList(messages) {
    document.getElementById('messagesChat').innerHTML = '';
    messages.forEach(row => {
        const node = document.createElement('div');
        node.innerText = `${row.from}: ${row.message}`;
        document.getElementById('messagesChat').appendChild(node);
    });
    document.getElementById('messagesChat').scrollTop = 100000;
}

document.getElementById('sendMessageBtn').addEventListener('click', sendMessage);
