import { registerAs } from '@nestjs/config';
import { Contact } from 'src/entitys/contact.entity';
import { Message } from 'src/entitys/mensaje.entity';


export default registerAs('typeorm', () => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Contact, Message],
  synchronize: true, 
  dropSchema: true,
}));
