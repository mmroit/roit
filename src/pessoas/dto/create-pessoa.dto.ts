import { IsNumberString, MinLength } from 'class-validator';

export class CreatePessoaDto {
  @MinLength(1)
  nome: string;

  @IsNumberString()
  idade: number;
}
