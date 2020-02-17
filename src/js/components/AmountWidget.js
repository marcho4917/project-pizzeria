import {settings, select} from '../settings.js';

class AmountWidget {
  constructor(element) {
      
    this.getElements(element);
    this.value = settings.amountWidget.defaultValue;
    this.setValue(this.input.value);
    this.initActions();

    //console.log('AmountWidget:', thisWidget);
    //console.log('constructor arguments:', element);
  }

  getElements(element) {

    this.element = element;
    this.input = this.element.querySelector(select.widgets.amount.input);
    this.linkDecrease = this.element.querySelector(select.widgets.amount.linkDecrease);
    this.linkIncrease = this.element.querySelector(select.widgets.amount.linkIncrease);
  }

  setValue(value) {

    const newValue = parseInt(value);
      
    /*validation*/
    if(newValue != this.value && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax) {
      this.value = newValue;
      this.announce();
    }

    this.input.value = this.value;
  }

  initActions() {

    function changeValue() {
      this.setValue(this.input.value);
    }
    this.input.addEventListener('change', changeValue.bind(this));

    function decreaseValue() {
      event.preventDefault();
      this.setValue(this.value - 1);
    }
    this.linkDecrease.addEventListener('click', decreaseValue.bind(this));
        
    function increaseValue() {
      event.preventDefault();
      this.setValue(this.value + 1);
    }
    this.linkIncrease.addEventListener('click', increaseValue.bind(this));
  }

  announce() {

    const event = new CustomEvent('updated', {
      bubbles: true
    });
    this.element.dispatchEvent(event); 
  }
}

export default AmountWidget;