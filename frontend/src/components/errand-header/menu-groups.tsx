import LucideIcon from '@sk-web-gui/lucide-icon';
import { Link, MenuItemGroup, PopupMenu } from '@sk-web-gui/react';
import { ColorSchemeItems } from './color-scheme-items.component';

export const getMenuGroups = (includeLogout: boolean): MenuItemGroup[] => {
  const elements: MenuItemGroup['elements'] = [
    {
      label: 'Färgläge',
      element: () => (
        <PopupMenu.Item>
          <PopupMenu position="right" align="start">
            <PopupMenu.Button className="justify-between w-full">
              <LucideIcon name="palette" />
              <span className="w-full flex justify-between">
                Färgläge
                <LucideIcon name="chevron-right" />
              </span>
            </PopupMenu.Button>
            <PopupMenu.Panel>
              <ColorSchemeItems />
            </PopupMenu.Panel>
          </PopupMenu>
        </PopupMenu.Item>
      ),
    },
  ];

  if (includeLogout) {
    elements.push({
      label: 'Logga ut',
      element: () => (
        <PopupMenu.Item>
          <Link key={'logout'} href={`${process.env.NEXT_PUBLIC_API_URL}/saml/logout`} className="usermenu-item">
            <LucideIcon name="log-out" />
            <span className="inline">Logga ut</span>
          </Link>
        </PopupMenu.Item>
      ),
    });
  }

  return [
    {
      label: 'Annat',
      elements,
    },
  ];
};
