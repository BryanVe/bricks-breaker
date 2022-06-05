export const handleError: HandleError = async (promise) => {
  try {
    const result = await promise

    return [result, undefined]
  } catch (error) {
    console.error(error)

    return [undefined, error as Error]
  }
}
