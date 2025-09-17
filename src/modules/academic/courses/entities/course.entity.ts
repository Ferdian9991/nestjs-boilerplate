import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'academic.courses',
})
export class CourseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 255, type: 'varchar', unique: true })
  code: string;

  @Column({ nullable: false, length: 255, type: 'varchar' })
  name: string;

  @Column({ nullable: false, type: 'int' })
  credits: number;

  @CreateDateColumn({ nullable: true, type: 'timestamptz' })
  readonly created_at!: Date;

  @UpdateDateColumn({ nullable: true, type: 'timestamptz' })
  readonly updated_at!: Date;

  @DeleteDateColumn({ nullable: true, type: 'timestamptz' })
  deleted_at!: Date;
}
