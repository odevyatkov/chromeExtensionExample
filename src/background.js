'use strict';

const messages = [];

chrome.runtime.onInstalled.addListener(function() {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'assets/stay_hydrated.png',
        title: 'Now i running',
        message: 'Let\'s play',
        priority: 0
    });
});
let ports = [];

chrome.runtime.onConnect.addListener(function(port) {
    if (port.name === 'chat') {
        ports.push(port);
        port.onMessage.addListener(function(request) {
            if (!request.type) {
                return;
            }

            switch (request.type) {
                case 'getMessages':
                    port.postMessage({
                        type: 'updateMessages',
                        messages,
                    });
                    break;
            }
        });
        port.onDisconnect.addListener(() => {
            ports = ports.filter(curPort => curPort !== port);
        });
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (!request.type) {
        return;
    }
    switch (request.type) {
        case 'sendMessage':
            messages.push({
                message: request.message,
                from: request.from,
            });
            chrome.action.setBadgeText({
                text: messages.length.toString(),
            });
            sendResponse({
                status: 'ok',
                messages,
            });

            //set to active tabs
            ports.forEach(port => {
                port.postMessage({
                    type: 'updateMessages',
                    messages,
                });
            });
            break;

        case 'getMessages':
            sendResponse({
                messages,
            });
            break;
    }
});
