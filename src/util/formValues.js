export function getFormValues (form) {
  return parseForm(form).values
}

export function setFormValues (form, newValues) {
  const { elements } = parseForm(form)

  for (const [name, value] of Object.entries(newValues)) {
    const element = elements[name]
    if (isMultiSelect(element)) {
      setSelectValues(element, value)
    } else if (Array.isArray(element)) {
      for (const checkbox of element) {
        if (value.includes(checkbox.value)) checkbox.setAttribute('checked', '')
        else checkbox.removeAttribute('checked')
      }
    } else {
      element.value = value
    }
  }
}

export function parseForm (form) {
  let values = {}
  let elements = {}
  for (let element of Array.from(form.elements)) {
    const name = element.name
    let value

    if (element.type === 'checkbox') {
      if (!values[name]) value = null

      if (element.checked) value = (values[name] || []).concat(element.value)
      else value = values[name]

      element = (elements[name] || []).concat(element)
    } else if (element.type === 'radio') {
      if (!values[name]) value = element.value
      element = (elements[name] || []).concat(element)
    } else if (isMultiSelect(element)) {
      value = getSelectValues(element)
    } else if (element.type === 'number') {
      value = element.value !== '' ? Number(element.value) : ''
    } else {
      value = element.value
    }

    values[name] = value
    elements[name] = element
  }
  return { values, elements }
}

function isMultiSelect (element) {
  return element.options && element.multiple
}

function getSelectValues (options) {
  let values = []
  for (const option of Array.from(options)) {
    values = option.selected ? values.concat(option.value) : values
  }
  return values
}

function setSelectValues (options, values) {
  for (const option of Array.from(options)) {
    if (values.includes(option.value)) {
      option.setAttribute('selected', '')
    } else {
      option.removeAttribute('selected')
    }
  }
}
