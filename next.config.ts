/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',       // включаем статический экспорт
  distDir: 'out',         // папка, в которой Netlify будет искать статические файлы
  experimental: {
    appDir: true
  }
}

module.exports = nextConfig
