// === Constants and DOM elements ===

const userInput = document.getElementById('userInput');
const inputContainer = document.getElementById('inputContainer');

const routes = {
  "home": { 
    url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/home.html', 
    passwords: null 
  },
  "help": { 
    url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/help.html', 
    passwords: null 
  },
  "overview": { 
    url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/overview/overview_1.html', 
    passwords: null 
  },
  "granvalis prime": { 
    url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/planet-information/Granvalis_Prime.html', 
    passwords: null 
  },
  "ventoria": { 
    url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/planet-information/Ventoria.html', 
    passwords: null 
  },
  "mission statment": { 
    url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/general/mission_statment.html', 
    passwords: null 
  },

  // === Protected Routes ===
  "compound": { 
    url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/general/compound.html', 
    passwords: ["Fighold1jdneidj_idvncj1odscin9sdcjn", "Argenta"] 
  },
  "harvest ledger": { 
    url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/general/harvest_ledger.html', 
    passwords: ["Fighold1jdneidj_idvncj1odscin9sdcjn"] 
  },
  "tavian lirae": { 
    url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/people/administratum_leader.html', 
    passwords: ["Fighold1jdneidj_idvncj1odscin9sdcjn", "Argenta", "Private Detective Rieper"] 
  },
  "vx-09k": { 
    url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/people/mechanicus_leader.html', 
    passwords: ["Fighold1jdneidj_idvncj1odscin9sdcjn", "Roooooooombarion"] 
  },
  "fevil mancar": { 
    url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/people/ministorum_leader.html', 
    passwords: ["Fighold1jdneidj_idvncj1odscin9sdcjn", "H1sW1llSh@11"] 
  },
  "daran maron": { 
    url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/people/PDF_Commander.html', 
    passwords: ["Fighold1jdneidj_idvncj1odscin9sdcjn", "CommandInElegance343", "Trommelfeuer", "1nfern0_2950", "Vikka99"] 
  },
  "elira campestris": { 
    url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/people/planetary-govenor-daughter.html', 
    passwords: ["Fighold1jdneidj_idvncj1odscin9sdcjn"] 
  },
  "marcus campestris": { 
    url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/people/planetary-govenor.html', 
    passwords: ["Fighold1jdneidj_idvncj1odscin9sdcjn", "CommandInElegance343", "Private Detective Rieper", "MZhTI33CLOK2z3", "Roooooooombarion", "H1sW1llSh@11"] 
  },
  "nocth": { 
    url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/people/warring_bands.html', 
    passwords: ["Fighold1jdneidj_idvncj1odscin9sdcjn", "Private Detective Rieper", "MZhTI33CLOK2z3"] 
  },
  "carn": { 
    url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/people/warring_leader.html', 
    passwords: ["Fighold1jdneidj_idvncj1odscin9sdcjn"] 
  },
  "church": { 
    url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/planet-information/church.html', 
    passwords: ["Fighold1jdneidj_idvncj1odscin9sdcjn", "H1sW1llSh@11"] 
  },
  "crime intel report": { 
    url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/general/Venner_Underworld_intel.html', 
    passwords: ["Private Detective Rieper"] 
  },
  "admin intel report": { 
    url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/general/Venner_Admin_intel.html', 
    passwords: ["Private Detective Rieper"] 
  },
  "problem intel report": { 
    url: 'https://jayax123.github.io/Warhammer_Jayax/GM%20Campaign%20DataSlate/general/anom_technical_report.html', 
    passwords: ["MZhTI33CLOK2z3"] 
  }
};



const passwordData = {
    "Fighold1jdneidj_idvncj1odscin9sdcjn": ['admin1', 'admin2', 'admin3', 'admin4', 'admin5'],
    "Guest": ['fileOther1', 'fileOther2', 'fileOther3', 'fileOther4', 'fileOther5'],
    "CommandInElegance343": ['gold1', 'gold2','gold3','gold4','gold5'],
    "Trommelfeuer": ['tom1', 'tom2','tom3','tom4','tom5'],
    "1nfern0_2950": ['arg1', 'arg2','arg3','arg4','arg5'],
    "Argenta": ['Argenta1', 'Argenta2','Argenta3','Argenta4','Argenta5'],
    "Roooooooombarion": ['Rom1', 'Rom2','Rom3','Rom4','Rom5'],
    "Vikka99": ['Ros1', 'Ros2','Ros3','Ros4','Ros5'],
    "Private Detective Rieper": ['Ri1', 'Ri2','Ri3','Ri4','Ri5'],
    "MZhTI33CLOK2z3": ['anom1', 'anom2','anom3','anom4','anom5'],
    "H1sW1llSh@11": ['sp1', 'sp2','sp3','sp4','sp5'],
};

// === Persistent animation enabled/disabled flag ===
let animationsEnabled = sessionStorage.getItem('animationsEnabled');
if (animationsEnabled === null) {
    animationsEnabled = true;
} else {
    animationsEnabled = animationsEnabled === 'true';
}

// === Typing animation function ===
async function typeHTML(parent, speed=10) {
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
                    if (newElem.complete)
                        r();
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
        if (el)
            el.style.display = 'none';
    });
}

function showProtected(password) {
    const elIds = passwordData[password];
    if (!elIds)
        return;

    elIds.forEach(elId => {
        const el = document.getElementById(elId);
        if (!el)
            return;

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
        if (el.classList.contains('protected-file') && el.style.display === 'none')
            continue;

        el.style.display = el.tagName.toLowerCase() === 'li' ? 'list-item' : 'block';

        if (el.classList.contains('protected-file') && el.dataset.originalContent) {
            el.innerHTML = el.dataset.originalContent;
            delete el.dataset.originalContent;
        }

        await typeHTML(el, 20);
    }

    if (inputContainer)
        inputContainer.style.display = 'inline-flex';
    if (userInput)
        userInput.focus();
}

// Run the typing sequence on page load:
startTypingSequence();

// === User command input handler ===
if (userInput) {
    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            if (!inputContainer || inputContainer.style.display === 'none')
                return;

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

                if (inputContainer)
                    inputContainer.style.display = 'inline-flex';
                userInput.focus();

                return;
            }

            if (input === 'enable animation') {
                animationsEnabled = true;
                sessionStorage.setItem('animationsEnabled', 'true');
                userInput.value = '';
                userInput.placeholder = 'Animations enabled.';
                return;
            }

            const acceptedPassword = sessionStorage.getItem('acceptedPassword');
            const route = routes[input];

            if (route) {
                if (!route.passwords || route.passwords.includes(acceptedPassword)) {
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

setupPasswordInput({
    inputId: 'passwordInput',
    redirectDelaySeconds: 1,
    redirectURL: 'home.html'
});

//window.addEventListener('load', () => {sessionStorage.clear();});
