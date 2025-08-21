function handleBtnToggle() {
     const switchBtn = document.querySelectorAll('.switch');
    const switchContainer = document.querySelectorAll('.switch-container');
    switchContainer.addEventListener('click', ()=>{
      switchContainer.classList.toggle('toggle');
    })
}
function handleModeToggle() {
  const mode = document.querySelector('#mode');
  mode.addEventListener('click', ()=>{
      if (mode.classList.contains('dark')) {
          mode.classList.remove('dark');
          mode.classList.add('light');
      } else {
          mode.classList.add('dark');
          mode.classList.remove('light');
      }
  })
}
