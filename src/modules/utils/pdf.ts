
// Uggh - I really need this library. There is no good alternative, but it uses
// Workers and seems to be completely incompatible with React Typescript / Modules.
// Best I can think of is to wrap it to hide / isolate the weird / ugly to one place.

// See https://phihag.github.io/pdfform.js/docs/demo.html for setup

let libraryReady: Promise<any>|null = null;

function whenLibraryReady(){
  if(!libraryReady){
    libraryReady = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/pdfform.pdf_js.dist.js';
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }
  return libraryReady;
}


export async function transformPdf(url: string, fieldValues: any){
  await whenLibraryReady();
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  var transformedBuffer = (window as any).pdfform().transform(arrayBuffer, fieldValues);
  return transformedBuffer;
}

export async function downloadUrlForTransformedPdf(url: string, fieldValues: any){
  const transformedBuffer = await transformPdf(url, fieldValues);
  const blob = new Blob([transformedBuffer], { type: 'application/pdf' });
  const dataUrl = URL.createObjectURL(blob);
  return dataUrl;
}

export async function fillAndDownloadPdf(url: string, fieldValues: any){
  const downloadUrl = await downloadUrlForTransformedPdf(url, fieldValues);
  const a = document.createElement('a');
  a.target = '_blank';
  a.download = url.substring(url.lastIndexOf('/') + 1);
  a.href = downloadUrl;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
};
