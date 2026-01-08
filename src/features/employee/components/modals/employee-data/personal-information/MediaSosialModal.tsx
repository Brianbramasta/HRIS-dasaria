// Modal baru: memisahkan input Media Sosial & Kontak Darurat dari modal pendidikan
import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import InputField from '@/components/shared/field/InputField';
import { useMediaSosialModal, MediaSosialForm } from '@/features/employee/hooks/modals/employee-data/personal-information/useMediaSosialModal';

interface Props {
  isOpen: boolean;
  initialData?: MediaSosialForm | null;
  onClose: () => void;
  onSubmit: (data: MediaSosialForm) => void;
  submitting?: boolean;
}

const MediaSosialModal: React.FC<Props> = ({ isOpen, initialData, onClose, onSubmit, submitting = false }) => {
  const { title, form, setForm } = useMediaSosialModal({ isOpen, initialData });

  const content = (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-start">{title}</h2>
        <p className="text-sm text-grey-200 font-semibold">Update your details to keep your profile up-to-date.</p>
      </div>

      <div>
        <h3 className="text-2xl text-[grey] font-semibold">Sosial Media & Kontak darurat</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <InputField
              label="Facebook"
              id="facebook"
              value={form.facebook || ''}
              onChange={(e) => setForm((p) => ({ ...p, facebook: e.target.value }))}
              placeholder="https://www.facebook.com/username"
            />
          </div>
          <div>
            <InputField
              label="X.com"
              id="xCom"
              value={form.xCom || ''}
              onChange={(e) => setForm((p) => ({ ...p, xCom: e.target.value }))}
              placeholder="https://x.com/username"
            />
          </div>
          <div>
            <InputField
              label="Linkedin"
              id="linkedin"
              value={form.linkedin || ''}
              onChange={(e) => setForm((p) => ({ ...p, linkedin: e.target.value }))}
              placeholder="https://www.linkedin.com/in/username"
            />
          </div>
          <div>
            <InputField
              label="Instagram"
              id="instagram"
              value={form.instagram || ''}
              onChange={(e) => setForm((p) => ({ ...p, instagram: e.target.value }))}
              placeholder="https://instagram.com/username"
            />
          </div>
          <div>
            <InputField
              label="Akun Sosial Media Orang Terdekat"
              id="akunSosialMediaTerdekat"
              value={form.akunSosialMediaTerdekat || ''}
              onChange={(e) => setForm((p) => ({ ...p, akunSosialMediaTerdekat: e.target.value }))}
              placeholder="https://..."
              required
            />
          </div>
          <div>
            <InputField
              label="No. Kontak Darurat"
              id="noKontakDarurat"
              value={form.noKontakDarurat || ''}
              onChange={(e) => setForm((p) => ({ ...p, noKontakDarurat: e.target.value }))}
              required
            />
          </div>
          <div>
            <InputField
              label="Nama No. Kontak Darurat"
              id="namaNoKontakDarurat"
              value={form.namaNoKontakDarurat || ''}
              onChange={(e) => setForm((p) => ({ ...p, namaNoKontakDarurat: e.target.value }))}
              required
            />
          </div>
          <div>
            <InputField
              label="Hubungan dengan Kontak Darurat"
              id="hubunganKontakDarurat"
              value={form.hubunganKontakDarurat || ''}
              onChange={(e) => setForm((p) => ({ ...p, hubunganKontakDarurat: e.target.value }))}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Render modal
  return (
    <ModalAddEdit
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={() => onSubmit(form)}
      submitting={!!submitting}
      maxWidth="max-w-5xl"
    />
  );
};

export default MediaSosialModal;
