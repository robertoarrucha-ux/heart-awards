
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  experimental: {
    cpus: 1,
    workerThreads: false,
    webpackBuildWorker: false,
  },
  serverExternalPackages: ['firebase-admin'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'theglobal.school',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'www.yucatan.gob.mx' },
      { protocol: 'https', hostname: 'www.ambitojuridico.com' },
      { protocol: 'https', hostname: 'marketinginsiderreview.com' },
      { protocol: 'https', hostname: 'www.operala.org' },
      { protocol: 'https', hostname: 'static.wixstatic.com' },
      { protocol: 'https', hostname: 'tequilainteligente.com' },
      { protocol: 'https', hostname: 'mentesalacarta.com' },
      { protocol: 'https', hostname: 'gentemotivandogente.com' },
      { protocol: 'https', hostname: 'amigosdelbellasartes.org.ar' },
      { protocol: 'https', hostname: 'premiosverdes.org' },
      { protocol: 'https', hostname: 'sambito.com.ec' },
      { protocol: 'https', hostname: 'www.diariosustentable.com' },
      { protocol: 'https', hostname: 'www.tigres.com.mx' },
      { protocol: 'https', hostname: 'heraldodemexico.com.mx' },
      { protocol: 'https', hostname: 'www.radioformula.com.mx' },
      { protocol: 'https', hostname: 'www.razon.com.mx' },
      { protocol: 'https', hostname: 'www.anahuac.mx' },
      { protocol: 'https', hostname: 'www.excelsior.com.mx' },
      { protocol: 'https', hostname: 'www.eluniversal.com.mx' },
      { protocol: 'https', hostname: 'www.eltiempo.com' },
    ],
  },
};

export default nextConfig;
