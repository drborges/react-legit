const required = (value) => {
  if (value === null || value === "")
    return Promise.reject("This field is required.")

  return Promise.resolve(value)
}

export default required
