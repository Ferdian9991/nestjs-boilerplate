export enum RoleEnum {
  ADMIN = 'admin',
  MAHASISWA = 'mhs',
}

export const RoleEnumLabels: Record<RoleEnum, string> = {
  [RoleEnum.ADMIN]: 'Administrator',
  [RoleEnum.MAHASISWA]: 'Mahasiswa',
};
