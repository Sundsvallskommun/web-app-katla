import { InternalRole } from '@/interfaces/users.interface';

// export type RoleADMapping = {
//   [key in ADRole]: InternalRole;
// };

export type RoleADMapping = {
  [key: string]: InternalRole;
};

const mapping: RoleADMapping = {};

mapping[process.env.ADMIN_GROUP.toLocaleLowerCase()] = 'draken_pt_admin';
mapping[process.env.DEVELOPER_GROUP.toLocaleLowerCase()] = 'draken_pt_developer';

export const roleADMapping: RoleADMapping = mapping;
