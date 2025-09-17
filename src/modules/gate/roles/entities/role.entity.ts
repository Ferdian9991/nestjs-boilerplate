import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'gate.roles',
})
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 255, type: 'varchar', unique: true })
  code: string;

  @Column({ nullable: false, length: 255, type: 'varchar' })
  name: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn({ nullable: true, type: 'timestamptz' })
  readonly created_at!: Date;

  @UpdateDateColumn({ nullable: true, type: 'timestamptz' })
  readonly updated_at!: Date;

  @DeleteDateColumn({ nullable: true, type: 'timestamptz' })
  deleted_at!: Date;
}
