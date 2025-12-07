// DOK: Utility menampilkan avatar; jika ada URL, render <img>, jika null tampilkan inisial
import React from 'react';
import { formatUrlFile } from './formatUrlFile';

export function formatImage(value: string | null, name: string): React.ReactElement | string {
  if (!value) {
    return name.charAt(0) || '—';
  }
  return React.createElement('img', { src: formatUrlFile(value), alt: name, className: 'w-full h-full rounded-full object-cover' });
}
