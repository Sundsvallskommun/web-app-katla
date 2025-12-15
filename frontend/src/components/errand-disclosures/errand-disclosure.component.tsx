import { AppContext } from '@contexts/app-context-interface';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Disclosure, Divider, FormControl, Label } from '@sk-web-gui/react';
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
  const [open, setOpen] = useState(true);
  const [doneMark, setDoneMark] = useState(false);
  const { errand } = useContext(AppContext);

  useEffect(() => {
    if (doneMark) {
      setOpen(!open);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doneMark]);

  return (
    <FormControl className="w-full" disabled={isErrandReadOnly(errand)}>
      <Disclosure variant="alt" className="w-full mobileVersion" open={open} onToggleOpen={setOpen}>
        <Disclosure.Header>
          <Disclosure.Icon icon={<LucideIcon name={lucideIconName} />} />
          <Disclosure.Title>{header}</Disclosure.Title>
          {doneMark && (
            <Label inverted rounded color="gronsta">
              Komplett
            </Label>
          )}
          <Disclosure.Button />
        </Disclosure.Header>
        <Disclosure.Content>
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
        </Disclosure.Content>
      </Disclosure>
    </FormControl>
  );
};
