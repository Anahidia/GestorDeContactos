import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  case: string;

  @Column()
  text: string;

  @Column({ nullable: true })
  img: string;
}
