import humps from 'humps'

export const connect = (data, clientId) => ({
  type: `SERVER_CONNECT`,
  clientId,
  data
})

export const response = ({ type }, data) => ({
  type: `${type}_RESPONSE`,
  data
})

export default { connect, response }
