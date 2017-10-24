# typeOf `lutils-typeof`
Reliable type checks for javascript primitives

```js
import typeOf from "lutils-typeof"

typeOf({}) // "object"
typeOf(5000) // "number"

typeOf.Object({}) // true
typeOf.Object(null) // false

typeOf.object({}) // true
typeOf.string("null") // true

typeOf.Undefined(undefined) // true
typeOf.Boolean(false) // true
typeOf.String("string") // true
typeOf.Function(Function() {}) // true
typeOf.Array([]) // true
typeOf.Null(null) // true
typeOf.Number(600) // true
typeOf.Date(new Date()) // true
typeOf.RegExp(/test/i) // true
typeOf.NaN(NaN) // true
```
