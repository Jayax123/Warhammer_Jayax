const elements = document.querySelectorAll('[data-type]');
const images = document.querySelectorAll('.delayed-img');
const inputContainer = document.getElementById('inputContainer');
const userInput = document.getElementById('userInput');

/**
 * Types HTML content inside an element, preserving tags.
 * Types text nodes character-by-character.
 * Shows element nodes immediately and types their children recursively.
 */
function typeHTML(parent, speed = 50) {
  return new Promise(async (resolve) => {
    const originalNodes = Array.from(parent.childNodes);
    parent.innerHTML = ''; // Clear to type fresh

    async function typeNode(node, container) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        for (let i = 0; i < text.length; i++) {
          container.textContent += text[i];
          await new Promise(r => setTimeout(r, speed));
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Special case for <br> tags
        if (node.tagName.toLowerCase() === 'br') {
          container.appendChild(document.createElement('br'));
          return;
        }

        const newElem = document.createElement(node.tagName);

        // Copy attributes if needed (e.g., <b class="something">)
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
    // Make element visible before typing
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

  // Show input prompt after all text and images
  inputContainer.style.display = 'inline-flex';
  userInput.focus();
}

startTypingSequence();

// Handle input commands
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
      // Unknown command
      userInput.value = '';
      userInput.placeholder = `Invalid type "Help" for a list of commands`;
      return;
    }

    // For valid commands
    userInput.placeholder = '';
    userInput.value = '';
  }
});

