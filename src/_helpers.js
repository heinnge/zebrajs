/**
 *  Private helper method used by {@link $#addClas .addCLass()}, {@link $#removeClass .removeClass()} and
 *  {@link $#toggleClass .toggleClass()} methods.
 *
 *  @param  {string}    action      What to do with the class(es)
 *                                  <br><br>
 *                                  Posssible values are `add`, `remove` and `toggle`.
 *
 *  @param  {string}    class_names One or more space-separated class names to be added/removed/toggled for each element
 *                                  in the set of matched elements.
 *
 *  @return {$}     Returns the set of matched elements (the parents, not the appended elements), for chaining.
 *
 *  @access private
 */
this._class = function(action, class_names) {

    // split by space and create an array
    class_names = class_names.split(' ');

    // iterate through the set of matched elements
    elements.forEach(function(element) {

        // iterate through the class names to add
        class_names.forEach(function(class_name) {

            // add or remove class(es)
            element.classList[action === 'add' || (action === 'toggle' && !element.classList.contains(class_name)) ? 'add' : 'remove'](class_name);

        });

    });

    // return the set of matched elements, for chaining
    return $this;

}

/**
 *  Private helper method used by {@link $#append .append()}, {@link $#appendTo .appendTo()}, {@link $#after .after()},
 *  {@link $#insertAfter .insertAfter()}, {@link $#before .before()}, {@link $#insertBefore .insertBefore()},
 *  {@link $#prepend .prepend()} and {@link $#prependTo .prependTo()} methods.
 *
 *  @param  {mixed}     content     Depending on the caller method this is the DOM element, text node, HTML string, or
 *                                  ZebraJS object to insert in the DOM.
 *
 *  @param  {string}    where       Indicated where the content should be inserted, relative to the set of matched elements.
 *                                  <br><br>
 *                                  Posssible values are `after`, `append` and `before`.
 *
 *  @return {$}     Returns the set of matched elements (the parents, not the appended elements), for chaining.
 *
 *  @access private
 */
this._dom_insert = function(content, where) {

    // if element to append is an $ object, we'll use the array of DOM elements
    if (content instanceof $) content = content.get();

    // if content to append is a DOM element or a text node, wrap it in an array
    else if (content instanceof Element || content instanceof Text) content = [content];

    // if content to append is not a string, don't go further
    else if (typeof content !== 'string') return false;

    // iterate through the set of matched elements
    elements.forEach(function(element) {

        // if content to append is a string (plain text or HTML)
        if (typeof content === 'string')

            // insert content like this
            element.insertAdjacentHTML((where === 'after' || where === 'prepend' ? 'after' : 'before') + (where === 'after' || where === 'append' ? 'end' : 'begin'), content);

        // since content is an array of DOM elements or text nodes
        // iterate over the array
        else content.forEach(function(item, index) {

            // where the content needs to be moved in the DOM
            switch (where) {

                // insert a clone after each target except for the last one after which we insert the original content
                case 'after': element.parentNode.insertBefore(index < elements.length - 1 ? item.cloneNode(true) : item, element.nextSibling); break;

                // add a clone to each parent except for the last one where we add the original content
                case 'append': element.appendChild(index < elements.length - 1 ? item.cloneNode(true) : item); break;

                // insert a clone before each target except for the last one before which we insert the original content
                case 'before': element.parentNode.insertBefore(index < elements.length - 1 ? item.cloneNode(true) : item, element); break;

                // prepend a clone to each parent except for the last one where we add the original content
                case 'prepend': element.insertBefore(index < elements.length - 1 ? item.cloneNode(true) : item, element.firstChild); break;

            }

        });

    });

    // return the set of matched elements, for chaining
    return $this;

}

/**
 *  Private helper method used by {@link $#children .children()} and {@link $#siblings .siblings()} methods.
 *
 *  @param  {string}    action      Specified what type of elements to look for
 *                                  <br><br>
 *                                  Posssible values are `children` and `siblings`.
 *
 *  @param  {string}    selector    If the selector is supplied, the elements will be filtered by testing whether they
 *                                  match it.
 *
 *  @return {$}     Returns the found elements, as a ZebraJS object
 *
 *  @access private
 */
this._dom_search = function(action, selector) {

    var result = [], remove_id, tmp;

    // iterate through the set of matched elements
    elements.forEach(function(element) {

        remove_id = false;

        // if selector is specified
        if (selector) {

            // if we're looking for children nodes and element does not have an ID
            if (action === 'children' && null === element.getAttribute('id'))

                 // generate and set a random ID for the element
                element.setAttribute('id', $this._random('id'));

            // if we're looking for sibling nodes or an element's previous node, and element's parent does not have an ID
            else if ((action === 'siblings' || action === 'previous') && null === element.parentNode.getAttribute('id'))

                 // generate and set a random ID for the element's parent node
                element.parentNode.setAttribute('id', $this._random('id'));

            // set this flag so that we know to remove the randomly generated ID when we're done
            remove_id = true;

        }

        // if we're looking for siblings
        if (action === 'siblings')

            // get the element's parent's children nodes which, optionally, match a given selector
            // and add them to the results array
            result = result.concat(Array.prototype.filter.call(selector ? element.parentNode.querySelectorAll('#' + element.parentNode.id + '>' + selector) : element.parentNode.children, function(child) {

                // skip the current element
                return child !== element;

            }));

        // if we're looking for children
        else if (action === 'children')

            // get the element's children nodes which, optionally, match a given selector
            // and add them to the results array
            result = result.concat(Array.prototype.slice.call(selector ? element.parentNode.querySelectorAll('#' + element.id + '>' + selector) : element.children));

        // if we're looking for children
        else if (action === 'previous')

            // if there's no selector specified
            if (!selector) {

                // a previous sibling exists
                if ((tmp = element.previousElementSibling))

                    // add it to the results array
                    result = result.concat([tmp]);

            // if selector is specified
            } else {

                tmp = [];

                // get the element's sibling nodes which, optionally, match a given selector and add them to the results array
                Array.prototype.filter.call(element.parentNode.querySelectorAll('#' + element.parentNode.id + '>' + selector), function(child) {

                    // add all elements that are before the current element
                    return (tmp.indexOf(element) === -1 && tmp.push(child));

                });

                // add to the results array
                result = result.concat(tmp.length >= 2 ? tmp[tmp.length - 2] : []);

            }

        // if present, remove the randomly generated ID
        if (remove_id)

            // if action was "children", we remove the randomly generated ID from the element
            if (action === 'children') element.removeAttribute('id');

            // otherwise, we remove the randomly generated ID from the element's parent
            else element.parentNode.removeAttribute('id');

    });

    // return the result, as a ZebraJS object
    return $(result);

}

/**
 *  Private helper method
 *
 *  @access private
 */
this._random = function(prefix) {

    // if the internal counter is too large, reset it
    if (internal_counter > Number.MAX_VALUE) internal_counter = 0;

    // return a pseudo-random string by incrementing the internal counter
    return prefix + '_' + internal_counter++;
}
