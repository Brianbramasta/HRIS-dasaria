import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import { Edit2 } from 'react-feather';

export default function SocialEmergencyCard() {
  return (
    <ExpandCard title="Media Sosial & Kontak Darurat" withHeaderDivider>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label>Facebook</Label>
          <InputField value={''} disabled={true} />
        </div>
        <div>
          <Label>X.com</Label>
          <InputField value={''} disabled={true} />
        </div>
        <div>
          <Label>LinkedIn</Label>
          <InputField value={''} disabled={true} />
        </div>
        <div>
          <Label>Instagram</Label>
          <InputField value={''} disabled={true} />
        </div>
        <div>
          <Label>Nama Kontak Darurat</Label>
          <InputField value={''} disabled={true} />
        </div>
        <div>
          <Label>No. Kontak Darurat</Label>
          <InputField value={''} disabled={true} />
        </div>
        <div>
          <Label>Akun Sosial Media Orang Terdekat</Label>
          <InputField value={''} disabled={true} />
        </div>
        <div>
          <Label>Hubungan dengan Kontak Darurat</Label>
          <div className="pointer-events-none opacity-60">
            <Select
              options={[
                { value: 'orangtua', label: 'Orang Tua' },
                { value: 'saudara', label: 'Saudara' },
                { value: 'pasangan', label: 'Suami/Istri' },
                { value: 'teman', label: 'Teman' },
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