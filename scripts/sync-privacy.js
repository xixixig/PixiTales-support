const fs = require('fs')
const path = require('path')

const localeDirectory = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(__dirname, '..', '..', 'pixitales-front', 'locales')
const outputFile = process.argv[3]
  ? path.resolve(process.argv[3])
  : path.resolve(__dirname, '..', 'privacy.html')

const locales = [
  { code: 'en-US', file: 'en-US.json', label: 'English (United States)' },
  { code: 'en-GB', file: 'en-GB.json', label: 'English (United Kingdom)' },
  { code: 'zh-Hans', file: 'zh-CN.json', label: '简体中文' },
  { code: 'zh-Hant', file: 'zh-TW.json', label: '繁體中文' },
  { code: 'ja-JP', file: 'ja-JP.json', label: '日本語' },
  { code: 'ko-KR', file: 'ko-KR.json', label: '한국어' },
  { code: 'es-ES', file: 'es-ES.json', label: 'Español' },
  { code: 'de-DE', file: 'de-DE.json', label: 'Deutsch' },
  { code: 'fr-FR', file: 'fr-FR.json', label: 'Français' },
  { code: 'it-IT', file: 'it-IT.json', label: 'Italiano' },
  { code: 'pt-BR', file: 'pt-BR.json', label: 'Português (Brasil)' },
  { code: 'id-ID', file: 'id-ID.json', label: 'Bahasa Indonesia' },
  { code: 'th-TH', file: 'th-TH.json', label: 'ไทย' },
  { code: 'vi-VN', file: 'vi-VN.json', label: 'Tiếng Việt' }
]

const requiredKeys = [
  'title',
  'last_updated',
  'section1_title',
  'section1_text',
  'section2_title',
  'section2_text',
  'section2_item1',
  'section2_item2',
  'section2_item3',
  'section2_item4',
  'section3_title',
  'section3_item1',
  'section3_item2',
  'section3_item3',
  'section4_title',
  'section4_text',
  'section4_item1',
  'section4_item2',
  'section5_title',
  'section5_item1',
  'section5_item2',
  'section5_item3',
  'section6_title',
  'section6_text',
  'section7_title',
  'section7_text',
  'section8_title',
  'section8_text'
]

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function readPrivacy(locale) {
  const filename = path.join(localeDirectory, locale.file)
  const document = JSON.parse(fs.readFileSync(filename, 'utf8'))
  const privacy = document?.register?.privacy
  if (!privacy) throw new Error(`Missing register.privacy in ${filename}`)

  const missing = requiredKeys.filter((key) => !privacy[key])
  if (missing.length) {
    throw new Error(`Missing privacy keys in ${filename}: ${missing.join(', ')}`)
  }

  return privacy
}

function renderSection(locale, privacy, index) {
  const item = (key) => `                    <li>${escapeHtml(privacy[key])}</li>`
  return `            <section id="lang-${locale.code}" class="lang-section${index === 0 ? ' is-active' : ''}" lang="${locale.code}">
                <div class="lang-tag">${locale.code}</div>
                <h1 class="legal-title">${escapeHtml(privacy.title)}</h1>
                <p class="legal-meta">${escapeHtml(privacy.last_updated)}</p>

                <h2 class="legal-heading">${escapeHtml(privacy.section1_title)}</h2>
                <p class="legal-text">${escapeHtml(privacy.section1_text)}</p>

                <h2 class="legal-heading">${escapeHtml(privacy.section2_title)}</h2>
                <p class="legal-text">${escapeHtml(privacy.section2_text)}</p>
                <ul class="legal-list">
${item('section2_item1')}
${item('section2_item2')}
${item('section2_item3')}
${item('section2_item4')}
                </ul>

                <h2 class="legal-heading">${escapeHtml(privacy.section3_title)}</h2>
                <ul class="legal-list">
${item('section3_item1')}
${item('section3_item2')}
${item('section3_item3')}
                </ul>

                <h2 class="legal-heading">${escapeHtml(privacy.section4_title)}</h2>
                <p class="legal-text">${escapeHtml(privacy.section4_text)}</p>
                <ul class="legal-list">
${item('section4_item1')}
${item('section4_item2')}
                </ul>

                <h2 class="legal-heading">${escapeHtml(privacy.section5_title)}</h2>
                <ul class="legal-list">
${item('section5_item1')}
${item('section5_item2')}
${item('section5_item3')}
                </ul>

                <h2 class="legal-heading">${escapeHtml(privacy.section6_title)}</h2>
                <p class="legal-text">${escapeHtml(privacy.section6_text)}</p>

                <h2 class="legal-heading">${escapeHtml(privacy.section7_title)}</h2>
                <p class="legal-text">${escapeHtml(privacy.section7_text)}</p>

                <h2 class="legal-heading">${escapeHtml(privacy.section8_title)}</h2>
                <p class="legal-text">${escapeHtml(privacy.section8_text)}</p>
            </section>`
}

const privacyByLocale = locales.map((locale) => ({ locale, privacy: readPrivacy(locale) }))
const options = locales
  .map(({ code, label }) => `            <option value="${code}">${code} (${label})</option>`)
  .join('\n')
const sections = privacyByLocale
  .map(({ locale, privacy }, index) => renderSection(locale, privacy, index))
  .join('\n\n            <hr class="lang-divider" />\n\n')
const supported = locales.map(({ code }) => `'${code}'`).join(', ')

const html = `<!DOCTYPE html>
<html lang="en-US">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PixiTales Privacy Policy</title>
    <style>
        body { margin: 0; padding: 0; }
        .legal-container {
            min-height: 100vh;
            background: #fff;
            display: flex;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .legal-content { width: 100%; max-width: 720px; padding: 24px 16px 40px; box-sizing: border-box; }
        .legal-title { font-size: 26px; font-weight: 700; color: #000; margin: 8px 0 6px; text-align: center; }
        .legal-meta { font-size: 13px; color: #888; margin: 0 0 20px; text-align: center; }
        .legal-heading { font-size: 16px; font-weight: 700; color: #111; margin: 18px 0 6px; }
        .legal-text { font-size: 14px; color: #444; line-height: 1.6; margin: 0 0 10px; }
        .legal-list { margin: 0 0 10px 18px; padding: 0; font-size: 14px; color: #444; line-height: 1.6; }
        .legal-list li { margin-bottom: 6px; }
        .lang-switch {
            position: fixed;
            top: 12px;
            right: 12px;
            z-index: 1000;
            background: rgba(255, 255, 255, 0.96);
            border: 1px solid #E5E5EA;
            border-radius: 12px;
            padding: 10px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .lang-switch label { display: block; font-size: 12px; color: #666; margin-bottom: 6px; }
        .lang-switch select {
            width: 220px;
            height: 34px;
            border-radius: 10px;
            border: 1px solid #D1D1D6;
            background: #fff;
            padding: 0 10px;
            font-size: 14px;
            color: #111;
            outline: none;
        }
        .lang-section { scroll-margin-top: 72px; display: none; }
        .lang-section.is-active { display: block; }
        .lang-tag {
            display: inline-block;
            font-size: 12px;
            color: #444;
            background: #F2F2F7;
            border: 1px solid #E5E5EA;
            border-radius: 999px;
            padding: 4px 10px;
            margin: 26px 0 8px;
        }
        .lang-divider { border: none; border-top: 1px solid #E5E5EA; margin: 28px 0; display: none; }
        @media (max-width: 480px) {
            .legal-content { padding: 76px 14px 32px; }
            .legal-title { font-size: 22px; }
            .lang-switch { left: 12px; right: 12px; }
            .lang-switch select { width: 100%; }
        }
    </style>
</head>
<body>
    <div class="lang-switch">
        <label for="languageSelector">Language</label>
        <select id="languageSelector" aria-label="Privacy policy language">
${options}
        </select>
    </div>
    <main class="legal-container">
        <div class="legal-content">
${sections}
        </div>
    </main>

    <script>
        (function () {
            const supported = [${supported}]
            const selector = document.getElementById('languageSelector')

            function normalizeLang(input) {
                if (!input) return null
                if (supported.includes(input)) return input
                const lower = String(input).toLowerCase()
                if (lower.startsWith('zh')) {
                    if (lower.includes('hant') || lower.includes('tw') || lower.includes('hk') || lower.includes('mo')) return 'zh-Hant'
                    return 'zh-Hans'
                }
                if (lower.startsWith('en-gb')) return 'en-GB'
                if (lower.startsWith('en')) return 'en-US'
                if (lower.startsWith('ja')) return 'ja-JP'
                if (lower.startsWith('ko')) return 'ko-KR'
                if (lower.startsWith('es')) return 'es-ES'
                if (lower.startsWith('de')) return 'de-DE'
                if (lower.startsWith('fr')) return 'fr-FR'
                if (lower.startsWith('it')) return 'it-IT'
                if (lower.startsWith('pt')) return 'pt-BR'
                if (lower.startsWith('id')) return 'id-ID'
                if (lower.startsWith('th')) return 'th-TH'
                if (lower.startsWith('vi')) return 'vi-VN'
                return null
            }

            function setActiveLanguage(lang) {
                const element = document.getElementById('lang-' + lang)
                if (!element) return
                document.querySelectorAll('.lang-section').forEach(function (section) {
                    const isActive = section === element
                    section.classList.toggle('is-active', isActive)
                    section.setAttribute('aria-hidden', isActive ? 'false' : 'true')
                })
                document.documentElement.lang = element.getAttribute('lang') || 'en-US'
                document.title = element.querySelector('.legal-title').textContent + ' - PixiTales'
                try { history.replaceState(null, '', '#lang-' + lang) } catch (error) {}
                window.scrollTo({ top: 0, behavior: 'smooth' })
            }

            selector.addEventListener('change', function (event) {
                setActiveLanguage(event.target.value)
            })

            const url = new URL(window.location.href)
            const fromParam = normalizeLang(url.searchParams.get('lang'))
            const fromHash = window.location.hash.startsWith('#lang-')
                ? normalizeLang(window.location.hash.replace('#lang-', ''))
                : null
            const fromNavigator = normalizeLang(navigator.language || '')
            const initial = fromParam || fromHash || fromNavigator || 'en-US'
            selector.value = initial
            setActiveLanguage(initial)
        })()
    </script>
</body>
</html>
`

fs.writeFileSync(outputFile, html, 'utf8')
console.log(`Generated ${outputFile} from ${privacyByLocale.length} locale files.`)
