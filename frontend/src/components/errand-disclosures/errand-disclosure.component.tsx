import { AppContext } from '@contexts/app-context-interface';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Disclosure, Divider, FormControl } from '@sk-web-gui/react';
import { isErrandReadOnly } from '@utils/errand-utils';
import { ReactNode, useContext, useEffect, useState } from 'react';
import { SectionCompletion } from '../errand-disclosures/sectionCompletion.component';

type LucideIconName = React.ComponentProps<typeof LucideIcon>['name'];

export const ErrandDisclosure: React.FC<{
  header: string;
  lucideIconName: LucideIconName;
  children: ReactNode;
  errandInformationSection?: boolean;
}> = ({ header, lucideIconName, children, errandInformationSection }) => {
  const [open, setOpen] = useState(false);
  const [doneMark, setDoneMark] = useState(false);
  const { errand } = useContext(AppContext);

  useEffect(() => {
    setOpen(!open);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doneMark]);

  return (
    <FormControl className="w-full" disabled={isErrandReadOnly(errand)}>
      <Disclosure
        icon={<LucideIcon name={lucideIconName} />}
        header={header}
        variant="alt"
        className="w-full mobileVersion"
        open={open}
        label={doneMark ? 'Komplett' : ''}
        labelColor={'gronsta'}
      >
        {children}
        {errandInformationSection && !isErrandReadOnly(errand) && <Divider className="pt-20" />}
        {!isErrandReadOnly(errand) && (
          <SectionCompletion
            checked={doneMark}
            onChange={() => {
              setDoneMark(!doneMark);
            }}
          />
        )}
      </Disclosure>
    </FormControl>
  );
};
