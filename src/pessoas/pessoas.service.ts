import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { Pessoa, PessoaDocument } from './schemas/pessoa.schema';

@Injectable()
export class PessoasService {
  constructor(
    @InjectModel(Pessoa.name) private pessoaModel: Model<PessoaDocument>,
  ) {}

  create(createPessoaDto: CreatePessoaDto) {
    return this.pessoaModel.create(createPessoaDto);
  }

  findAll() {
    return this.pessoaModel.find().exec();
  }

  findOne(id: string) {
    return this.pessoaModel.findById(id);
  }

  async update(id: string, updatePessoaDto: UpdatePessoaDto) {
    await this.pessoaModel.findByIdAndUpdate(id, updatePessoaDto);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.pessoaModel.findByIdAndRemove(id);
  }
}
