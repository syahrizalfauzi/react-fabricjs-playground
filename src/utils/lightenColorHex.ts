export default function lightenColorHex(colorHex: string) {
  let { h, s, l } = HexToHSL(colorHex);
  console.log("hex", colorHex);
  console.log("hsl", `hsl(${h}, ${s}, ${l})`);
  l += 40;
  if (l >= 100) l = 100;
  console.log("after hsl", `hsl(${h}, ${s}, ${l})`);

  return `hsl(${h}, ${s}%, ${l}%)`;
  // var R = parseInt(color.substring(1, 3), 16);
  // var G = parseInt(color.substring(3, 5), 16);
  // var B = parseInt(color.substring(5, 7), 16);

  // R = (R * (100 + percent)) / 100;
  // G = (G * (100 + percent)) / 100;
  // B = (B * (100 + percent)) / 100;

  // R = R < 255 ? R : 255;
  // G = G < 255 ? G : 255;
  // B = B < 255 ? B : 255;

  // var RR = R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16);
  // var GG = G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16);
  // var BB = B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16);

  // return "#" + RR + GG + BB;
}

function HexToHSL(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)!;

  var r = parseInt(result[1], 16);
  var g = parseInt(result[2], 16);
  var b = parseInt(result[3], 16);

  (r /= 255), (g /= 255), (b /= 255);
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h: any,
    s: any,
    l: any = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  s = s * 100;
  s = Math.round(s);
  l = l * 100;
  l = Math.round(l);
  h = Math.round(360 * h);

  return { h, s, l };
}
