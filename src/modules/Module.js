/**
 * plastic Module Prototype
 *
 * @param options
 * @constructor
 */
plastic.modules.Module = function(options) {
    this.options = options;
    this.name = options.name;
};

plastic.modules.Module.prototype.getColor = function(){
    return this.color;
};
