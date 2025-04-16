import { AppContext } from '@contexts/app-context-interface';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button, Dialog } from '@sk-web-gui/react';
import { useContext, useState } from 'react';

export const CancelRegistrationButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { isLoading } = useContext(AppContext);

  const openHandler = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Button variant="secondary" color="vattjom" disabled={isLoading} onClick={openHandler}>
        Avbryt
      </Button>
      <Dialog className="max-w-[36rem]" show={isOpen}>
        <Dialog.Content className="flex flex-col items-center justify-center text-center">
          <LucideIcon color="vattjom" name="hand" size={32} />
          <div className="text-h4">Avbryt registrering</div>
          <div>
            Du har valt att avbryta registreringen. Ej sparad data kommer att gå förlorad. Är du säker att du vill
            avbryta?
          </div>
        </Dialog.Content>
        <Dialog.Buttons className="flex justify-center gap-7">
          <Button className="w-[12.8rem]" variant="secondary" onClick={openHandler}>
            Nej
          </Button>
          <Button className="w-[12.8rem]" variant="primary" onClick={() => window.close()}>
            Ja
          </Button>
        </Dialog.Buttons>
      </Dialog>
    </>
  );
};
