# Ingresser

Evolução do Regresser, para ter um visual mais agradável, sem instalações locais ou de containers. Mas ainda fazendo o envio de Embarques e Documentos para ambientes 😊!

Criado com [Angular](https://github.com/angular/angular-cli) versão 18.2.1 no Frontend, e [.NET](https://dotnet.microsoft.com/pt-br/download/dotnet) 8 no Backend.

Depois de atualizar o front e o backend, é preciso colocar as alterações no servidor, então para isso:

### Colocando as novas atualizações no servidor
- Frontend: 
  - Executar o comando `ng build` ou `npm run ng build`;
  - Isso irá criar uma pasta `dist` dentro da raiz do Frontend;
  - Abrir as pastas até encontrar o arquivo `index.html`;
  - Alterar nesse arquivo nas primeiras linhas:
    - de: `<base href="/">`
    - para: `<base href="/Ingresser/">`
  - Pegar todo o conteúdo que estiver nessa pasta e colocar lá no servidor na pasta `C:\Sites\Ingresser`;