import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'academic.enrollments',
})
export class EnrollmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'bigint', unsigned: true })
  participant_id: number;

  @Column({ nullable: false, type: 'bigint', unsigned: true })
  classroom_id: number;

  @CreateDateColumn({ nullable: true, type: 'timestamptz' })
  readonly created_at!: Date;

  @UpdateDateColumn({ nullable: true, type: 'timestamptz' })
  readonly updated_at!: Date;

  @DeleteDateColumn({ nullable: true, type: 'timestamptz' })
  deleted_at!: Date;
}
