"""Bundle the prototype into one self-contained HTML file (fonts embedded, no network needed).

usage: python3 -I build.py            -> vehicle-recovery-prototype.html
       python3 -I build.py --fragment <out.html>   -> same page without the document wrapper
"""
import base64
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'src')
FONTS = os.path.join(HERE, 'fonts')


def read(name):
    with open(os.path.join(SRC, name), encoding='utf-8') as f:
        return f.read()


def font(name):
    with open(os.path.join(FONTS, name), 'rb') as f:
        return base64.b64encode(f.read()).decode()


FONT_CSS = ''.join([
    "@font-face{font-family:'Archivo';font-style:normal;font-weight:100 900;font-stretch:62%% 125%%;font-display:swap;src:url(data:font/woff2;base64,%s) format('woff2')}" % font('archivo.woff2'),
    "@font-face{font-family:'Instrument Sans';font-style:normal;font-weight:400 700;font-display:swap;src:url(data:font/woff2;base64,%s) format('woff2')}" % font('instrumentsans.woff2'),
    "@font-face{font-family:'Geist Mono';font-style:normal;font-weight:400 600;font-display:swap;src:url(data:font/woff2;base64,%s) format('woff2')}" % font('geistmono.woff2'),
    "@font-face{font-family:'IBM Plex Sans Arabic';font-style:normal;font-weight:400;font-display:swap;src:url(data:font/woff2;base64,%s) format('woff2')}" % font('plexarabic-400.woff2'),
    "@font-face{font-family:'IBM Plex Sans Arabic';font-style:normal;font-weight:600;font-display:swap;src:url(data:font/woff2;base64,%s) format('woff2')}" % font('plexarabic-600.woff2'),
])

MARK = ('<svg width="32" height="32" viewBox="0 0 36 36" aria-hidden="true"><rect width="36" height="36" rx="10" fill="#E0AA4E"/>'
        '<circle cx="12" cy="24" r="3" fill="#1A1206"/><path d="M12 15a9 9 0 0 1 9 9M12 9a15 15 0 0 1 15 15" fill="none" '
        'stroke="#1A1206" stroke-width="2.4" stroke-linecap="round"/></svg>')
RESTART = ('<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" '
           'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.3-5.7M4 4v5h5"/></svg>')

body = read('body.html').replace('__MARK__', MARK).replace('__RESTART__', RESTART)
js = '\n'.join(read(n) for n in ['art.js', 'core.js', 'customer.js', 'operator.js', 'dispatch.js', 'shell.js'])
js = js.replace("document.addEventListener('DOMContentLoaded', () => Shell.init());",
                "if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => Shell.init()); else Shell.init();")
css = read('styles.css')

head = ('<title>Vehicle Recovery Dubai</title>\n'
        '<meta name="description" content="Interactive prototype of the Vehicle Recovery customer, operator and dispatch apps, set in Dubai.">\n'
        '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 36 36%27%3E%3Crect width=%2736%27 height=%2736%27 rx=%2710%27 fill=%27%23E0AA4E%27/%3E%3Ccircle cx=%2712%27 cy=%2724%27 r=%273%27 fill=%27%231A1206%27/%3E%3Cpath d=%27M12 15a9 9 0 0 1 9 9M12 9a15 15 0 0 1 15 15%27 fill=%27none%27 stroke=%27%231A1206%27 stroke-width=%272.4%27 stroke-linecap=%27round%27/%3E%3C/svg%3E">\n'
        '<style>\n' + FONT_CSS + '\n' + css + '\n</style>\n')
page = head + body + '\n<script>\n"use strict";\n' + js + '\n</script>\n'

if len(sys.argv) > 2 and sys.argv[1] == '--fragment':
    out = sys.argv[2]
    content = page
else:
    out = os.path.join(HERE, 'vehicle-recovery-prototype.html')
    content = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
               '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
               + head + '</head>\n<body>\n' + body + '\n<script>\n"use strict";\n' + js + '\n</script>\n</body>\n</html>\n')
with open(out, 'w', encoding='utf-8') as f:
    f.write(content)
print('wrote', out, len(content.encode()), 'bytes')
