
export const required = value => (value ? undefined : 'Required')

const validation = (validators = []) => (value) => {
  let errorMsg
  validators.forEach((validator) => {
    const error = validator(value)
    if (error) errorMsg = error
  })
  return errorMsg
}

export default validation
