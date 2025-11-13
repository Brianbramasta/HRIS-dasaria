import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import { Edit2 } from 'react-feather';

export default function SalaryCard() {
  return (
    <ExpandCard title="Salary" withHeaderDivider>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label>Gaji</Label>
          <InputField value={''} disabled={true} />
        </div>
        <div>
          <Label>Bank</Label>
          <div className="pointer-events-none opacity-60">
            <Select
              options={[
                { value: 'bca', label: 'BCA' },
                { value: 'bni', label: 'BNI' },
                { value: 'bri', label: 'BRI' },
                { value: 'mandiri', label: 'Mandiri' },
              ]}
              onChange={() => {}}
              defaultValue={''}
              required={false}
            />
          </div>
        </div>
        <div>
          <Label>Nama Akun Bank</Label>
          <InputField value={''} disabled={true} />
        </div>
        <div>
          <Label>No. Rekening</Label>
          <InputField value={''} disabled={true} />
        </div>
        <div>
          <Label>NPWP</Label>
          <InputField value={''} disabled={true} />
        </div>
        <div>
          <Label>PTKP Status</Label>
          <div className="pointer-events-none opacity-60">
            <Select
              options={[
                { value: 'tk0', label: 'TK/0' },
                { value: 'k0', label: 'K/0' },
                { value: 'k1', label: 'K/1' },
                { value: 'k2', label: 'K/2' },
                { value: 'k3', label: 'K/3' },
              ]}
              onChange={() => {}}
              defaultValue={''}
              required={false}
            />
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="outline" size="sm">
          <Edit2 size={16} className="mr-2" /> Edit
        </Button>
      </div>
    </ExpandCard>
  );
}