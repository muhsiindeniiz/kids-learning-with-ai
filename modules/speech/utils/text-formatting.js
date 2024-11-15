const getFirstFourWords = text => {
  const words = text.split(' ').slice(0, 4).join(' ')
  return words.length < text.length ? `${words}...` : words
}

export { getFirstFourWords }
