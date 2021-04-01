import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PessoasService } from './pessoas.service';
import { PessoasController } from './pessoas.controller';
import { Pessoa, PessoaSchema } from './schemas/pessoa.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pessoa.name, schema: PessoaSchema }]),
  ],
  controllers: [PessoasController],
  providers: [PessoasService],
})
export class PessoasModule {}
