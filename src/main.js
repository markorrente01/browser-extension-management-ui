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
        ]
    }
    UiManager.prototype = {
        addEventListener: function () {
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
                        <button class="remove-btn" data-id="${item.description}">Remove</button>
                        <div class="switch-container ${btnActiveToggle}">
                        <div class="switch" ></div>
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
                this.renderFilteredItems('.states.state-active')
            }
        }
    }

    // initialization
    const dataManager = new DataManager('uiData', initialData);
    const ui = new UiManager(dataManager)
    ui.addEventListener()
    ui.renderFilteredItems(ui.elements.showAll)
    dataManager.initialize()
    dataManager.getData()
    // toggleManager()