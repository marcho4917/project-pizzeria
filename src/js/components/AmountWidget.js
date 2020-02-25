import {settings, select} from '../settings.js';
import BaseWidget from './BaseWidget.js';

class AmountWidget extends BaseWidget{
  constructor(element) {
    super(element, settings.amountWidget.defaultValue);
    const thisWidget = this;

    thisWidget.getElements(element);
    thisWidget.value = settings.amountWidget.defaultValue;
    thisWidget.initActions();

    //console.log('AmountWidget:', thisWidget);
    //console.log('constructor arguments:', element);
  }

  getElements() {
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }

  isValid(value) {

    return !isNaN(value)
    && value >= settings.amountWidget.defaultMin 
    && value <= settings.amountWidget.defaultMax;
  }

  renderValue() {
    const thisWidget = this;

    thisWidget.dom.input.value = thisWidget.value;
  }

  initActions() {
    const thisWidget = this;

    function changeValue() {
      this.setValue(thisWidget.dom.input.value);
    }
    thisWidget.dom.input.addEventListener('change', changeValue.bind(this));

    function decreaseValue() {
      event.preventDefault();
      this.setValue(this.value - 1);
    }
    thisWidget.dom.linkDecrease.addEventListener('click', decreaseValue.bind(this));
        
    function increaseValue() {
      event.preventDefault();
      this.setValue(this.value + 1);
    }
    thisWidget.dom.linkIncrease.addEventListener('click', increaseValue.bind(this));
  }

}

export default AmountWidget;