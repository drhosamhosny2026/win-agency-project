import fs from "node:fs";
const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
const pdfBuffer = fs.readFileSync("c:/Users/g/Desktop/win-agency-file.pdf");

async function dump(pageNum) {
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(pdfBuffer) }).promise;
  const page = await pdf.getPage(pageNum);
  const ops = await page.getOperatorList();
  const objs = page.objs;
  const viewport = page.getViewport({ scale: 1 });
  let ctm = [1, 0, 0, 1, 0, 0];
  const stack = [];
  const list = [];

  for (let i = 0; i < ops.fnArray.length; i++) {
    const fn = ops.fnArray[i];
    const args = ops.argsArray[i];
    if (fn === 10) stack.push([...ctm]);
    else if (fn === 11) ctm = stack.pop() ?? ctm;
    else if (fn === 12)
      ctm = [
        args[0] * ctm[0] + args[2] * ctm[1],
        args[1] * ctm[0] + args[3] * ctm[1],
        args[0] * ctm[2] + args[2] * ctm[3],
        args[1] * ctm[2] + args[3] * ctm[3],
        args[0] * ctm[4] + args[2] * ctm[5] + ctm[4],
        args[1] * ctm[4] + args[3] * ctm[5] + ctm[5],
      ];
    else if (fn === 85 || fn === 86) {
      const name = args[0];
      try {
        const img = await objs.get(name);
        if (!img?.width) continue;
        const w = img.width * Math.hypot(ctm[0], ctm[1]);
        const h = img.height * Math.hypot(ctm[2], ctm[3]);
        list.push({
          name,
          iw: img.width,
          ih: img.height,
          dw: Math.round(w),
          dh: Math.round(h),
          x: Math.round(ctm[4]),
          y: Math.round(viewport.height - ctm[5] - h),
        });
      } catch {}
    }
  }
  console.log(`\n=== Page ${pageNum} (${list.length} images) ===`);
  list
    .sort((a, b) => a.y - b.y || a.x - b.x)
    .forEach((l) =>
      console.log(`${l.name} native ${l.iw}x${l.ih} draw ${l.dw}x${l.dh} @ ${l.x},${l.y}`)
    );
}

for (const p of [8, 9]) await dump(p);
