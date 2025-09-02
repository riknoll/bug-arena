const path = require("path");
const fs = require("fs");

const PNG = require("pngjs").PNG;

const assetsDir = path.resolve(__dirname, "..", "assets", "raw");

const palette = [
    "#000000",
    "#FDFFCD",
    "#FF384E",
    "#FF7F38",
    "#FFB838",
    "#D6FF5D",
    "#41736E",
    "#47DF6F",
    "#4886BE",
    "#4BB1D3",
    "#8C1E4E",
    "#D7DFE2",
    "#8C9193",
    "#4E585B",
    "#2E3948",
    "#0E1132"
].map(parseColor);

let outTs = "";

for (const file of fs.readdirSync(assetsDir)) {
    const ext = path.extname(file);
    if (ext === ".png") {
        const fullPath = path.join(assetsDir, file);

        const data = fs.readFileSync(fullPath);
        const png = PNG.sync.read(data);

        let spriteName = name = path.basename(file, ext);

        const parts = spriteName.split("-");
        let width = png.width;
        let height = png.height;
        let frames = 1;

        if (parts.length > 1) {
            spriteName = parts[0];
            width = parseInt(parts[1]);
            height = parseInt(parts[2]);
            frames = Math.floor(png.width / width)
        }

        const colorData = new Uint8Array(width * height * frames);

        for (let x = 0; x < png.width; x++) {
            for (let y = 0; y < png.height; y++) {
                const idx = (png.height * x + y) << 2;
                const r = png.data[idx];
                const g = png.data[idx + 1];
                const b = png.data[idx + 2];
                const a = png.data[idx + 3];

                let bestColor = 0;
                if (a < 128) {
                    bestColor = 0;
                }
                else {
                    let bestDiff = Infinity;
                    for (let i = 0; i < palette.length; i++) {
                        const pr = palette[i].r;
                        const pg = palette[i].g;
                        const pb = palette[i].b;
                        const dr = r - pr;
                        const dg = g - pg;
                        const db = b - pb;
                        const diff = dr * dr + dg * dg + db * db;
                        if (diff < bestDiff) {
                            bestDiff = diff;
                            bestColor = i;
                        }
                    }
                }
                colorData[png.height * x + y] = bestColor;
            }
        }

        const frameImages = []
        for (let frame = 0; frame < frames; frame++) {
            frameImages.push(readImage(colorData, width, height, frame, frames));
        }

        outTs += `    // ${file}\n`;
        outTs += `    //% whenUsed\n`;
        if (frameImages.length === 1) {
            outTs += `    export const ${spriteName} = ${indentAfterFirstLine(frameImages[0], 4)};\n\n`;
        }
        else {
            outTs += `    export const ${spriteName} = [\n${indent(frameImages.join(",\n"), 8)}\n    ];\n\n`;
        }
    }
}

outTs = `// Auto-generated file. Do not edit.\n\n
namespace hourOfAi.imgs {
${outTs}
}
`;

const outPath = path.resolve(__dirname, "..", "assets", "built.ts");

fs.writeFileSync(outPath, outTs);

console.log("done");

function readImage(colorData, width, height, frame, frames) {
    let out = "";

    for (let y = 0; y < height; y++) {
        let row = "";
        for (let x = 0; x < width; x++) {
            const absX = frame * width + x;
            const idx = y * width * frames + absX;
            const color = colorData[idx];
            row += ".123456789ABCDEF".charAt(color) + " ";
        }
        out += row.trim() + "\n";
    }
    return `img\`\n${indent(out.trim(), 4)}\n\``;
}

function parseColor(color) {
    color = color.replace("#", "");
    const r = parseInt(color.slice(0, 2), 16);
    const g = parseInt(color.slice(2, 4), 16);
    const b = parseInt(color.slice(4, 6), 16);
    return { r, g, b };
}

function indent(text, spaces) {
    let pad = "";
    for (let i = 0; i < spaces; i++) pad += " ";
    return pad + text.replace(/\n/g, "\n" + pad);
}

function indentAfterFirstLine(text, spaces) {
    const lines = text.split("\n");

    return lines[0] + "\n" + indent(lines.slice(1).join("\n"), spaces);
}