/**
 *  Retrieves one of the elements matched by the {@link ZebraJS} object.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var elements = $('selector');
 *
 *  // this gets the second DOM element from the list of matched elements
 *  elements.get(1);
 *
 *  @param  {integer}   index   The index (starting from `0`) of the DOM element to return from the list of matched
 *                              elements
 *
 *  @memberof   ZebraJS
 *  @alias      get
 *  @instance
 */
$.fn.get = function(index) {

    // return the matching DOM element
    return this[index];

}
