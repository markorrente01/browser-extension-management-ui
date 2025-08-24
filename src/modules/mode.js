const toggleMode = document.getElementById('mode');
const imgContainer = document.querySelector('.nav-container-item1');
const headerLogo = imgContainer.querySelector('img')
const root = document.documentElement;
export function toggleManager() {
    let theme = localStorage.getItem('theme');
    if (!theme) {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } root.setAttribute('data-theme', theme);
    toggleMode.classList.add(theme)
    localStorage.setItem('theme', theme)

    toggleMode.addEventListener('click', ()=>{
        const curr = root.getAttribute('data-theme');
        const next = curr === 'dark' ? 'light' : 'dark';
        const classToggle = next === 'dark' ? 'dark' : 'light';
        root.setAttribute('data-theme', next);
        localStorage.setItem('theme', next)

        toggleMode.classList.remove('dark', 'light');
        toggleMode.classList.add(classToggle);
    })
}
