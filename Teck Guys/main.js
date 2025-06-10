let typingEnabled = JSON.parse(localStorage.getItem('typingEnabled') ?? 'true');
let typingSpeed = parseInt(localStorage.getItem('typingSpeed') ?? '20', 10);
let hardTypingDisabled = JSON.parse(localStorage.getItem('hardTypingDisabled') ?? 'false');

const typingMaxSpeed = 100;
const typingMinSpeed = -50;

let currentSessionId = parseInt(sessionStorage.getItem('currentSessionId') ?? '0', 10);
const originalContentMap = new WeakMap();

function saveSettings() {
    localStorage.setItem('typingEnabled', JSON.stringify(typingEnabled));
    localStorage.setItem('typingSpeed', typingSpeed.toString());
    localStorage.setItem('hardTypingDisabled', JSON.stringify(hardTypingDisabled));
}

function saveCurrentSessionId() {
    sessionStorage.setItem('currentSessionId', currentSessionId.toString());
}

function parseNodes(node) {
    const result = [];
    for (const child of node.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
            const chars = Array.from(child.textContent);
            chars.forEach(char => result.push({ type: 'text', content: char }));
        } else if (child.nodeType === Node.ELEMENT_NODE) {
            if (['IMG', 'VIDEO', 'IFRAME'].includes(child.tagName)) {
                result.push({ type: 'media', node: child.cloneNode(true) });
            } else {
                const inner = parseNodes(child);
                result.push({
                    type: 'element',
                    tag: child.tagName,
                    attrs: [...child.attributes],
                    children: inner
                });
            }
        }
    }
    return result;
}

function renderNode(container, structure, callback, sessionId) {
    let index = 0;
    const speed = typingSpeed;
    if (speed <= typingMinSpeed) {
        showAll(container, structure);
        callback && callback();
        return;
    }
    let charsToRender = 1;
    if (speed < 0) {
        charsToRender += Math.min(Math.floor(Math.abs(speed) / 10), 4);
    }
    function next() {
        if (sessionId !== currentSessionId) return;
        if (index >= structure.length) {
            callback && callback();
            return;
        }
        let rendered = 0;
        while (index < structure.length && rendered < charsToRender) {
            const item = structure[index++];
            if (item.type === 'text') {
                container.append(item.content);
            } else if (item.type === 'media') {
                container.appendChild(item.node);
            } else if (item.type === 'element') {
                const el = document.createElement(item.tag);
                item.attrs.forEach(attr => el.setAttribute(attr.name, attr.value));
                container.appendChild(el);
                renderNode(el, item.children, next, sessionId);
                return;
            }
            rendered++;
        }
        setTimeout(next, speed > 0 ? speed : 10);
    }
    next();
}

function showAll(container, structure) {
    for (const item of structure) {
        if (item.type === 'text') {
            container.append(item.content);
        } else if (item.type === 'media') {
            container.appendChild(item.node);
        } else if (item.type === 'element') {
            const el = document.createElement(item.tag);
            item.attrs.forEach(attr => el.setAttribute(attr.name, attr.value));
            container.appendChild(el);
            showAll(el, item.children);
        }
    }
}

function animateTyping() {
    const elements = document.querySelectorAll('.animated');
    elements.forEach(el => {
        const originalHTML = el.innerHTML;
        const dummy = document.createElement('div');
        dummy.innerHTML = originalHTML;
        const structure = parseNodes(dummy);
        originalContentMap.set(el, structure);
    });
    const animateSequentially = (i = 0, sessionId) => {
        if (i >= elements.length) return;
        const el = elements[i];
        const structure = originalContentMap.get(el);
        if (!structure) {
            animateSequentially(i + 1, sessionId);
            return;
        }
        el.innerHTML = '';
        renderNode(el, structure, () => animateSequentially(i + 1, sessionId), sessionId);
    };
    currentSessionId++;
    saveCurrentSessionId();
    animateSequentially(0, currentSessionId);
}

function restartTyping() {
    currentSessionId++;
    saveCurrentSessionId();
    const sessionId = currentSessionId;
    document.querySelectorAll('.animated').forEach(el => {
        el.innerHTML = '';
        const structure = originalContentMap.get(el);
        if (!structure) return;
        if (typingEnabled && typingSpeed > typingMinSpeed) {
            renderNode(el, structure, null, sessionId);
        } else {
            showAll(el, structure);
        }
    });
}

function toggleTyping() {
    typingEnabled = !typingEnabled;
    hardTypingDisabled = !typingEnabled;
    saveSettings();
    restartTyping();
}

function enableTyping() {
    typingEnabled = true;
    hardTypingDisabled = false;
    saveSettings();
    restartTyping();
}

function disableTyping() {
    typingEnabled = false;
    hardTypingDisabled = true;
    saveSettings();
    restartTyping();
}

function increaseSpeed() {
    if (hardTypingDisabled) return;
    typingSpeed = Math.max(typingMinSpeed, typingSpeed - 10);
    if (typingSpeed <= typingMinSpeed) {
        typingEnabled = false;
        hardTypingDisabled = true;
    } else {
        typingEnabled = true;
        hardTypingDisabled = false;
    }
    saveSettings();
    restartTyping();
}

function decreaseSpeed() {
    if (hardTypingDisabled) return;
    typingSpeed = Math.min(typingMaxSpeed, typingSpeed + 10);
    if (typingSpeed < typingMinSpeed) typingSpeed = typingMinSpeed;
    typingEnabled = true;
    hardTypingDisabled = false;
    saveSettings();
    restartTyping();
}

function resetTypingSettings() {
    localStorage.removeItem('typingEnabled');
    localStorage.removeItem('typingSpeed');
    localStorage.removeItem('hardTypingDisabled');
    typingEnabled = true;
    hardTypingDisabled = false;
    typingSpeed = 20;
    location.reload();
}

function redirectWithTemporaryTypingOverride(redirectUrl, tempTypingSpeed) {
    const backup = {
        typingEnabled: localStorage.getItem('typingEnabled'),
        typingSpeed: localStorage.getItem('typingSpeed'),
        hardTypingDisabled: localStorage.getItem('hardTypingDisabled')
    };
    localStorage.setItem('typingEnabled', JSON.stringify(true));
    localStorage.setItem('typingSpeed', tempTypingSpeed.toString());
    localStorage.setItem('hardTypingDisabled', JSON.stringify(false));
    typingEnabled = true;
    typingSpeed = tempTypingSpeed;
    hardTypingDisabled = false;
    currentSessionId++;
    saveCurrentSessionId();
    const sessionId = currentSessionId;
    const elements = document.querySelectorAll('.animated');
    if (elements.length === 0) {
        restoreAndRedirect();
        return;
    }
    let remaining = elements.length;
    elements.forEach(el => {
        const originalHTML = el.getAttribute('data-original-html') || el.innerHTML;
        el.setAttribute('data-original-html', originalHTML);
        const dummy = document.createElement('div');
        dummy.innerHTML = originalHTML;
        const structure = parseNodes(dummy);
        originalContentMap.set(el, structure);
        el.innerHTML = '';
        renderNode(el, structure, () => {
            remaining--;
            if (remaining === 0 && sessionId === currentSessionId) {
                restoreAndRedirect();
            }
        }, sessionId);
    });
    function restoreAndRedirect() {
        if (backup.typingEnabled !== null) {
            localStorage.setItem('typingEnabled', backup.typingEnabled);
        } else {
            localStorage.removeItem('typingEnabled');
        }
        if (backup.typingSpeed !== null) {
            localStorage.setItem('typingSpeed', backup.typingSpeed);
        } else {
            localStorage.removeItem('typingSpeed');
        }
        if (backup.hardTypingDisabled !== null) {
            localStorage.setItem('hardTypingDisabled', backup.hardTypingDisabled);
        } else {
            localStorage.removeItem('hardTypingDisabled');
        }
        window.location.href = redirectUrl;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('password.html')) {
        redirectWithTemporaryTypingOverride('home.html', 20);
    } else {
        if (hardTypingDisabled || !typingEnabled) {
            const elements = document.querySelectorAll('.animated');
            elements.forEach(el => {
                const originalHTML = el.innerHTML;
                const dummy = document.createElement('div');
                dummy.innerHTML = originalHTML;
                const structure = parseNodes(dummy);
                originalContentMap.set(el, structure);
                el.innerHTML = '';
                showAll(el, structure);
            });
        } else {
            animateTyping();
        }
    }
});


function showRandomDiv() {
    const container = document.querySelector('#random');
    if (!container) return;
    const children = Array.from(container.children);
    if (children.length === 0) return;
    children.forEach(div => {
        div.style.display = 'none';
    });
    const randomIndex = Math.floor(Math.random() * children.length);
    children[randomIndex].style.display = 'block';
}



// <body onload="showRandomDiv()">
