import { getData } from "./modules/local.js";
import { toggleManager } from "./modules/mode.js";
    const initialData = await getData();
    function DataManager(key, testData) {
        this.key = key;
        this.initialData = testData;
    }
    DataManager.prototype = {
        initialize: function (){
            localStorage.setItem(this.key, JSON.stringify(this.initialData));
        },
        getData: function () {
            const storedData = localStorage.getItem(this.key);
            return storedData ? JSON.parse(storedData) : [];
        },
        saveData: function (data) {
            localStorage.setItem(this.key, JSON.stringify(data))
        }
    };

    function UiManager(dataManager) {
        this.dataManager = dataManager;
        this.elements = {
            gridContainer: document.querySelector('.ext-grid-container'),
            activeBtn: document.querySelector('.active'),
            inactiveBtn: document.querySelector('.inactive'),
            showAll: document.querySelector('.all')
        };
        this.filterBtn = [
            this.elements.activeBtn,
            this.elements.inactiveBtn,
            this.elements.showAll
        ];
    }
    UiManager.prototype = {
        addEventListeners: function () {
            this.elements.activeBtn.addEventListener('click', ()=>{
                this.setFilterBtnActive(this.elements.activeBtn);
                this.renderFilteredItems(this.elements.activeBtn);
            })
            this.elements.inactiveBtn.addEventListener('click', ()=>{
                this.setFilterBtnActive(this.elements.inactiveBtn);
                this.renderFilteredItems(this.elements.inactiveBtn);
            })
            this.elements.showAll.addEventListener('click', ()=>{
                this.setFilterBtnActive(this.elements.showAll);
                this.renderFilteredItems(this.elements.showAll);
            })
        },
        keyboardNav: function () {
            document.addEventListener('keydown', (e)=>{
                const item = Array.from(document.querySelectorAll('.tabItem'));
                const target = e.target;
                const index = item.indexOf(target);
                if(!item.includes(target))return;
                switch (e.key) {
                    case 'Enter':
                    case ' ':
                        e.preventDefault();
                        if (target === this.elements.activeBtn) {
                                this.setFilterBtnActive(this.elements.activeBtn);
                                this.renderFilteredItems(this.elements.activeBtn);
                            } else if(target === this.elements.inactiveBtn){
                                this.setFilterBtnActive(this.elements.inactiveBtn);
                                this.renderFilteredItems(this.elements.inactiveBtn);
                            } else if(target === this.elements.showAll){
                                this.setFilterBtnActive(this.elements.showAll);
                                this.renderFilteredItems(this.elements.showAll);
                            } else if(target.classList.contains('remove-btn')){
                                this.remove(target.dataset.id)
                                console.log(target.dataset.id)
                            } else if(target.classList.contains('switch-container')){
                                this.toggleState(target.dataset.id)
                                console.log(target.dataset.id);
                            }
                        break;
                
                    case 'ArrowDown':
                        e.preventDefault();
                            const nextIndex = (index + 1) % item.length;
                            item[nextIndex].focus();
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                            const prevIndex = (index - 1 + item.length) % item.length;
                            item[prevIndex].focus();
                        break;
                }
                
            })
        },
        setFilterBtnActive: function (activeButton) {
            this.filterBtn.forEach(btn=> btn.classList.remove('state-active'));
            activeButton.classList.add('state-active')
        },
        renderFilteredItems: function (currBtn) {
            const allItems = this.dataManager.getData();
            let itemsToRender = [];
            if (currBtn === this.elements.activeBtn) {
                itemsToRender = allItems.filter(item=>item.isActive)
            } else if (currBtn === this.elements.inactiveBtn) {
                itemsToRender = allItems.filter(item=>!item.isActive)
            } else{
                itemsToRender = allItems;
            }
            this.renderItems(itemsToRender)
        },
        renderItems: function (itemsToRender) {
            this.elements.gridContainer.innerHTML = '';
            itemsToRender.forEach((item)=>{
                const btnActiveToggle = item.isActive ? 'toggle' : '';
                const div = document.createElement('div');
                div.className = 'ext-grid-item';
                div.innerHTML = `
                    <article class="ext-info">
                        <div class="ext-img-container">
                        <img src="${item.logo}" alt="${item.name}">
                        </div>
                        <div class="ext-info-content">
                        <h2 class="ext-title">${item.name}</h2>
                        <p class="ext-content">${item.description}</p>
                        </div>
                        </article>
                        <article class="ext-actions">
                        <button class="remove-btn tabItem" data-id="${item.description}" tabindex="0">Remove</button>
                        <div class="switch-container ${btnActiveToggle} tabItem" tabindex="0" data-id="${item.description}">
                        <div class="switch"></div>
                        </div>
                    </article>
                `;
                const toggleBtn = div.querySelector('.switch-container');
                const removeBtn = div.querySelector('.remove-btn');
                toggleBtn.addEventListener('click', ()=>{
                    this.toggleState(item.description)
                })
                removeBtn.addEventListener('click', ()=>{
                    this.remove(item.description)
                })
                this.elements.gridContainer.appendChild(div);
            })
        },
        remove: function (itemDesc) {
            const allItems = this.dataManager.getData();
            let itemToUpdate = allItems.filter(item=> item.description !== itemDesc);
            this.dataManager.saveData(itemToUpdate);
            this.renderFilteredItems(document.querySelector('.states.state-active'))
        },
        toggleState: function (itemDesc) {
            const allItems = this.dataManager.getData();
            let toggleItems = allItems.find(item=>item.description === itemDesc);
            if (toggleItems) {
                toggleItems.isActive = !toggleItems.isActive;
                this.dataManager.saveData(allItems);
                this.renderFilteredItems(document.querySelector('.states.state-active'));
            }
        },
        // handleModes: function() {
        //     const toggleMode = document.getElementById('mode');
        //     const root = document.documentElement;
        //     function toggleManager() {
        //         let theme = localStorage.getItem('theme');
        //         if (!theme) {
        //             theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        //         } root.setAttribute('data-theme', theme);
        //         toggleMode.classList.add(theme)
        //         localStorage.setItem('theme', theme)

        //         toggleMode.addEventListener('click', ()=>{
        //             const curr = root.getAttribute('data-theme');
        //             const next = curr === 'dark' ? 'light' : 'dark';
        //             const classToggle = next === 'dark' ? 'dark' : 'light';
        //             root.setAttribute('data-theme', next);
        //             localStorage.setItem('theme', next)

        //             toggleMode.classList.remove('dark', 'light');
        //             toggleMode.classList.add(classToggle);
        //         })
        //     }

        // }
    }
    const dataManager = new DataManager('uiData', initialData);
    const uiManager = new UiManager(dataManager);
    dataManager.initialize();
    uiManager.addEventListeners();
    uiManager.keyboardNav();
    uiManager.renderFilteredItems(uiManager.elements.showAll);
    toggleManager()
    // uiManager.handleModes();