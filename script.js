class Storage {
  static getItemsFromStorage() {
    return JSON.parse(localStorage.getItem('items'));
  }
  static addItemToStorage(item) {
    const items = Storage.getItemsFromStorage() || [];
    localStorage.setItem('items', JSON.stringify([...items, item]));
  }
  static removeItemFromStorage(item) {
    const items = Storage.getItemsFromStorage() || [];
    const updatedItems = items.filter((i) => i !== item);
    localStorage.setItem('items', JSON.stringify(updatedItems));
  }
  static updateItemInStorage(name) {
    const items = Storage.getItemsFromStorage() || [];
    const updatedItems = items.map((i) => (i !== name ? i : name));
    localStorage.setItem('items', JSON.stringify(updatedItems));
  }
  static clearItemsFromStorage() {
    localStorage.removeItem('items');
  }
}

class Item {
  constructor(itemName) {
    this.item = this.capitalize(itemName);
  }
  capitalize(text) {
    let words = text.trim().toLowerCase().split(' ');
    words = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
    return words.join(' ');
  }
}

class App {
  constructor() {
    this.items = Storage.getItemsFromStorage();
    this.filteredItems = Storage.getItemsFromStorage();
    this.itemInput = document.querySelector('#itemInput');
    this.itemAddBtn = document.querySelector('.item__addBtn');
    this.itemsList = document.querySelector('.itemsList');
    this.filter = document.querySelector('.filters');
    this.filterInput = document.querySelector('#filters__input');
    this.clearAllBtn = document.querySelector('.clearBtn');
    this.initializeListeners();
    this.render();
  }
  initializeListeners() {
    this.itemAddBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.addItem.bind(this)();
    });
    this.clearAllBtn.addEventListener('click', this.clearItems.bind(this));
    this.filterInput.addEventListener('input', this.filterItems.bind(this));
    this.itemsList.addEventListener('click', this.removeItem.bind(this));
  }
  render() {
    if (!this.filteredItems || this.filteredItems.length === 0) {
      this.clearUI();
      return;
    }
    this.filteredItems.forEach((item) => {
      this.addItemToDOM(item);
    });
  }
  clearUI() {
    this.itemsList.classList.add('hide');
    this.filter.classList.add('hide');
    this.clearAllBtn.classList.add('hide');
  }
  resetItem() {
    this.itemInput.value = '';
  }
  addItemToDOM(item) {
    this.itemsList.classList.remove('hide');
    this.filter.classList.remove('hide');
    this.clearAllBtn.classList.remove('hide');
    const listItem = document.createElement('li');
    listItem.className = 'itemsList__item';
    listItem.innerHTML = `
    <span>${item}</span><button>x</button>
    `;
    this.itemsList.append(listItem);
  }
  filterItems() {
    this.filteredItems = this.items.filter((item) =>
      item.toLowerCase().includes(this.filterInput.value.toLowerCase())
    );
    this.filteredItems =
      this.filterInput.value === '' ? this.items : this.filteredItems;
    this.itemsList.innerHTML = '';
    this.filteredItems.forEach((item) => this.addItemToDOM(item));
  }
  addItem() {
    if (!this.itemInput.value) alert('Please enter item name');
    const ifExists = this.items.find(
      (i) => i.toLowerCase() === this.itemInput.value.toLowerCase()
    );
    if (ifExists) {
      alert('Item already exists');
      return;
    }
    const { item } = new Item(this.itemInput.value);
    this.resetItem();
    Storage.addItemToStorage(item);
    this.items = Storage.getItemsFromStorage();
    this.addItemToDOM(item);
  }
  removeItem(e) {
    if (e.target.tagName !== 'BUTTON') return;
    const listItem = e.target.parentElement;
    listItem.remove();
    Storage.removeItemFromStorage(listItem.querySelector('span').textContent);
    this.items = Storage.getItemsFromStorage();
    this.items.length === 0 && this.clearUI();
  }
  clearItems() {
    Storage.clearItemsFromStorage();
    this.items = [];
    this.render();
  }
}

new App();
