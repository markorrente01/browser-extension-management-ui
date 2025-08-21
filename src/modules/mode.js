const toggleMode = document.getElementById('mode');
const root = document.documentElement;
export function toggleManager() {
    if (localStorage.getItem('theme')) {
        root.setAttribute('data-theme', localStorage.getItem('theme'))
    } else {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            root.setAttribute('data-theme', 'dark')
        }
    }

    toggleMode.addEventListener('click', ()=>{
        const curr = root.getAttribute('data-theme');
        const next = curr === 'dark' ? 'light' : 'dark';
        const classToggle = next === 'dark' ? 'dark' : 'light';
        toggleMode.classList.add(classToggle)
        root.setAttribute('data-theme', next);
        localStorage.setItem('theme', next)
    })
}
