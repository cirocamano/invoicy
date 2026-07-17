const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

const isWatch = process.argv.includes('--watch');

function copyHtml() {
  const src = path.join(__dirname, 'src', 'index.html');
  const dest = path.join(__dirname, 'index.html');
  const html = fs.readFileSync(src, 'utf8');
  // Inline critical CSS and embed html2pdf inline
  const script = `<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"><\/script>`;
  const bundle = `<script>${fs.readFileSync(path.join(__dirname, 'dist', 'app.js'), 'utf8')}<\/script>`;
  const out = html.replace('<!-- INJECT_SCRIPTS -->', `${script}\n    ${bundle}`);
  fs.writeFileSync(dest, out, 'utf8');
  console.log('✓ index.html built');
}

async function build() {
  const result = await esbuild.build({
    entryPoints: [path.join(__dirname, 'src', 'js', 'main.js')],
    bundle: true,
    outfile: path.join(__dirname, 'dist', 'app.js'),
    format: 'iife',
    target: ['es2020'],
    minify: !isWatch,
    sourcemap: isWatch,
    logLevel: 'info',
  });

  copyHtml();
  return result;
}

build().catch(() => process.exit(1));
