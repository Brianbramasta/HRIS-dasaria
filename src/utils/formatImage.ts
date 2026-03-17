// DOK: Utility menampilkan avatar; jika ada URL, render <img>, jika null tampilkan inisial
import React from 'react';
import { formatUrlFile } from './formatUrlFile';

export function formatImage(value: string | null, name: string): React.ReactElement | string {
  if (!value) {
    return React.createElement('span', { 
      className: 'w-full h-full rounded-full bg-gray-400 text-center flex items-center justify-center text-white'
    }, name.charAt(0) || '—');
  }
  return React.createElement('img', { src: formatUrlFile(value), alt: name, className: 'w-full h-full rounded-full object-cover' });
}
