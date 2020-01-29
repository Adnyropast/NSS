
/**
 * Swaps two elements of an array.
 */

function array_swap(array, i, j) {/*28/08/2018*/
    var x = array[i];
    array[i] = array[j];
    array[j] = x;
    return array;
}

/* 31/10/2018 * 20/06/2019 */

function array_gather() {
    let res = [];
    
    if(arguments.length > 1) {
        for(var i = 0; i < arguments.length; ++i) {
            res.push.apply(res, array_gather(arguments[i]));
        }
    } else if(arguments.length == 1 && Array.isArray(arguments[0])) {
        for(var i = 0; i < arguments[0].length; ++i) {
            res.push.apply(res, array_gather(arguments[0][i]));
        }
    } else if(arguments.length == 1 && !Array.isArray(arguments[0])) {
        res.push(arguments[0]);
    }
    
    return res;
    
    return arguments[0].flat(Infinity);
}

/* 11/04/2017 * 12/12/2018 */

function array_randomIndex(array) {
    return Math.floor(Math.random() * array.length);
}

/* 11/04/2017 * 12/12/2018 */

function array_random(array) {
    return array[Math.floor(Math.random() * array.length)];
}

//23/06/2017
function array_reversed(array) {
    const reverse = [];
    
    for(let i = 0; i < array.length; ++i) {
        reverse[i] = array[array.length - 1 - i];
    }
    return reverse;
}

function isIterable(object) {
    return object != null && object.length !== undefined;
}

function array_recenter(array, index) {
	const element = array[index];
    
	if(array.includes(element)) while(array.indexOf(element) != Math.floor(array.length / 2)) {
		let step = Math.floor(array.length / 2) - array.indexOf(element);
		
		if(step > 0) {
			array.unshift(array.pop());
		} else if(step < 0) {
            array.push(array.shift());
        }
	}
    
    return array;
}

function array_equal(array1, array2) {
    if(array1 && array2 && array1.length === array2.length) {
        for(let i = 0; i < array1.length; ++i) {
            if(array1[i] != array2[i]) {
                return false;
            }
        }
        
        return true;
    }
    
    return false;
}

function array_bubbleSort(array, compareFn = function(a, b) {
    if(a > b) {return +1;}
    if(a < b) {return -1;}
    return 0;
}) {
    let sorted = true;
    
    while(sorted) {
        sorted = false;
        
        for(let i = 0; i < array.length - 1; ++i) {
            if(compareFn(array[i], array[i+1]) > 0) {
                let x = array[i];
                array[i] = array[i+1];
                array[i+1] = x;
                sorted = true;
            }
        }
    }
    
    return array;
}

function array_shuffle(array) {
    const clone = Array.from(array);
    array.length = 0;
    
    while(clone.length > 0) {
        const index = Math.floor(Math.random() * clone.length);
        
        array.push(clone[index]);
        clone.splice(index, 1);
    }
    
    return array;
}
