/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    cart: {
      wrapperActive: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    },
    cart: {
      defaultDeliveryFee: 20,
    },
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
  };

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
      price *= thisProduct.amountWidget.value;


      /*insert the value of the 'price' variable into thisProduct.priceElem*/
      

      this.viewPrice(price);

    }

    viewPrice(endPrice) {

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
        
        thisProduct.priceElem.innerHTML = actuallPrice;
      }, 500);
      
    }  
  }

  class AmountWidget {
    constructor(element) {
      const thisWidget = this;

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

      const event = new Event('updated');
      this.element.dispatchEvent(event); 
    }
  }

  const app = {
    initMenu: function() {
      const thisApp = this;
      //console.log('thisApp.data:', thisApp.data);
      
      for(let productData in thisApp.data.products) {
        new Product(productData, thisApp.data.products[productData]);
      }
    },

    initData: function() {
      const thisApp = this;

      thisApp.data = dataSource;
    },

    init: function() {
      const thisApp = this;
      //console.log('*** App starting ***');
      //console.log('thisApp:', thisApp);
      //console.log('classNames:', classNames);
      //console.log('settings:', settings);
      //console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
    },
  };

  app.init();
}
