function separate_extension(fullname: string): {
  name: string,
  ext: string
} {
  // Word after last dot is file extension, others contribute to name
  const [ext, ...rest] = fullname.split('.').reverse()
  const name = rest.reverse().join('.') // Reverse to get original order
  return { name, ext }
}

export default separate_extension
