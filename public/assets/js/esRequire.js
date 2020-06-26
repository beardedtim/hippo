export const esRequire = async path => {
  const { default: mod } = await import(path)

  return mod
}