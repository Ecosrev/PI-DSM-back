
#Usa uma imagem base oficial do Node.js
FROM node:18-alpine

#Define o diretório de trabalho dentro do container
WORKDIR /app

#Copia os arquivos de dependência primeiro
#Isso permite aproveitar o cache de camadas do Docker
COPY package*.json ./

#Instala as dependências do projeto
RUN npm install

#Copia o resto dos arquivos do projeto
COPY . .

#Exponha a porta que sua aplicação usa
EXPOSE 4000

#Comando para iniciar a aplicação
CMD ["npm", "start"]