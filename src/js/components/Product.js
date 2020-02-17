import {templates, select, classNames} from '../settings.js';
import {utils} from '../utils.js';
import AmountWidget from './AmountWidget.js';

class Product {
  constructor(id, data) {
    const thisProduct = this;

    thisProduct.id = id;
    thisProduct.data = data;

    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
      
  }

  renderInMenu() {
    const thisProduct = this;

    /*generate HTML based on template*/
    const generatedHTML = templates.menuProduct(thisProduct.data);

    /*create element using utils.createElementFromHTML*/
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      
    /*find menu container*/
    const menuContainer = document.querySelector(select.containerOf.menu);

    /*add element to menu*/
    menuContainer.appendChild(thisProduct.element);
  }

  getElements() {
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }

  initAccordion() {
    const thisProduct = this;

    /* find the clickable trigger (the element that should react to clicking) */
    const clickableTrigger = thisProduct.accordionTrigger;
    //thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      

    /* START: click event listener to trigger */
    clickableTrigger.addEventListener('click', function(event) {
        

      /* prevent default action for event */
      event.preventDefault();

      /* toggle active class on element of thisProduct */
      thisProduct.element.classList.toggle('active');

      /* find all active products */
      const activeProducts = document.querySelectorAll(select.all.menuProductsActive);
      //console.log('active Products:', activeProducts);

      /* START LOOP: for each active product */
      for (let activeProduct of activeProducts) {  

        /* START: if the active product isn't the element of thisProduct */
        if(activeProduct != thisProduct.element) {

          /* remove class active for the active product */
          activeProduct.classList.remove('active');

          /* END: if the active product isn't the element of thisProduct */
        }
        /* END LOOP: for each active product */
      }
      /* END: click event listener to trigger */
    });
  }
  

  initOrderForm() {
    const thisProduct = this;
    //console.log('initOrderForm:', thisProduct);

    thisProduct.form.addEventListener('submit', function(event) {
      event.preventDefault();
      thisProduct.processOrder();
    });

    for (let input of thisProduct.formInputs) {
      input.addEventListener('change', function() {
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function(event) {
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
      
  }

  initAmountWidget () {
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);

    thisProduct.amountWidgetElem.addEventListener('updated', function() {
      thisProduct.processOrder();
    });
  }


  processOrder() {
    const thisProduct = this;
    //console.log('processOrder:', thisProduct);

    /*read all values from form and add it to constant formData*/
    const formData = utils.serializeFormToObject(thisProduct.form);
    //console.log('formData', formData);

    thisProduct.params = {};

    /*make new variable 'price' with value from 'thisProduct.data.price'*/
    let price = thisProduct.data.price;
    //console.log('price is:', price);
      
    /*start loop for each params elements*/
    for(let paramId in thisProduct.data.params) {
      const param = thisProduct.data.params[paramId];
      //console.log('param:',param);

      /*start loop for each option of params*/
      for (let optionId in param.options) {
        const option = param.options[optionId];
        //console.log('option:', option);

        /*if checked option is NOT default than increase 'price' by the price of THIS OPTION*/
        if(formData.hasOwnProperty(paramId) && formData[paramId].includes(optionId) && !option.default) {
          price = price + param.options[optionId].price;
        }
          
        /*else, if default option is NOT checked than reduce 'price' by the price of THIS OPTION*/ 
        else if (!(formData.hasOwnProperty(paramId) && formData[paramId].includes(optionId)) && option.default) {
          price = price - param.options[optionId].price;
        }

        /*make constant and add to it all images for option*/
        const optionImages = thisProduct.imageWrapper.querySelectorAll('.' + paramId + '-' + optionId);
        //console.log('IMAGES:', optionImages);
           
        /*if option is checked ADD to all option images class equal to class 'classNames.menuProduct.imageVisible'*/
        if(formData.hasOwnProperty(paramId) && formData[paramId].includes(optionId)) {
          if(!thisProduct.params[paramId]) {
            thisProduct.params[paramId] = {
              label: param.label,
              options: {},
            };
          }
          thisProduct.params[paramId].options[optionId] = option.label;
          for (let images of optionImages) {
            images.classList.add(classNames.menuProduct.imageVisible);
          }
        }
        /*else - all option images DELETE class equal to class in "classNames.menuProduct.imageVisible"*/
        else {
          for (let images of optionImages) {
            images.classList.remove(classNames.menuProduct.imageVisible);
          }
        }
      /*end loop for each option of params*/
      }
      /*end loop for each params elements*/
    }

    /*multiply price by amount*/
    thisProduct.priceSingle = price;
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;

    /*insert the value of the 'price' variable into thisProduct.priceElem*/
    thisProduct.priceElem.innerHTML = thisProduct.price;

    //this.viewPrice(price);
    //console.log('WIDZISZ:', thisProduct.params);
  }

  /*viewPrice(endPrice) {

      const thisProduct = this;
      let actuallPrice = parseInt(thisProduct.priceElem.innerHTML);

      const idInterval = setInterval (function() {

        if(endPrice > actuallPrice) {
          actuallPrice++;
        } else if (endPrice < actuallPrice) {
          actuallPrice--;
        } else if (endPrice == actuallPrice) {
          clearInterval(idInterval);
        }
        
      }, 500); 
      
    }*/
    
  addToCart() {
    const thisProduct = this;

    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;

    // app.cart.add(thisProduct);

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });

    thisProduct.element.dispatchEvent(event);

  }
}


export default Product;