import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { Edit2 } from 'react-feather';

export default function BPJSCard() {
  return (
    <ExpandCard title="BPJS" withHeaderDivider>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label>No. BPJS Kesehatan</Label>
          <InputField value={''} disabled={true} />
        </div>
        <div>
          <Label>Status BPJS Kesehatan</Label>
          <InputField value={''} disabled={true} />
        </div>
        <div>
          <Label>No. BPJS Ketenagakerjaan</Label>
          <InputField value={''} disabled={true} />
        </div>
        <div>
          <Label>Status BPJS Ketenagakerjaan</Label>
          <InputField value={''} disabled={true} />
        </div>
        <div>
          <Label>Nominal BPJS TK</Label>
          <InputField value={''} disabled={true} />
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