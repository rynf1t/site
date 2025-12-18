/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.ts', './content/**/*.md', './dist/**/*.html'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Times New Roman"', 'Times', 'serif'],
                serif: ['"Times New Roman"', 'Times', 'serif'],
            },
            colors: {
                bg: 'var(--color-bg)',
                text: 'var(--color-text)',
                border: 'var(--color-border)',
                link: 'var(--color-link)',
                ui: 'var(--color-ui)',
                bg2: 'var(--color-bg-alt)',
                text2: 'var(--color-text2)',
                text3: 'var(--color-text)',
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        '--tw-prose-body': theme('colors.text'),
                        '--tw-prose-headings': theme('colors.text'),
                        '--tw-prose-links': theme('colors.link'),
                        '--tw-prose-bold': theme('colors.text'),
                        '--tw-prose-counters': theme('colors.text2'),
                        '--tw-prose-bullets': theme('colors.text2'),
                        '--tw-prose-hr': theme('colors.border'),
                        '--tw-prose-quotes': theme('colors.text2'),
                        '--tw-prose-quote-borders': theme('colors.border'),
                        '--tw-prose-code': 'var(--color-text)',
                        '--tw-prose-pre-code': 'var(--color-text)',
                        '--tw-prose-pre-bg': 'var(--color-bg-alt)',
                        maxWidth: '65ch',
                    },
                },
            }),
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
