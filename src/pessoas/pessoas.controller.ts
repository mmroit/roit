import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Render,
} from '@nestjs/common';
import { PessoasService } from './pessoas.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';

@Controller('pessoas')
export class PessoasController {
  constructor(private readonly pessoasService: PessoasService) {}

  @Post()
  @Render('main-content')
  async create(@Body() createPessoaDto: CreatePessoaDto) {
    await this.pessoasService.create(createPessoaDto);
    return this.findAll();
  }

  @Get()
  @Render('index')
  async findAll() {
    const pessoas = await this.pessoasService.findAll();
    return { pessoas };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pessoasService.findOne(id);
  }

  @Put(':id')
  @Render('pessoa-card')
  async update(
    @Param('id') id: string,
    @Body() updatePessoaDto: UpdatePessoaDto,
  ) {
    const pessoa = await this.pessoasService.update(id, updatePessoaDto);
    return { pessoa };
  }

  @Delete(':id')
  @Render('main-content')
  async remove(@Param('id') id: string) {
    await this.pessoasService.remove(id);
    return this.findAll();
  }
}

const PESSOAS_MOCK = [
  {
    _id: '1',
    nome: 'John Doe',
    idade: 21,
  },
  {
    _id: '2',
    nome: 'John Doe',
    idade: 21,
  },
  {
    _id: '3',
    nome: 'John Doe',
    idade: 21,
  },
  {
    _id: '4',
    nome: 'John Doe',
    idade: 21,
  },
  {
    _id: '5',
    nome: 'John Doe',
    idade: 21,
  },
  {
    _id: '6',
    nome: 'John Doe',
    idade: 21,
  },
  {
    _id: '7',
    nome: 'John Doe',
    idade: 21,
  },
  {
    _id: '8',
    nome: 'John Doe',
    idade: 21,
  },
  {
    _id: '9',
    nome: 'John Doe',
    idade: 21,
  },
  {
    _id: '10',
    nome: 'John Doe',
    idade: 21,
  },
  {
    _id: '11',
    nome: 'John Doe',
    idade: 21,
  },
  {
    _id: '12',
    nome: 'John Doe',
    idade: 21,
  },
  {
    _id: '13',
    nome: 'John Doe',
    idade: 21,
  },
];
