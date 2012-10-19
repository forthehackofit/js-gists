	/* copied directly  from the underscore js source
	 * underscore has a very light footprint 4kb compressed
	 * I highly recommend using it but for the sake of brevity here
	 * I'll just extract a couple things from it
	 * http://underscorejs.org/underscore.js
	 */                                                                
	var ArrayProto 		   = Array.prototype,
		nativeForEach      = ArrayProto.forEach,
		breaker = {},
		_has = function(obj, key) {
		    return hasOwnProperty.call(obj, key);
		};
	/* The cornerstone, an `each` implementation, aka `forEach`.
     * Handles objects with the built-in `forEach`, arrays, and raw objects.
     * Delegates to **ECMAScript 5**'s native `forEach` if available.
     */
	var _each = function(obj, iterator, context) {
	    if (obj == null) return;
	    if (nativeForEach && obj.forEach === nativeForEach) {
	      obj.forEach(iterator, context);
	    } else if (obj.length === +obj.length) {
	      for (var i = 0, l = obj.length; i < l; i++) {
	        if (iterator.call(context, obj[i], i, obj) === breaker) return;
	      }
	    } else {
	      for (var key in obj) {
	        if (_has(obj, key)) {
	          if (iterator.call(context, obj[key], key, obj) === breaker) return;
	        }
	      }
	    }
	};
	
	/*
	 * Storage object to easily add one or multiple records at a time
	 * it accommodates storing arrays or object structures by serializing
	 * input and unserializing them as output
	 * assumes the presence of window.JSON.stringify and window.JSON.parse
	 * you could add Douglas Crockford solutions as backup if those don't exist 
	 * in the window global
	 */
	var appStorage =  {
		/**
		 * the main and the only method that should be used to do CRUD with storage
		 * @param {object} params expects three argument :
		 * - "which" : "ls" or "ss" for local or session storage
		 * - "func"  : "set", "get", "length", "remove" or "clear" which calls one of the same named method and performs that action
		 * - "args"  : array of key pairs to be store [{"keyName" : "keyVal"}] keyVal can be a string, an array or an object
		 */
    	exec   : function (params) {
    		var that   = this,
    			_p     = params;
    			that.type   = (_p.which === "ls" || _p.which === "ss") ? _p.which : "ls";
    			that.cb   = (_p.func ? _p.func : false);
    			that.args  = _p.args;    
 
    			// short circuit evaluation 
    			return that.cb && that[that.cb].apply(that, that.args);		
    	},
    	/**
    	 * local copy of localStorage
    	 */
    	ls     : window.localStorage,
    	/**
    	 * local copy of sessionStorage
    	 */
    	ss     : window.sessionStorage,
    	/**
    	 * the set method add a new record
    	 */
    	set    : function (options) {
    		var that = this,
    			type = that.type;

    		_each(options, function(val, key) {
    			try {
					that[type].setItem(key, JSON.stringify(val));
				} catch (e) {
					if (e == QUOTA_EXCEEDED_ERR) {
						alert("Quota exceeded!");
					}
				}
    		});
    	},
    	/**
    	 * the length method checks for the length
    	 */
    	length : function () {
    		var that = this,
    			type = that.type;
    		return that[type].length;
    	},
    	/**
    	 * the get method retrieves a record
    	 */
    	get    : function (key) {
    		var that = this,
    			type = that.type,
    			val  = that[type].getItem(key);
    		return val && JSON.parse(val);
    	},
    	/**
    	 * the remove method deletes a record
    	 */
    	remove : function (key) {
    		var that = this,
    			type = that.type;
    			that[type].removeItem(key);
    	},
    	/**
    	 * the clear method wipes the specified storage type clean
    	 * use carefully
    	 */
    	clear  : function () {
    		var that = this,
    			type = that.type;
    		that[type].clear();
    		alert("session storage cleared, new length: "+that.length());
    		return true;
    	}
    };