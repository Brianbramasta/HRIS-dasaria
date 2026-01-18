import { formatCurrency } from './formatCurrency';

describe('fungsi formatCurrency - memformat angka ke mata uang Rupiah', () => {
  it('memformat angka positif menjadi string Rupiah yang benar', () => {
    const result = formatCurrency(1000);

    expect(result).toContain('Rp');
    expect(result.replace(/\s/g, '')).toContain('1.000');
  });

  it('memformat angka nol dengan benar', () => {
    const result = formatCurrency(0);

    expect(result).toContain('Rp');
    expect(result.replace(/\s/g, '')).toContain('0');
  });
});

