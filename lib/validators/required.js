const required = (value) => {
  if (value === null || value === "")
    return "This field is required."

  return null
}

export default required
