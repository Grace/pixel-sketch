let gridContainer = document.querySelector('.grid-container');

var selectedColor = 'black';
function changeColorOnHover(e) {
    console.log(e.target);
    e.target.style.backgroundColor = selectedColor;
}

const newGridBtn = document.querySelector('#new-grid-btn');
newGridBtn.addEventListener('click', (e) => {
    let input = parseInt(prompt("How many squares per side?"));
    let gridContainer = document.querySelector('.grid-container');
    gridContainer.style['grid-template-columns'] = `repeat(${input}, 1fr`;
    createGrid(input);
})


function createGrid(dimensionNumber) {
    let gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(item => gridContainer.removeChild(item));
    for(let i = 0; i < dimensionNumber*dimensionNumber; i++) {
        let gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        gridItem.addEventListener('mouseover', changeColorOnHover);
        gridContainer.appendChild(gridItem);
    }
}

for(let i = 0; i < 16; i++) {
    let gridItem = document.createElement('div');
    gridItem.classList.add('grid-item');
    gridItem.addEventListener('mouseover', changeColorOnHover);
    gridContainer.appendChild(gridItem);
}