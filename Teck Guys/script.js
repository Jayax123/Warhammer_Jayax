const elements = document.querySelectorAll('[data-type]');
const images = document.querySelectorAll('.delayed-img');
const inputContainer = document.getElementById('inputContainer');
const userInput = document.getElementById('userInput');


function typeHTML(parent, speed = 50) {
  return new Promise(async (resolve) => {
    const originalNodes = Array.from(parent.childNodes);
    parent.innerHTML = '';

    async function typeNode(node, container) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        for (let i = 0; i < text.length; i++) {
          container.textContent += text[i];
          await new Promise(r => setTimeout(r, speed));
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {

        if (node.tagName.toLowerCase() === 'br') {
          container.appendChild(document.createElement('br'));
          return;
        }

        const newElem = document.createElement(node.tagName);

        for (let attr of node.attributes) {
          newElem.setAttribute(attr.name, attr.value);
        }

        container.appendChild(newElem);

        for (const child of node.childNodes) {
          await typeNode(child, newElem);
        }
      }
    }

    for (const node of originalNodes) {
      await typeNode(node, parent);
    }

    resolve();
  });
}

async function startTypingSequence() {
  for (const el of elements) {
    el.style.display = 'block';
    await typeHTML(el, 35);
  }

  for (const img of images) {
    await new Promise(r => setTimeout(r, 500));
    img.style.display = 'block';
    requestAnimationFrame(() => {
      img.style.opacity = 1;
    });
  }

  inputContainer.style.display = 'inline-flex';
  userInput.focus();
}

startTypingSequence();


const warningMessage = document.getElementById('warningMessage');

userInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const input = userInput.value.trim().toLowerCase();

    if (input === 'test') {
      window.location.href = 'test.html';
    } else if (input === 'about') {
      window.location.href = 'about.html';
    } else if (input === 'contact') {
      window.location.href = 'contact.html';
    } else {
      userInput.value = '';
      userInput.placeholder = `Invalid type "Help" for a list of commands`;
      return;
    }
    userInput.placeholder = '';
    userInput.value = '';
  }
});

