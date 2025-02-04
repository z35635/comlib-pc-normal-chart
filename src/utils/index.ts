export function getPercent(data: any[], field: string) {
  const total = data.reduce((pre, cur) => (pre += cur[field]), 0);
  return data.map((item) => {
    item.percent = `${(item[field] / total).toFixed(2)}%`;
    return item;
  });
}

export function downloadImg(chart, { imageName = '图片', base64 = false }) {
  const canvas = chart.getCanvas();
  const renderer = chart.renderer;
  const canvasDom = canvas.get('el');
  let dataURL = '';
  if (renderer === 'svg') {
    const clone = canvasDom.cloneNode(true);
    const svgDocType = document.implementation.createDocumentType(
      'svg',
      '-//W3C//DTD SVG 1.1//EN',
      'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'
    );
    const svgDoc = document.implementation.createDocument(
      'http://www.w3.org/2000/svg',
      'svg',
      svgDocType
    );
    svgDoc.replaceChild(clone, svgDoc.documentElement);
    const svgData = new XMLSerializer().serializeToString(svgDoc);
    dataURL = 'data:image/svg+xml;charset=utf8,' + encodeURIComponent(svgData);
    if (base64) return dataURL;
    download(dataURL, imageName);
    const img = new Image(); // 创建图片容器承载过渡
    img.src = dataURL;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const context = canvas.getContext('2d');
      context.drawImage(img, 0, 0);
      // TODO 图片信息缺失
      const ImgBase64 = canvas.toDataURL('image/png');
      download(ImgBase64, imageName);
    };
  } else if (renderer === 'canvas') {
    dataURL = canvasDom.toDataURL('image/png');
    if (base64) return dataURL;
    download(dataURL, imageName);
  }
  return dataURL;
}

export const download = (base64: string, imageName: string) => {
  let a: HTMLAnchorElement | null = document.createElement('a');
  a.href = base64;
  a.download = imageName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  a = null;
};

function dataURLtoBlob(dataurl) {
  let arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
// 将blob转换为file
function blobToFile(theBlob, fileName) {
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}
export function dataURLToFile(dataURL: string, fileName: string) {
  const blob = dataURLtoBlob(dataURL);
  return blobToFile(blob, fileName);
}