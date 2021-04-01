import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PessoasModule } from './pessoas/pessoas.module';

@Module({
  imports: [
    PessoasModule,
    MongooseModule.forRoot('mongodb://localhost:27017/roit', {
      useFindAndModify: false,
    }),
  ],
})
export class AppModule {}
