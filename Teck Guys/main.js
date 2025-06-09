let typingEnabled = JSON.parse(localStorage.getItem('typingEnabled') ?? 'true');
let typingSpeed = parseInt(localStorage.getItem('typingSpeed') ?? '50', 10);
let hardTypingDisabled = JSON.parse(localStorage.getItem('hardTypingDisabled') ?? 'false');

const typingMaxSpeed = 100;
const typingMinSpeed = 0;

let currentSessionId = 0;
const originalContentMap = new WeakMap();

function saveSettings() {
    localStorage.setItem('typingEnabled', JSON.stringify(typingEnabled));
    localStorage.setItem('typingSpeed', typingSpeed.toString());
    localStorage.setItem('hardTypingDisabled', JSON.stringify(hardTypingDisabled));
}

function parseNodes(node) {
    const result = [];
    for (const child of node.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
            const chars = child.textContent.split('');
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

    function next() {
        if (sessionId !== currentSessionId) return;

        if (!typingEnabled || typingSpeed <= 0) {
            showAll(container, structure);
            callback && callback();
            return;
        }

        if (index >= structure.length) {
            callback && callback();
            return;
        }

        const item = structure[index++];
        if (item.type === 'text') {
            container.append(item.content);
            setTimeout(next, typingSpeed);
        } else if (item.type === 'media') {
            container.appendChild(item.node);
            setTimeout(next, typingSpeed);
        } else if (item.type === 'element') {
            const el = document.createElement(item.tag);
            item.attrs.forEach(attr => el.setAttribute(attr.name, attr.value));
            container.appendChild(el);
            renderNode(el, item.children, next, sessionId);
        }
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

    const animateSequentially = (i = 0, sessionId) => {
        if (i >= elements.length) return;
        const el = elements[i];
        const originalHTML = el.innerHTML;
        const dummy = document.createElement('div');
        dummy.innerHTML = originalHTML;

        const structure = parseNodes(dummy);

        originalContentMap.set(el, structure);
        el.innerHTML = '';
        renderNode(el, structure, () => animateSequentially(i + 1, sessionId), sessionId);
    };

    const sessionId = ++currentSessionId;
    animateSequentially(0, sessionId);
}

function restartTyping() {
    const sessionId = ++currentSessionId;
    document.querySelectorAll('.animated').forEach(el => {
        el.innerHTML = '';
        const structure = originalContentMap.get(el);
        if (!structure) return;
        if (typingEnabled && typingSpeed > 0) {
            renderNode(el, structure, null, sessionId);
        } else {
            showAll(el, structure);
        }
    });
}

// Controls

function toggleTyping() {
    typingEnabled = !typingEnabled;
    hardTypingDisabled = false;
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
    console.log(typingSpeed);
    saveSettings();
    restartTyping();
}

function decreaseSpeed() {
    if (hardTypingDisabled) {
        hardTypingDisabled = false;
        typingEnabled = true;
    }

    typingSpeed = Math.min(typingMaxSpeed, typingSpeed + 10); // Increase delay

    if (typingSpeed < typingMinSpeed) typingSpeed = typingMinSpeed; // Clamp to min
    console.log(typingSpeed);
    saveSettings();
    restartTyping();
}

function resetTypingSettings() {
    localStorage.removeItem('typingEnabled');
    localStorage.removeItem('typingSpeed');
    localStorage.removeItem('hardTypingDisabled');
    typingEnabled = true;
    hardTypingDisabled = false;
    typingSpeed = 50;
    location.reload();
}

// Redirect
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

    const sessionId = ++currentSessionId;
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
    animateTyping();
  }
});