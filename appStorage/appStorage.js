//(function (_win, _doc) {
	/* copied directly  from the underscore js source
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
	
	var appStorage =  {
    	exec   : function (params) {
    		var that   = this,
    			_p     = params;
    			that.type   = (_p.which === "ls" || _p.which === "ss") ? _p.which : "ls";
    			that.cb   = (_p.func ? _p.func : false);
    			that.args  = _p.args;    
 
    			// short circuit evaluation 
    			return that.cb && that[that.cb].apply(that, that.args);		
    	},
    	ls     : window.localStorage,
    	ss     : window.sessionStorage,
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
    	length : function () {
    		var that = this,
    			type = that.type;
    		return that[type].length;
    	},
    	get    : function (key) {
    		var that = this,
    			type = that.type,
    			val  = that[type].getItem(key);
    		return val && JSON.parse(val);
    	},
    	remove : function (key) {
    		var that = this,
    			type = that.type;
    			that[type].removeItem(key);
    	},
    	clear  : function () {
    		var that = this,
    			type = that.type;
    		that[type].clear();
    		alert("session storage cleared, new length: "+that.length());
    		return true;
    	}
    };
//})(window, document);
