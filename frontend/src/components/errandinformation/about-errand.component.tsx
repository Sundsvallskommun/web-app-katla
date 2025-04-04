import LucideIcon from '@sk-web-gui/lucide-icon';
import { Checkbox, Disclosure, Select } from '@sk-web-gui/react';
import { useState } from 'react';

export const AboutErrand: React.FC = () => {
  const [doneMark, setDoneMark] = useState(false);
  return (
    <Disclosure
      icon={<LucideIcon name="info" />}
      header="Om ärendet"
      variant="alt"
      className="w-full px-32"
      open={true}
      label={doneMark ? 'Komplett' : ''}
      labelColor={'gronsta'}
    >
      <div className="flex flex-col">
        <strong className="mb-10">Ärendetyp*</strong>
        <Select className="w-full">
          {/* {people.map((person) => ( */}
          <Select.Option>Välj ärendetyp</Select.Option>
          {/* ))} */}
        </Select>
      </div>
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
