import { ErrandStatus, ErrandStatusType } from '@interfaces/errand-status';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Label } from '@sk-web-gui/react';

type LucideIconName = React.ComponentProps<typeof LucideIcon>['name'];

export const StatusLabelComponent: React.FC<{ status: ErrandStatus; className?: string }> = ({
  status,
  className = '',
}) => {
  let icon: LucideIconName | null = null;
  let color,
    inverted = false;

  switch (status.statusType) {
    case ErrandStatusType.ArendeAvslutat:
      color = 'primary';
      icon = 'check';
      break;
    case ErrandStatusType.BeslutOverklagat:
    case ErrandStatusType.BeslutVerkstallt:
    case ErrandStatusType.Beslutad:
    case ErrandStatusType.UnderGranskning:
    case ErrandStatusType.UnderUtredning:
    case ErrandStatusType.UnderBeslut:
      color = 'gronsta';
      icon = 'pen';
      break;
    case ErrandStatusType.ArendeInkommit:
      color = 'vattjom';
      break;
    case ErrandStatusType.VantarPaKomplettering:
    case ErrandStatusType.InterntAterkoppling:
      color = 'gronsta';
      inverted = true;
      icon = 'clock-10';
      break;
    case ErrandStatusType.Tilldelat:
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
      {icon && <LucideIcon name={icon} size={16} />} {status.statusType}
    </Label>
  );
};
