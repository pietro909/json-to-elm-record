import {
  isUndefined,
  isNull,
  isFunction,
  isNaN,
  isDate,
  isObject,
  isArray,
  isString,
  isNumber,
  isBoolean,
  isEmpty,
} from 'lodash'

let output, input, button, buttonClean
setTimeout(() => {
  output = document.getElementById('output')
  input = document.getElementById('input')
  buttonClean = document.getElementById('clean')
  buttonClean.onclick = clean
  button = document.getElementById('parse')
  button.onclick = doIt
  demo()
})

const format = arrOfStr => isEmpty(arrOfStr) ? "" : "{"+arrOfStr.filter(s => !isEmpty(s)).join(",")+"}"
const skip =
  val =>
  isUndefined(val) || isNull(val) ||
  isFunction(val) || isNaN(val) || isDate(val)

const parse = (node) =>
  Object.keys(node).reduce((acc, key) => {
    const val = node[key]
    let result

    if (skip(val)) {
      return acc
    }

    if (isObject(val) && !isArray(val)) {
      return [...acc, format(parse(val))]
    }

    if (isArray(val)) {
      // TODO: ensure all elements have same type
      result = [...acc, `${key} = []`]
    } else if (isString(val)) {
      result = `${key} = "${val}"`
    } else if (isNumber(val) || isBoolean(val)) {
      result = `${key} = ${val}`
    } else {
      result = `${key} = "${val.toString()}"`
    }

    return [...acc, result]
  }, [])

function doIt() {
  try {
    const json = JSON.parse(input.value)
    const result = format(parse(json))
    console.log(result)
    output.value = result
  } catch(e) {
    alert(e)
  }
}

function clean() {
  input.value = ""
  output.value = ""
}

function demo() {
  input.value = JSON.stringify({
    "match":{
      "path":"/",
      "url":"/",
      "isExact":true,
      "params":{

      }
    },
    "location":{
      "pathname":"/",
      "search":"",
      "hash":""
    },
    "history":{
      "length":3,
      "action":"POP",
      "location":{
        "pathname":"/",
        "search":"",
        "hash":""
      }
    }
  })
  doIt()
}

