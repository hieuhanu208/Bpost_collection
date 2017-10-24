# Trasposer
A small and fast *"dataKey"* transposer. 

This module turns `here.is[2].some["!data!"]` into
```js
{
	here: {
		is: [
			, , { some: { "!data!": 'a value' } }
		]
	}
}
```

The dataKey syntax is just javascript.  
You can even start the dataKey with an array index to create an array.
```js
new Transposer().transpose( '[1].test', 'test' ) // returns [ , { test: 'test' } ]
```

One usecase of many:
```html
<input name="some.data[0].here" value="1" />
```

#### Install
`npm install transposer`

#### class Transposer( ?data? )
```js
Transposer = require('transposer')
transposer = new Transposer({ some: { data: 1 } })

transposer.get('some.data') // returns 1
transposer.set('some.data.here', 2)
transposer.get('some.data.here') // returns 2
transposer.data.some.data.here // returns 2
```

See `./Transposer.js` for parameter information.

#### .transpose( dataKey, value )
Turns `data.key[1].c` into its represented data structure.
Sets the last key in the string to a value.

Returns null on an invalid dataKey.

```js
new Transposer().transpose('some.data', 100) // returns { some: { data: 100 } }

// or

{ transpose } = require('transposer').prototype
transpose('some.data', 100) // returns { some: { data: 100 } }
```

#### .transposeAll( object )
Transposes all properties of `object`, modifying `object`.
Any dataKey is deleted from the object in place of the transposed parent key.

```js
data = {
	'name[0]': 'Jim'
	'name[1]': 'Bob'
	type: 'person'
}

transposer.transposeAll(data)

data // returns { name: [ 'Jim', 'Bob' ], type: 'person' }
```

#### .set( dataKey or transposedData, value)
Sets a value in `this.data`.

```js
// Both do the same thing
transposer.set('some.data', 1)
transposer.set({ some: { data: 1} })
transposer.data // returns { some: { data: 1 } }
```

#### .get( dataKey or transposedData )
Finds a value in `this.data`.

```js
transposer = new Transposer({ some: { data: 500 } })
// Both yield the same thing (The value is ignored)
transposer.get('some.data') // returns 500
transposer.get({ some: { data: null } })// returns 500
```

#### .merge( obj1, obj2, depth = 16, overwrite = false )
Merges obj2 into obj1, optionally overwriting properties.
Tries to always maintain an object's reference in obj1 unless `overwritten` is `true`.
 