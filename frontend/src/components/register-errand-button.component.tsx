import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button, Dialog } from '@sk-web-gui/react';
import { useState } from 'react';

export const RegisterErrandButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openHandler = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Button variant="primary" color="vattjom" onClick={openHandler}>
        Registrera ärende
      </Button>
      <Dialog className="max-w-[36rem]" show={isOpen}>
        <Dialog.Content className="flex flex-col items-center justify-center text-center">
          <LucideIcon color="vattjom" name="inbox" size={32} />
          <div className="text-h4">Registrera ärende</div>
          <div>
            När du registrerar ett ärende, kommer det automatiskt att placeras under kategorin &apos;Inkomna
            ärende&apos;. Därefter blir ärendet tillgängligt för alla behäriga medarbetare inom din verksamhet.
          </div>
          <p>Vill du fortsätta med registreringen?</p>
        </Dialog.Content>
        <Dialog.Buttons className="flex justify-center gap-7">
          <Button className="w-[12.8rem]" variant="secondary" onClick={openHandler}>
            Nej
          </Button>
          <Button className="w-[12.8rem]" variant="primary" onClick={() => console.log('Not implemented')}>
            Ja
          </Button>
        </Dialog.Buttons>
      </Dialog>
    </>
  );
};
