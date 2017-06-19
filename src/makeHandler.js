export default (handler) => {
  return async (action, next, broadcast) => {
    try {
      let result = await handler(action)
      if (!result) return
      if (action.broadcast) broadcast(result)
      next(result)
    } catch (error) {
      console.info(`Error occured in processor: ${processor}: ${error}`)
      next({error})
    }
  }
}
