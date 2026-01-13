import { ErrandStatus } from '@interfaces/errand-status';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Label } from '@sk-web-gui/react';

type LucideIconName = React.ComponentProps<typeof LucideIcon>['name'];

export const StatusLabelComponent: React.FC<{ status: string | undefined; className?: string }> = ({
  status,
  className = '',
}) => {
  let icon: LucideIconName | null = null;
  let color,
    inverted = false;

  switch (status) {
    case ErrandStatus.ArendeAvslutat:
      color = 'primary';
      icon = 'check';
      break;
    case ErrandStatus.BeslutOverklagat:
    case ErrandStatus.BeslutVerkstallt:
    case ErrandStatus.Beslutad:
    case ErrandStatus.UnderGranskning:
    case ErrandStatus.UnderUtredning:
    case ErrandStatus.UnderBeslut:
      color = 'gronsta';
      icon = 'pen';
      break;
    case ErrandStatus.ArendeInkommit:
      color = 'vattjom';
      break;
    case ErrandStatus.VantarPaKomplettering:
    case ErrandStatus.InterntAterkoppling:
      color = 'gronsta';
      inverted = true;
      icon = 'clock-10';
      break;
    case ErrandStatus.Tilldelat:
      color = 'warning';
      inverted = false;
      icon = 'circle-pause';
      break;
    default:
      color = 'tertiary';
      break;
  }

  return (
    <Label
      rounded
      inverted={inverted}
      color={color}
      className={`max-h-full h-auto text-center whitespace-nowrap ${className}`}
    >
      {icon && <LucideIcon name={icon} size={16} />} {status}
    </Label>
  );
};
