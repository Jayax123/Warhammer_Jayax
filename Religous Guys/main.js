function toggleDivs(id1, id2, parentId = null, backgrounds = []) {
    const element1 = document.getElementById(id1);
    const element2 = document.getElementById(id2);
    
    if (!element1 || !element2) {
        console.error('One or both elements not found!');
        return;
    }

    const isElement1Visible = window.getComputedStyle(element1).display !== 'none';
    
    if (isElement1Visible) {
        element1.style.display = 'none';
        element2.style.display = 'block';
        
        if (parentId && backgrounds.length >= 2) {
            const parent = document.getElementById(parentId);
            if (parent) {
                parent.style.backgroundImage = `url('${backgrounds[1]}')`;
            }
        }
    } else {
        element1.style.display = 'block';
        element2.style.display = 'none';
        
        if (parentId && backgrounds.length >= 2) {
            const parent = document.getElementById(parentId);
            if (parent) {
                parent.style.backgroundImage = `url('${backgrounds[0]}')`;
            }
        }
    }
}

function toggleDivsCirc(id1, id2, parentId = null, backgrounds = []) {
    const element1 = document.getElementById(id1);
    const element2 = document.getElementById(id2);
    
    if (!element1 || !element2) {
        console.error('One or both elements not found!');
        return;
    }

    const isElement1Visible = window.getComputedStyle(element1).display !== 'none';
    
    if (isElement1Visible) {
        element1.style.display = 'none';
        element2.style.display = 'flex';
        
        if (parentId && backgrounds.length >= 2) {
            const parent = document.getElementById(parentId);
            if (parent) {
                parent.style.backgroundImage = `url('${backgrounds[1]}')`;
            }
        }
    } else {
        element1.style.display = 'flex';
        element2.style.display = 'none';
        
        if (parentId && backgrounds.length >= 2) {
            const parent = document.getElementById(parentId);
            if (parent) {
                parent.style.backgroundImage = `url('${backgrounds[0]}')`;
            }
        }
    }
}

// Frame activation management
document.addEventListener('click', function(event) {
    const allFrames = document.querySelectorAll('.frame, .frame_circle');
    const clickedInsideFrame = event.target.closest('.frame, .frame_circle');
    
    allFrames.forEach(frame => {
        if (frame !== clickedInsideFrame) {
            frame.classList.remove('active');
        }
    });
    
    if (clickedInsideFrame) {
        clickedInsideFrame.classList.add('active');
    }
});

document.querySelectorAll('.arrow_left, .arrow_right').forEach(arrow => {
    arrow.addEventListener('click', function(e) {
        e.stopPropagation();
    });
});