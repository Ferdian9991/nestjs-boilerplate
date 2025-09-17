import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleEntity } from '../../roles/entities/role.entity';

@Entity({
  name: 'gate.users',
})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 255, type: 'varchar', unique: true })
  username: string;

  @Column({ nullable: false, length: 255, type: 'varchar' })
  fullname: string;

  @Column({ nullable: false, length: 255, type: 'varchar', unique: true })
  email: string;

  @Column({ nullable: false, length: 255, type: 'varchar' })
  password: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn({ nullable: true, type: 'timestamptz' })
  readonly created_at!: Date;

  @UpdateDateColumn({ nullable: true, type: 'timestamptz' })
  readonly updated_at!: Date;

  @DeleteDateColumn({ nullable: true, type: 'timestamptz' })
  deleted_at!: Date;

  @ManyToMany(() => RoleEntity)
  @JoinTable({
    name: 'gate.user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: RoleEntity[];
}
