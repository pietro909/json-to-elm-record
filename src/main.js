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

const demo = JSON.stringify({
    "match":{
      "path":"/",
      "url":"/",
      "isExact":true,
      "params":{}
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
  }, null, 2)

const getSpaces = level => {
  let spaces = ''
  while (level > 0) {
    level--
    spaces+='  '
  }
  return spaces
}

const format = (arrOfStr, level) => {
  if (isEmpty(arrOfStr)) {
    return ''
  }
  const tabs = getSpaces(level)
  return `{ ` +
    arrOfStr.filter(s => !isEmpty(s)).join(`\n${tabs}, `) +
    `\n${tabs}}`
}

const skip =
  val =>
  isUndefined(val) || isNull(val) ||
  isFunction(val) || isNaN(val) || isDate(val)

const parse = (node, level = 0) =>
  Object.keys(node).reduce((acc, key) => {
    const val = node[key]
    let result

    if (skip(val)) {
      return acc
    }

    if (isObject(val) && !isArray(val)) {
      const nextLevel = level+1
      const parsed = parse(val, nextLevel)
      if (parsed.length > 0) {
        const tabs = getSpaces(nextLevel)
        return [...acc, `${key} = \n${tabs}${format(parsed, nextLevel)}`]
      }
      return acc
    }

    if (isArray(val)) {
      // TODO: ensure all elements have same type,
      // then can serialize them
      result = [...acc, `${key} = []`]
    } else if (isString(val)) {
      result = `${key} = "${val}"`
    } else if (isNumber(val)) {
      result = `${key} = ${val}`
    } else if (isBoolean(val))  {
      const value = val.toString()
      result = `${key} = ${value[0].toUpperCase()}${value.slice(1)}`
    } else {
      result = `${key} = "${val.toString()}"`
    }

    return [...acc, result]
  }, [])


const output = document.getElementById('output')
const input = document.getElementById('input')
const onInput = ({ target }) => {
  let result
  try {
    const json = JSON.parse(target.value)
    result = format(parse(json))
  } catch(e) {
    result = `Invalid JSON: ${e.message}`
  }
  output.value = result
}
input.oninput = onInput
input.value = demo
onInput({ target: input })

