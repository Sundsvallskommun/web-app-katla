import LucideIcon from '@sk-web-gui/lucide-icon';
import { Checkbox, Disclosure } from '@sk-web-gui/react';
import { useState } from 'react';

export const MedicalOpinion: React.FC = () => {
  const [doneMark, setDoneMark] = useState(false);
  return (
    <Disclosure
      icon={<LucideIcon name="clipboard-signature" />}
      header="Medicinskt utlåtande"
      variant="alt"
      open={false}
      className="w-full"
      label={doneMark ? 'Komplett' : ''}
      labelColor={'gronsta'}
    >
      <div className="mt-24">
        <Checkbox
          onClick={() => {
            setDoneMark(!doneMark);
          }}
          checked={doneMark}
        >
          Markera avsnittet som komplett
        </Checkbox>
      </div>
    </Disclosure>
  );
};
