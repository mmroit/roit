import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PessoaDocument = Pessoa & Document;

@Schema()
export class Pessoa {
  @Prop({ required: true })
  nome: string;

  @Prop({ required: true })
  idade: number;

  // Endereço

  @Prop()
  cep?: string;

  @Prop()
  logradouro?: string;

  @Prop()
  complemento?: string;

  @Prop()
  bairro?: string;

  @Prop()
  localidade?: string;

  @Prop()
  uf?: string;

  @Prop()
  numero?: string;

  // Github

  @Prop()
  login?: string;

  @Prop()
  avatar_url?: string;

  @Prop()
  html_url?: string;

  @Prop()
  score?: number;
}

export const PessoaSchema = SchemaFactory.createForClass(Pessoa);
