console.log('Hello from inject.js');

const injectedExtensionNode = document.createElement('div');
injectedExtensionNode.setAttribute('id', 'injectedNode');

const messagesChatNode = document.createElement('div');
messagesChatNode.setAttribute('id', 'messagesChat');
injectedExtensionNode.appendChild(messagesChatNode);

const messageInputNode = document.createElement('input');
messageInputNode.setAttribute('id', 'messageInput');
injectedExtensionNode.appendChild(messageInputNode);

const sendMessageBtnNode = document.createElement('button');
sendMessageBtnNode.setAttribute('id', 'sendMessageBtn');
sendMessageBtnNode.innerText = 'Send message from site';
sendMessageBtnNode.addEventListener('click', sendMessage);
injectedExtensionNode.appendChild(sendMessageBtnNode);

document.body.appendChild(injectedExtensionNode);

window.addEventListener('message', (request) => {
    if (!request.data || !request.data.type) {
        return;
    }
    switch (request.data.type) {
        case 'updateMessages':
            renderMessagesList(request.data.messages);
            break;

        case 'responseSendMessage':
            messageInputNode.value = '';
            messageInputNode.removeAttribute('disabled');
            messageInputNode.focus();
            break;
    }
}, false);
window.postMessage({type: 'requestGetMessages'});

function renderMessagesList(messages) {
    messagesChatNode.innerHTML = '';
    messages.forEach(row => {
        const node = document.createElement('div');
        node.innerText = `${row.from}: ${row.message}`;
        messagesChatNode.appendChild(node);
    });
    messagesChatNode.scrollTop = 100000;
}

function sendMessage() {
    const message = messageInputNode.value;
    if (!message) {
        return;
    }
    messageInputNode.setAttribute('disabled', 'disabled');
    window.postMessage({
        type: 'requestSendMessage',
        message,
        from: window.location.host,
    });
}
