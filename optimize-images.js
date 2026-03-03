const sharp = require("sharp");
const fs = require("fs-extra");
const glob = require("glob");
const path = require("path");
const cheerio = require("cheerio");

const SIZES = [480, 768, 1200];
const OUTPUT_DIR = "optimized";

async function optimizeImage(imgPath) {
    const fileName = path.basename(imgPath, path.extname(imgPath));

    for (let size of SIZES) {
        const outputPath = path.join(
            OUTPUT_DIR,
            `${fileName}-${size}.webp`
        );

        await fs.ensureDir(OUTPUT_DIR);

        await sharp(imgPath)
            .resize({ width: size, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(outputPath);

        console.log("Generated:", outputPath);
    }
}

async function processHTML(htmlFile) {
    let content = fs.readFileSync(htmlFile, "utf8");
    const $ = cheerio.load(content);

    const images = $("img");

    for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const src = $(img).attr("src");

        if (!src || !src.startsWith("images/")) continue;

        const imgPath = path.join(__dirname, src);

        if (!fs.existsSync(imgPath)) continue;

        await optimizeImage(imgPath);

        const fileName = path.basename(src, path.extname(src));

        $(img).attr("src", `optimized/${fileName}-768.webp`);
        $(img).attr(
            "srcset",
            `
optimized/${fileName}-480.webp 480w,
optimized/${fileName}-768.webp 768w,
optimized/${fileName}-1200.webp 1200w
`
        );
        $(img).attr(
            "sizes",
            "(max-width:768px) 90vw, 1200px"
        );
        $(img).attr("loading", "lazy");
    }

    fs.writeFileSync(htmlFile, $.html());
}

async function run() {
    const htmlFiles = glob.sync("*.html");

    for (let file of htmlFiles) {
        await processHTML(file);
    }

    console.log("Optimization Complete 🚀");
}

run();