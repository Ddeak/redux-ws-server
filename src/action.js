import humps from 'humps'

const types = { connect: 'SERVER_CONNECT' }

const actions = {
  connect: (data, app) => ({
    types,
    type: `SERVER_CONNECT`,
    app,
    data
  }),
  response: ({types, type}, data) => {
    var responseType
    for (let key of Object.keys(types)) {
      if (types[key] == type) {
        responseType = types[`${key}Response`] = `${type}_RESPONSE`
        break
      }
    }
    return {
      types,
      type: responseType,
      local: true,
      data
    }
  }
}

const customAction = (typeName, data, app) => {
  const typeValue = humps.decamelize(typeName).toUpperCase()
  const action = {
    types: {[typeName]: typeValue},
    type: typeValue,
    app,
    data
  }
  return action
}

export { actions, customAction }
