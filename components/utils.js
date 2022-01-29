const base64 = (str) => {
  return btoa(unescape(encodeURIComponent( str )))
}
const ShowSVGImage = ({dataURI}) => {
  const json = atob(dataURI.substring(29));
  const { image } = JSON.parse(json);
  return (
    <img src={image} />
  )
}

const baseSvgSrc = (text, backgroundColor, textColor) => {
  const baseSvg = `<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'> <style>.base { fill: ${textColor}; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='${backgroundColor}' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>${text}</text></svg>`
  return `data:image/svg+xml;base64,${base64(baseSvg)}`
}

export {
  base64,
  ShowSVGImage,
  baseSvgSrc
}
