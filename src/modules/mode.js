const toggleMode = document.getElementById('mode');
const root = document.documentElement;
export function toggleManager() {
    let theme = localStorage.getItem('theme');
    if (!theme) {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } root.setAttribute('data-theme', theme);
    toggleMode.classList.add(theme)
    localStorage.setItem('theme', theme)

    toggleMode.addEventListener('click', ()=>{
        eventMode()
    })
    toggleMode.addEventListener('keydown', (e)=>{
        if(e.key === 'Enter' || e.code === 'Enter'){
            eventMode();
        }
    })
}
function eventMode(){
    const curr = root.getAttribute('data-theme');
        const next = curr === 'dark' ? 'light' : 'dark';
        const classToggle = next === 'dark' ? 'dark' : 'light';
        root.setAttribute('data-theme', next);
        localStorage.setItem('theme', next)

        toggleMode.classList.remove('dark', 'light');
        toggleMode.classList.add(classToggle);
}
