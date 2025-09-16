import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'gate.users'
})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 255, type: 'varchar' })
  username: string;

  @Column({ nullable: false, length: 255, type: 'varchar' })
  fullname: string;

  @Column({ nullable: false, length: 255, type: 'varchar' })
  email: string;

  @Column({ nullable: false, length: 255, type: 'varchar', select: false })
  password: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn({ nullable: true, type: 'timestamptz' })
  readonly created_at!: Date;

  @UpdateDateColumn({ nullable: true, type: 'timestamptz' })
  readonly updated_at!: Date;

  @DeleteDateColumn({ nullable: true, type: 'timestamptz' })
  deleted_at!: Date;
}
