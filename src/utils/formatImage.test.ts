import React from 'react';
import { formatImage } from './formatImage';

describe('fungsi formatImage - menampilkan avatar dari URL atau inisial', () => {
  it('mengembalikan inisial ketika nilai gambar null atau kosong', () => {
    const result = formatImage(null, 'Andi');
    const resultNamaKosong = formatImage(null, '');

    expect(result).toBe('A');
    expect(resultNamaKosong).toBe('—');
  });

  it('mengembalikan elemen img ketika nilai gambar tersedia', () => {
    const url = 'http://example.com/avatar.png';
    const name = 'Budi';

    const element = formatImage(url, name);

    expect(React.isValidElement(element)).toBe(true);
    const imgElement = element as React.ReactElement<any>;
    expect(imgElement.type).toBe('img');
    expect(imgElement.props.src).toBe(url);
    expect(imgElement.props.alt).toBe(name);
    expect(imgElement.props.className).toContain('rounded-full');
  });
});

