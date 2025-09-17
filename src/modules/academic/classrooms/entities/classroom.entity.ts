import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'academic.classrooms',
})
export class ClassroomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 255, type: 'varchar', unique: true })
  code: string;

  @Column({ nullable: false, type: 'int' })
  day: number;

  @Column({ nullable: false, type: 'time' })
  start_time: string;

  @Column({ nullable: false, type: 'time' })
  end_time: string;

  @Column({ nullable: false, type: 'int' })
  quota: number;

  @Column({ nullable: false, type: 'int', default: 0 })
  participants_count: number;

  @Column({ nullable: false, type: 'bigint', unsigned: true })
  course_id: number;

  @Column({ nullable: false, type: 'bigint', unsigned: true })
  period_id: number;

  @CreateDateColumn({ nullable: true, type: 'timestamptz' })
  readonly created_at!: Date;

  @UpdateDateColumn({ nullable: true, type: 'timestamptz' })
  readonly updated_at!: Date;

  @DeleteDateColumn({ nullable: true, type: 'timestamptz' })
  deleted_at!: Date;
}
