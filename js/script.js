let gridContainer = document.querySelector('.grid-container');

var selectedColor = 'black';

function selectRandomColor() {
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColor}`;
}

function randomColorOnHover(e) {
    e.target.style.backgroundColor = selectRandomColor();
}

function changeColorOnHover(e) {
    e.target.style.backgroundColor = selectedColor;
}

const newGridBtn = document.querySelector('#new-grid-btn');
newGridBtn.addEventListener('click', (e) => {
    let input = parseInt(prompt("How many squares per side?"));
    if (input <= 100) {
        gridContainer.style['grid-template-columns'] = `repeat(${input}, 1fr)`;
        createGrid(input);
    } else {
        alert("Please enter a value less than or equal to 100.");
    }
});

// Ensure grid items have the right hover behavior when a new grid is created
function createGrid(dimensionNumber) {
    let gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(item => gridContainer.removeChild(item)); // Remove existing grid items
    
    // Create new grid items
    for (let i = 0; i < dimensionNumber * dimensionNumber; i++) {
        let gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        
        // Apply the correct hover behavior based on the current mode
        if (rainbowModeActive) {
            gridItem.addEventListener('mouseover', randomColorOnHover);
        } else if (shaderModeActive) {
            gridItem.addEventListener('mouseover', shadeColorOnHover);
        } else {
            gridItem.addEventListener('mouseover', changeColorOnHover);
        }
        
        gridContainer.appendChild(gridItem);
    }
}

// Color shading functions borrowed from https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
const pSBC = (p, c0, c1, l) => {
    if (c0 == "black") return;
    let r, g, b, P, f, t, h, m = Math.round, a = typeof (c1) == "string";
    if (typeof (p) != "number" || p < -1 || p > 1 || typeof (c0) != "string" || (c0[0] != 'r' && c0[0] != '#') || (c1 && !a)) return null;
    h = c0.length > 9, h = a ? c1.length > 9 ? true : c1 == "c" ? !h : false : h, f = pSBC.pSBCr(c0), P = p < 0, t = c1 && c1 != "c" ? pSBC.pSBCr(c1) : P ? { r: 0, g: 0, b: 0, a: -1 } : { r: 255, g: 255, b: 255, a: -1 }, p = P ? p * -1 : p, P = 1 - p;
    if (!f || !t) return null;
    if (l) r = m(P * f.r + p * t.r), g = m(P * f.g + p * t.g), b = m(P * f.b + p * t.b);
    else r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5), g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5), b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5);
    a = f.a, t = t.a, f = a >= 0 || t >= 0, a = f ? a < 0 ? t : t < 0 ? a : a * P + t * p : 0;
    if (h) return "rgb" + (f ? "a(" : "(") + r + "," + g + "," + b + (f ? "," + m(a * 1000) / 1000 : "") + ")";
    else return "#" + (4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? m(a * 255) : 0)).toString(16).slice(1, f ? undefined : -2)
}

pSBC.pSBCr = (d) => {
    const i = parseInt;
    let n = d.length, x = {};
    if (n > 9) {
        const [r, g, b, a] = (d = d.split(','));
        n = d.length;
        if (n < 3 || n > 4) return null;
        x.r = i(r[3] == "a" ? r.slice(5) : r.slice(4)), x.g = i(g), x.b = i(b), x.a = a ? parseFloat(a) : -1
    } else {
        if (n == 8 || n == 6 || n < 4) return null;
        if (n < 6) d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (n > 4 ? d[4] + d[4] : "");
        d = i(d.slice(1), 16);
        if (n == 9 || n == 5) x.r = d >> 24 & 255, x.g = d >> 16 & 255, x.b = d >> 8 & 255, x.a = Math.round((d & 255) / 0.255) / 1000;
        else x.r = d >> 16, x.g = d >> 8 & 255, x.b = d & 255, x.a = -1
    } return x
};

function shadeColorOnHover(e) {
    e.target.style.backgroundColor = pSBC(-0.1, e.target.style.backgroundColor);
}

// Keep track of the active mode
let rainbowModeActive = false;
let shaderModeActive = false;

const rainbowModeBtn = document.querySelector('#rainbow-mode-btn');
rainbowModeBtn.addEventListener('click', (e) => {
    rainbowModeActive = true;
    shaderModeActive = false;
    
    let gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(item => item.removeEventListener('mouseover', changeColorOnHover));
    gridItems.forEach(item => item.removeEventListener('mouseover', shadeColorOnHover));
    gridItems.forEach(item => item.addEventListener('mouseover', randomColorOnHover));
});

const shaderModeBtn = document.querySelector('#shader-mode-btn');
shaderModeBtn.addEventListener('click', (e) => {
    shaderModeActive = true;
    rainbowModeActive = false;
    
    let gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(item => item.removeEventListener('mouseover', changeColorOnHover));
    gridItems.forEach(item => item.removeEventListener('mouseover', randomColorOnHover));
    gridItems.forEach(item => item.addEventListener('mouseover', shadeColorOnHover));
});
