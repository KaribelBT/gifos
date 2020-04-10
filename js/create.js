const buttonCreate = document.querySelector('#buttonCreate');
const headerBox = document.querySelector('.headerBox');
const searchs = document.querySelector('.search');
const suggestions = document.querySelector('.suggestions');
const tops = document.querySelector('.top');
const instructions = document.querySelector('.instructions');
const cancel = document.querySelector('#cancel');
const begin = document.querySelector('#begin');
const test = document.querySelector('.test');
const closeUno = document.querySelector('#closeUno');

buttonCreate.addEventListener('click', ()=>{
    headerBox.style.display = 'none';
    searchs.style.display = 'none';
    searchResultButtons.style.display = 'none';
    suggestions.style.display = 'none';
    tops.style.display = 'none';
    logoBoxCreate.style.display = 'flex';
    instructions.style.display = 'block';
})

cancel.addEventListener('click', ()=>{
    location.reload()
})

begin.addEventListener('click', ()=>{
    instructions.style.display = 'none';
    test.style.display = 'block';
})

closeUno.addEventListener('click', ()=>{
    location.reload()
})
