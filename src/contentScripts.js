console.log('Hello from contentScripts.js');

const port = chrome.runtime.connect({name: "chat"});
port.onMessage.addListener(function(response) {
    if (!response || !response.type) {
        return;
    }

    switch (response.type) {
        case 'updateMessages':
            window.postMessage({
                ...response,
                type: 'updateMessages',
            });
            break;
    }
});

window.addEventListener('message', (request) => {
    if (!request.data || !request.data.type) {
        return;
    }

    switch (request.data.type) {
        case 'requestGetMessages':
            chrome.runtime.sendMessage(
                {
                    ...request.data,
                    type: 'getMessages',
                },
                function(response) {
                    window.postMessage({
                        ...response,
                        type: 'updateMessages',
                    });
                }
            );
            break;

        case 'requestSendMessage':
            chrome.runtime.sendMessage(
                {
                    ...request.data,
                    type: 'sendMessage',
                },
                function(response) {
                    window.postMessage({
                        ...response,
                        type: 'responseSendMessage',
                    });
                }
            );
            break;
    }
}, false);

const jsScript = document.createElement('script');
jsScript.src = chrome.runtime.getURL('src/inject.js');
(document.head || document.documentElement).appendChild(jsScript);
