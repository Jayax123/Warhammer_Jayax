// === Constants and DOM elements ===

const userInput = document.getElementById('userInput');
const inputContainer = document.getElementById('inputContainer');

const routes = {
  home: { url: 'https://jayax123.github.io/Warhammer_Jayax/Teck%20Guys/home.html', password: null },
  help: { url: 'https://jayax123.github.io/Warhammer_Jayax/Teck%20Guys/help.html', password: null },
  background: { url: 'https://jayax123.github.io/Warhammer_Jayax/Teck%20Guys/character_information/biograghy1.html', password: null },
  household: { url: 'https://jayax123.github.io/Warhammer_Jayax/Teck%20Guys/household_information/household_information/house_information1', password: null },
  support: { url: 'https://jayax123.github.io/Warhammer_Jayax/Teck%20Guys/household_information/household_support/house_support1', password: null },
  mechanic: { url: 'https://jayax123.github.io/Warhammer_Jayax/Teck%20Guys/household_information/household_mechanics/house_mechanics1', password: null }
};

const passwordData = {
  F3lOGh9: ['fileNomen1','fileNomen2','fileNomen3','fileNomen4','fileNomen5'],
  Guest: ['fileOther1','fileOther2','fileOther3','fileOther4','fileOther5'],
};

// === Typing animation function ===

function typeHTML(parent, speed = 35) {
  return new Promise(async (resolve) => {
    const originalNodes = Array.from(parent.childNodes);
    parent.textContent = '';

    async function typeNode(node, container) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        for (let i = 0; i < text.length; i++) {
          container.appendChild(document.createTextNode(text[i]));
          await new Promise(r => setTimeout(r, speed));
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName.toLowerCase();
        const newElem = document.createElement(node.tagName);
        for (let attr of node.attributes) {
          newElem.setAttribute(attr.name, attr.value);
        }

        container.appendChild(newElem);

        if (tag === 'img') {
          await new Promise((r) => {
            newElem.onload = () => r();
            newElem.onerror = () => r();
            if (newElem.complete) r(); // Already loaded
          });
          await new Promise(r => setTimeout(r, speed * 5));
          return;
        }

        if (tag === 'br') {
          container.appendChild(newElem);
          return;
        };

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

// === Hide/show protected content ===

function hideAllProtected() {
  const allIds = new Set(Object.values(passwordData).flat());
  allIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
}

function showProtected(password) {
  const elIds = passwordData[password];
  if (!elIds) return;

  elIds.forEach(elId => {
    const el = document.getElementById(elId);
    if (!el) return;

    if (!el.dataset.originalContent) {
      el.dataset.originalContent = el.innerHTML;
    }
    el.innerHTML = '';
    el.style.display = 'block';
  });
}

// === Initialize: hide protected, show if accepted ===

const acceptedPassword = sessionStorage.getItem('acceptedPassword');
hideAllProtected();
if (acceptedPassword && passwordData[acceptedPassword]) {
  showProtected(acceptedPassword);
}

// === Typing sequence ===

const elements = document.querySelectorAll('[data-type], .protected-file');

async function startTypingSequence() {
  for (const el of elements) {
    if (el.classList.contains('protected-file') && el.style.display === 'none') continue;

    el.style.display = el.tagName.toLowerCase() === 'li' ? 'list-item' : 'block';

    if (el.classList.contains('protected-file') && el.dataset.originalContent) {
      el.innerHTML = el.dataset.originalContent;
      delete el.dataset.originalContent;
    }

    await typeHTML(el, 20);
  }

  if (inputContainer) inputContainer.style.display = 'inline-flex';
  if (userInput) userInput.focus();
}

startTypingSequence();

// === User command input handler ===
if (userInput) {
  userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      if (!inputContainer || inputContainer.style.display === 'none') return;

      const input = userInput.value.trim().toLowerCase();
      const acceptedPassword = sessionStorage.getItem('acceptedPassword');
      const route = routes[input];

      if (route) {
        if (!route.password || route.password === acceptedPassword) {
          window.location.href = route.url;
        } else {
          userInput.value = '';
          userInput.placeholder = 'Invalid. Type "Help" for commands.';
        }
      } else {
        userInput.value = '';
        userInput.placeholder = 'Invalid. Type "Help" for commands.';
      }
    }
  });
}

// === Password input handling ===

function setupPasswordInput({
  inputId = 'passwordInput',
  redirectDelaySeconds = 1,
  redirectURL = 'home.html'
} = {}) {
  const input = document.getElementById(inputId);
  const passwordInputContainer = document.getElementById('passwordInputContainer') || document.getElementById('inputContainer');

  if (passwordInputContainer) {
    passwordInputContainer.style.display = 'none';
  }

  hideAllProtected();

  async function startTypingSequence() {
    const elements = Array.from(document.querySelectorAll('[data-type], .protected-file'))
      .filter(el => !el.classList.contains('protected-file'));

    for (const el of elements) {
      el.style.display = el.tagName.toLowerCase() === 'li' ? 'list-item' : 'block';
      await typeHTML(el, 20);
    }

    const acceptedPassword = sessionStorage.getItem('acceptedPassword');
    if (!acceptedPassword && passwordInputContainer) {
      passwordInputContainer.style.display = 'inline-flex';
      if (input) input.focus();
    }
  }

  const acceptedPassword = sessionStorage.getItem('acceptedPassword');

  if (acceptedPassword && passwordData[acceptedPassword]) {
    showProtected(acceptedPassword);
    if (passwordInputContainer) passwordInputContainer.style.display = 'none';
  } else {
    startTypingSequence();
  }

  if (input) {
    input.addEventListener('keydown', async (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        const entered = input.value.trim();

        if (passwordData[entered]) {
          sessionStorage.setItem('acceptedPassword', entered);

          if (passwordInputContainer) passwordInputContainer.style.display = 'none';
          document.querySelectorAll('.hide-on-auth').forEach(el => {
            el.style.display = 'none';
          });

          hideAllProtected();
          showProtected(entered);

          const elIds = passwordData[entered];
          for (const elId of elIds) {
            const el = document.getElementById(elId);
            if (el) {
              if (el.dataset.originalContent) {
                el.innerHTML = el.dataset.originalContent;
                delete el.dataset.originalContent;
              }
              await typeHTML(el, 20);
            }
          }

          input.value = '';
          input.placeholder = '';

          setTimeout(() => {
            window.location.href = redirectURL;
          }, redirectDelaySeconds * 1000);
        } else {
          input.value = '';
          input.placeholder = 'Incorrect password. Try again.';
        }
      }
    });
  }
}