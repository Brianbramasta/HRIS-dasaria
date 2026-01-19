import formatDate, {
  formatDateToISO,
  formatDateToIndonesian,
  formatIndonesianToISO,
} from './formatDate';

describe('fungsi formatDate dan helper terkait - memformat tanggal', () => {
  it('memformat objek Date valid menjadi mm/dd/yyyy menggunakan UTC', () => {
    const date = new Date('2023-01-02T00:00:00Z');

    const result = formatDate(date);

    expect(result).toBe('01/02/2023');
  });

  it('mengembalikan string kosong ketika objek Date tidak valid', () => {
    const invalidDate = new Date('invalid-date');

    const result = formatDate(invalidDate);

    expect(result).toBe('');
  });

  it('memformat string yyyy-mm-dd menjadi mm/dd/yyyy', () => {
    const result = formatDate('2023-12-05');

    expect(result).toBe('12/05/2023');
  });

  it('memformat string tanggal lain yang bisa diparse menjadi mm/dd/yyyy', () => {
    const result = formatDate('2023/01/02');

    expect(result).toBe('01/02/2023');
  });

  it('mengembalikan string kosong untuk string yang tidak bisa diparse', () => {
    const result = formatDate('bukan tanggal');

    expect(result).toBe('');
  });

  it('mengembalikan string kosong untuk nilai undefined atau null', () => {
    expect(formatDate(undefined as any)).toBe('');
    expect(formatDate(null as any)).toBe('');
  });

  it('mengonversi format dd/mm/yyyy ke yyyy-mm-dd dengan benar', () => {
    const result = formatDateToISO('01/02/2023');

    expect(result).toBe('2023-02-01');
  });

  it('mengembalikan string kosong ketika format dd/mm/yyyy tidak valid', () => {
    const result = formatDateToISO('32/13/2023');

    expect(result).toBe('');
  });

  it('mengonversi yyyy-mm-dd ke format Indonesia "DD NamaBulan YYYY"', () => {
    const result = formatDateToIndonesian('2023-06-14');

    expect(result).toBe('14 Juni 2023');
  });

  it('mengembalikan string kosong ketika yyyy-mm-dd tidak valid', () => {
    const result = formatDateToIndonesian('2023-13-40');

    expect(result).toBe('');
  });

  it('mengonversi tanggal Indonesia ke format ISO yyyy-mm-dd', () => {
    const result = formatIndonesianToISO('14 Juni 2003');

    expect(result).toBe('2003-06-14');
  });

  it('mengembalikan string kosong untuk tanggal Indonesia dengan hari tidak valid', () => {
    const result = formatIndonesianToISO('32 Juni 2003');

    expect(result).toBe('');
  });

  it('mengembalikan string kosong untuk bulan Indonesia yang tidak dikenal', () => {
    const result = formatIndonesianToISO('14 Foo 2003');

    expect(result).toBe('');
  });
});

