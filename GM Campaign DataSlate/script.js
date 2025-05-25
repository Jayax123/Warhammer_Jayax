// === Constants and DOM elements ===

const userInput = document.getElementById('userInput');
const inputContainer = document.getElementById('inputContainer');

const routes = {
  "home": { url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/home.html', password: null },
  "help": { url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/help.html', password: null },
  "overview": { url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/overview/overview_1.html', password: null },
  "granvalis prime": { url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/planet-information/Granvalis_Prime.html', password: null },

  // === Admin Password ===
  "compound": { url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/general/compound.html', password: "Fighold1jdneidj_idvncj1odscin9sdcjn" },
  "harvest ledger": { url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/general/harvest_ledger.html', password: "Fighold1jdneidj_idvncj1odscin9sdcjn" },
  "tavian lirae": { url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/people/administratum_leader.html', password: "Fighold1jdneidj_idvncj1odscin9sdcjn" },
  "vx-09k": { url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/people/mechanicus_leader.html', password: "Fighold1jdneidj_idvncj1odscin9sdcjn" },
  "fevil mancar": { url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/people/ministorum_leader.html', password: "Fighold1jdneidj_idvncj1odscin9sdcjn" },
  "daran maron": { url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/people/PDF_Commander.html', password: "Fighold1jdneidj_idvncj1odscin9sdcjn" },
  "elira campestris": { url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/people/planetary-govenor-daughter.html', password: "Fighold1jdneidj_idvncj1odscin9sdcjn" },
  "marcus campestris": { url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/people/planetary-govenor.html', password: "Fighold1jdneidj_idvncj1odscin9sdcjn" },
  "nocth": { url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/people/warring_bands.html', password: "Fighold1jdneidj_idvncj1odscin9sdcjn" },
  "carn1": { url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/people/warring_leader.html', password: "Fighold1jdneidj_idvncj1odscin9sdcjn" },
  "ventoria": { url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/planet-information/Ventoria.html', password: "Fighold1jdneidj_idvncj1odscin9sdcjn" },
};

const passwordData = {
  Fighold1jdneidj_idvncj1odscin9sdcjn: ['admin1','admin2','admin3','admin4','admin5'],
  Guest: ['fileOther1','fileOther2','fileOther3','fileOther4','fileOther5'],
};

// === Persistent animation enabled/disabled flag ===
let animationsEnabled = sessionStorage.getItem('animationsEnabled');
if (animationsEnabled === null) {
  animationsEnabled = true;
} else {
  animationsEnabled = animationsEnabled === 'true';
}

// === Typing animation function ===
async function typeHTML(parent, speed = 10) {
  if (!animationsEnabled) {
    if (parent.dataset.originalContent) {
      parent.innerHTML = parent.dataset.originalContent;
    }
    parent.style.display = parent.tagName.toLowerCase() === 'li' ? 'list-item' : 'block';
    parent.dataset.typedOnce = 'true';
    return Promise.resolve();
  }

  if (parent.dataset.typedOnce === 'true') {
    if (parent.dataset.originalContent) {
      parent.innerHTML = parent.dataset.originalContent;
    }
    parent.style.display = parent.tagName.toLowerCase() === 'li' ? 'list-item' : 'block';
    return Promise.resolve();
  }

  if (!parent.dataset.originalContent) {
    parent.dataset.originalContent = parent.innerHTML;
  }

  const originalNodes = Array.from(parent.childNodes);
  parent.innerHTML = '';
  parent.style.display = parent.tagName.toLowerCase() === 'li' ? 'list-item' : 'block';

  async function typeNode(node, container) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      for (let i = 0; i < text.length; i++) {
        container.appendChild(document.createTextNode(text[i]));
        await new Promise(r => setTimeout(r, speed));
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = node.tagName.toLowerCase();
      const newElem = document.createElement(tag);

      for (let attr of node.attributes) {
        newElem.setAttribute(attr.name, attr.value);
      }

      container.appendChild(newElem);

      if (tag === 'img') {
        await new Promise((r) => {
          newElem.onload = () => r();
          newElem.onerror = () => r();
          if (newElem.complete) r();
        });
        await new Promise(r => setTimeout(r, speed * 5));
        return;
      }

      if (tag === 'br') {
        return;
      }

      for (const child of node.childNodes) {
        await typeNode(child, newElem);
      }
    }
  }

  for (const node of originalNodes) {
    await typeNode(node, parent);
  }

  parent.dataset.typedOnce = 'true';
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

    el.style.display = 'block';

    if (animationsEnabled) {
      el.innerHTML = '';
    } else {
      el.innerHTML = el.dataset.originalContent;
      el.dataset.typedOnce = 'true';
    }
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

// Run the typing sequence on page load:
startTypingSequence();

// === User command input handler ===
if (userInput) {
  userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      if (!inputContainer || inputContainer.style.display === 'none') return;

      const input = userInput.value.trim().toLowerCase();

      if (input === 'disable animation') {
        userInput.value = '';
        userInput.placeholder = 'Animations disabled.';
        
        animationsEnabled = false;
        sessionStorage.setItem('animationsEnabled', 'false');

        const allTypedElements = document.querySelectorAll('[data-type], .protected-file');
        allTypedElements.forEach(el => {
          if (el.dataset.originalContent) {
            el.innerHTML = el.dataset.originalContent;
            el.style.display = el.tagName.toLowerCase() === 'li' ? 'list-item' : 'block';
            el.dataset.typedOnce = 'true';
          }
        });

        if (inputContainer) inputContainer.style.display = 'inline-flex';
        userInput.focus();

        return;
      }

      if (input === 'enable animation') {
        animationsEnabled = true;
        localStorage.setItem('animationsEnabled', 'true');
        userInput.value = '';
        userInput.placeholder = 'Animations enabled.';
        return;
      }

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

  hideAllProtected();

  async function typeAndShowProtected(password) {
    const elIds = passwordData[password];
    if (!elIds) return;

    for (const elId of elIds) {
      const el = document.getElementById(elId);
      if (!el) continue;

      if (!el.dataset.originalContent) {
        el.dataset.originalContent = el.innerHTML;
      }

      el.style.display = 'block';

      if (animationsEnabled) {
        el.innerHTML = '';
        await typeHTML(el, 20);
      } else {
        el.innerHTML = el.dataset.originalContent;
        el.dataset.typedOnce = 'true';
      }
    }
  }

  const acceptedPassword = sessionStorage.getItem('acceptedPassword');

  if (acceptedPassword && passwordData[acceptedPassword]) {
    showProtected(acceptedPassword);
    if (passwordInputContainer) passwordInputContainer.style.display = 'none';
  } else {
    (async () => {
      const hideOnAuthElements = Array.from(document.querySelectorAll('.hide-on-auth'));
      
      for (const el of hideOnAuthElements) {
        el.style.display = el.tagName.toLowerCase() === 'li' ? 'list-item' : 'block';
        await typeHTML(el, 20);
      }

      if (passwordInputContainer) {
        passwordInputContainer.style.display = 'inline-flex';
      }
      if (input) input.focus();
    })();
  }

  if (input) {
    input.addEventListener('keydown', async (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        const entered = input.value.trim();

        if (passwordData[entered]) {
          sessionStorage.setItem('acceptedPassword', entered);

          document.querySelectorAll('.hide-on-auth').forEach(el => {
            el.style.display = 'none';
          });

          if (passwordInputContainer) passwordInputContainer.style.display = 'none';

          hideAllProtected();

          await typeAndShowProtected(entered);

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

setupPasswordInput({
  inputId: 'passwordInput',
  redirectDelaySeconds: 1,
  redirectURL: 'home.html'
});



//window.addEventListener('load', () => {sessionStorage.clear();});