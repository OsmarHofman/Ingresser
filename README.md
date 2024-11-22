# Ingresser

Evolução do Regresser, para ter um visual mais agradável, sem instalações locais ou de containers. Mas ainda fazendo o envio de Embarques e Documentos para ambientes 😊!

Criado com [Angular](https://github.com/angular/angular-cli) versão 18.2.1 no Frontend, e [.NET](https://dotnet.microsoft.com/pt-br/download/dotnet) 8 no Backend.

---

### Colocando as novas atualizações no servidor

Depois de atualizar o front e o backend, é preciso colocar as alterações no servidor, então para isso:

- Frontend: 
  - Executar o comando `ng build` ou `npm run ng build`;
  - Isso irá criar uma pasta `dist` dentro da raiz do Frontend;
  - Abrir as pastas até encontrar o arquivo `index.html`;
  - Alterar nesse arquivo nas primeiras linhas:
    - de: `<base href="/">`
    - para: `<base href="/Ingresser/">`
  - Pegar todo o conteúdo que estiver nessa pasta e colocar lá no servidor na pasta `C:\Sites\Ingresser`;

- Backend: 
  - Clique com o botão direito no projeto e vá em Publish;
  ![publish image](./readmeImages/publish.png)
  - Selecione a opção de publicar numa pasta;
  ![folder option](./readmeImages/folder.png)
  - Escolha a pasta para publicação e vá em Finish;
  ![finish publish](./readmeImages/publish.png)
  - Clique no botão de Publish para publicar na pasta;
  ![publish on folder](./readmeImages/publish-on-folder.png)