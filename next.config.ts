/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // включаем статический экспорт
  distDir: "out", // папка для Netlify
};

module.exports = nextConfig;
