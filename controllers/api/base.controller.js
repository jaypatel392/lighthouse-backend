class BaseController {
    constructor() {
      console.log('Initializing base contoller');
    }
  
    static get = (Controller, action) => {
      return (...args) => {
        return new Controller()[action](...args);
      };
    };
  }
  
 module.exports = BaseController;
  