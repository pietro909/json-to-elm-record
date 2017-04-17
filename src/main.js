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

const makeNode =
  (level, name, value, type, children) => ({ name, level, value, type, children})

const findNode =
  (name, tree) => {
    const children = tree.children
    for (let child in children) {
      if (children.hasOwnProperty(child) && child.name === name) {
        return child
      }
    }
  }

const appendToNode = (targetName, children, tree) =>
  findNode(targetName, tree).value = children

const parse = (id, node, level = 0) =>
  Object.keys(node).reduce((tree, key) => {
    const val = node[key]
    const astNode = makeNode(level, key)

    if (skip(val)) {
      return tree
    }

    if (isObject(val) && !isArray(val)) {
      return tree
    }

    if (isArray(val)) {
      // TODO: ensure all elements have same type,
      // then can serialize them
      astNode.val = []
    } else if (isString(val)) {
      astNode.value = val
    }
    tree.value.push(astNode)
    return node
  }, makeNode(0, id, [])


const output = document.getElementById('output')
const input = document.getElementById('input')
const onInput = ({ target }) => {
  let result
  try {
    const json = JSON.parse(target.value)
    result = parse(json)
  } catch(e) {
    result = `Invalid JSON: ${e.message}`
  }
  output.value = result
}
input.oninput = onInput
input.value = demo
onInput({ target: input })

